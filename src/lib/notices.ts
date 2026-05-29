import { prisma } from './prisma'

/**
 * Compute the real status based on the effective date vs today.
 * This replaces the static DB `status` field for display purposes.
 */
export function getComputedStatus(effectiveDate: Date): 'upcoming' | 'in_progress' | 'completed' {
  const now = new Date()
  const daysUntil = Math.ceil((effectiveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil > 30) return 'upcoming'
  if (daysUntil > 0) return 'in_progress'
  return 'completed'
}

/** Attach computed status to a notice object */
function withComputedStatus<T extends { date: Date }>(notice: T): T & { computedStatus: string } {
  return { ...notice, computedStatus: getComputedStatus(notice.date) }
}

export async function getAllNotices() {
  const notices = await prisma.notice.findMany({
    orderBy: { date: 'desc' },
  })
  return notices.map(withComputedStatus)
}

export async function getNoticeById(id: number) {
  const notice = await prisma.notice.findUnique({
    where: { id },
  })
  if (!notice) return null
  return withComputedStatus(notice)
}

export async function searchNotices(
  query?: string, 
  statusFilter?: string, 
  sectorFilter?: string,
  page: number = 1,
  pageSize: number = 10,
  sort: string = 'date',
  dir: string = 'desc'
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}

  if (query) {
    where.OR = [
      { company: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ]
  }

  // Sector filter stays as DB-level filter
  if (sectorFilter && sectorFilter.toLowerCase() !== 'all') {
    where.sector = { equals: sectorFilter, mode: 'insensitive' }
  }

  // For status filtering, we need to apply computed status post-fetch
  // because it's derived from the date, not stored in DB.
  const needsStatusFilter = statusFilter && statusFilter.toLowerCase() !== 'all'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderObj: any = {}
  if (sort === 'company') {
    orderObj.company = dir === 'asc' ? 'asc' : 'desc'
  } else if (sort === 'affected') {
    orderObj.affected = dir === 'asc' ? 'asc' : 'desc'
  } else {
    orderObj.date = dir === 'asc' ? 'asc' : 'desc'
  }

  if (needsStatusFilter) {
    // Fetch all matching notices (without pagination), compute status, filter, then paginate
    const allNotices = await prisma.notice.findMany({
      where,
      orderBy: orderObj,
    })

    const withStatus = allNotices.map(withComputedStatus)
    const filtered = withStatus.filter(n => n.computedStatus === statusFilter!.toLowerCase())
    const totalCount = filtered.length
    const notices = filtered.slice((page - 1) * pageSize, page * pageSize)

    return { notices, totalCount }
  } else {
    // No status filter — use standard DB pagination
    const [rawNotices, totalCount] = await Promise.all([
      prisma.notice.findMany({
        where,
        orderBy: orderObj,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notice.count({ where }),
    ])

    const notices = rawNotices.map(withComputedStatus)
    return { notices, totalCount }
  }
}

export async function getStats() {
  const allNotices = await prisma.notice.findMany({
    select: { date: true, affected: true },
  })

  const totalNotices = allNotices.length
  const totalAffected = allNotices.reduce((sum, n) => sum + n.affected, 0)
  const upcomingNotices = allNotices.filter(n => getComputedStatus(n.date) === 'upcoming').length

  return {
    totalNotices,
    totalAffected,
    upcomingNotices,
  }
}

export async function getFilterCounts(query?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}

  if (query) {
    where.OR = [
      { company: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ]
  }

  const [allNotices, sectorAgg] = await Promise.all([
    prisma.notice.findMany({
      where,
      select: { date: true, sector: true },
    }),
    prisma.notice.groupBy({
      by: ['sector'],
      _count: true,
      where
    }),
  ])

  const total = allNotices.length

  // Compute status counts dynamically from dates
  const statusCounts: Record<string, number> = {
    upcoming: 0,
    in_progress: 0,
    completed: 0,
  }
  for (const notice of allNotices) {
    const cs = getComputedStatus(notice.date)
    statusCounts[cs]++
  }

  const sectorCounts = Object.fromEntries(
    sectorAgg.filter(s => s.sector).map(s => [s.sector as string, s._count])
  )

  return { total, statusCounts, sectorCounts }
}
