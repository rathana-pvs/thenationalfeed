'use client'

import React, { useEffect, useRef, useState } from 'react'

interface TwitterEmbedProps {
  url: string
  text?: string
  author?: string
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void
      }
    }
  }
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ url, text, author }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(isDark ? 'dark' : 'light')

    const loadWidgets = () => {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.load(containerRef.current)
      }
    }

    if (typeof window !== 'undefined') {
      if (!window.twttr) {
        const existingScript = document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
        if (!existingScript) {
          const script = document.createElement('script')
          script.src = 'https://platform.twitter.com/widgets.js'
          script.async = true
          script.charset = 'utf-8'
          script.onload = loadWidgets
          document.body.appendChild(script)
        } else {
          existingScript.addEventListener('load', loadWidgets)
        }
      } else {
        loadWidgets()
      }
    }
  }, [url])

  return (
    <div ref={containerRef} className="my-8 flex justify-center w-full min-h-[160px] overflow-hidden">
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-dnt="true"
        data-align="center"
      >
        <p lang="en" dir="ltr">{text || 'Loading post...'}</p>
        {author && <span>— {author}</span>}
        <a href={url}>View Post</a>
      </blockquote>
    </div>
  )
}
