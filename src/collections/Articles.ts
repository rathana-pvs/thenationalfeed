import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature, UploadFeature } from '@payloadcms/richtext-lexical'
import { VideoEmbed } from '../blocks/VideoEmbed'
import { slugify } from '../lib/utils'
import { revalidateTag } from 'next/cache'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'status', 'publishedAt'],
    description: 'News articles published on The National Feed.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role === 'admin' || (req.user as any).role === 'editor') return true
      return { author: { equals: req.user.id } }
    },
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.title) {
          const generatedSlug = slugify(data.title)
          
          // Ensure slug is never empty
          data.slug = generatedSlug || `article-${Date.now()}`
        }
        
        if (data.content) {
          const contentStr = JSON.stringify(data.content)
          const wordCount = contentStr.split(/\s+/).length
          data.readTime = Math.max(1, Math.ceil(wordCount / 200))
        }

        const coverImageId = typeof data.coverImage === 'object' && data.coverImage !== null ? (data.coverImage.id || data.coverImage) : data.coverImage

        // Ensure og group exists and sync fields
        if (!data.og) {
          data.og = {}
        }
        data.og.metaTitle = data.title
        data.og.metaDescription = data.excerpt
        data.og.ogImage = coverImageId

        // Ensure meta (SEO plugin) group exists and sync fields
        if (!data.meta) {
          data.meta = {}
        }
        data.meta.title = data.title
        data.meta.description = data.excerpt
        data.meta.image = coverImageId

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          // Clear all cached article queries (unstable_cache queries tagged with 'articles')
          revalidateTag('articles')

          // 🔥 Warm the cache immediately — fire-and-forget background fetches
          // so pages are pre-built before the first real visitor arrives
          if (doc.status === 'published' && doc.slug) {
            const envUrl = process.env.NEXT_PUBLIC_SITE_URL
            const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'http://localhost:3000'

            // Warm article page
            fetch(`${siteUrl}/article/${doc.slug}`, { cache: 'no-store' })
              .catch(() => {})

            // Warm home page
            fetch(`${siteUrl}/`, { cache: 'no-store' })
              .catch(() => {})
          }
        } catch (e) {
          // Ignore revalidation errors during seeding/CLI
        }
        
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', description: 'Auto-generated from title.' },
    },
    {
      name: 'aiAssistant',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/src/components/admin/AIAssistant#AIAssistant',
        },
      },
    },
    {
      name: 'shareLink',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/src/components/admin/ShareLink#ShareLink',
        },
      },
    },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 250 },
    { 
      name: 'content', 
      type: 'richText', 
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                  },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [VideoEmbed],
          }),
        ],
      }), 
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'dateline', type: 'text', admin: { description: 'e.g. LONDON, GENEVA, TOKYO' } },
    { name: 'credit', type: 'text', admin: { description: 'News source or attribution (e.g. BBC News, AP, Reuters).' } },
    { name: 'author', type: 'relationship', relationTo: 'authors', admin: { position: 'sidebar' } },
    {
      name: 'region',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'World / Global', value: 'world' },
        { label: 'Europe', value: 'europe' },
        { label: 'Asia', value: 'asia' },
        { label: 'US & Canada', value: 'us-canada' },
        { label: 'Middle East', value: 'middle-east' },
        { label: 'Latin America', value: 'latin-america' },
        { label: 'Africa', value: 'africa' },
      ],
      defaultValue: 'world',
    },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'published',
      admin: { position: 'sidebar' },
    },
    { name: 'isBreaking', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isVideo', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'videoDuration', type: 'text', admin: { position: 'sidebar', description: 'e.g. 03:45' } },
    { name: 'viewCount', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', description: 'Auto-calculated' } },
    {
      name: 'og',
      label: 'OG',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
