import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Don't let search engines index the Payload CMS dashboard
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
