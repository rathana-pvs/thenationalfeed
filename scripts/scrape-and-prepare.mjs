import fs from 'fs'
import path from 'path'

const SOURCE_URL = 'https://pulefeed.tech'

async function scrapeAndPrepare() {
  console.log(`📡 Fetching latest 40 articles from ${SOURCE_URL}/api/articles?limit=40&sort=-publishedAt&depth=2 ...`)

  const res = await fetch(`${SOURCE_URL}/api/articles?limit=40&sort=-publishedAt&depth=2`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch articles from pulefeed.tech: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const rawArticles = data.docs || []
  console.log(`✅ Successfully fetched ${rawArticles.length} raw articles!`)

  const mediaDir = path.resolve(process.cwd(), 'public/media')
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  }

  const preparedArticles = []
  const authorMap = new Map()

  for (let i = 0; i < rawArticles.length; i++) {
    const raw = rawArticles[i]
    const prefix = `[${i + 1}/${rawArticles.length}]`
    console.log(`\n📥 ${prefix} Processing: "${raw.title}"`)

    // Handle Author
    let authorData = {
      name: 'The National Feed Editorial Desk',
      slug: 'thenationalfeed-editorial',
      role: 'Senior Newsroom Desk',
      bio: 'Latest breaking political and international reporting from The National Feed news team.',
      email: 'news@thenationalfeed.com',
    }

    if (raw.author && typeof raw.author === 'object' && raw.author.name) {
      authorData = {
        name: raw.author.name === 'Toch Media' ? 'The National Feed Newsroom' : raw.author.name,
        slug: raw.author.slug || 'thenationalfeed-newsroom',
        role: raw.author.role || 'Staff Reporter',
        bio: raw.author.bio || 'Comprehensive news coverage and analysis from our correspondents.',
        email: raw.author.email || 'news@thenationalfeed.com',
      }
    }
    authorMap.set(authorData.slug, authorData)

    // Handle Cover Image
    const coverObj = raw.coverImage || {}
    let imageUrl = coverObj.url || coverObj.externalUrl || ''
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${SOURCE_URL}${imageUrl}`
    }

    let localFilename = ''
    let mimeType = 'image/jpeg'
    let imageFilesize = 0

    if (imageUrl) {
      try {
        console.log(`   ⬇️ Downloading image: ${imageUrl}`)
        const imgRes = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        })

        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
          mimeType = contentType.includes('png') ? 'image/png' : 'image/jpeg'
          const ext = mimeType === 'image/png' ? 'png' : 'jpg'
          
          localFilename = `pulefeed-scraped-${i + 1}-${Date.now()}.${ext}`
          const localFilePath = path.join(mediaDir, localFilename)
          fs.writeFileSync(localFilePath, buffer)
          imageFilesize = buffer.length
          console.log(`   💾 Saved image to public/media/${localFilename} (${imageFilesize} bytes)`)
        } else {
          console.warn(`   ⚠️ Image download failed with status ${imgRes.status}, using remote URL`)
        }
      } catch (err) {
        console.warn(`   ⚠️ Error downloading image: ${err.message}`)
      }
    }

    // Process Tags
    const tags = Array.isArray(raw.tags)
      ? raw.tags.map((t) => (typeof t === 'object' && t ? { tag: t.tag || String(t) } : { tag: String(t) })).filter(t => t.tag)
      : []

    // Ensure at least one tag
    if (tags.length === 0) {
      tags.push({ tag: 'news' }, { tag: 'politics' })
    }

    const cleanArticle = {
      title: raw.title.trim(),
      slug: raw.slug || `article-${i + 1}-${Date.now()}`,
      excerpt: (raw.excerpt || raw.title).trim().slice(0, 250),
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
              children: [{ type: 'text', text: raw.excerpt || raw.title, version: 1 }],
            },
          ],
        },
      },
      coverImage: {
        alt: raw.title.trim(),
        filename: localFilename,
        remoteUrl: imageUrl,
        mimeType: mimeType,
        filesize: imageFilesize,
        source: localFilename ? 'local' : 'external',
      },
      credit: raw.credit || 'The National Feed Wire Service',
      author: authorData,
      tags: tags,
      status: 'published',
      isBreaking: !!raw.isBreaking,
      isFeatured: i === 0 || i === 1 || !!raw.isFeatured,
      publishedAt: raw.publishedAt || new Date().toISOString(),
      readTime: raw.readTime || Math.max(2, Math.ceil((raw.excerpt || '').length / 50)),
      og: {
        metaTitle: raw.og?.metaTitle || raw.title,
        metaDescription: raw.og?.metaDescription || raw.excerpt || raw.title,
      },
      meta: {
        title: raw.meta?.title || raw.title,
        description: raw.meta?.description || raw.excerpt || raw.title,
      },
    }

    preparedArticles.push(cleanArticle)
  }

  const outputData = {
    scrapedAt: new Date().toISOString(),
    source: SOURCE_URL,
    totalArticles: preparedArticles.length,
    authors: Array.from(authorMap.values()),
    articles: preparedArticles,
  }

  const outputPath = path.resolve(process.cwd(), 'seed_data_40.json')
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))
  console.log(`\n🎉 Successfully prepared ${preparedArticles.length} articles with images!`)
  console.log(`📁 Seed data saved to: ${outputPath}`)
}

scrapeAndPrepare().catch(err => {
  console.error('❌ Scrape & Prepare failed:', err)
  process.exit(1)
})
