'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SectionDivider } from '@/components/ui/SectionDivider'

const CATEGORIES = [
  { slug: 'all', name: 'All Desks' },
  { slug: 'elections', name: 'Elections' },
  { slug: 'parliament', name: 'Parliament' },
  { slug: 'international', name: 'International' },
  { slug: 'policy', name: 'Policy & Law' },
  { slug: 'defense', name: 'Defense' },
  { slug: 'opinion', name: 'Opinion' },
]

interface CategoryHighlightProps {
  articles: Article[]
}

export function CategoryHighlight({ articles }: CategoryHighlightProps) {
  const [activeTab, setActiveTab] = useState('all')

  if (!articles || articles.length === 0) return null

  const filtered = activeTab === 'all'
    ? articles
    : articles.filter((a) => {
        if (!a.category) return false
        if (typeof a.category === 'object') {
          return a.category.slug === activeTab || a.category.name?.toLowerCase().includes(activeTab.toLowerCase())
        }
        return false
      })

  const displayArticles = filtered.length > 0 ? filtered.slice(0, 4) : articles.slice(0, 4)

  return (
    <section className="w-full py-8 bg-[var(--bg-surface)] border-y border-[var(--border)] my-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionDivider
          title="Desk Explorer"
          subtitle="Explore reporting by topic & beat"
          viewAllHref={activeTab === 'all' ? '/search' : `/search?category=${activeTab}`}
          viewAllText="View Desk"
        />

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none font-ui">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.slug
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveTab(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--accent-red)] text-white shadow-sm'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* 4-Col Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayArticles.map((article, i) => (
            <ArticleCard
              key={`${article.id}-${activeTab}`}
              article={article}
              size="md"
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
