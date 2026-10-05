import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getArticles } from '@/lib/api-server'
import { getMediaUrl } from '@/lib/utils'
import MostRead from '@/components/sections/MostRead'
import { Article } from '@/types'
import { mockArticles } from '@/lib/mockData'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryDescriptions: Record<string, string> = {
  world: 'The latest international news, analysis and eyewitness reporting from correspondents around the world.',
  business: 'Global markets, companies, technology and the forces changing how the world works.',
  innovation: 'New ideas in technology, science, artificial intelligence and engineering shaping the future.',
  technology: 'New ideas in technology, science, artificial intelligence and engineering shaping the future.',
  culture: 'Arts, entertainment, ideas, literature and stories that explain how we live now.',
  earth: 'Reporting on climate, environment, renewable energy, and the changing planet.',
  travel: 'Inspiring places, destinations, practical discoveries and journeys across the globe.',
  video: 'The latest video reports, documentaries, explainers and audio stories from journalists.',
  sport: 'Live scores, tournament reports, transfer news and global athletic coverage.',
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'
  return {
    title: `${categoryName} — ${siteName}`,
    description: categoryDescriptions[slug.toLowerCase()] || `The latest ${categoryName} policy, analysis, and reporting.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const cleanSlug = slug.toLowerCase()
  const categoryName = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1)

  const allArticlesRes = await getArticles({ limit: 40 })
  const allArticles: Article[] = (allArticlesRes.docs && allArticlesRes.docs.length > 0)
    ? (allArticlesRes.docs as Article[])
    : mockArticles

  const categoryArticles = allArticles.filter((a) => {
    if (!a.category) return true
    if (typeof a.category === 'object') {
      const cSlug = a.category.slug?.toLowerCase() || ''
      const cName = a.category.name?.toLowerCase() || ''
      return cSlug === cleanSlug || cName === cleanSlug || cSlug.includes(cleanSlug) || cleanSlug === 'world'
    }
    return true
  })

  const articles = categoryArticles.length > 0 ? categoryArticles : allArticles
  const lead = articles[0]
  const supporting = articles.slice(1, 4)
  const feed = articles.slice(4, 15)

  return (
    <div className="bbc-container category-page">
      <header className="category-title-block">
        <h1 className="category-title">{categoryName}</h1>
        <p className="category-description">
          {categoryDescriptions[cleanSlug] || `The latest ${categoryName.toLowerCase()} news, analysis and reporting.`}
        </p>
      </header>

      {!lead ? (
        <div className="empty-state">
          <p>No articles are currently available in this section.</p>
          <Link href="/">Return to the homepage</Link>
        </div>
      ) : (
        <>
          <section className="category-lead-grid" aria-label={`${categoryName} top stories`}>
            <article className="category-lead">
              {lead.coverImage && (
                <Link href={`/article/${lead.slug}`} className="media-frame media-16x9">
                  <Image
                    src={getMediaUrl(lead.coverImage)}
                    alt={lead.coverImage?.alt || lead.title}
                    fill
                    priority
                    sizes="(max-width: 700px) 100vw, 67vw"
                  />
                  {lead.isVideo && (
                    <span className="media-badge">
                      <span className="play-mark">▶</span>{lead.videoDuration || '03:00'}
                    </span>
                  )}
                </Link>
              )}
              <Link href={`/article/${lead.slug}`}><h2 className="story-title">{lead.title}</h2></Link>
              <p className="story-summary">{lead.excerpt}</p>
              <div className="story-meta">
                <span>{lead.readTime || 3} min read</span>
                <span>{lead.region || lead.category?.name || 'News'}</span>
              </div>
            </article>

            <div className="category-secondary">
              {supporting.map((story) => (
                <article className="category-secondary-story" key={story.id}>
                  <span className="story-kicker">{story.region || story.category?.name || 'News'}</span>
                  <Link href={`/article/${story.slug}`}><h2 className="story-title">{story.title}</h2></Link>
                  <p className="story-summary">{story.excerpt}</p>
                  <div className="story-meta"><span>{story.readTime || 3} min read</span></div>
                </article>
              ))}
            </div>
          </section>

          <div className="category-content-grid">
            <section aria-labelledby="latest-heading">
              <div className="section-heading-row"><h2 id="latest-heading" className="section-heading">Latest</h2></div>
              {(feed.length > 0 ? feed : supporting).map((story) => {
                const imgUrl = getMediaUrl(story.coverImage)
                return (
                  <article className="news-list-story" key={story.id}>
                    {imgUrl && (
                      <Link href={`/article/${story.slug}`} className="media-frame media-3x2">
                        <Image
                          src={imgUrl}
                          alt={story.coverImage?.alt || story.title}
                          fill
                          sizes="(max-width: 700px) 120px, 210px"
                        />
                      </Link>
                    )}
                    <div>
                      <span className="story-kicker">{story.region || story.category?.name || 'News'}</span>
                      <Link href={`/article/${story.slug}`}><h3 className="story-title">{story.title}</h3></Link>
                      <p className="story-summary">{story.excerpt}</p>
                      <div className="story-meta"><span>{story.readTime || 3} min read</span></div>
                    </div>
                  </article>
                )
              })}
            </section>
            <MostRead articles={allArticles} />
          </div>
        </>
      )}
    </div>
  )
}
