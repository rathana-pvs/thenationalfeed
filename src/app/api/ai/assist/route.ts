import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { headers as getNextHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import * as cheerio from 'cheerio'

function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).toString()
  } catch {
    return relativeUrl
  }
}

function normalizeText(t: string): string {
  return (t || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#39;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeForComparison(t: string): string {
  return (t || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isJunkText(t: string): boolean {
  if (!t) return true
  const clean = normalizeText(t)
  if (clean.length < 15) return true
  const l = clean.toLowerCase()
  return (
    l.includes('email address will not be published') ||
    l.includes('required fields are marked') ||
    l.includes('save my name') ||
    l.includes('leave a comment') ||
    l.includes('leave a reply') ||
    l.includes('comment section') ||
    l.includes('cookie policy') ||
    l.includes('cookie settings') ||
    l.includes('all rights reserved') ||
    l.includes('terms of service') ||
    l.includes('privacy policy') ||
    l.includes('subscribe to') ||
    l.includes('sign up for') ||
    l.includes('sign up to') ||
    l.includes('newsletter') ||
    l.startsWith('photo by') ||
    l.startsWith('photo credit') ||
    l.startsWith('image credit') ||
    l.startsWith('image copyright') ||
    l.startsWith('image source') ||
    l.startsWith('read more:') ||
    l.startsWith('also read:') ||
    l.startsWith('related:') ||
    l.startsWith('see also:') ||
    l.startsWith('click here to') ||
    l.includes('follow us on') ||
    l.includes('join our telegram') ||
    l.includes('join our whatsapp') ||
    l.includes('advertisement') ||
    l.includes('sponsored content')
  )
}

async function scrapeUrlDirectly(url: string) {
  let targetUrl = url.trim()
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`
  }

  const res = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.statusText} (${res.status})`)
  }
  const html = await res.text()
  const $ = cheerio.load(html)
  
  // 1. Extract Title
  let title = $('meta[property="og:title"]').attr('content') ||
              $('meta[name="twitter:title"]').attr('content') ||
              $('h1').first().text() ||
              $('title').text()
  title = normalizeText(title)
  title = title
    .replace(/\s*–\s*arnewspost\.info$/i, '')
    .replace(/\s*-\s*arnewspost\.info$/i, '')
    .replace(/\s*–\s*instantlyfeed$/i, '')
    .replace(/\s*-\s*instantlyfeed$/i, '')
    .replace(/\s*–\s*pulefeed$/i, '')
    .replace(/\s*-\s*pulefeed$/i, '')
    .replace(/\s*–\s*thenationalfeed$/i, '')
    .replace(/\s*-\s*thenationalfeed$/i, '')
    .replace(/\s*[-–|•]\s*(?:BBC News|CNN|Reuters|AP News|Fox News|Politico|The Guardian|The New York Times|The Washington Post|Bloomberg|Forbes|Al Jazeera|arnewspost\.info|instantlyfeed|pulefeed|us\s*policy\s*brief|thenationalfeed)[\s\S]*$/i, '')
    .replace(/[…\.\s]+$/, '')
    .trim()

  const cleanTitleNorm = normalizeForComparison(title)

  // 2. Extract Excerpt / Description
  let excerpt = $('meta[property="og:description"]').attr('content') ||
                $('meta[name="twitter:description"]').attr('content') ||
                $('meta[name="description"]').attr('content') ||
                ''
  excerpt = normalizeText(excerpt)
  if (isJunkText(excerpt)) {
    excerpt = ''
  }

  // 3. Extract main content container
  let container = $('.entry-content')
  if (container.length === 0) container = $('article')
  if (container.length === 0) container = $('main')
  if (container.length === 0) container = $('[itemprop="articleBody"]')
  if (container.length === 0) {
    let maxP = 0
    let bestEl: any = null
    $('div, section').each((_, el) => {
      const pCount = $(el).find('> p').length
      if (pCount > maxP) {
        maxP = pCount
        bestEl = el
      }
    })
    if (bestEl) {
      container = $(bestEl)
    }
  }
  if (container.length === 0) {
    container = $('body')
  }

  // If container matches multiple elements, choose the one with the most paragraphs
  if (container.length > 1) {
    let maxP = 0
    let bestContainer: any = container.first()
    container.each((_, el) => {
      const pCount = $(el).find('p').length
      if (pCount > maxP) {
        maxP = pCount
        bestContainer = $(el)
      }
    })
    container = bestContainer
  }

  // Strip noisy / non-article elements from container
  container.find(
    'header, footer, nav, aside, ' +
    '.sidebar, #sidebar, .comments, #comments, .comment-respond, .comment-list, ' +
    '.sharedaddy, .sd-sharing, .social-share, .share-buttons, .share-box, .social-buttons, ' +
    '.related-posts, .related-articles, .jp-relatedposts, .wp-block-post-comments, ' +
    '.author-bio, .author-box, .post-author, .about-author, .entry-author, ' +
    '.advertisement, .ad-container, .ad, .ads, .banner, .addec, ' +
    '.tag-cloud, .post-tags, .entry-meta, .post-meta, .entry-utility, ' +
    'figcaption, .caption, .wp-caption-text, .image-caption, ' +
    'script, style, noscript, svg, form, iframe[src*="doubleclick"], iframe[src*="googleads"]'
  ).remove()

  const rawBlocks: any[] = []
  const seenTexts = new Set<string>()
  const seenMediaUrls = new Set<string>()
  
  function traverse(element: any) {
    const tag = element.tagName?.toLowerCase()
    if (!tag) return

    // 1. Headings (h1 - h6)
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const text = normalizeText($(element).text())
      if (text.length > 3) {
        const textNorm = normalizeForComparison(text)
        // Deduplicate: avoid repeating title in body
        if (
          textNorm === cleanTitleNorm ||
          (cleanTitleNorm.length > 10 && (textNorm.startsWith(cleanTitleNorm.substring(0, 25)) || cleanTitleNorm.startsWith(textNorm.substring(0, 25))))
        ) {
          return
        }
        // Deduplicate: avoid repeating previously seen heading/paragraph
        if (seenTexts.has(textNorm)) return
        seenTexts.add(textNorm)

        if (text.length > 80 || text.split(/\s+/).length > 12) {
          rawBlocks.push({
            type: 'paragraph',
            text,
            children: [{ type: 'text', text }]
          })
        } else {
          rawBlocks.push({
            type: 'heading',
            tag: tag === 'h1' ? 'h2' : (['h2', 'h3', 'h4'].includes(tag) ? tag : 'h3'),
            text
          })
        }
      }
      return
    }

    // 2. Blockquote
    if (tag === 'blockquote') {
      const hasTwitterLink = $(element).find('a[href*="twitter.com"], a[href*="x.com"]').length > 0
      const isTwitter = $(element).hasClass('twitter-tweet') || hasTwitterLink
      if (isTwitter) {
        const tweetLink = $(element).find('a[href*="twitter.com"], a[href*="x.com"]').attr('href') || ''
        const text = normalizeText($(element).text())
        if (tweetLink) {
          const resolvedTweet = resolveUrl(url, tweetLink)
          if (!seenMediaUrls.has(resolvedTweet)) {
            seenMediaUrls.add(resolvedTweet)
            rawBlocks.push({
              type: 'twitter',
              url: resolvedTweet,
              text
            })
          }
          return
        }
      }

      const text = normalizeText($(element).text())
      const textNorm = normalizeForComparison(text)
      if (text.length > 5 && !seenTexts.has(textNorm)) {
        if (textNorm !== cleanTitleNorm) {
          seenTexts.add(textNorm)
          rawBlocks.push({
            type: 'quote',
            text
          })
        }
      }
      return
    }

    // 3. List
    if (['ul', 'ol'].includes(tag)) {
      const items: string[] = []
      $(element).find('> li, li').each((_, li) => {
        const liText = normalizeText($(li).text())
        if (liText && !isJunkText(liText)) {
          const norm = normalizeForComparison(liText)
          if (!seenTexts.has(norm)) {
            seenTexts.add(norm)
            items.push(liText)
          }
        }
      })
      if (items.length > 0) {
        rawBlocks.push({
          type: 'list',
          tag: tag === 'ol' ? 'ol' : 'ul',
          items
        })
      }
      return
    }

    // 4. Image
    if (tag === 'img') {
      const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy-src')
      const alt = $(element).attr('alt')?.trim() || ''
      if (src) {
        const resolved = resolveUrl(url, src)
        const lowerSrc = resolved.toLowerCase()
        if (
          resolved.startsWith('http') && 
          !lowerSrc.includes('avatar') && 
          !lowerSrc.includes('gravatar') && 
          !lowerSrc.includes('logo') && 
          !lowerSrc.includes('icon') && 
          !lowerSrc.includes('spinner') && 
          !lowerSrc.includes('loader') && 
          !lowerSrc.includes('pixel') && 
          !lowerSrc.includes('addec') &&
          !seenMediaUrls.has(resolved)
        ) {
          seenMediaUrls.add(resolved)
          rawBlocks.push({
            type: 'image',
            src: resolved,
            alt: alt || 'Inline Image'
          })
        }
      }
      return
    }

    // 5. Iframe (Video)
    if (tag === 'iframe') {
      const src = $(element).attr('src')
      if (src) {
        const resolvedSrc = resolveUrl(url, src)
        if (!seenMediaUrls.has(resolvedSrc)) {
          let videoSource: 'youtube' | 'facebook' | 'other' = 'other'
          if (resolvedSrc.includes('youtube.com') || resolvedSrc.includes('youtu.be')) {
            videoSource = 'youtube'
          } else if (resolvedSrc.includes('facebook.com')) {
            videoSource = 'facebook'
          }
          
          if (videoSource !== 'other' || resolvedSrc.includes('embed') || resolvedSrc.includes('player')) {
            seenMediaUrls.add(resolvedSrc)
            rawBlocks.push({
              type: 'video',
              url: resolvedSrc,
              source: videoSource
            })
          }
        }
      }
      return
    }

    // 6. Native Video
    if (tag === 'video') {
      const src = $(element).attr('src') || $(element).find('source').attr('src')
      if (src) {
        const resolvedSrc = resolveUrl(url, src)
        if (!seenMediaUrls.has(resolvedSrc)) {
          seenMediaUrls.add(resolvedSrc)
          rawBlocks.push({
            type: 'video',
            url: resolvedSrc,
            source: 'other'
          })
        }
      }
      return
    }

    // 7. Paragraph
    if (tag === 'p') {
      const text = normalizeText($(element).text())
      if (isJunkText(text)) return

      const textNorm = normalizeForComparison(text)
      // Deduplicate: avoid paragraph repeating title
      if (
        textNorm === cleanTitleNorm ||
        (cleanTitleNorm.length > 10 && textNorm.startsWith(cleanTitleNorm)) ||
        (textNorm.length > 10 && cleanTitleNorm.startsWith(textNorm))
      ) {
        return
      }

      // Deduplicate: avoid duplicate paragraph
      if (seenTexts.has(textNorm)) return
      seenTexts.add(textNorm)

      const links = $(element).find('a')
      if (links.length === 1 && text.length < 150) {
        const href = links.attr('href') || ''
        if (href.includes('twitter.com') || href.includes('x.com')) {
          if (href.includes('/status/')) {
            const tweetUrl = resolveUrl(url, href)
            if (!seenMediaUrls.has(tweetUrl)) {
              seenMediaUrls.add(tweetUrl)
              rawBlocks.push({
                type: 'twitter',
                url: tweetUrl,
                text
              })
              return
            }
          }
        } else if (href.includes('youtube.com/watch') || href.includes('youtu.be/')) {
          const vidUrl = resolveUrl(url, href)
          if (!seenMediaUrls.has(vidUrl)) {
            seenMediaUrls.add(vidUrl)
            rawBlocks.push({
              type: 'video',
              url: vidUrl,
              source: 'youtube'
            })
            return
          }
        }
      }

      const inlineChildren: any[] = []
      $(element).contents().each((_, child) => {
        if (child.type === 'text') {
          const txt = (child.data || '').replace(/\s+/g, ' ')
          if (txt) {
            inlineChildren.push({ type: 'text', text: txt })
          }
        } else if (child.type === 'tag') {
          const childTag = child.tagName.toLowerCase()
          const childText = normalizeText($(child).text())
          if (childText) {
            if (childTag === 'a') {
              const href = $(child).attr('href')
              inlineChildren.push({
                type: 'link',
                text: childText,
                url: href ? resolveUrl(url, href) : ''
              })
            } else if (['strong', 'b'].includes(childTag)) {
              inlineChildren.push({
                type: 'text',
                text: childText,
                bold: true
              })
            } else if (['em', 'i'].includes(childTag)) {
              inlineChildren.push({
                type: 'text',
                text: childText,
                italic: true
              })
            } else {
              inlineChildren.push({ type: 'text', text: childText })
            }
          }
        }
      })

      // If a single paragraph is an unformatted giant wall (> 150 words), split cleanly by sentence
      const wordCount = text.split(/\s+/).length
      if (wordCount > 150 && inlineChildren.length <= 1) {
        const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text]
        let currentPara = ''
        for (const sent of sentences) {
          if ((currentPara + sent).split(/\s+/).length > 60 && currentPara.length > 50) {
            const pTrim = currentPara.trim()
            rawBlocks.push({
              type: 'paragraph',
              text: pTrim,
              children: [{ type: 'text', text: pTrim }]
            })
            currentPara = sent
          } else {
            currentPara += sent
          }
        }
        if (currentPara.trim()) {
          const pTrim = currentPara.trim()
          rawBlocks.push({
            type: 'paragraph',
            text: pTrim,
            children: [{ type: 'text', text: pTrim }]
          })
        }
      } else {
        rawBlocks.push({
          type: 'paragraph',
          text,
          children: inlineChildren.length > 0 ? inlineChildren : [{ type: 'text', text }]
        })
      }
      return
    }

    $(element).children().each((_, child) => {
      traverse(child)
    })
  }

  container.children().each((_, el) => {
    traverse(el)
  })

  // Fallback if no paragraphs were found inside main container
  if (rawBlocks.filter(b => b.type === 'paragraph').length === 0) {
    $('p').each((_, el) => {
      const text = normalizeText($(el).text())
      if (!isJunkText(text) && text.length > 20) {
        const textNorm = normalizeForComparison(text)
        if (!seenTexts.has(textNorm) && textNorm !== cleanTitleNorm) {
          seenTexts.add(textNorm)
          rawBlocks.push({
            type: 'paragraph',
            text,
            children: [{ type: 'text', text }]
          })
        }
      }
    })
  }

  const cleanParagraphs = rawBlocks
    .filter(b => b.type === 'paragraph')
    .map(b => b.text.replace(/\s+/g, ' ').trim())
  
  // Full text preserved without arbitrary caps
  const content = cleanParagraphs.join('\n\n')

  let tags: string[] = []
  const keywords = $('meta[name="keywords"]').attr('content')
  if (keywords) {
    tags = keywords.split(',').map(k => k.trim()).filter(k => k.length > 2 && k.length < 20).slice(0, 5)
  } else {
    tags = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && !['about', 'after', 'before', 'their', 'there', 'these', 'would', 'instantlyfeed', 'thenationalfeed', 'policy', 'brief'].includes(w))
      .slice(0, 4)
  }

  let scrapedImageUrl = $('meta[property="og:image"]').attr('content') ||
                        $('meta[name="twitter:image"]').attr('content') ||
                        $('link[rel="image_src"]').attr('href') ||
                        $('.wp-post-image, .attachment-post-thumbnail, .attachment-hitmag-featured, .featured-image img, .entry-thumbnail img').first().attr('src') ||
                        ''
  
  if (scrapedImageUrl) {
    scrapedImageUrl = resolveUrl(url, scrapedImageUrl)
  } else {
    const articleImages = $('article img, main img, .entry-content img, .content img, .post img, #content img')
    let foundImg = ''
    articleImages.each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
      if (src) {
        const resolved = resolveUrl(url, src)
        if (
          resolved.startsWith('http') && 
          !resolved.includes('avatar') && 
          !resolved.includes('gravatar') && 
          !resolved.includes('logo') && 
          !resolved.includes('icon') && 
          !resolved.includes('spinner') && 
          !resolved.includes('loader')
        ) {
          foundImg = resolved
          return false
        }
      }
    })
    
    if (!foundImg) {
      $('img').each((_, el) => {
        const src = $(el).attr('src')
        if (src) {
          const resolved = resolveUrl(url, src)
          if (
            resolved.startsWith('http') && 
            !resolved.includes('avatar') && 
            !resolved.includes('gravatar') && 
            !resolved.includes('logo') && 
            !resolved.includes('icon') && 
            !resolved.includes('spinner') && 
            !resolved.includes('loader')
          ) {
            foundImg = resolved
            return false
          }
        }
      })
    }
    scrapedImageUrl = foundImg
  }

  // Clean excerpt if it duplicates title at start
  if (title && excerpt) {
    const cleanT = title.trim().toLowerCase()
    const prefix = cleanT.substring(0, Math.min(25, cleanT.length))
    if (excerpt.trim().toLowerCase().startsWith(prefix)) {
      excerpt = excerpt.trim().substring(title.length).replace(/^[\s:\-–—\.\,\!]+/, '').trim()
    }
  }

  // Clean rawBlocks: remove top blocks that duplicate title
  if (title && rawBlocks.length > 0) {
    const cleanT = title.trim().toLowerCase()
    const prefix = cleanT.substring(0, Math.min(25, cleanT.length))
    const filteredBlocks = rawBlocks.filter((block: any, idx: number) => {
      if (idx >= 5) return true
      const bText = (block.text || '').trim().toLowerCase()
      if (!bText) return true
      if (
        bText === cleanT || 
        (prefix.length > 5 && bText.startsWith(prefix)) || 
        (bText.length > 5 && cleanT.startsWith(bText.substring(0, 25)))
      ) {
        return false
      }
      return true
    })
    rawBlocks.length = 0
    rawBlocks.push(...filteredBlocks)
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'
  const metaTitle = title.endsWith(` - ${siteName}`) ? title : `${title.substring(0, 45)} - ${siteName}`
  
  // Clean fallback excerpt from first clean paragraph (strictly under 160 chars)
  const firstParagraph = cleanParagraphs.find(p => !isJunkText(p) && p.length > 25) || content
  let fallbackExcerpt = firstParagraph
  if (title && fallbackExcerpt.toLowerCase().startsWith(title.toLowerCase())) {
    fallbackExcerpt = fallbackExcerpt.substring(title.length).replace(/^[\s:\-–—\.\,\!]+/, '').trim()
  }
  if (fallbackExcerpt.length > 155) {
    fallbackExcerpt = fallbackExcerpt.substring(0, 155)
    const lastPeriod = fallbackExcerpt.lastIndexOf('.')
    if (lastPeriod > 80) {
      fallbackExcerpt = fallbackExcerpt.substring(0, lastPeriod + 1).trim()
    } else {
      const lastSpace = fallbackExcerpt.lastIndexOf(' ')
      if (lastSpace > 80) {
        fallbackExcerpt = fallbackExcerpt.substring(0, lastSpace).trim() + '...'
      }
    }
  }

  const finalExcerpt = (excerpt && !isJunkText(excerpt)) ? excerpt : fallbackExcerpt
  
  let rawMetaDesc = $('meta[property="og:description"]').attr('content') ||
                    $('meta[name="twitter:description"]').attr('content') ||
                    $('meta[name="description"]').attr('content') || ''
  rawMetaDesc = normalizeText(rawMetaDesc)
  if (isJunkText(rawMetaDesc)) {
    rawMetaDesc = ''
  }
  const metaDescription = rawMetaDesc || finalExcerpt

  return {
    title,
    content,
    excerpt: finalExcerpt,
    tags,
    metaTitle,
    metaDescription,
    scrapedImageUrl,
    blocks: rawBlocks,
  }
}

function buildLexicalJson(blocks: any[]): any {
  const children = blocks.map(block => {
    if (block.type === 'paragraph') {
      const blockChildren = Array.isArray(block.children) && block.children.length > 0
        ? block.children
        : [{ type: 'text', text: block.text || '' }]
      return {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: blockChildren.map((child: any) => {
          if (child.type === 'link') {
            return {
              type: 'link',
              version: 2,
              fields: {
                url: child.url,
                newTab: true,
                linkType: 'custom'
              },
              format: '',
              indent: 0,
              children: [
                {
                  type: 'text',
                  text: child.text,
                  format: 0,
                  style: '',
                  version: 1
                }
              ],
              direction: 'ltr'
            }
          } else {
            let format = 0
            if (child.bold) format |= 1
            if (child.italic) format |= 2
            return {
              type: 'text',
              text: child.text,
              format,
              style: '',
              version: 1
            }
          }
        }),
        direction: 'ltr'
      }
    }
    
    if (block.type === 'heading') {
      return {
        type: 'heading',
        tag: block.tag,
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: block.text,
            format: 0,
            style: '',
            version: 1
          }
        ],
        direction: 'ltr'
      }
    }
    
    if (block.type === 'quote') {
      return {
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: block.text,
            format: 0,
            style: '',
            version: 1
          }
        ],
        direction: 'ltr'
      }
    }
    
    if (block.type === 'list') {
      return {
        type: 'list',
        tag: block.tag === 'ol' ? 'ol' : 'ul',
        format: '',
        indent: 0,
        version: 1,
        children: block.items.map((itemText: string) => ({
          type: 'listitem',
          version: 1,
          format: '',
          indent: 0,
          value: -1,
          children: [
            {
              type: 'text',
              text: itemText,
              format: 0,
              style: '',
              version: 1
            }
          ],
          direction: 'ltr'
        })),
        direction: 'ltr'
      }
    }
    
    if (block.type === 'image') {
      if (!block.mediaId) return null
      return {
        type: 'upload',
        version: 1,
        relationTo: 'media',
        value: block.mediaId,
        format: '',
        indent: 0,
        children: []
      }
    }
    
    if (block.type === 'video') {
      return {
        type: 'block',
        version: 2,
        format: '',
        indent: 0,
        fields: {
          id: `block-${Math.random().toString(36).substring(2, 11)}`,
          blockType: 'videoEmbed',
          source: block.source,
          url: block.url,
          caption: block.caption || ''
        }
      }
    }
    
    if (block.type === 'twitter') {
      const rawText = block.tweetText || block.text || ''
      // Strip noisy pic.twitter and t.co URLs from text body
      const cleanText = rawText
        .replace(/https?:\/\/t\.co\/\S+/gi, '')
        .replace(/pic\.twitter\.com\/\S+/gi, '')
        .replace(/\s+/g, ' ')
        .trim()

      const authorText = block.author 
        ? ` — ${block.author}${block.authorHandle ? ` (${block.authorHandle})` : ''}` 
        : ''
      
      const children: any[] = []
      if (cleanText) {
        children.push({
          type: 'text',
          text: `“${cleanText}”`,
          format: 2, // italic
          style: '',
          version: 1,
        })
      }

      if (authorText) {
        children.push({
          type: 'text',
          text: authorText,
          format: 0,
          style: '',
          version: 1,
        })
      }
      
      if (block.url) {
        if (children.length > 0) {
          children.push({
            type: 'text',
            text: ' ',
            format: 0,
            style: '',
            version: 1,
          })
        }
        children.push({
          type: 'link',
          version: 2,
          fields: {
            url: block.url,
            newTab: true,
            linkType: 'custom',
          },
          format: '',
          indent: 0,
          children: [
            {
              type: 'text',
              text: 'View on X',
              format: 0,
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
        })
      }

      if (children.length === 0) return null

      return {
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        children,
        direction: 'ltr',
      }
    }
    
    return null
  }).filter(Boolean)
  
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: children.length > 0 ? children : [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [],
          direction: 'ltr'
        }
      ],
      direction: 'ltr'
    }
  }
}

function getGoogleAI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured in environment variables')
  }
  return createGoogleGenerativeAI({ apiKey })
}

const PRIMARY_MODEL_ID = 'gemini-3.5-flash-lite'
const FALLBACK_MODEL_ID = 'gemini-3.6-flash'
const TERTIARY_MODEL_ID = 'gemini-2.5-flash'

async function generateAiText(systemPrompt: string, userPrompt: string): Promise<string> {
  const googleAI = getGoogleAI()
  const candidateModels = [PRIMARY_MODEL_ID, FALLBACK_MODEL_ID, TERTIARY_MODEL_ID]
  let lastErr: any = null

  for (const modelId of candidateModels) {
    try {
      const model = googleAI(modelId)
      const res = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt,
      })
      if (res.text && res.text.trim()) {
        return res.text
      }
    } catch (err: any) {
      console.warn(`[AI Assist] Model ${modelId} failed:`, err?.message)
      lastErr = err
    }
  }

  throw lastErr || new Error('All AI models failed to generate content')
}

function extractJsonFromText(rawText: string): any {
  if (!rawText) throw new Error('Empty response from AI model')

  let text = rawText
    .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .trim()

  try {
    return JSON.parse(text)
  } catch {}

  const markdownJsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (markdownJsonMatch && markdownJsonMatch[1]) {
    try {
      return JSON.parse(markdownJsonMatch[1].trim())
    } catch {}
  }

  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1)
    try {
      return JSON.parse(candidate)
    } catch {}
  }

  throw new Error(`Failed to parse valid JSON from AI response: ${text.substring(0, 120)}...`)
}

// GET /api/ai/assist — health check all models
export async function GET() {
  const results: Record<string, { ok: boolean; response?: string; error?: string }> = {}

  try {
    const googleAI = getGoogleAI()
    for (const modelId of [PRIMARY_MODEL_ID, FALLBACK_MODEL_ID, TERTIARY_MODEL_ID]) {
      try {
        const model = googleAI(modelId)
        const res = await generateText({
          model,
          prompt: 'Reply with exactly: OK',
        })
        results[modelId] = { ok: true, response: res.text.trim() }
      } catch (e: any) {
        results[modelId] = { ok: false, error: e?.message || 'Unknown error' }
      }
    }
  } catch (initErr: any) {
    return NextResponse.json({ allOk: false, error: initErr?.message }, { status: 500 })
  }

  const anyOk = Object.values(results).some(r => r.ok)
  return NextResponse.json({ allOk: anyOk, models: results }, { status: anyOk ? 200 : 500 })
}

const SYSTEM_PROMPT = `You are an expert news editor and content writer for a world-class news publication covering global news, politics, technology, business, and culture in BBC News style.

For content summarization and AI formatting, follow these strict editorial rules:
1. Lead Excerpt / Summary: Create a punchy, high-engagement lead summary strictly under 160 characters.
2. Title Handling: Do NOT duplicate the article title inside the main body content.
3. Subheadings: Do NOT include any H2 or H3 subheadings in short summary articles—use clean, readable paragraphs.
4. Total Word Count: The entire summary body content MUST be strictly between 120 and 140 words.
5. Paragraph Constraints: Write EXACTLY 4 paragraphs (no more, no less). Each paragraph MUST be at most 35 words long.
6. Core Takeaways First (Lead-In): Put the main conclusion, event, or answer in the very first sentence (the "5 Ws": Who, What, When, Where, Why).
7. Eliminate Fluff & Redundancies: Strip away unnecessary background details, conversational filler, repetitive examples, and minor anecdotes.
8. Maintain Factual Accuracy: Preserve the original meaning and context without altering facts or adding unverified information.
9. Region & Dateline: Categorize region (one of: world, europe, asia, us-canada, middle-east, latin-america, africa) and dateline (e.g. LONDON, GENEVA, WASHINGTON, TOKYO).
10. SEO Metadata Limits:
   - Meta Title: 50–60 characters.
   - Meta Description: 100–150 characters.

Always respond with valid JSON only. No markdown, no explanations outside the JSON.`

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    let user = null

    try {
      const nextHeaders = await getNextHeaders()
      const authRes = await payload.auth({ headers: nextHeaders })
      user = authRes.user
    } catch {
      try {
        const authRes = await payload.auth({ headers: req.headers })
        user = authRes.user
      } catch {}
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to CMS admin.' }, { status: 401 })
    }

    const { action, title, content, url } = await req.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    if (action === 'scrape_direct') {
      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
      }

      const result = await scrapeUrlDirectly(url) as any
      const blocks = result.blocks || []

      // 1. Download cover image
      if (result.scrapedImageUrl) {
        try {
          const imageRes = await fetch(result.scrapedImageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
          })
          if (imageRes.ok) {
            const arrayBuffer = await imageRes.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const contentType = imageRes.headers.get('content-type') || 'image/jpeg'
            let ext = contentType.split('/')[1] || 'jpg'
            ext = ext.split(';')[0].replace('+xml', '').trim()
            if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
              ext = 'jpg'
            }
            const filename = `scraped-${Date.now()}.${ext}`
            
            const mediaDoc = await payload.create({
              collection: 'media',
              data: {
                alt: result.title || 'Scraped Image',
                source: 'local',
              },
              file: {
                data: buffer,
                name: filename,
                mimetype: contentType,
                size: buffer.length,
              }
            })
            result.coverImage = mediaDoc.id
          } else {
            throw new Error(`Failed to fetch cover image: Status ${imageRes.status}`)
          }
        } catch (imgErr) {
          console.error('Failed to download scraped cover image, trying external fallback:', imgErr)
          try {
            const mediaDoc = await payload.create({
              collection: 'media',
              data: {
                alt: result.title || 'Scraped Image',
                source: 'external',
                externalUrl: result.scrapedImageUrl
              },
              file: {
                data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==', 'base64'),
                name: `external-cover-${Date.now()}.png`,
                mimetype: 'image/png',
                size: 70,
              },
            })
            result.coverImage = mediaDoc.id
          } catch (extErr) {
            console.error('Failed to create external cover image fallback:', extErr)
          }
        }
      }

      // 2. Download inline images
      for (const block of blocks) {
        if (block.type === 'image' && block.src) {
          try {
            const imageRes = await fetch(block.src, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            })
            if (imageRes.ok) {
              const arrayBuffer = await imageRes.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              const contentType = imageRes.headers.get('content-type') || 'image/jpeg'
              let ext = contentType.split('/')[1] || 'jpg'
              ext = ext.split(';')[0].replace('+xml', '').trim()
              if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
                ext = 'jpg'
              }
              const filename = `scraped-inline-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`
              
              const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                  alt: block.alt || result.title || 'Scraped Inline Image',
                  source: 'local',
                },
                file: {
                  data: buffer,
                  name: filename,
                  mimetype: contentType,
                  size: buffer.length,
                }
              })
              block.mediaId = mediaDoc.id
            } else {
              throw new Error(`Failed to fetch inline image: Status ${imageRes.status}`)
            }
          } catch (imgErr) {
            console.error('Failed to download inline image, trying external fallback:', block.src, imgErr)
            try {
              const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                  alt: block.alt || result.title || 'Scraped Inline Image',
                  source: 'external',
                  externalUrl: block.src
                },
                file: {
                  data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6ie6hQAAAABJRU5ErkJggg==', 'base64'),
                  name: `external-inline-${Date.now()}.png`,
                  mimetype: 'image/png',
                  size: 70,
                },
              })
              block.mediaId = mediaDoc.id
            } catch (extErr) {
              console.error('Failed to create external inline image fallback:', extErr)
            }
          }
        }

        // 3. Resolve Twitter/X embeds using the public oEmbed API
        if (block.type === 'twitter' && block.url) {
          try {
            const oEmbedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(block.url)}&omit_script=true`
            const embedRes = await fetch(oEmbedUrl)
            if (embedRes.ok) {
              const embedData = await embedRes.json()
              block.author = embedData.author_name || ''
              block.authorHandle = embedData.author_url ? '@' + embedData.author_url.split('/').pop() : '@x'
              
              if (embedData.html) {
                const tweet$ = cheerio.load(embedData.html)
                block.tweetText = tweet$('p').text().trim() || block.text
                block.date = tweet$('a').last().text().trim()
              }
            }
          } catch (tweetErr) {
            console.error('Failed to fetch Twitter oEmbed info:', tweetErr)
          }
          if (!block.tweetText) {
            block.tweetText = block.text || 'Twitter content'
          }
        }
      }

      // 4. Deduplicate cover and inline images
      const coverMediaId = result.coverImage
      const coverSrc = result.scrapedImageUrl

      const dedupedBlocks = blocks.filter((block: any) => {
        if (block.type !== 'image') return true
        if (coverMediaId && block.mediaId === coverMediaId) return false
        if (coverSrc && block.src === coverSrc) return false
        return true
      })

      // 5. Build Lexical JSON rich text from the full deduped blocks in natural order
      // (paragraphs, subheadings, images, videos, twitter embeds, quotes, lists)
      // Preserves full text without summarization or artificial caps.
      result.content = buildLexicalJson(dedupedBlocks)

      // 6. Generate intelligent Gemini AI metadata (excerpt, tags, region, dateline, SEO) adhering to editorial rules
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && result.title) {
        try {
          const rawParagraphsText = dedupedBlocks
            .filter((b: any) => b.type === 'paragraph')
            .map((b: any) => b.text)
            .slice(0, 15)
            .join('\n\n')

          if (rawParagraphsText.length > 50) {
            const hasVideo = dedupedBlocks.some((b: any) => b.type === 'video')
            if (hasVideo) {
              result.isVideo = true
              result.videoDuration = '03:45'
            }

            const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'

            const aiPrompt = `Given the news article title "${result.title}" and context:\n"${rawParagraphsText.substring(0, 3000)}"\n\nGenerate article metadata strictly following these rules:
1. "excerpt": A punchy, high-engagement lead summary strictly under 160 characters. Do NOT repeat or duplicate the title.
2. "region": One of ["world", "europe", "asia", "us-canada", "middle-east", "latin-america", "africa"].
3. "dateline": Uppercase city name of the news origin (e.g. "LONDON", "GENEVA", "WASHINGTON", "TOKYO").
4. "tags": ["3-5 relevant lowercase tags"].
5. "metaTitle": SEO title strictly 50-60 characters ending with - ${siteName}.
6. "metaDescription": SEO meta description strictly 100-150 characters.

Return valid JSON with exact keys: { "excerpt", "region", "dateline", "tags", "metaTitle", "metaDescription" }`

            const rawText = await generateAiText(SYSTEM_PROMPT, aiPrompt)
            const aiData = extractJsonFromText(rawText)

            if (aiData.excerpt) result.excerpt = aiData.excerpt
            if (aiData.tags) result.tags = aiData.tags
            if (aiData.metaTitle) result.metaTitle = aiData.metaTitle
            if (aiData.metaDescription) result.metaDescription = aiData.metaDescription
            if (aiData.region) result.region = aiData.region
            if (aiData.dateline) result.dateline = aiData.dateline
          }
        } catch (aiMetadataErr) {
          console.warn('[Import Metadata AI Warning]', aiMetadataErr)
        }
      }
      delete result.blocks

      const enforced = enforceSeoLimits(result)
      return NextResponse.json({ success: true, data: enforced })
    }

    // AI Generation Actions: full, content_only, seo_only
    if (!title && !content) {
      return NextResponse.json({ error: 'Title or content is required for AI generation' }, { status: 400 })
    }

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'

    let prompt = ''
    if (action === 'full') {
      prompt = `Given the article title "${title}"${content ? ` and notes: "${content}"` : ''}, generate a complete summary news article adhering to these rules:
- "excerpt": A punchy, high-engagement lead summary strictly under 160 characters.
- "content": Summary body of EXACTLY 4 short paragraphs (no H2/H3 subheadings). Total word count MUST be between 120 and 140 words. Each paragraph MUST be at most 35 words long.
- "tags": ["3-5 relevant lowercase tags"]
- "metaTitle": SEO title strictly 50-60 characters ending with - ${siteName}.
- "metaDescription": SEO meta description strictly 100-150 characters.

Return JSON with exact keys: { "excerpt", "content", "tags", "metaTitle", "metaDescription" }`
    } else if (action === 'content_only') {
      prompt = `Given the article title "${title}"${content ? ` and notes: "${content}"` : ''}, generate the summary article content adhering to these rules:
- "excerpt": A punchy, high-engagement lead summary strictly under 160 characters.
- "content": Summary body of EXACTLY 4 short paragraphs (no H2/H3 subheadings). Total word count MUST be between 120 and 140 words. Each paragraph MUST be at most 35 words long.

Return JSON with exact keys: { "excerpt", "content" }`
    } else if (action === 'seo_only') {
      prompt = `Given the article title "${title}"${content ? ` and excerpt/content: "${content}"` : ''}, generate SEO metadata adhering to these rules:
- "excerpt": A punchy, high-engagement lead summary strictly under 160 characters.
- "tags": ["3-5 relevant lowercase tags"]
- "metaTitle": SEO title strictly 50-60 characters ending with - ${siteName}.
- "metaDescription": SEO meta description strictly 100-150 characters.

Return JSON with exact keys: { "excerpt", "tags", "metaTitle", "metaDescription" }`
    }

    const rawText = await generateAiText(SYSTEM_PROMPT, prompt)
    const aiData = extractJsonFromText(rawText)
    const enforced = enforceSeoLimits(aiData)

    return NextResponse.json({ success: true, data: enforced })
  } catch (error: any) {
    console.error('[AI Assist Error]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

function enforceSeoLimits(seoData: any) {
  if (!seoData) return seoData

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The National Feed'

  // 1. Meta Title: 50–60 characters
  if (seoData.metaTitle && typeof seoData.metaTitle === 'string') {
    let title = seoData.metaTitle.trim()
    if (title.length > 60) {
      const suffix = title.endsWith(` - ${siteName}`) ? ` - ${siteName}` : (title.endsWith(` | ${siteName}`) ? ` | ${siteName}` : '')
      const maxPrefixLength = 60 - suffix.length
      if (suffix) {
        let prefix = title.substring(0, title.length - suffix.length).trim()
        if (prefix.length > maxPrefixLength) {
          prefix = prefix.substring(0, maxPrefixLength)
          const lastSpace = prefix.lastIndexOf(' ')
          if (lastSpace > 20) {
            prefix = prefix.substring(0, lastSpace).trim()
          }
        }
        title = prefix + suffix
      } else {
        title = title.substring(0, 60)
        const lastSpace = title.lastIndexOf(' ')
        if (lastSpace > 30) {
          title = title.substring(0, lastSpace).trim()
        }
      }
      seoData.metaTitle = title
    }
  }

  // 2. Meta Description: 100–150 characters
  if (seoData.metaDescription && typeof seoData.metaDescription === 'string') {
    let desc = seoData.metaDescription.trim()
    if (desc.length > 150) {
      desc = desc.substring(0, 150)
      const lastPeriod = desc.lastIndexOf('.')
      if (lastPeriod > 100) {
        desc = desc.substring(0, lastPeriod + 1).trim()
      } else {
        const lastSpace = desc.lastIndexOf(' ')
        if (lastSpace > 100) {
          desc = desc.substring(0, lastSpace).trim() + '...'
        }
      }
      seoData.metaDescription = desc
    }
  }

  // 3. Lead Excerpt: strictly under 160 characters (and no title duplication)
  if (seoData.excerpt && typeof seoData.excerpt === 'string') {
    let excerpt = seoData.excerpt.trim()
    if (seoData.title && typeof seoData.title === 'string') {
      const cleanT = seoData.title.trim().toLowerCase()
      const prefix = cleanT.substring(0, Math.min(25, cleanT.length))
      if (excerpt.toLowerCase().startsWith(prefix)) {
        excerpt = excerpt.substring(seoData.title.length).replace(/^[\s:\-–—\.\,\!]+/, '').trim()
      }
    }
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 160)
      const lastPeriod = excerpt.lastIndexOf('.')
      if (lastPeriod > 100) {
        excerpt = excerpt.substring(0, lastPeriod + 1).trim()
      } else {
        const lastSpace = excerpt.lastIndexOf(' ')
        if (lastSpace > 100) {
          excerpt = excerpt.substring(0, lastSpace).trim() + '...'
        }
      }
    }
    seoData.excerpt = excerpt
  }
  return seoData
}
