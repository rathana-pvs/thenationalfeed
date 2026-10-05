/**
 * Standalone Al Jazeera News API Migration Script (Dynamic Scraper + Full Content)
 * Runs locally or on the VPS using standard Node.js (no dependencies needed).
 * 
 * Usage:
 *   node migrate-api.js --url https://pulefeed.tech --email admin@pulefeed.tech --password YOUR_PASSWORD
 */

// Helper to parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    url: 'http://localhost:3000',
    email: 'admin@pulefeed.tech',
    password: 'adminpassword123',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) config.url = args[i + 1].replace(/\/$/, '');
    if (args[i] === '--email' && args[i + 1]) config.email = args[i + 1];
    if (args[i] === '--password' && args[i + 1]) config.password = args[i + 1];
  }
  return config;
}

// Simple slugify helper
function slugifyTitle(title) {
  if (!title) return '';
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return slug || `article-${Date.now()}`;
}

// Helper to scrape the og:image from an article URL
async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    
    const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                  html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    
    if (match && match[1]) {
      let imageUrl = match[1].trim();
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }
      return imageUrl;
    }
  } catch (err) {
    console.error(`  ⚠️ Failed to fetch og:image for ${url}:`, err.message);
  }
  return null;
}

// Helper to scrape full article paragraphs
async function fetchFullContent(url, fallbackText) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!res.ok) return [fallbackText];
    const html = await res.text();
    
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    const paragraphs = [];
    while ((match = pRegex.exec(html)) !== null) {
      const text = match[1]
        .replace(/<[^>]*>/g, '') // remove inner HTML tags (e.g. links, formats)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .trim();
      
      // Filter out non-article paragraphs
      if (
        text.length > 60 && 
        !text.includes('Navigation menu') &&
        !text.includes('Show more sections') &&
        !text.includes('Published On') &&
        !text.includes('caret-left') &&
        !text.includes('caret-right') &&
        !text.includes('xwhatsapp-strokecopylink') &&
        !text.includes('Sign up') &&
        !text.startsWith('By ') &&
        !text.startsWith('Listen to this article') &&
        !text.includes('Code of Ethics') &&
        !text.includes('ConnectConnect') &&
        !text.includes('Our Channels') &&
        !text.includes('Advertisement AboutAbout')
      ) {
        paragraphs.push(text);
      }
    }
    
    return paragraphs.length > 0 ? paragraphs : [fallbackText];
  } catch (err) {
    console.error(`  ⚠️ Failed to fetch full content for ${url}:`, err.message);
    return [fallbackText];
  }
}

async function main() {
  const config = parseArgs();
  console.log(`🌐 Connecting to: ${config.url}`);
  console.log(`👤 Logging in as: ${config.email}`);

  let token;
  try {
    const res = await fetch(`${config.url}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    token = data.token;
    if (!token) throw new Error('Token not found in login response.');
    console.log('✓ Successfully logged in!');
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    process.exit(1);
  }

  // 1. Fetch live RSS feed from Al Jazeera
  console.log('📡 Fetching latest news feed from Al Jazeera RSS...');
  let rssText = '';
  try {
    const res = await fetch('https://www.aljazeera.com/xml/rss/all.xml');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rssText = await res.text();
  } catch (err) {
    console.error('❌ Failed to fetch RSS feed:', err.message);
    process.exit(1);
  }

  // 2. Parse RSS XML
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(rssText)) !== null && items.length < 15) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const catMatch = itemContent.match(/<category>([\s\S]*?)<\/category>/);
    
    const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&amp;/g, '&').trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    let description = descMatch ? descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
    
    description = description
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'");

    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    const category = catMatch ? catMatch[1].trim() : 'News';
    
    if (title && link) {
      items.push({
        title,
        link,
        description: description || title,
        pubDate,
        category,
      });
    }
  }

  console.log(`✓ Parsed ${items.length} news items from RSS.`);

  // 3. Find or create the Al Jazeera Staff author
  let authorId;
  try {
    const authorRes = await fetch(`${config.url}/api/authors?where[slug][equals]=aljazeera-staff`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const authorData = await authorRes.json();
    
    const authorPayload = {
      name: 'Al Jazeera Staff',
      slug: 'aljazeera-staff',
      bio: "Latest news, analysis and features from Al Jazeera's global network.",
      role: 'International News Network',
      email: 'news@aljazeera.net',
    };

    if (authorData.docs && authorData.docs.length > 0) {
      authorId = authorData.docs[0].id;
      // Update
      const updateRes = await fetch(`${config.url}/api/authors/${authorId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorPayload),
      });
      if (!updateRes.ok) throw new Error(`Failed to update author: ${updateRes.statusText}`);
      console.log(`✓ Found and updated author "Al Jazeera Staff" (ID: ${authorId})`);
    } else {
      // Create
      const createRes = await fetch(`${config.url}/api/authors`, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorPayload),
      });
      if (!createRes.ok) throw new Error(`Failed to create author: ${createRes.statusText}`);
      const newAuthor = await createRes.json();
      authorId = newAuthor.doc.id;
      console.log(`✓ Created author "Al Jazeera Staff" (ID: ${authorId})`);
    }
  } catch (err) {
    console.error('❌ Author operation failed:', err.message);
    process.exit(1);
  }

  // 4. Loop through and create/update articles
  console.log(`📰 Migrating ${items.length} articles...`);
  for (const item of items) {
    try {
      const slug = slugifyTitle(item.title);

      // Check if article exists
      const articleCheckRes = await fetch(`${config.url}/api/articles?where[slug][equals]=${slug}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      const checkData = await articleCheckRes.json();
      const exists = checkData.docs && checkData.docs.length > 0;

      // Scrape the real Al Jazeera cover image URL
      console.log(`🔗 Scraping image for: "${item.title}"`);
      const scrapedImageUrl = await fetchOgImage(item.link);
      const coverImageUrl = scrapedImageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200';

      // Download actual image bytes
      let fileBlob;
      let filename = `aljazeera-${slug}.jpg`;
      
      try {
        console.log(`   Downloading image file: ${coverImageUrl}`);
        const imgRes = await fetch(coverImageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
        
        const arrayBuffer = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        const ext = contentType.split('/')[1] || 'jpg';
        filename = `aljazeera-${slug}.${ext}`;
        fileBlob = new Blob([Buffer.from(arrayBuffer)], { type: contentType });
        console.log(`   ✓ Image downloaded successfully (${filename})`);
      } catch (e) {
        console.warn(`   ⚠️ Image download failed: ${e.message}. Using fallback placeholder.`);
        fileBlob = new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==', 'base64')], { type: 'image/png' });
        filename = `placeholder-${slug}.png`;
      }

      // Upload to Payload Media collection (saved as source: local)
      const mediaForm = new FormData();
      mediaForm.append('alt', item.title);
      mediaForm.append('source', 'local');
      mediaForm.append('file', fileBlob, filename);

      const mediaRes = await fetch(`${config.url}/api/media`, {
        method: 'POST',
        headers: { Authorization: `JWT ${token}` },
        body: mediaForm,
      });

      if (!mediaRes.ok) {
        const errMsg = await mediaRes.text();
        throw new Error(`Media upload failed: ${mediaRes.statusText} (${errMsg})`);
      }

      const mediaDoc = await mediaRes.json();
      const newMediaId = mediaDoc.doc.id;

      // Scrape the full content text paragraphs
      console.log(`   Scraping full content text...`);
      const paragraphs = await fetchFullContent(item.link, item.description);
      console.log(`   ✓ Found ${paragraphs.length} paragraphs`);

      const tags = [
        { tag: item.category.toLowerCase() },
        { tag: 'aljazeera' }
      ];
      if (item.title.toLowerCase().includes('ukraine') || item.title.toLowerCase().includes('kyiv')) tags.push({ tag: 'ukraine' });
      if (item.title.toLowerCase().includes('election') || item.title.toLowerCase().includes('primary')) tags.push({ tag: 'elections' });
      if (item.title.toLowerCase().includes('heatwave') || item.title.toLowerCase().includes('temperature')) tags.push({ tag: 'climate' });
      if (item.title.toLowerCase().includes('world cup') || item.title.toLowerCase().includes('ronaldo')) tags.push({ tag: 'sports' });

      const articlePayload = {
        title: item.title,
        slug: slug,
        excerpt: item.description,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: paragraphs.map(pText => ({
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [{ type: 'text', text: pText, version: 1 }],
            })),
          },
        },
        status: 'published',
        publishedAt: new Date(item.pubDate).toISOString(),
        isBreaking: item.title.toLowerCase().includes('breaking') || item.title.toLowerCase().includes('war'),
        isFeatured: false,
        credit: 'Al Jazeera',
        author: authorId,
        coverImage: newMediaId,
        tags: tags,
      };

      if (!exists) {
        console.log(`➕ Creating article: "${item.title}"`);
        
        const createArticleRes = await fetch(`${config.url}/api/articles`, {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articlePayload),
        });

        if (!createArticleRes.ok) {
          const errMsg = await createArticleRes.text();
          throw new Error(`Article creation failed: ${createArticleRes.statusText} (${errMsg})`);
        }
        console.log(`  ✓ Successfully created!`);
      } else {
        const existingDoc = checkData.docs[0];
        console.log(`🔄 Updating article: "${item.title}"`);
        
        const oldMediaId = typeof existingDoc.coverImage === 'object' ? existingDoc.coverImage.id : existingDoc.coverImage;

        const updateArticleRes = await fetch(`${config.url}/api/articles/${existingDoc.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articlePayload),
        });

        if (!updateArticleRes.ok) {
          const errMsg = await updateArticleRes.text();
          throw new Error(`Article update failed: ${updateArticleRes.statusText} (${errMsg})`);
        }
        console.log(`  ✓ Successfully updated article!`);

        // Safely delete the old media to avoid orphans in DB
        if (oldMediaId && oldMediaId !== newMediaId) {
          try {
            await fetch(`${config.url}/api/media/${oldMediaId}`, {
              method: 'DELETE',
              headers: { Authorization: `JWT ${token}` },
            });
            console.log(`  ✓ Cleaned up old media record (ID: ${oldMediaId})`);
          } catch (delErr) {
            console.warn(`  ⚠️ Failed to delete old media record (ID: ${oldMediaId}):`, delErr.message);
          }
        }
      }
    } catch (err) {
      console.error(`  ❌ Error processing "${item.title}":`, err.message);
    }
  }

  console.log('🎉 API News Migration completed successfully!');
}

main();
