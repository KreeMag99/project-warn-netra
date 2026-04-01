import { MetadataRoute } from 'next'
import { getAllNotices } from '@/lib/notices'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Setup dynamic base domain (fallback for dev)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://warn.in'

  // Fetch all notices via the centralized lib layer
  const notices = await getAllNotices()

  // Map individual database notices to SEO routes
  const noticeEntries: MetadataRoute.Sitemap = notices.map((notice) => ({
    url: `${baseUrl}/notices/${notice.id}`,
    lastModified: notice.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/notices`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...noticeEntries,
  ]
}
