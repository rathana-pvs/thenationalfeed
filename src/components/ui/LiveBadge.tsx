'use client'

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm ${className || ''}`}
      style={{
        background: 'var(--accent-red)',
        color: '#fff',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      <span
        className="live-dot w-1.5 h-1.5 rounded-full bg-white"
      />
      LIVE
    </span>
  )
}
