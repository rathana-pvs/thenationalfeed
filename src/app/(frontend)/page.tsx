import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/sections/HeroSection'
import RegionalNews from '@/components/sections/RegionalNews'
import VideoHub from '@/components/sections/VideoHub'
import MostRead from '@/components/sections/MostRead'
import { getArticles, getFeatured, getVideoArticles } from '@/lib/api-server'
import { Article } from '@/types'
import { mockArticles } from '@/lib/mockData'
import { getMediaUrl } from '@/lib/utils'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'

export const metadata: Metadata = {
  title: `${siteName} — Real-Time US Policy, Governance & World News`,
  description: 'Fast, authoritative reporting on US policy, congress, White House governance, global affairs, and economy.',
}

export const revalidate = 60

function FeatureCard({ story }: { story: Article }) {
  const imgUrl = getMediaUrl(story.coverImage)
  const catName = story.category?.name || 'News'

  return (
    <article className="feature-card">
      {imgUrl && (
        <Link href={`/article/${story.slug}`} className="media-frame media-3x2">
          <Image src={imgUrl} alt={story.coverImage?.alt || story.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
        </Link>
      )}
      <span className="story-kicker">{catName}</span>
      <Link href={`/article/${story.slug}`}><h3 className="story-title">{story.title}</h3></Link>
      <p className="story-summary">{story.excerpt}</p>
      <div className="story-meta"><span>{story.readTime || 3} min read</span><span>{story.region || 'World'}</span></div>
    </article>
  )
}

export default async function HomePage() {
  const [{ hero: dbHero, secondary: dbSecondary }, allArticlesRes, videoArticles] = await Promise.all([
    getFeatured(),
    getArticles({ limit: 40 }),
    getVideoArticles(6),
  ])

  const articles: Article[] = (allArticlesRes.docs && allArticlesRes.docs.length > 0)
    ? (allArticlesRes.docs as Article[])
    : mockArticles

  const leadStory = dbHero || articles[0] || null
  const secondaryStories = (dbSecondary && dbSecondary.length >= 4)
    ? dbSecondary
    : articles.filter((a) => a.id !== leadStory?.id).slice(0, 5)

  const features = articles.filter((a) => a.id !== leadStory?.id).slice(0, 3)
  const moreNews = articles.slice(5, 12)
  const videoStories = videoArticles.length > 0 ? videoArticles : articles.filter(a => a.isVideo)

  return (
    <>
      <div className="bbc-container home-page">
        {leadStory ? (
          <HeroSection leadStory={leadStory} secondaryStories={secondaryStories} />
        ) : (
          <div className="empty-state"><p>No published stories are available.</p></div>
        )}

        {features.length > 0 && (
          <section className="editorial-section" aria-labelledby="features-heading">
            <div className="section-heading-row">
              <h2 id="features-heading" className="section-heading">Featured Stories</h2>
              <Link href="/category/world" className="section-more">More features →</Link>
            </div>
            <div className="feature-grid">
              {features.map((story) => (
                <FeatureCard story={story} key={story.id} />
              ))}
            </div>
          </section>
        )}

        {/* Regional News Beat Explorer */}
        <RegionalNews articles={articles} />
      </div>

      {/* Watch & Listen Video Hub */}
      {videoStories.length > 0 && <VideoHub articles={videoStories} />}

      {/* Lower Feed & Most Read */}
      <div className="bbc-container">
        <section className="editorial-section" aria-labelledby="more-news-heading">
          <div className="section-heading-row">
            <h2 id="more-news-heading" className="section-heading">More news</h2>
            <Link href="/category/world" className="section-more">View all news →</Link>
          </div>
          <div className="home-lower-grid">
            <div>
              {moreNews.map((story) => {
                const imgUrl = getMediaUrl(story.coverImage)
                const catName = story.category?.name || 'News'
                return (
                  <article className="news-list-story" key={story.id}>
                    {imgUrl && (
                      <Link href={`/article/${story.slug}`} className="media-frame media-3x2">
                        <Image src={imgUrl} alt={story.coverImage?.alt || story.title} fill sizes="(max-width: 700px) 120px, 210px" />
                      </Link>
                    )}
                    <div>
                      <span className="story-kicker">{catName}</span>
                      <Link href={`/article/${story.slug}`}><h3 className="story-title">{story.title}</h3></Link>
                      <p className="story-summary">{story.excerpt}</p>
                      <div className="story-meta"><span>{story.readTime || 3} min read</span><span>{story.region || 'World'}</span></div>
                    </div>
                  </article>
                )
              })}
            </div>
            <MostRead articles={articles} />
          </div>
        </section>
      </div>
    </>
  )
}
