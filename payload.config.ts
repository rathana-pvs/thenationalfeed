import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { 
  lexicalEditor, 
  FixedToolbarFeature, 
  HeadingFeature, 
  HorizontalRuleFeature,
  InlineCodeFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  UploadFeature,
  BlocksFeature
} from '@payloadcms/richtext-lexical'
import { VideoEmbed } from './src/blocks/VideoEmbed'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { cloudinaryStorage } from 'payload-cloudinary'
import sharp from 'sharp'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({ path: path.resolve(dirname, '.env.local') })
dotenv.config({ path: path.resolve(dirname, '.env') })

import { Articles } from './src/collections/Articles'
import { Authors } from './src/collections/Authors'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { ShareLinks } from './src/collections/ShareLinks'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thenationalfeed.com'

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— The National Feed CMS',
    },
    theme: 'dark',
  },
  collections: [Articles, Authors, Media, Users, ShareLinks],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      FixedToolbarFeature(),
      HorizontalRuleFeature(),
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
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://thenationalfeed:thenationalfeed_pass_123@localhost:5438/thenationalfeed',
    },
  }),
  plugins: [
    seoPlugin({
      collections: ['articles'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: { doc: any }) => doc?.title ? `${doc.title} — The National Feed` : 'The National Feed',
      generateDescription: ({ doc }: { doc: any }) => doc?.excerpt || '',
    }),
    (config) => {
      const articlesCollection = config.collections?.find((c) => c.slug === 'articles')
      if (articlesCollection && articlesCollection.fields) {
        const ogIndex = articlesCollection.fields.findIndex((f) => 'name' in f && f.name === 'og')
        const metaIndex = articlesCollection.fields.findIndex((f) => 'name' in f && f.name === 'meta')
        
        if (ogIndex !== -1 && metaIndex !== -1) {
          const ogField = articlesCollection.fields[ogIndex]
          const metaField = articlesCollection.fields[metaIndex]
          
          articlesCollection.fields = articlesCollection.fields.filter(
            (f) => !('name' in f && (f.name === 'og' || f.name === 'meta'))
          )
          
          articlesCollection.fields.push({
            type: 'collapsible',
            label: 'Advanced (OG & SEO)',
            admin: {
              initCollapsed: true,
            },
            fields: [
              ogField,
              metaField,
            ],
          } as any)
        }
      }
      return config
    },
    ...(process.env.ENABLE_CLOUDINARY === 'true' && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
      ? [
          cloudinaryStorage({
            collections: {
              media: true,
            },
            disableLocalStorage: false,
            config: {
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
            },
          }),
        ]
      : []),
  ],
  cors: [
    siteUrl,
    'https://thenationalfeed.com',
    'https://www.thenationalfeed.com',
  ],
  csrf: [
    siteUrl,
    'https://thenationalfeed.com',
    'https://www.thenationalfeed.com',
  ],
})
