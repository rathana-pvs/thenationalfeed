'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Article } from '@/types'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { dict } from '@/lib/i18n'

interface OpinionSectionProps {
  articles: Article[]
}

export function OpinionSection({ articles }: OpinionSectionProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionDivider
          title="Ideas & Commentary"
          subtitle="Analysis and perspectives from leading thinkers"
          viewAllHref="/search?category=opinion"
          viewAllText="All Opinion"
        />

        {/* Columnist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={`/article/${article.slug}`}
                className="group block rounded-xl p-6 h-full transition-all bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent-red)] shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Author Avatar + Name */}
                  {article.author && typeof article.author === 'object' && (
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[var(--border-subtle)]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--accent-red)] bg-[var(--bg-hover)]">
                        {article.author.avatar?.url ? (
                          <Image
                            src={article.author.avatar.url}
                            alt={article.author.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-[var(--accent-red)] text-white font-ui">
                            {article.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-ui font-bold text-sm text-[var(--text-primary)] truncate">
                          {article.author.name}
                        </p>
                        <p className="font-ui text-[11px] text-[var(--text-muted)] truncate">
                          {article.author.role || 'Guest Contributor'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Article Headline */}
                  <h3 className="font-card-title text-base sm:text-lg font-bold leading-snug mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
                    &ldquo;{article.title}&rdquo;
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="font-body text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                {/* Read Column Link */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--accent-red)] font-ui">
                  <span>{dict.readColumn}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

