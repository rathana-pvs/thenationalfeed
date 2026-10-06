'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function pingWhosAmungUs(title: string, url?: string) {
  if (typeof window === 'undefined') return
  try {
    const siteKey = 'hohxzyzf2i'
    const targetUrl = url || window.location.href
    const referrer = document.referrer || ''

    // Clean and limit title to 80 chars
    const cleanTitle = (title || 'The National Feed')
      .replace(/\s*—\s*The National Feed.*$/i, '')
      .replace(/[\r\n\t]+/g, ' ')
      .trim()
      .slice(0, 80)
      .replace(/(\?=)|(\/)/g, '')

    const pageTitle = encodeURIComponent(cleanTitle || 'The National Feed')
    const pageUrl = encodeURIComponent(targetUrl)
    const pageRef = encodeURIComponent(referrer)
    const randomId = Math.ceil(99999 * Math.random())

    const pingScript = document.createElement('script')
    pingScript.id = `_wau_ping_${Date.now()}`
    pingScript.async = true
    pingScript.src = `https://whos.amung.us/pingjs/?k=${siteKey}&t=${pageTitle}&c=d&x=${pageUrl}&y=${pageRef}&a=-1&v=27&r=${randomId}`

    // Cleanup previous ping scripts to prevent memory leaks in DOM
    const oldPings = document.querySelectorAll('script[id^="_wau_ping_"]')
    oldPings.forEach((el) => {
      if (el.parentNode) el.parentNode.removeChild(el)
    })

    document.head.appendChild(pingScript)
  } catch (err) {
    console.error('Failed to ping whos.amung.us:', err)
  }
}

export function VisitorCounter() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Setup global queue
    window._wau = window._wau || []
    window._wau.push(['dynamic', 'hohxzyzf2i', 'tqo', 'c4302bffffff', 'small'])

    // 2. Ensure config script exists with exact ID required by whos.amung.us
    if (!document.getElementById('_wautqo')) {
      const configScript = document.createElement('script')
      configScript.id = '_wautqo'
      configScript.innerHTML = 'var _wau = _wau || []; _wau.push(["dynamic", "hohxzyzf2i", "tqo", "c4302bffffff", "small"]);'
      document.body.appendChild(configScript)
    }

    // 3. Ensure waust.at/d.js script is loaded
    if (!document.getElementById('_wau_d_js')) {
      const dScript = document.createElement('script')
      dScript.id = '_wau_d_js'
      dScript.async = true
      dScript.src = '//waust.at/d.js'
      document.body.appendChild(dScript)
    }

    // 4. Clear localStorage cache so whos.amung.us doesn't stick to the homepage title
    try {
      localStorage.removeItem('_wautime')
      localStorage.removeItem('_waucount')
    } catch (e) {}

    // On article pages, ArticleTracker handles tracking with the exact article title.
    // Here we handle non-article routes (homepage, categories, static pages)
    if (pathname && !pathname.startsWith('/article/')) {
      const timer = setTimeout(() => {
        let title = document.title || 'The National Feed'
        if (pathname === '/') {
          title = 'Homepage'
        } else {
          const h1Text = document.querySelector('h1')?.textContent?.trim()
          if (h1Text) title = h1Text
        }
        pingWhosAmungUs(title)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <div
      id="wau-container-hidden"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
        opacity: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}

declare global {
  interface Window {
    _wau?: any[]
  }
}
