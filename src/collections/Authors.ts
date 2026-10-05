import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/utils'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    description: 'Tribune staff and contributors.',
  },
  access: {
    read: () => true,
    create: ({ req }) => (req.user as any)?.role === 'admin' || (req.user as any)?.role === 'editor',
    update: ({ req }) => (req.user as any)?.role === 'admin' || (req.user as any)?.role === 'editor',
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.name) {
          const generatedSlug = slugify(data.name)
          data.slug = generatedSlug || `author-${Date.now()}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'e.g. "Senior Political Correspondent"',
      },
    },
    {
      name: 'twitter',
      type: 'text',
      admin: {
        description: 'Twitter/X handle (without @)',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
}
