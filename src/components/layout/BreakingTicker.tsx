'use client'

import Link from 'next/link'
import { Article } from '@/types'
import { dict } from '@/lib/i18n'

interface BreakingTickerProps {
  articles: Article[]
}

export function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null

  // Duplicate for seamless marquee loop
  const items = [...articles, ...articles, ...articles]

  return (
    <div
      className="w-full overflow-hidden flex items-center bg-[var(--accent-red)] text-white h-9 border-b border-black/10 shadow-inner z-40"
    >
      {/* BREAKING Label */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-black/20 border-r border-white/20 z-10"
      >
        <span className="live-dot w-2 h-2 rounded-full bg-white inline-block" />
        <span className="font-ui text-[11px] font-extrabold uppercase tracking-widest text-white">
          {dict.breaking}
        </span>
      </div>

      {/* Ticker Content */}
      <div className="flex-1 overflow-hidden">
        <div className="marquee-track">
          {items.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={`/article/${article.slug}`}
              className="flex items-center gap-3 mr-10 hover:underline text-white font-ui text-[13px] font-medium transition-opacity hover:opacity-90"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20">
                Alert
              </span>
              <span className="font-display font-bold">{article.title}</span>
              <span className="opacity-40 text-xs">◆</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

