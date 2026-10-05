import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, pattern = 'MMMM d, yyyy', localeCode = 'en'): string {
  try {
    const date = parseISO(dateString)
    return format(date, pattern, { locale: enUS })
  } catch {
    return dateString
  }
}

export function formatRelativeDate(dateString: string, localeCode = 'en'): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: enUS })
  } catch {
    return dateString
  }
}

export function calcReadTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export function truncate(str: string | undefined | null, maxLength: number): string {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trim() + '…'
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function slugify(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD') // splits accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove diacritical marks
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // keep letters, numbers, spaces, and hyphens
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function getMediaUrl(media?: any, fallback: string = 'https://picsum.photos/seed/default/800/600'): string {
  if (!media) return fallback
  const url = typeof media === 'string' ? media : (media.externalUrl || media.url)
  if (!url) return fallback
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/api/media/file/')) return `/media/${url.replace('/api/media/file/', '')}`
  return url.startsWith('/') ? url : `/${url}`
}

export function extractKeyPoints(article?: any): string[] {
  if (!article?.keyPoints) return []
  if (Array.isArray(article.keyPoints)) {
    return article.keyPoints
      .map((item: any) => (typeof item === 'string' ? item : item?.point))
      .filter(Boolean)
  }
  return []
}

