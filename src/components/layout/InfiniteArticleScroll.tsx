'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Article } from '@/types'
import { AuthorChip } from '@/components/ui/AuthorChip'
import { RichText } from '@/components/RichText'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { getArticles } from '@/lib/api'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { dict } from '@/lib/i18n'
import { formatDate, getMediaUrl } from '@/lib/utils'

interface InfiniteArticleScrollProps {
  initialArticle: Article
  initialRelated?: Article[]
}

// Show only the opened article, then hand off to Adskeeper Feed (Option A)
const MAX_ARTICLES = 1
const widgetSidebar = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR || ''
const widgetInArticle1 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1 || ''
const widgetInArticle2 = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2 || ''
const widgetUnderArticle = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_UNDER_ARTICLE || ''
const widgetFeed = process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED || ''

export function InfiniteArticleScroll({ initialArticle, initialRelated }: InfiniteArticleScrollProps) {
  const [articles, setArticles] = useState<Article[]>([initialArticle])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadedIds = useRef<(string | number)[]>([initialArticle.id])
  const observerTargetRef = useRef<HTMLDivElement>(null)

  // Track breakpoint in JS so only ONE instance of widget 2043076 is ever
  // mounted in the DOM at a time (CSS-only hiding still renders both divs,
  // which causes Adskeeper to find duplicate slot IDs and fill both).
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Fetch consecutive published articles client-side
  const loadNextArticles = async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const res = await getArticles({ limit: 5, page: page + 1 })
      
      if (!res.docs || res.docs.length === 0) {
        setHasMore(false)
        return
      }

      // Avoid duplicates
      const freshArticles = res.docs.filter((a: Article) => !loadedIds.current.includes(a.id))

      if (freshArticles.length > 0) {
        setArticles((prev) => {
          const next = [...prev, ...freshArticles]
          // Stop loading once we hit the article cap — hand off to Adskeeper Feed
          if (next.length >= MAX_ARTICLES) setHasMore(false)
          return next.slice(0, MAX_ARTICLES)
        })
        freshArticles.forEach((a: Article) => loadedIds.current.push(a.id))
        setPage((p) => p + 1)
      } else {
        // If everything we got was duplicate, stop loading further to prevent infinite loops
        setHasMore(false)
      }
    } catch (e) {
      console.error('Failed to load next articles:', e)
    } finally {
      setLoading(false)
    }
  }

  // Setup observer to trigger fetching more articles when user nears the bottom of the page
  useEffect(() => {
    const trigger = observerTargetRef.current
    if (!trigger) return

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextArticles()
        }
      },
      { threshold: 0.1, rootMargin: '800px' } // Pre-load article 800px before user hits the bottom
    )

    scrollObserver.observe(trigger)
    return () => {
      scrollObserver.unobserve(trigger)
    }
  }, [loading, hasMore, page])

  // Setup observer to synchronize browser URL and document title based on which article is currently in focus
  useEffect(() => {
    const articleElements = document.querySelectorAll('article[data-slug]')
    
    const urlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug')
            const title = entry.target.getAttribute('data-title')
            
            if (slug && title) {
              // Smoothly replace the browser history state with the current article's URL
              window.history.replaceState(null, '', `/article/${slug}`)
              document.title = `${title} — The National Feed`
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: '-20% 0px -60% 0px' } // Intersects when taking up the center reading zone
    )

    articleElements.forEach((el) => urlObserver.observe(el))
    return () => {
      articleElements.forEach((el) => urlObserver.unobserve(el))
    }
  }, [articles])

  return (
    <div>
      {articles.map((article, index) => {
        const heroImage = getMediaUrl(article.coverImage, 'https://picsum.photos/seed/article/1400/900')

        return (
          <article 
            key={article.id} 
            data-slug={article.slug} 
            data-title={article.title}
            className="relative border-b border-[var(--border)] last:border-0"
          >
            {/* Visual separator for dynamically loaded articles */}
            {index > 0 && (
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 flex items-center justify-center gap-6">
                <div className="h-[1px] flex-1 bg-[var(--border)]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">
                  Next Article: {article.title}
                </span>
                <div className="h-[1px] flex-1 bg-[var(--border)]" />
              </div>
            )}

            {/* Hero Image Section */}
            <div className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: 500, maxHeight: 800 }}>
              <Image
                src={heroImage}
                alt={article.coverImage?.alt || article.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover scale-105"
              />
              
              {/* Subtle Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(var(--hero-overlay-rgba), 0.75) 15%, rgba(var(--hero-overlay-rgba), 0) 50%)',
                }}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end max-w-[1280px] mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
                 <div className="absolute left-0 top-1/2 bottom-20 w-[4px] bg-[var(--accent-red)]" />
                 <div className="lg:max-w-[1000px]">
                    <div className="flex items-center gap-3 mb-6">
                      {article.isBreaking && (
                        <span className="font-mono font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--accent-red)]">
                           {dict.breaking}
                        </span>
                      )}
                    </div>
                    <h1
                      className="font-display font-black leading-tight mb-6 tracking-tighter text-[var(--text-primary)]"
                      style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
                    >
                      {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6">
                       <AuthorChip
                          author={article.author || null}
                          date={article.publishedAt}
                          readTime={article.readTime}
                          size="lg"
                          className="article-hero-chip"
                        />
                    </div>
                 </div>
              </div>
            </div>

            {/* Article Content Area */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Main Article Body */}
                <div className="lg:col-span-8">
                  {/* Lead Excerpt */}
                  <div className="relative mb-12">
                     <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-[var(--accent-red)]" />
                     <p
                      className="text-xl leading-[1.5] italic font-display text-[var(--text-primary)]"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Rich Text Body */}
                  <div className="article-body prose prose-invert prose-lg max-w-none mb-2">
                    {article.content ? (
                      <RichText
                        content={article.content}
                        adWidgetId={widgetInArticle1}
                        secondAdWidgetId={widgetInArticle2}
                      />
                    ) : (
                      <p className="text-xl leading-relaxed mt-4 italic opacity-50">
                        {dict.comingSoon}
                      </p>
                    )}
                  </div>

                  {widgetUnderArticle && (
                    <AdskeeperWidget widgetId={widgetUnderArticle} onlyShowOn="desktop" className="hidden lg:block my-4" />
                  )}

                  {/* Related Articles — inside main column so sidebar stays visible */}
                  {index === 0 && initialRelated && initialRelated.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[var(--border)]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-[4px] h-8 bg-[var(--accent-red)]" />
                        <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-[var(--text-primary)]">
                          {dict.relatedArticles}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {initialRelated.slice(0, 2).map((a: Article, i: number) => (
                          <ArticleCard key={a.id} article={a} size="md" index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isDesktop === true && widgetSidebar && (
                  <aside className="lg:col-span-4">
                    <div className="sticky top-24">
                      <AdskeeperWidget
                        widgetId={widgetSidebar}
                        adType="sidebar"
                        onlyShowOn="desktop"
                      />
                    </div>
                  </aside>
                )}
              </div>


            </div>
          </article>
        )
      })}

      <div ref={observerTargetRef} />

      {/* Feed Widget — rendered ONCE at the very bottom, outside the article loop */}
      {!hasMore && widgetFeed && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <AdskeeperWidget widgetId={widgetFeed} adType="feed" />
        </div>
      )}
    </div>
  )
}
