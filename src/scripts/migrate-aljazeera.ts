import { getPayload } from 'payload';
import config from '../../payload.config';
import { slugify } from '../lib/utils';

// Helper to scrape the og:image from an article URL
async function fetchOgImage(url: string): Promise<string | null> {
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
  } catch (err: any) {
    console.error(`  ⚠️ Failed to fetch og:image for ${url}:`, err.message);
  }
  return null;
}

async function runMigration() {
  console.log('🏁 Starting Al Jazeera Live news migration script...');
  const payload = await getPayload({ config });

  // 1. Fetch live RSS feed
  console.log('📡 Fetching latest news feed from Al Jazeera RSS...');
  let rssText = '';
  try {
    const res = await fetch('https://www.aljazeera.com/xml/rss/all.xml');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rssText = await res.text();
  } catch (err: any) {
    console.error('❌ Failed to fetch RSS feed:', err.message);
    process.exit(1);
  }

  // 2. Parse RSS XML
  const items: any[] = [];
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
  console.log('👤 Finding or creating "Al Jazeera Staff" author...');
  let authorId: string | number;
  const existingAuthor = await payload.find({
    collection: 'authors',
    where: { slug: { equals: 'aljazeera-staff' } },
  });

  const authorData = {
    name: 'Al Jazeera Staff',
    slug: 'aljazeera-staff',
    bio: "Latest news, analysis and features from Al Jazeera's global network.",
    role: 'International News Network',
    email: 'news@aljazeera.net',
  };

  if (existingAuthor.docs.length === 0) {
    const createdAuthor = await payload.create({
      collection: 'authors',
      data: authorData,
      draft: false,
    });
    authorId = createdAuthor.id;
    console.log(`✓ Created author "Al Jazeera Staff" (ID: ${authorId})`);
  } else {
    authorId = existingAuthor.docs[0].id;
    await payload.update({
      collection: 'authors',
      id: authorId,
      data: authorData,
      draft: false,
    });
    console.log(`✓ Found and updated author "Al Jazeera Staff" (ID: ${authorId})`);
  }

  // 4. Loop through and create/update articles
  console.log(`📰 Migrating articles to DB...`);
  for (const item of items) {
    // Generate slugify
    let slug = slugify(item.title);
    if (!slug) slug = `article-${Date.now()}`;

    const existingArticle = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
    });

    // Scrape the real Al Jazeera cover image URL
    console.log(`🔗 Scraping image for: "${item.title}"`);
    const scrapedImageUrl = await fetchOgImage(item.link);
    const coverImageUrl = scrapedImageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200';
    console.log(`   Image URL: ${coverImageUrl}`);

    const tags = [
      { tag: item.category.toLowerCase() },
      { tag: 'aljazeera' }
    ];
    // Add additional tag if name matches key topics
    if (item.title.toLowerCase().includes('ukraine') || item.title.toLowerCase().includes('kyiv')) tags.push({ tag: 'ukraine' });
    if (item.title.toLowerCase().includes('election') || item.title.toLowerCase().includes('primary')) tags.push({ tag: 'elections' });
    if (item.title.toLowerCase().includes('heatwave') || item.title.toLowerCase().includes('temperature')) tags.push({ tag: 'climate' });
    if (item.title.toLowerCase().includes('world cup') || item.title.toLowerCase().includes('ronaldo')) tags.push({ tag: 'sports' });

    const articleData: any = {
      title: item.title,
      slug: slug,
      excerpt: item.description,
      content: {
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
              children: [{ type: 'text', text: item.description, version: 1 }],
            },
          ],
        },
      },
      status: 'published',
      publishedAt: new Date(item.pubDate).toISOString(),
      isBreaking: item.title.toLowerCase().includes('breaking') || item.title.toLowerCase().includes('war'),
      isFeatured: false,
      credit: 'Al Jazeera',
      author: authorId,
      tags: tags,
    };

    if (existingArticle.docs.length === 0) {
      console.log(`➕ Creating article: "${item.title}"`);
      
      // Create external media record
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: item.title,
          source: 'external',
          externalUrl: coverImageUrl,
        },
        file: {
          data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==', 'base64'),
          name: `external-${slug}.png`,
          mimetype: 'image/png',
          size: 70,
        },
      });

      articleData.coverImage = media.id;

      await payload.create({
        collection: 'articles',
        data: articleData,
        draft: false,
      });
      console.log(`  ✓ Successfully created article!`);
    } else {
      console.log(`🔄 Updating article: "${item.title}"`);
      const doc = existingArticle.docs[0];
      const mediaId = typeof doc.coverImage === 'object' ? (doc.coverImage as any).id : doc.coverImage;

      if (mediaId) {
        // Update external media record
        await payload.update({
          collection: 'media',
          id: mediaId,
          data: {
            alt: item.title,
            source: 'external',
            externalUrl: coverImageUrl,
          },
        });
      }

      await payload.update({
        collection: 'articles',
        id: doc.id,
        data: articleData,
        draft: false,
      });
      console.log(`  ✓ Successfully updated article!`);
    }
  }

  console.log('🎉 Live Migration completed successfully!');
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
