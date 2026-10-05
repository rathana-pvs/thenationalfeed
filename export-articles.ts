import { getPayload } from 'payload'
import config from './payload.config'
import fs from 'fs'

async function exportPulefeedData() {
  console.log('📦 Connecting to pulefeed Payload instance...')
  const payload = await getPayload({ config })

  console.log('🔍 Fetching articles from Pulefeed...')
  const articlesRes = await payload.find({
    collection: 'articles',
    limit: 100,
    sort: '-publishedAt',
    depth: 2,
  })

  console.log(`✅ Found ${articlesRes.docs.length} articles in Pulefeed!`)

  const authorsRes = await payload.find({
    collection: 'authors',
    limit: 100,
  }).catch(() => ({ docs: [] }))

  const exportData = {
    articles: articlesRes.docs,
    authors: authorsRes.docs,
  }

  const outputPath = '/home/rathana/Desktop/reportlyfeed/pulefeed_data.json'
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))
  console.log(`🎉 Successfully exported pulefeed data to ${outputPath}`)
  process.exit(0)
}

exportPulefeedData().catch((err) => {
  console.error('❌ Export failed:', err)
  process.exit(1)
})
