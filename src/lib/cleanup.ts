import { getPayload } from 'payload'
import config from '../../payload.config'
import fs from 'fs'
import path from 'path'

const cleanup = async () => {
  console.log('🧹 Starting thorough data cleanup...')
  const payload = await getPayload({ config })
  
  console.log('🗑️ Deleting all articles...')
  try {
    const deletedArticles = await payload.delete({
      collection: 'articles',
      where: { id: { exists: true } },
    })
    console.log(`  ✓ Deleted articles records`)
  } catch (err: any) {
    console.warn(`  ⚠️ Articles delete notice: ${err.message}`)
  }

  console.log('🗑️ Deleting all media records...')
  try {
    const deletedMedia = await payload.delete({
      collection: 'media',
      where: { id: { exists: true } },
    })
    console.log(`  ✓ Deleted media records`)
  } catch (err: any) {
    console.warn(`  ⚠️ Media delete notice: ${err.message}`)
  }

  console.log('🗑️ Deleting all authors...')
  try {
    const deletedAuthors = await payload.delete({
      collection: 'authors',
      where: { id: { exists: true } },
    })
    console.log(`  ✓ Deleted authors records`)
  } catch (err: any) {
    console.warn(`  ⚠️ Authors delete notice: ${err.message}`)
  }

  // Clean local files in public/media
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (fs.existsSync(mediaDir)) {
    const files = fs.readdirSync(mediaDir)
    console.log(`📁 Cleaning ${files.length} local files in public/media...`)
    for (const file of files) {
      if (file.startsWith('scraped-') || file.startsWith('pulefeed-') || file.startsWith('external-') || file.startsWith('article-') || file.startsWith('placeholder-')) {
        try {
          fs.unlinkSync(path.join(mediaDir, file))
        } catch (e) {}
      }
    }
  }

  console.log('✨ Cleanup complete! All existing data has been removed.')
  process.exit(0)
}

cleanup()

