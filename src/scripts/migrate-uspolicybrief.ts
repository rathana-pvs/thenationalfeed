import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import { getPayload } from 'payload'
import config from '../../payload.config'
import fs from 'fs'
import path from 'path'
import { slugify } from '../lib/utils'

const SOURCE_URL = 'https://uspolicybrief.com'
const TOTAL_TO_MIGRATE = 40

async function downloadAndCreateMedia(
  payload: any,
  imageUrl: string,
  altText: string,
  prefixName: string
): Promise<string | number | null> {
  if (!imageUrl) return null
  try {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${SOURCE_URL}${imageUrl}`
    console.log(`   ⬇️ Downloading image: ${fullUrl}`)
    const res = await fetch(fullUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) {
      console.warn(`   ⚠️ Image fetch failed: HTTP ${res.status} for ${fullUrl}`)
      return null
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png')
      ? 'png'
      : contentType.includes('webp')
      ? 'webp'
      : 'jpg'
    const filename = `${prefixName}-${Date.now()}.${ext}`

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: altText || 'The National Feed News',
        caption: altText || 'The National Feed News',
        source: 'local',
      },
      file: {
        data: buffer,
        name: filename,
        mimetype: contentType,
        size: buffer.length,
      },
    })

    console.log(`   🖼️ Created local media #${mediaDoc.id} (${filename}, ${buffer.length} bytes)`)
    return mediaDoc.id
  } catch (err: any) {
    console.warn(`   ⚠️ Media creation error for ${imageUrl}: ${err.message}`)
    return null
  }
}

async function processInlineUploads(payload: any, contentRoot: any, articleIndex: number): Promise<void> {
  if (!contentRoot) return

  const traverse = async (node: any) => {
    if (!node) return

    if (node.type === 'upload' && node.value) {
      const inlineUrl = typeof node.value === 'object' ? node.value.url : null
      const altText = (typeof node.value === 'object' && node.value.alt) ? node.value.alt : 'Article inline image'
      if (inlineUrl) {
        console.log(`   🔍 Found inline image in body content: ${inlineUrl}`)
        const inlineMediaId = await downloadAndCreateMedia(
          payload,
          inlineUrl,
          altText,
          `uspolicybrief-inline-${articleIndex + 1}`
        )
        if (inlineMediaId) {
          node.value = inlineMediaId
          node.relationTo = 'media'
        }
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        await traverse(child)
      }
    }
  }

  await traverse(contentRoot)
}

async function migrate() {
  console.log('🚀 Starting US Policy Brief Migration to The National Feed...')
  const payload = await getPayload({ config })

  // 1. Remove current data
  console.log('\n🧹 Cleaning existing articles, media records, and old downloaded files...')
  try {
    await payload.delete({
      collection: 'articles',
      where: { id: { exists: true } },
    })
    console.log('  ✓ Deleted all existing articles')
  } catch (err: any) {
    console.warn(`  ⚠️ Articles cleanup notice: ${err.message}`)
  }

  try {
    await payload.delete({
      collection: 'media',
      where: { id: { exists: true } },
    })
    console.log('  ✓ Deleted all existing media records')
  } catch (err: any) {
    console.warn(`  ⚠️ Media cleanup notice: ${err.message}`)
  }

  // Clean public/media files
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  } else {
    const files = fs.readdirSync(mediaDir)
    console.log(`  📁 Cleaning ${files.length} existing files in public/media...`)
    for (const file of files) {
      if (
        file.startsWith('scraped-') ||
        file.startsWith('pulefeed-') ||
        file.startsWith('uspolicybrief-') ||
        file.startsWith('external-') ||
        file.startsWith('article-') ||
        file.startsWith('placeholder-')
      ) {
        try {
          fs.unlinkSync(path.join(mediaDir, file))
        } catch (e) {}
      }
    }
  }

  // 2. Ensure Admin User
  console.log('\n👤 Ensuring Admin User exists...')
  const adminEmail = 'admin@thenationalfeed.com'
  const adminPassword = 'adminpassword123'
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
  })

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'The National Feed Admin',
        role: 'admin',
      },
    })
    console.log(`  ✓ Created admin user: ${adminEmail}`)
  } else {
    console.log(`  ✓ Admin user exists: ${adminEmail}`)
  }

  // 3. Ensure Author
  console.log('\n✍️ Ensuring Author exists...')
  const authorData = {
    name: 'The National Feed Newsroom',
    slug: 'thenationalfeed-newsroom',
    role: 'Staff Reporter',
    bio: 'Comprehensive news coverage and analysis from our correspondents.',
    email: 'news@thenationalfeed.com',
  }

  let authorId: string | number
  const existingAuthor = await payload.find({
    collection: 'authors',
    where: { slug: { equals: authorData.slug } },
  })

  if (existingAuthor.docs.length === 0) {
    const createdAuthor = await payload.create({
      collection: 'authors',
      data: authorData,
      draft: false,
    })
    authorId = createdAuthor.id
    console.log(`  ✓ Created author: "${authorData.name}" (ID: ${authorId})`)
  } else {
    authorId = existingAuthor.docs[0].id
    console.log(`  ✓ Found existing author: "${authorData.name}" (ID: ${authorId})`)
  }

  // 4. Fetch 40 Latest Articles from uspolicybrief.com
  console.log(`\n📡 Fetching ${TOTAL_TO_MIGRATE} latest articles from ${SOURCE_URL}/api/articles...`)
  const res = await fetch(
    `${SOURCE_URL}/api/articles?limit=${TOTAL_TO_MIGRATE}&sort=-publishedAt&depth=2`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch from ${SOURCE_URL}: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const rawArticles = data.docs || []
  console.log(`✅ Successfully fetched ${rawArticles.length} raw articles!`)

  // 5. Download Images and Create Media & Articles in Database
  console.log(`\n📥 Migrating ${rawArticles.length} articles to database with downloaded images...`)
  const preparedBackupArticles = []
  let successCount = 0

  for (let i = 0; i < rawArticles.length; i++) {
    const raw = rawArticles[i]
    const prefix = `[${i + 1}/${rawArticles.length}]`
    console.log(`\n${prefix} Processing: "${raw.title}"`)

    // Download Cover Image
    const coverObj = raw.coverImage || {}
    const imageUrl = coverObj.url || coverObj.externalUrl || ''
    let coverMediaId = await downloadAndCreateMedia(
      payload,
      imageUrl,
      raw.title.trim(),
      `uspolicybrief-scraped-${i + 1}`
    )

    // Fallback if download failed
    if (!coverMediaId) {
      console.log(`   ⚠️ Using fallback media record for article #${i + 1}`)
      try {
        const fallbackDoc = await payload.create({
          collection: 'media',
          data: {
            alt: raw.title.trim(),
            source: 'external',
            externalUrl:
              'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200',
          },
          file: {
            data: Buffer.from(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==',
              'base64'
            ),
            name: `fallback-${i + 1}.png`,
            mimetype: 'image/png',
            size: 70,
          },
        })
        coverMediaId = fallbackDoc.id
      } catch (fallbackErr: any) {
        console.error(`   ❌ Failed to create fallback media: ${fallbackErr.message}`)
      }
    }

    // Process any inline uploads inside content.root
    if (raw.content?.root) {
      await processInlineUploads(payload, raw.content.root, i)
    }

    // Process Tags
    const tags = Array.isArray(raw.tags)
      ? raw.tags
          .map((t: any) => ({
            tag: typeof t === 'object' && t ? (t.tag || String(t)).trim() : String(t).trim(),
          }))
          .filter((t: any) => t.tag)
      : []

    if (tags.length === 0) {
      tags.push({ tag: 'news' }, { tag: 'politics' })
    }

    // Format Slug
    let slug = raw.slug?.trim() || slugify(raw.title)
    if (!slug) slug = `article-${i + 1}-${Date.now()}`

    // Clean Excerpt
    const cleanExcerpt = (raw.excerpt || raw.title).trim().slice(0, 250)

    // Assemble Article Payload
    const articlePayload: any = {
      title: raw.title.trim(),
      slug: slug,
      excerpt: cleanExcerpt,
      content: raw.content || {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', text: cleanExcerpt, version: 1 }],
            },
          ],
        },
      },
      coverImage: coverMediaId,
      dateline: raw.dateline || 'WASHINGTON',
      credit: 'The National Feed Wire Service',
      author: authorId,
      region: raw.region || 'us-canada',
      tags: tags,
      status: 'published',
      isBreaking: i < 5 || !!raw.isBreaking,
      isFeatured: i === 0 || i === 1 || !!raw.isFeatured,
      isVideo: !!raw.isVideo,
      videoDuration: raw.videoDuration || null,
      viewCount:
        typeof raw.viewCount === 'number'
          ? raw.viewCount
          : Math.floor(Math.random() * 500) + 120,
      publishedAt: raw.publishedAt || new Date().toISOString(),
      readTime: raw.readTime || Math.max(2, Math.ceil(cleanExcerpt.length / 50)),
      og: {
        metaTitle: raw.og?.metaTitle || raw.title,
        metaDescription: raw.og?.metaDescription || cleanExcerpt,
        ogImage: coverMediaId,
      },
      meta: {
        title: raw.meta?.title || raw.title,
        description: raw.meta?.description || cleanExcerpt,
        image: coverMediaId,
      },
    }

    try {
      const createdArticle = await payload.create({
        collection: 'articles',
        data: articlePayload,
        draft: false,
      })
      console.log(`   ✅ Created Article #${createdArticle.id}: "${createdArticle.title.slice(0, 45)}..."`)
      successCount++

      preparedBackupArticles.push({
        ...articlePayload,
        id: createdArticle.id,
      })
    } catch (artErr: any) {
      console.error(`   ❌ Failed to create article "${raw.title}":`, artErr.message)
    }
  }

  // 6. Save seed_data_40.json backup
  const backupData = {
    migratedAt: new Date().toISOString(),
    source: SOURCE_URL,
    totalArticles: preparedBackupArticles.length,
    authors: [authorData],
    articles: preparedBackupArticles,
  }
  const backupPath = path.resolve(process.cwd(), 'seed_data_40.json')
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
  console.log(`\n💾 Saved backup seed file: ${backupPath}`)

  // 7. Trigger Next.js cache revalidation if server is running
  try {
    const revRes = await fetch('http://localhost:3000/api/revalidate', { cache: 'no-store' })
    if (revRes.ok) {
      console.log('🔄 Revalidated Next.js cache successfully!')
    }
  } catch (e) {
    // Dev server might not be running, safe to ignore
  }

  console.log(`\n==============================================`)
  console.log(`🎉 US Policy Brief Migration Completed!`)
  console.log(`- Source: ${SOURCE_URL}`)
  console.log(`- Total Articles Migrated: ${successCount} / ${rawArticles.length}`)
  console.log(`- Images Downloaded & Saved to: public/media/`)
  console.log(`==============================================\n`)
  process.exit(0)
}

migrate().catch((err) => {
  console.error('❌ Fatal Migration Error:', err)
  process.exit(1)
})
