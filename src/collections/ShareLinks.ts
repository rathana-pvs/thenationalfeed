import type { CollectionConfig } from 'payload'

export const ShareLinks: CollectionConfig = {
  slug: 'share-links',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'article', 'label', 'clicks'],
    description: 'Dynamic share links for article tracking and anti-spam.',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => {
      const role = (req.user as any)?.role
      return role === 'admin' || role === 'editor'
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.key) {
          let uniqueKey = ''
          let isUnique = false
          let attempts = 0
          while (!isUnique && attempts < 10) {
            // Generate a 5-char alphanumeric key
            uniqueKey = Math.random().toString(36).substring(2, 7)
            const existing = await req.payload.find({
              collection: 'share-links' as any,
              where: { key: { equals: uniqueKey } },
              limit: 1,
            })
            if (existing.docs.length === 0) {
              isUnique = true
            }
            attempts++
          }
          if (!isUnique) {
            // fallback if somehow math.random fails to be unique
            uniqueKey = `link-${Date.now().toString().slice(-5)}`
          }
          data.key = uniqueKey
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated 5-character unique key.',
        readOnly: true,
      },
    },
    {
      name: 'article',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      admin: {
        description: 'The target article for this share link.',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional tag/label to identify this share link (e.g. "FB Group Comment A").',
      },
    },
    {
      name: 'clicks',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
