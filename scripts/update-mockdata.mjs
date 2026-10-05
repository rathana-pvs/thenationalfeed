import fs from 'fs'
import path from 'path'

const seedPath = path.resolve(process.cwd(), 'seed_data_40.json')
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))

const { articles, authors } = seedData

const mockDataContent = `import { Article, Author, Category } from '@/types'

export const mockCategories: Record<string, Category> = {
  politics: { id: 'cat-1', name: 'Politics', slug: 'politics' },
  global: { id: 'cat-2', name: 'Global Affairs', slug: 'global' },
  defense: { id: 'cat-3', name: 'Defense & Security', slug: 'defense' },
  economy: { id: 'cat-4', name: 'Economy', slug: 'economy' },
  tech: { id: 'cat-5', name: 'Tech Policy', slug: 'tech' },
  opinion: { id: 'cat-6', name: 'Opinion', slug: 'opinion' },
}

export const mockAuthors: Author[] = ${JSON.stringify(
  authors.map((a, idx) => ({
    id: `author-${idx + 1}`,
    name: a.name,
    slug: a.slug,
    role: a.role,
    bio: a.bio,
    avatar: {
      id: `media-a${idx + 1}`,
      filename: 'avatar.jpg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      alt: a.name,
    },
    twitter: a.slug,
    email: a.email,
  })),
  null,
  2
)}

export const mockArticles: Article[] = ${JSON.stringify(
  articles.map((art, idx) => ({
    id: `art-${idx + 1}`,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt,
    coverImage: {
      id: `img-${idx + 1}`,
      filename: art.coverImage.filename || 'cover.jpg',
      url: art.coverImage.remoteUrl || (art.coverImage.filename ? `/media/${art.coverImage.filename}` : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop'),
      alt: art.title,
    },
    category: {
      id: 'cat-1',
      name: art.tags?.[0]?.tag || 'Politics',
      slug: (art.tags?.[0]?.tag || 'politics').toLowerCase(),
    },
    author: {
      id: 'author-1',
      name: art.author?.name || 'The National Feed Newsroom',
      slug: art.author?.slug || 'thenationalfeed-newsroom',
      role: art.author?.role || 'Staff Reporter',
      bio: art.author?.bio || '',
      email: art.author?.email || 'news@thenationalfeed.com',
    },
    status: 'published',
    isBreaking: !!art.isBreaking,
    isFeatured: idx < 3 || !!art.isFeatured,
    language: 'en',
    publishedAt: art.publishedAt,
    readTime: art.readTime || 4,
    tags: art.tags || [{ tag: 'news' }],
    createdAt: art.publishedAt,
    updatedAt: art.publishedAt,
  })),
  null,
  2
)}

export const mockLiveUpdates = [
  {
    id: 'live-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    headline: 'House Passes Landmark Bipartisan Housing Legislation',
    body: 'Lawmakers vote overwhelmingly in favor of expanding affordable housing credits and restricting institutional bulk acquisitions.',
    isBreaking: true,
  },
  {
    id: 'live-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    headline: 'Congressional briefing on border trade infrastructure scheduled',
    body: 'A joint committee will convene to discuss supply chain modernization and agricultural labor protections.',
    isBreaking: false,
  },
]
`

fs.writeFileSync(path.resolve(process.cwd(), 'src/lib/mockData.ts'), mockDataContent)
console.log('✅ Updated src/lib/mockData.ts with all 40 fresh scraped articles!')
