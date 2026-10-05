import { getPayload } from 'payload'
import config from '../../payload.config'

const fixUrls = async () => {
  const payload = await getPayload({ config })
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = envUrl && !envUrl.includes('placeholder.com') ? envUrl : 'https://thenationalfeed.com'

  console.log('Fixing Media URLs to be absolute...')
  const media = await payload.find({
    collection: 'media',
    limit: 100,
  })

  for (const doc of media.docs) {
    if (doc.url && !doc.url.startsWith('http')) {
      const fullUrl = `${siteUrl}${doc.url.startsWith('/') ? '' : '/'}${doc.url}`
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          url: fullUrl,
        },
      })
      console.log(`Updated: ${doc.filename} -> ${fullUrl}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

fixUrls()
