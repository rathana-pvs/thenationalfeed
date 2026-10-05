'use client'

import { useEffect, useRef, useState } from 'react'

interface AdskeeperWidgetProps {
  widgetId: string
  className?: string
  adType?: 'sidebar'
  onlyShowOn?: string
}

// Simulated clickbait-style native advertisement mock data
const MOCK_ADS = [
  {
    id: 1,
    title: "The Actual Cost of Dental Implants in 2026 Might Surprise You",
    brand: "Dental Implants | Search Ads",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Unsold SUVs Are Being Cleared Out For Next to Nothing: View Deals!",
    brand: "SUV Deals | Sponsored",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "15 Simple Tricks to Drastically Lower Your Electricity Bill This Month",
    brand: "SmartEnergy Tips",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "If You Need to Clean Your Ears, Stop Using Cotton Swabs Immediately",
    brand: "Health & Wellness Portal",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "The Most Beautiful Places on Earth You Can Visit for Under $50 a Day",
    brand: "Explorer Life",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Drivers Stunned: This Simple Device Can Save You Thousands on Repairs",
    brand: "Car Tech Labs",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    title: "Before You Retire, Try This 1 Simple Rule to Maximize Your Wealth",
    brand: "WealthGuard Financial",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "This $49 Portable AC Cooler is Selling Out Fast Across the Country",
    brand: "ChillCool Tech",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    title: "New Government Grants Available for Homeowners in 2026",
    brand: "HomeGrant Assistance",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    title: "10 Luxury Cruises That Cost Less Than Staying at Home",
    brand: "CruiseExplorer Deals",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80"
  }
]

// Module-level flag: _mgc.load must only fire ONCE per page session.
// Calling it per-widget causes Adskeeper to treat the second+ calls as
// duplicates and silently skip already-scanned slots (e.g. widget 2044156).
// Instead, the FIRST widget to enter the viewport triggers the global scan;
export default function AdskeeperWidget({ widgetId, className = '', adType, onlyShowOn }: AdskeeperWidgetProps) {
  if (!widgetId) return null

  const isDev = process.env.NODE_ENV === 'development'
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAllowedDevice, setIsAllowedDevice] = useState<boolean | null>(null)

  useEffect(() => {
    if (onlyShowOn === 'desktop') {
      const mq = window.matchMedia('(min-width: 1024px)')
      setIsAllowedDevice(mq.matches)
      const handler = (e: MediaQueryListEvent) => setIsAllowedDevice(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      setIsAllowedDevice(true)
    }
  }, [onlyShowOn])

  useEffect(() => {
    if (isDev) return
    if (onlyShowOn === 'desktop' && !window.matchMedia('(min-width: 1024px)').matches) return

    try {
      if (typeof window !== 'undefined') {
        window._mgq = window._mgq || []
        window._mgq.push(['_mgc.load'])
      }
    } catch (e) {
      console.error('Adskeeper load error:', e)
    }
  }, [widgetId, isDev, onlyShowOn])

  if (isDev) {
    // Sidebar Widget — sticky vertical native ad column
    if (adType === 'sidebar') {
      return (
        <div className={`ads-container ${className}`}>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-30 block text-center mb-3">
            [Local Test Mode] Adskeeper Sidebar ({widgetId})
          </span>

          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-0">
            <span className="label-caps !text-[var(--text-primary)] text-[10px] tracking-[0.25em]">
              You Might Like
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Ad</span>
          </div>

          {/* Stacked cards */}
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {MOCK_ADS.slice(0, 8).map((ad) => (
              <article key={ad.id} className="group py-4 cursor-pointer">
                {/* Full-width image */}
                <div className="relative w-full overflow-hidden rounded mb-3" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Title */}
                <h3
                  className="font-card-title leading-snug line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors mb-2"
                  style={{ fontSize: '13px' }}
                >
                  {ad.title}
                </h3>
                {/* Brand */}
                <div
                  className="font-mono flex items-center gap-1.5"
                  style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}
                >
                  <span
                    className="uppercase font-bold px-1 py-0.5 rounded-sm"
                    style={{ background: 'var(--accent-red)', color: '#fff', fontSize: 8 }}
                  >
                    Ad
                  </span>
                  <span className="truncate">{ad.brand}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    if (widgetId === '2043077') {
      // In-Article Top: 2-column compact list (replicates ArticleCard size="sm")
      return (
        <div className={`ads-container border border-dashed border-[var(--border)] bg-[var(--bg-card)] rounded-md p-6 my-8 ${className}`}>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 block text-center mb-4">
            [Local Test Mode] Adskeeper In-Article Top ({widgetId})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_ADS.slice(0, 2).map((ad) => (
              <article key={ad.id} className="group flex gap-3 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0 cursor-pointer transition-all">
                <div className="relative flex-shrink-0 overflow-hidden rounded" style={{ width: 100, height: 72 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-between min-w-0 py-0.5">
                  <h3 className="font-card-title leading-tight line-clamp-3 text-sm text-[var(--text-primary)]">
                    <span className="underline-hover pb-[2px]">{ad.title}</span>
                  </h3>
                  <div className="font-mono flex items-center gap-2 mt-1" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    <span className="uppercase text-[var(--accent-red)] font-bold">Sponsored</span>
                    <span>·</span>
                    <span className="truncate">{ad.brand}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }


    if (widgetId === '2044156') {
      // In-Article Mid (second injection, long reads) — same layout as 2043077
      // but uses different mock ads so both slots are distinguishable in dev.
      return (
        <div className={`ads-container border border-dashed border-[var(--border)] bg-[var(--bg-card)] rounded-md p-6 my-8 ${className}`}>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 block text-center mb-4">
            [Local Test Mode] Adskeeper In-Article Mid ({widgetId})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_ADS.slice(2, 4).map((ad) => (
              <article key={ad.id} className="group flex gap-3 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0 cursor-pointer transition-all">
                <div className="relative flex-shrink-0 overflow-hidden rounded" style={{ width: 100, height: 72 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-between min-w-0 py-0.5">
                  <h3 className="font-card-title leading-tight line-clamp-3 text-sm text-[var(--text-primary)]">
                    <span className="underline-hover pb-[2px]">{ad.title}</span>
                  </h3>
                  <div className="font-mono flex items-center gap-2 mt-1" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    <span className="uppercase text-[var(--accent-red)] font-bold">Sponsored</span>
                    <span>·</span>
                    <span className="truncate">{ad.brand}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }


    if (widgetId === '2043079') {
      // Under-Article: 2x2 grid (replicates ArticleCard size="md" layout)
      return (
        <div className={`ads-container border border-dashed border-[var(--border)] bg-[var(--bg-card)] rounded-md p-6 my-10 ${className}`}>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 block text-center mb-4">
            [Local Test Mode] Adskeeper Under-Article Grid ({widgetId})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_ADS.slice(3, 7).map((ad) => (
              <article key={ad.id} className="group border-b border-[var(--border)] sm:border-0 pb-5 sm:pb-0 cursor-pointer transition-all">
                <div className="relative w-full overflow-hidden rounded" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                </div>
                <div className="pt-4">
                  <h3 className="font-card-title leading-tight mb-2 line-clamp-3 text-[var(--text-primary)]" style={{ fontSize: '15px' }}>
                    <span className="underline-hover pb-[2px]">{ad.title}</span>
                  </h3>
                  <div className="font-mono flex items-center gap-1.5 mt-1" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    <span className="text-[var(--accent-red)] font-bold">Ad</span>
                    <span>·</span>
                    <span className="truncate max-w-[120px]">{ad.brand}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    // Default or Feed Widget (2043075): Single-column vertical native feed (realistic Adskeeper feed layout)
    return (
      <div className={`ads-container ${className}`}>
        {/* Dev label */}
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-30 block text-center mb-3">
          [Local Test Mode] Adskeeper Feed Widget ({widgetId})
        </span>

        {/* Feed header — matches real Adskeeper widget header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-0">
          <span className="label-caps !text-[var(--text-primary)] text-[10px] tracking-[0.25em]">
            Interesting For You
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Sponsored</span>
        </div>

        {/* Single-column feed list */}
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {MOCK_ADS.map((ad) => (
            <article
              key={ad.id}
              className="group flex gap-4 py-4 cursor-pointer hover:bg-[var(--bg-surface)] transition-colors px-2 -mx-2 rounded"
            >
              {/* Thumbnail */}
              <div
                className="relative flex-shrink-0 overflow-hidden rounded"
                style={{ width: 120, height: 80 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                <h3
                  className="font-card-title leading-snug line-clamp-3 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  {ad.title}
                </h3>
                <div
                  className="font-mono flex items-center gap-1.5 mt-2"
                  style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}
                >
                  <span
                    className="uppercase font-bold px-1 py-0.5 rounded-sm"
                    style={{ background: 'var(--accent-red)', color: '#fff', fontSize: 8 }}
                  >
                    Ad
                  </span>
                  <span className="truncate">{ad.brand}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More — simulates infinite scroll trigger */}
        <div className="mt-4 flex justify-center">
          <button
            className="font-mono text-[10px] uppercase tracking-widest px-6 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors"
            onClick={() => {}}
          >
            Load More
          </button>
        </div>
      </div>
    )
  }

  // Device restriction check (e.g. onlyShowOn="desktop"):
  if (onlyShowOn === 'desktop' && isAllowedDevice !== true) return null

  return (
    <div
      ref={containerRef}
      className={`adskeeper-widget-container my-6 w-full flex justify-center ${className}`}
    >
      <div
        suppressHydrationWarning
        data-type="_mgwidget"
        data-widget-id={widgetId}
        style={{ width: '100%' }}
      />
    </div>
  )
}

// Add TypeScript typing for window._mgq
declare global {
  interface Window {
    _mgq?: any[][]
  }
}
