'use client'

import { useParams } from 'next/navigation'
import { dict } from '@/lib/i18n'

export function BreakingBadge({ className }: { className?: string }) {

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm ${className || ''}`}
      style={{
        background: 'var(--accent-red-bright)',
        color: '#fff',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      ● {dict.breaking}
    </span>
  )
}
