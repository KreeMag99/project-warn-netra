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

export async function searchNotices(query?: string, statusFilter?: string) {
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

  return prisma.notice.findMany({
    where,
    orderBy: { date: 'desc' },
  })
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
