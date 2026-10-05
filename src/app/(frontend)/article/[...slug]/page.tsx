import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle, getArticles, getRelatedArticles } from '@/lib/api-server'
import { getMediaUrl, extractKeyPoints, formatDate } from '@/lib/utils'
import ExecutiveSummary from '@/components/article/ExecutiveSummary'
import MostRead from '@/components/sections/MostRead'
import { RichText } from '@/components/RichText'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { ReadingBar } from '@/components/ui/ReadingBar'

interface PageProps {
  params: Promise<{ slug: string | string[] }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  const articleSlug = Array.isArray(rawSlug) ? rawSlug[rawSlug.length - 1] : rawSlug

  const article = await getArticle(articleSlug)
  if (!article) return { title: 'Story Not Found — The National Feed' }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'
  const title = article.meta?.title || article.title
  const description = article.meta?.description || article.excerpt
  const ogImageUrl = getMediaUrl(article.coverImage)

  return {
    title: `${title} — ${siteName}`,
    description,
    alternates: {
      canonical: `/article/${articleSlug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/article/${articleSlug}`,
      siteName,
      publishedTime: article.publishedAt ?? undefined,
      authors: [article.author?.name || `${siteName} Staff`],
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  let articleSlug = ''
  let trackingKey: string | null = null

  if (Array.isArray(rawSlug)) {
    if (rawSlug.length === 1) {
      articleSlug = rawSlug[0]
    } else if (rawSlug.length >= 2) {
      trackingKey = rawSlug[0]
      articleSlug = rawSlug[rawSlug.length - 1]
    }
  } else if (typeof rawSlug === 'string') {
    articleSlug = rawSlug
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'

  if (trackingKey) {
    fetch(`${siteUrl}/api/track-share-link?key=${encodeURIComponent(trackingKey)}`, {
      method: 'GET',
      cache: 'no-store',
    }).catch(() => {})
  }

  const [article, allArticlesRes, relatedArticles] = await Promise.all([
    getArticle(articleSlug),
    getArticles({ limit: 10 }),
    getArticle(articleSlug).then(a => a ? getRelatedArticles(a.id) : []),
  ])

  if (!article) notFound()

  const allArticles = allArticlesRes.docs || []
  const heroImage = getMediaUrl(article.coverImage)
  const keyPoints = extractKeyPoints(article)
  const catName = article.category?.name || 'World'
  const catSlug = article.category?.slug || 'world'
  const authorInitial = (article.author?.name || 'B').charAt(0).toUpperCase()
  const formattedDate = article.publishedAt ? formatDate(article.publishedAt, 'd MMMM yyyy') : 'Recent'

  const widgetSidebar = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR || ''
  const widgetInArticle1 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1 || ''
  const widgetInArticle2 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2 || ''
  const widgetFeed = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${articleSlug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: [
      {
        '@type': 'ImageObject',
        url: heroImage,
      },
    ],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: article.author?.name || `${siteName} Staff`,
    }],
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingBar />

      <article className="bbc-container article-page">
        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta-single-line">
            <span className="author-name">
              {article.author?.name || `${siteName} Staff`}
            </span>
            <span className="meta-separator" aria-hidden="true">·</span>
            <time className="publication-date">Published {formattedDate}</time>
            <span className="meta-separator" aria-hidden="true">·</span>
            <span className="read-time">{article.readTime || 3} min read</span>
            {article.dateline && (
              <>
                <span className="meta-separator" aria-hidden="true">·</span>
                <span className="dateline">{article.dateline}</span>
              </>
            )}
          </div>
        </header>

        <div className="article-layout">
          <div className="article-body">
            {heroImage && (
              <figure className="article-hero">
                <div className="media-frame media-16x9">
                  <Image
                    src={heroImage}
                    alt={article.coverImage?.alt || article.title}
                    fill
                    priority
                    sizes="(max-width: 700px) 100vw, 720px"
                  />
                </div>
                {article.coverImage?.caption && (
                  <figcaption className="article-caption">{article.coverImage.caption}</figcaption>
                )}
              </figure>
            )}

            {/* Executive Summary (Excerpt & Key Points) */}
            <ExecutiveSummary excerpt={article.excerpt} keyPoints={keyPoints} />

            {/* Article Content with In-Article Native Ads */}
            <div className="article-prose">
              {article.content ? (
                <RichText
                  content={article.content}
                  articleTitle={article.title}
                  adWidgetId={widgetInArticle1}
                  adWidgetId2={widgetInArticle2}
                  feedWidgetId={widgetFeed}
                />
              ) : (
                <p>{article.excerpt}</p>
              )}
            </div>

            {/* Bottom Feed Native Ad Widget — inside article content column, no border */}
            {widgetFeed && (
              <div className="article-bottom-feed-wrapper mt-6 mb-8">
                <AdskeeperWidget widgetId={widgetFeed} />
              </div>
            )}
          </div>

          <aside className="article-sidebar">
            <MostRead articles={allArticles} limit={6} />
            {widgetSidebar && (
              <div className="mt-4 mb-6 sticky top-20">
                <AdskeeperWidget widgetId={widgetSidebar} adType="sidebar" />
              </div>
            )}
            {relatedArticles.length > 0 && (
              <section className="related-block" aria-labelledby="related-heading">
                <h2 id="related-heading">Related</h2>
                {relatedArticles.map((story) => (
                  <Link href={`/article/${story.slug}`} className="related-story" key={story.id}>
                    <span className="story-kicker">{story.category?.name || 'News'}</span>
                    <h3 className="story-title">{story.title}</h3>
                  </Link>
                ))}
              </section>
            )}
          </aside>
        </div>
      </article>
    </>
  )
}
