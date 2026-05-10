import { prisma } from './prisma'
import { Notice } from '@prisma/client'

export async function getAllNotices() {
  return prisma.notice.findMany({
    orderBy: { date: 'desc' },
  })
}

export async function getNoticeById(id: number) {
  return prisma.notice.findUnique({
    where: { id },
  })
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

  if (statusFilter && statusFilter.toLowerCase() !== 'all') {
    where.status = { equals: statusFilter, mode: 'insensitive' }
  }

  if (sectorFilter && sectorFilter.toLowerCase() !== 'all') {
    where.sector = { equals: sectorFilter, mode: 'insensitive' }
  }

  const orderObj: any = {}
  if (sort === 'company') {
    orderObj.company = dir === 'asc' ? 'asc' : 'desc'
  } else if (sort === 'affected') {
    orderObj.affected = dir === 'asc' ? 'asc' : 'desc'
  } else {
    orderObj.date = dir === 'asc' ? 'asc' : 'desc'
  }

  const [notices, totalCount] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: orderObj,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.notice.count({ where }),
  ])

  return { notices, totalCount }
}

export async function getStats() {
  const [totalNotices, totalAffectedResult, upcomingNotices] = await Promise.all([
    prisma.notice.count(),
    prisma.notice.aggregate({
      _sum: { affected: true },
    }),
    prisma.notice.count({
      where: { status: 'upcoming' },
    }),
  ])

  return {
    totalNotices,
    totalAffected: totalAffectedResult._sum.affected ?? 0,
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

  const [statusAgg, sectorAgg, total] = await Promise.all([
    prisma.notice.groupBy({
      by: ['status'],
      _count: true,
      where
    }),
    prisma.notice.groupBy({
      by: ['sector'],
      _count: true,
      where
    }),
    prisma.notice.count({ where })
  ])

  const statusCounts = Object.fromEntries(
    statusAgg.map(s => [s.status.toLowerCase(), s._count])
  )
  
  const sectorCounts = Object.fromEntries(
    sectorAgg.filter(s => s.sector).map(s => [s.sector as string, s._count])
  )

  return { total, statusCounts, sectorCounts }
}
