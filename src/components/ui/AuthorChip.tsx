'use client'

import { formatDate } from '@/lib/utils'
import { Author } from '@/types'
import { dict } from '@/lib/i18n'

interface AuthorChipProps {
  author?: Author | null
  date?: string
  readTime?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AuthorChip({ author, date, readTime, size = 'md', className }: AuthorChipProps) {
  if (!author || typeof author === 'string') return null
  if (!author.name) return null // Ensure we have at least the name

  return (
    <div className={`inline-flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--text-muted)] font-ui ${className || ''}`}>
      <span className="font-semibold text-[var(--text-primary)]">
        {author.name}
      </span>
      {date && (
        <>
          <span className="opacity-40">·</span>
          <span suppressHydrationWarning>{formatDate(date, 'MMM d, yyyy')}</span>
        </>
      )}
      {readTime && (
        <>
          <span className="opacity-40">·</span>
          <span>{readTime} {dict.minRead}</span>
        </>
      )}
    </div>
  )
}
