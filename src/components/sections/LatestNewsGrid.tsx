'use client'

import Link from 'next/link'
import { Article } from '@/types'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { dict } from '@/lib/i18n'

interface LatestNewsGridProps {
  articles: Article[]
}

export function LatestNewsGrid({ articles }: LatestNewsGridProps) {
  if (!articles || articles.length === 0) return null

  const featuredLatest = articles[0]
  const gridArticles = articles.slice(1, 7)

  return (
    <section className="w-full py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionDivider
          title="Latest Dispatches"
          subtitle="Real-time coverage and breaking reports"
          viewAllHref="/search"
          viewAllText="View All News"
        />

        {/* 6-Card Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              size="md"
              index={i}
            />
          ))}
        </div>

        {/* Load More Action */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-all shadow-sm font-ui"
          >
            <span>{dict.loadMore}</span>
            <span>↓</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

