'use client'

import Link from 'next/link'

interface SectionDividerProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllText?: string
  className?: string
}

export function SectionDivider({
  title,
  subtitle,
  viewAllHref,
  viewAllText = 'View All',
  className = '',
}: SectionDividerProps) {
  return (
    <div className={`flex items-end justify-between border-b-2 border-[var(--text-primary)] pb-2 mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-[var(--accent-red)] rounded-sm" />
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
          {title}
        </h2>
        {subtitle && (
          <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-ui font-medium border-l border-[var(--border)] pl-3">
            {subtitle}
          </span>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs font-bold uppercase tracking-wider text-[var(--accent-red)] hover:underline font-ui flex items-center gap-1"
        >
          <span>{viewAllText}</span>
          <span>→</span>
        </Link>
      )}
    </div>
  )
}
