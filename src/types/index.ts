export interface Author {
  id: string | number
  name: string
  slug: string
  bio?: string
  avatar?: MediaItem
  role?: string
  twitter?: string
  email?: string
}

export interface MediaItem {
  id: string | number
  filename: string
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
    hero?: { url: string; width: number; height: number }
  }
  source?: 'local' | 'external'
  externalUrl?: string
}

export interface Category {
  id: string | number
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

export interface Tag {
  tag: string
}

export interface Article {
  id: string | number
  title: string
  slug: string
  excerpt: string
  content?: any
  coverImage: MediaItem
  credit?: string
  category?: Category
  author?: Author
  tags?: Tag[]
  status: 'draft' | 'published' | 'archived'
  isBreaking: boolean
  isFeatured: boolean
  language?: 'all' | 'en'
  publishedAt?: string
  readTime?: number
  keyPoints?: string[]
  region?: string
  dateline?: string
  isVideo?: boolean
  videoDuration?: string
  viewCount?: number
  meta?: {
    title?: string | null
    description?: string | null
    image?: MediaItem | null
  }
  createdAt: string
  updatedAt: string
}

export interface PaginatedArticles {
  docs: Article[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface LiveUpdate {
  id: string
  timestamp: string
  headline: string
  body: string
  category?: string
  isBreaking: boolean
  image?: string
}
