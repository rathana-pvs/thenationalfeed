'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const prevPathname = useRef(pathname)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fakeProgressRef = useRef<NodeJS.Timeout | null>(null)

  const startProgress = () => {
    setVisible(true)
    setWidth(0)

    // Animate fake progress up to ~85% while waiting for data
    let current = 0
    fakeProgressRef.current = setInterval(() => {
      // Slow down as it approaches 85% to simulate waiting
      const increment = current < 40 ? 8 : current < 70 ? 3 : 0.5
      current = Math.min(current + increment, 85)
      setWidth(current)
    }, 120)
  }

  const finishProgress = () => {
    if (fakeProgressRef.current) clearInterval(fakeProgressRef.current)
    setWidth(100)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 400)
  }

  // Detect navigation START by intercepting anchor clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')

      // Only trigger for internal navigation links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('http') ||
        target.getAttribute('target') === '_blank'
      ) return

      // Only trigger if the link is actually navigating to a different page
      const currentPath = window.location.pathname
      const targetPath = href.split('?')[0]
      if (currentPath !== targetPath) {
        startProgress()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Detect navigation COMPLETE when pathname changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      finishProgress()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, var(--accent-gold), #f0d070)',
          transition: width === 100 ? 'width 0.3s ease-out' : 'width 0.12s ease-out',
          boxShadow: '0 0 10px rgba(201,168,76,0.6)',
        }}
      />
    </div>
  )
}
