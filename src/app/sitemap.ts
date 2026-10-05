import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'

  // Static pages
  const staticPages = ['', '/about', '/contact', '/policy', '/privacy', '/live', '/search']

  // Fetch all articles
  const { docs: articles } = await payload.find({
    collection: 'articles',
    limit: 1000,
    select: {
      slug: true,
      updatedAt: true,
    },
  })
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static pages
  staticPages.forEach((page) => {
    sitemapEntries.push({
      url: `${siteUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: page === '' ? 1 : 0.8,
    })
  })

  // Add article pages
  articles.forEach((article: any) => {
    sitemapEntries.push({
      url: `${siteUrl}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'daily',  // news articles update frequently
      priority: 0.8,             // same weight as key static pages
    })
  })

  return sitemapEntries
}
