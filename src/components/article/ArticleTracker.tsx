'use client'

import { useEffect } from 'react'
import { pingWhosAmungUs } from '@/components/layout/VisitorCounter'

interface ArticleTrackerProps {
  title: string
  slug: string
}

export function ArticleTracker({ title, slug }: ArticleTrackerProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/article/${slug}`
    pingWhosAmungUs(title, url)
  }, [title, slug])

  return null
}
