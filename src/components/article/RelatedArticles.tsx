import Link from 'next/link'
import { Article } from '@/types'

interface RelatedArticlesProps {
  articles: Article[]
  locale?: string
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="mt-4 mb-4 border-t border-[var(--border)] pt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-3">
        <span className="label-caps !text-[var(--text-primary)] text-[10px] tracking-[0.25em]">
          Suggested Reading
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">More News</span>
      </div>

      {/* Text-Only Editorial Links */}
      <ul className="divide-y divide-[var(--border)]">
        {articles.slice(0, 3).map((article) => {
          return (
            <li key={article.id} className="py-2.5 first:pt-1 last:pb-1">
              <Link
                href={`/article/${article.slug}`}
                className="group flex items-start justify-between gap-3 text-sm sm:text-base font-bold leading-snug text-[var(--text-primary)] hover:text-[var(--accent-red)] transition-colors font-card-title"
              >
                <span className="flex-1 line-clamp-2 group-hover:underline">
                  {article.title}
                </span>
                <span className="font-mono text-[11px] text-[var(--accent-red)] font-bold flex-shrink-0 mt-0.5">
                  →
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
