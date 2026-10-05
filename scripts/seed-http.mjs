import fs from 'fs'
import path from 'path'

// Helper to parse arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const config = {
    url: 'http://localhost:3000',
    email: 'admin@thenationalfeed.com',
    password: 'adminpassword123',
    clean: true,
    delayMs: 300,
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.url = args[i + 1].replace(/\/$/, '')
    if (args[i] === '--email' && args[i + 1]) config.email = args[i + 1]
    if (args[i] === '--password' && args[i + 1]) config.password = args[i + 1]
    if (args[i] === '--delay' && args[i + 1]) config.delayMs = parseInt(args[i + 1], 10)
    if (args[i] === '--no-clean') config.clean = false
  }
  return config
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function runHttpSeeder() {
  const config = parseArgs()
  console.log(`🌐 Target The National Feed API: ${config.url}/api`)
  console.log(`👤 Authenticating as: ${config.email}`)

  // 1. Authenticate via HTTP POST /api/users/login
  let token = ''
  try {
    const loginRes = await fetch(`${config.url}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
    })

    if (!loginRes.ok) {
      throw new Error(`Login failed with HTTP ${loginRes.status}: ${await loginRes.text()}`)
    }

    const loginData = await loginRes.json()
    token = loginData.token
    if (!token) throw new Error('Token not found in login response!')
    console.log('✅ Authenticated successfully via HTTP!')
  } catch (err) {
    console.error('❌ HTTP Authentication failed:', err.message)
    console.error('💡 Make sure your The National Feed Next.js server is running and the admin user exists.')
    process.exit(1)
  }

  const authHeaders = {
    Authorization: `JWT ${token}`,
  }

  const jsonAuthHeaders = {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`,
  }

  // 2. Clean existing articles if clean is true
  if (config.clean) {
    console.log('\n🧹 Cleaning existing articles and media via HTTP DELETE requests...')
    try {
      const getArticlesRes = await fetch(`${config.url}/api/articles?limit=1000`, { headers: jsonAuthHeaders })
      if (getArticlesRes.ok) {
        const articlesData = await getArticlesRes.json()
        const docs = articlesData.docs || []
        console.log(`  Found ${docs.length} articles to clean.`)
        for (const doc of docs) {
          await fetch(`${config.url}/api/articles/${doc.id}`, { method: 'DELETE', headers: authHeaders })
          console.log(`  🗑️ Deleted article #${doc.id}: "${doc.title.slice(0, 35)}..."`)
          await sleep(50)
        }
      }

      const getMediaRes = await fetch(`${config.url}/api/media?limit=1000`, { headers: jsonAuthHeaders })
      if (getMediaRes.ok) {
        const mediaData = await getMediaRes.json()
        const docs = mediaData.docs || []
        console.log(`  Found ${docs.length} media records to clean.`)
        for (const doc of docs) {
          await fetch(`${config.url}/api/media/${doc.id}`, { method: 'DELETE', headers: authHeaders })
          await sleep(30)
        }
      }
    } catch (cleanErr) {
      console.warn('  ⚠️ Cleanup note:', cleanErr.message)
    }
  }

  // 3. Load Seed Data JSON
  const seedPath = path.resolve(process.cwd(), 'seed_data_40.json')
  if (!fs.existsSync(seedPath)) {
    console.error(`❌ seed_data_40.json not found! Run "node scripts/scrape-and-prepare.mjs" first.`)
    process.exit(1)
  }

  const { authors = [], articles = [] } = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
  console.log(`\n📦 Loaded ${articles.length} articles and ${authors.length} authors from seed file`)

  // 4. Create Authors via HTTP POST /api/authors
  console.log('\n✍️ Creating Authors via HTTP POST /api/authors...')
  const authorMap = {}

  for (const author of authors) {
    try {
      // Check existing author
      const findRes = await fetch(`${config.url}/api/authors?where[slug][equals]=${encodeURIComponent(author.slug)}`, {
        headers: jsonAuthHeaders,
      })
      if (findRes.ok) {
        const findData = await findRes.json()
        if (findData.docs && findData.docs.length > 0) {
          authorMap[author.slug] = findData.docs[0].id
          console.log(`  ✓ Found existing author "${author.name}" (ID: ${findData.docs[0].id})`)
          continue
        }
      }

      // Create author
      const createRes = await fetch(`${config.url}/api/authors`, {
        method: 'POST',
        headers: jsonAuthHeaders,
        body: JSON.stringify({
          name: author.name,
          slug: author.slug,
          role: author.role || 'Staff Reporter',
          bio: author.bio || 'Comprehensive news coverage and analysis from our correspondents.',
          email: author.email || 'news@thenationalfeed.com',
        }),
      })

      if (createRes.ok) {
        const createdDoc = await createRes.json()
        const authorId = createdDoc.doc?.id || createdDoc.id
        authorMap[author.slug] = authorId
        console.log(`  ✅ Created Author: "${author.name}" (ID: ${authorId})`)
      } else {
        console.warn(`  ⚠️ Author create failed:`, await createRes.text())
      }
    } catch (e) {
      console.warn(`  ⚠️ Error handling author "${author.name}":`, e.message)
    }
  }

  // 5. Seed Media and Articles via HTTP Requests
  console.log(`\n📡 Seeding ${articles.length} Articles via HTTP Requests...`)
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i]
    const prefix = `[${i + 1}/${articles.length}]`
    console.log(`\n${prefix} Processing: "${art.title}"`)

    // Upload Cover Image via HTTP POST /api/media (FormData)
    let mediaId = null
    const coverInfo = art.coverImage || {}

    try {
      const formData = new FormData()
      formData.append('alt', art.title)
      formData.append('caption', art.title)

      if (coverInfo.filename && fs.existsSync(path.join(mediaDir, coverInfo.filename))) {
        const fileBuffer = fs.readFileSync(path.join(mediaDir, coverInfo.filename))
        const blob = new Blob([fileBuffer], { type: coverInfo.mimeType || 'image/jpeg' })
        formData.append('file', blob, coverInfo.filename)
        formData.append('source', 'local')
      } else if (coverInfo.remoteUrl) {
        const blob = new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==', 'base64')], { type: 'image/png' })
        formData.append('file', blob, `external-${art.slug}.png`)
        formData.append('source', 'external')
        formData.append('externalUrl', coverInfo.remoteUrl)
      }

      const mediaRes = await fetch(`${config.url}/api/media`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })

      if (mediaRes.ok) {
        const mediaDoc = await mediaRes.json()
        mediaId = mediaDoc.doc?.id || mediaDoc.id
        console.log(`  🖼️ Media uploaded successfully (Media ID: ${mediaId})`)
      } else {
        console.warn(`  ⚠️ Media upload warning:`, await mediaRes.text())
      }
    } catch (imgErr) {
      console.warn(`  ⚠️ Media processing error:`, imgErr.message)
    }

    // Resolve Author ID
    const authorSlug = art.author?.slug || 'thenationalfeed-newsroom'
    const resolvedAuthorId = authorMap[authorSlug] || Object.values(authorMap)[0]

    // Post Article via HTTP POST /api/articles
    const articlePayload = {
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      coverImage: mediaId,
      author: resolvedAuthorId,
      tags: art.tags || [{ tag: 'news' }],
      status: 'published',
      isBreaking: !!art.isBreaking,
      isFeatured: !!art.isFeatured,
      publishedAt: art.publishedAt,
      readTime: art.readTime || 3,
      credit: art.credit || 'The National Feed Wire Service',
      og: art.og || {
        metaTitle: art.title,
        metaDescription: art.excerpt,
      },
      meta: art.meta || {
        title: art.title,
        description: art.excerpt,
      },
    }

    try {
      const postRes = await fetch(`${config.url}/api/articles`, {
        method: 'POST',
        headers: jsonAuthHeaders,
        body: JSON.stringify(articlePayload),
      })

      if (postRes.ok) {
        const createdArticle = await postRes.json()
        const docId = createdArticle.doc?.id || createdArticle.id
        console.log(`  ✅ HTTP Article #${docId} created successfully!`)
        successCount++
      } else {
        const errText = await postRes.text()
        console.error(`  ❌ Article creation failed:`, errText)
        failCount++
      }
    } catch (postErr) {
      console.error(`  ❌ Request failed:`, postErr.message)
      failCount++
    }

    await sleep(config.delayMs)
  }

  console.log(`\n==============================================`)
  console.log(`🎉 HTTP REST API Seed Summary:`)
  console.log(`- Target: ${config.url}`)
  console.log(`- Seeded Articles: ${successCount} / ${articles.length}`)
  console.log(`- Failed: ${failCount}`)
  console.log(`==============================================\n`)
}

runHttpSeeder().catch((err) => {
  console.error('Fatal HTTP Seeder Error:', err)
  process.exit(1)
})
