import type { Metadata } from 'next'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import LiveBanner from '@/components/layout/LiveBanner'
import Footer from '@/components/layout/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'
import { NavigationProgress } from '@/components/layout/NavigationProgress'
import { VisitorCounter } from '@/components/layout/VisitorCounter'
import { getBreakingArticles } from '@/lib/api-server'

const envUrl = process.env.NEXT_PUBLIC_SITE_URL
const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'
const adskeeperSiteId = process.env.NEXT_PUBLIC_ADS_KEEPER_SITE_ID

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — US Policy, Governance, Global Affairs & Economy`,
    template: `%s — ${siteName}`,
  },
  description: 'Independent reporting and authoritative analysis on US policy, governance, legislation, defense, and international affairs.',
  keywords: ['news', 'politics', 'us policy', 'policy', 'governance', 'legislation', 'congress', 'white house', 'economy', 'world news'],
  openGraph: {
    siteName,
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon_192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon_512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breakingList = await getBreakingArticles()
  const breakingStory = breakingList[0] || null

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === 'production' && adskeeperSiteId && (
          <script
            async
            src={`https://jsc.adskeeper.com/site/${adskeeperSiteId}.js`}
          />
        )}
      </head>
      <body>
        <NavigationProgress />
        <Header />
        <Navigation />
        {breakingStory && (
          <LiveBanner
            headline={breakingStory.title}
            slug={breakingStory.slug}
          />
        )}
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer />
        <VisitorCounter />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
