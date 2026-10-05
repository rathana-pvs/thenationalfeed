'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Article } from '@/types'
import { AuthorChip } from './AuthorChip'
import { BreakingBadge } from './BreakingBadge'
import { CategoryBadge } from './CategoryBadge'
import { truncate, getMediaUrl } from '@/lib/utils'
import { dict } from '@/lib/i18n'

interface ArticleCardProps {
  article: Article
  size?: 'sm' | 'md' | 'lg'
  index?: number
  className?: string
  showExcerpt?: boolean
}

export function ArticleCard({
  article,
  size = 'md',
  index = 0,
  className = '',
  showExcerpt = true,
}: ArticleCardProps) {
  const href = `/article/${article.slug}`
  const imageUrl = getMediaUrl(article.coverImage)
  const categoryName = typeof article.category === 'object' && article.category !== null ? article.category.name : 'News'

  if (size === 'sm') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
        className={`group flex gap-3.5 py-3 border-b border-[var(--border)] last:border-b-0 cursor-pointer ${className}`}
      >
        <Link href={href} className="flex gap-3.5 w-full">
          <div className="relative flex-shrink-0 w-24 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
            <Image
              src={imageUrl}
              alt={article.coverImage?.alt || article.title}
              fill
              sizes="120px"
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui">
                  {categoryName}
                </span>
                {article.isBreaking && <BreakingBadge />}
              </div>
              <h3 className="font-card-title text-sm sm:text-[15px] font-bold leading-snug line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
                {article.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-ui mt-1">
              {article.author && typeof article.author === 'object' && (
                <span className="font-medium text-[var(--text-secondary)] truncate">
                  {article.author.name}
                </span>
              )}
              {article.readTime && <span>· {article.readTime} {dict.minRead}</span>}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (size === 'lg') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className={`group flex flex-col bg-[var(--bg-surface)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      >
        <Link href={href} className="block flex-1 flex flex-col">
          <div className="relative w-full overflow-hidden bg-[var(--bg-hover)]" style={{ aspectRatio: '16/10' }}>
            <Image
              src={imageUrl}
              alt={article.coverImage?.alt || article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              unoptimized
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {article.isBreaking && (
              <div className="absolute top-3 left-3 z-10">
                <BreakingBadge />
              </div>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-red)] font-ui">
                  {categoryName}
                </span>
              </div>
              <h2 className="font-card-title text-xl sm:text-2xl font-bold leading-tight mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
                {article.title}
              </h2>
              {showExcerpt && article.excerpt && (
                <p className="font-body text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-[var(--border-subtle)] mt-auto">
              <AuthorChip
                author={article.author || null}
                date={article.publishedAt}
                readTime={article.readTime}
                size="md"
              />
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // md (default card)
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`group flex flex-col bg-[var(--bg-surface)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <Link href={href} className="block flex-1 flex flex-col">
        <div className="relative w-full overflow-hidden bg-[var(--bg-hover)]" style={{ aspectRatio: '16/10' }}>
          <Image
            src={imageUrl}
            alt={article.coverImage?.alt || article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          {article.isBreaking && (
            <div className="absolute top-3 left-3 z-10">
              <BreakingBadge />
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui">
                {categoryName}
              </span>
            </div>
            <h3 className="font-card-title text-base sm:text-lg font-bold leading-snug mb-2.5 line-clamp-3 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
              {article.title}
            </h3>
            {showExcerpt && article.excerpt && (
              <p className="font-body text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] mb-4 line-clamp-2">
                {truncate(article.excerpt, 110)}
              </p>
            )}
          </div>
          <div className="pt-3 border-t border-[var(--border-subtle)] mt-auto">
            <AuthorChip
              author={article.author || null}
              date={article.publishedAt}
              readTime={article.readTime}
              size="sm"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

