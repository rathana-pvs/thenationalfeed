'use client'

import { useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thenationalfeed.com'

export const ShareLinkField: React.FC = () => {
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined)
  const [copied, setCopied] = useState(false)

  if (!slug) {
    return (
      <div
        style={{
          padding: '12px 14px',
          marginBottom: '16px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.12)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          fontStyle: 'italic',
        }}
      >
        🔗 Share link will appear after saving.
      </div>
    )
  }

  const url = `${SITE_URL}/article/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <span>🔗</span>
        <span>Share Link</span>
      </div>

      {/* URL display */}
      <div
        style={{
          padding: '10px 12px',
          fontSize: '12px',
          color: '#60a5fa',
          wordBreak: 'break-all',
          lineHeight: '1.5',
          fontFamily: 'monospace',
        }}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'none' }}
          onMouseOver={e => ((e.target as HTMLAnchorElement).style.textDecoration = 'underline')}
          onMouseOut={e => ((e.target as HTMLAnchorElement).style.textDecoration = 'none')}
        >
          {url}
        </a>
      </div>

      {/* Copy button */}
      <div style={{ padding: '0 12px 12px' }}>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            background: copied
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(96,165,250,0.15)',
            color: copied ? '#4ade80' : '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>
      </div>
    </div>
  )
}

export default ShareLinkField
