import { getPayload } from 'payload'
import config from '../../payload.config'

async function verify() {
  const payload = await getPayload({ config })
  const articles = await payload.find({ collection: 'articles', limit: 5, depth: 2 })
  const media = await payload.find({ collection: 'media', limit: 5 })
  const authors = await payload.find({ collection: 'authors', limit: 5 })
  const users = await payload.find({ collection: 'users', limit: 5 })

  console.log(`📊 The National Feed Database Summary:`)
  console.log(`- Articles: ${articles.totalDocs}`)
  console.log(`- Media: ${media.totalDocs}`)
  console.log(`- Authors: ${authors.totalDocs}`)
  console.log(`- Users: ${users.totalDocs}`)

  if (articles.docs.length > 0) {
    console.log(`\nSample Article:`)
    console.log({
      id: articles.docs[0].id,
      title: articles.docs[0].title,
      slug: articles.docs[0].slug,
      publishedAt: articles.docs[0].publishedAt,
      author: typeof articles.docs[0].author === 'object' ? (articles.docs[0].author as any)?.name : articles.docs[0].author,
      coverImage: typeof articles.docs[0].coverImage === 'object' ? (articles.docs[0].coverImage as any)?.url : articles.docs[0].coverImage,
    })
  }

  // 🧪 Test Media Upload Verification
  console.log(`\n🧪 Testing Media Upload Creation...`)
  const testPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjDAGBiYACQcCARfUaVAAAAAASUVORK5CYII=', 'base64')
  const testMedia = await payload.create({
    collection: 'media',
    data: {
      alt: 'Upload Verification Test',
      source: 'local',
    },
    file: {
      data: testPng,
      name: `verify-test-${Date.now()}.png`,
      mimetype: 'image/png',
      size: testPng.length,
    },
  })
  console.log(`  ✓ Created test media ID: ${testMedia.id}, URL: ${testMedia.url}`)
  
  await payload.delete({
    collection: 'media',
    id: testMedia.id,
  })
  console.log(`  ✓ Successfully cleaned up test media`)

  process.exit(0)
}

verify().catch((e) => {
  console.error(e)
  process.exit(1)
})
