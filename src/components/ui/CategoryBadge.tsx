'use client'

import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  color?: string
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryBadge({ name, size = 'md', className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold uppercase tracking-widest',
        size === 'sm' ? 'text-[9px] px-0 py-0' : 'text-[10px] px-0 py-0',
        className,
      )}
      style={{ color: 'var(--accent-red)', letterSpacing: '0.15em' }}
    >
      {name}
    </span>
  )
}
