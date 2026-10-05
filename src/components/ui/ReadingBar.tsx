'use client'

import { useEffect, useState } from 'react'

export function ReadingBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setWidth(Math.min(100, progress))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      id="reading-bar"
      style={{
        width: `${width}%`,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'var(--accent-gold)',
        zIndex: 9999,
        transition: 'width 0.1s linear',
      }}
    />
  )
}
