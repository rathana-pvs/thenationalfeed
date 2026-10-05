import { Article, PaginatedArticles } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function getArticles(params?: {
  limit?: number
  page?: number
  where?: Record<string, any>
}): Promise<PaginatedArticles> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.page) searchParams.set('page', String(params.page))
    searchParams.set('where[status][equals]', 'published')
    searchParams.set('depth', '2')

    const res = await fetch(`/api/articles?${searchParams}`)
    if (!res.ok) throw new Error('Failed to fetch articles')
    return res.json()
  } catch (e) {
    console.error(e)
    return {
      docs: [],
      totalDocs: 0,
      limit: 12,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`/api/articles?where[slug][equals]=${slug}&depth=2&limit=1`)
    if (!res.ok) return null
    const data = await res.json()
    return data.docs[0] || null
  } catch {
    return null
  }
}

export async function getFeatured(): Promise<{ hero: Article | null; secondary: Article[] }> {
  try {
    const searchParams = new URLSearchParams({
      'where[isFeatured][equals]': 'true',
      'where[status][equals]': 'published',
      limit: '3',
      depth: '2',
      sort: '-publishedAt'
    })
    const res = await fetch(`/api/articles?${searchParams}`)
    const data = await res.json()
    const docs = data.docs || []
    return { hero: docs[0] || null, secondary: docs.slice(1, 3) }
  } catch {
    return { hero: null, secondary: [] }
  }
}

export async function getBreakingArticles(): Promise<Article[]> {
  try {
    const searchParams = new URLSearchParams({
      'where[isBreaking][equals]': 'true',
      'where[status][equals]': 'published',
      limit: '5',
      depth: '1'
    })
    const res = await fetch(`/api/articles?${searchParams}`)
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export async function getRelatedArticles(articleId: string | number): Promise<Article[]> {
  try {
    const params = new URLSearchParams()
    params.set('where[status][equals]', 'published')
    params.set('where[id][not_equals]', String(articleId))
    params.set('limit', '3')
    params.set('depth', '2')
    
    const res = await fetch(`/api/articles?${params}`)
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}
