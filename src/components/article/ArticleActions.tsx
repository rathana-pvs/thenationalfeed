'use client'

import React, { useState } from 'react'

export default function ArticleActions() {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = () => {
    setSaved((prev) => !prev)
  }

  return (
    <div className="article-actions" aria-label="Article actions">
      <button type="button" className="article-action" onClick={handleShare}>
        {copied ? '✓ Link Copied' : 'Share'}
      </button>
      <button type="button" className="article-action" onClick={handleSave}>
        {saved ? '★ Saved' : 'Save'}
      </button>
    </div>
  )
}
