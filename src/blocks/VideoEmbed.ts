import { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Other / Iframe', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Video URL',
      required: true,
      admin: {
        description: 'Paste the full link (e.g. https://www.youtube.com/watch?v=...)',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
