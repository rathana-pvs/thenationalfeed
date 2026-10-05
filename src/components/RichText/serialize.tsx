import { Fragment, JSX } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TwitterEmbed } from '@/components/article/TwitterEmbed'
import { getMediaUrl } from '@/lib/utils'

type Node = {
  type: string
  value?: any
  text?: string
  children?: Node[]
  tag?: string
  format?: number
  metadata?: any
  [key: string]: any
}

export function serializeLexical(nodes: Node[], keyPrefix: string = 'node'): JSX.Element[] {
  return nodes.map((node, i) => {
    const nodeKey = `${keyPrefix}-${i}`
    if (node.type === 'text') {
      let text = <Fragment key={nodeKey}>{node.text}</Fragment>

      if ((node.format || 0) & 1) {
        text = <strong key={nodeKey}>{text}</strong>
      }
      if ((node.format || 0) & 2) {
        text = <em key={nodeKey}>{text}</em>
      }
      if ((node.format || 0) & 4) {
        text = <u key={nodeKey}>{text}</u>
      }
      if ((node.format || 0) & 8) {
        text = <s key={nodeKey}>{text}</s>
      }
      if ((node.format || 0) & 16) {
        text = <code key={nodeKey}>{text}</code>
      }

      return text as any
    }

    if (!node) {
      return null
    }

    const children = node.children ? serializeLexical(node.children, `${nodeKey}-c`) : null

    switch (node.type) {
      case 'h1':
        return (
          <h1 key={nodeKey} className="font-serif font-bold text-3xl sm:text-4xl mb-4 mt-8 text-[var(--ink)]">
            {children}
          </h1>
        )
      case 'h2':
        return (
          <h2 key={nodeKey} className="font-serif font-bold text-2xl sm:text-3xl mb-3 mt-8 text-[var(--ink)]">
            {children}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={nodeKey} className="font-serif font-bold text-xl sm:text-2xl mb-3 mt-6 text-[var(--ink)]">
            {children}
          </h3>
        )
      case 'h4':
        return (
          <h4 key={nodeKey} className="font-serif font-bold text-lg sm:text-xl mb-2 mt-5 text-[var(--ink)]">
            {children}
          </h4>
        )
      case 'quote': {
        const linkChild = node.children?.find((child: any) => 
          child.type === 'link' && 
          (child.fields?.url?.includes('twitter.com') || child.fields?.url?.includes('x.com'))
        )
        const twitterUrl = linkChild?.fields?.url

        if (twitterUrl) {
          const textChildren = node.children?.filter((child: any) => child.type === 'text') || []
          const fullText = textChildren.map((c: any) => c.text || '').join(' ').replace(/^“|”$/g, '').trim()

          return (
            <TwitterEmbed
              key={nodeKey}
              url={twitterUrl}
              text={fullText}
            />
          )
        }

        return (
          <blockquote 
            key={nodeKey} 
            className="border-l-4 pl-4 py-2.5 my-6 text-lg leading-relaxed italic bg-[var(--surface)] border-[var(--bbc-red)] text-[#222]"
          >
            {children}
          </blockquote>
        )
      }
      case 'link': {
        const isTwitterLink = node.fields?.url?.includes('twitter.com') || node.fields?.url?.includes('x.com')
        if (isTwitterLink) {
          return (
            <a
              key={nodeKey}
              href={node.fields?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 text-xs font-semibold rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-all shadow-sm not-italic"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{children || 'View on X'} ↗</span>
            </a>
          )
        }

        return (
          <Link
            key={nodeKey}
            href={node.fields?.url || ''}
            className="underline underline-offset-3 transition-colors hover:text-[var(--ink)] font-medium text-[var(--bbc-red)]"
          >
            {children}
          </Link>
        )
      }
      case 'block':
        const block = node.fields
        if (!block || block.blockType !== 'videoEmbed') return null

        const embedUrl = block.url
        const ytId = embedUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]

        return (
          <div key={nodeKey} className="my-10">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5 aspect-video bg-black">
              <iframe
                src={ytId ? `https://www.youtube.com/embed/${ytId}` : embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.caption && (
              <p className="text-sm text-center mt-3 text-white/50 italic">{block.caption}</p>
            )}
          </div>
        )

      case 'upload':
        const media = node.value
        if (!media || node.relationTo !== 'media') return null
        
        const mediaUrl = getMediaUrl(media, '')
        if (!mediaUrl) return null

        const isVideo = media.mimeType?.startsWith('video/')

        if (isVideo) {
          return (
            <div key={nodeKey} className="my-10 rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black">
              <video
                src={mediaUrl}
                controls
                className="w-full aspect-video"
                playsInline
              />
              {media.caption && (
                <div className="p-4 bg-muted/30">
                  <p className="text-sm text-white/70 italic font-serif">
                    {media.caption}
                  </p>
                </div>
              )}
            </div>
          )
        }

        return (
          <div key={nodeKey} className="my-10 relative rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
            <Image
              src={mediaUrl}
              alt={media.alt || ''}
              width={media.width || 1200}
              height={media.height || 800}
              unoptimized={mediaUrl.startsWith('/media/')}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {media.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm text-white/90 italic font-serif">
                  {media.caption}
                </p>
              </div>
            )}
          </div>
        )
      case 'embed':
      case 'youtube':
        const url = node.value || node.fields?.url
        if (!url) return null
        
        const youtubeId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]
        
        if (youtubeId) {
          return (
            <div key={nodeKey} className="my-10 rounded-xl overflow-hidden shadow-2xl border border-white/5 aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        }

        return (
          <div key={nodeKey} className="my-10 rounded-xl overflow-hidden shadow-2xl border border-white/5 aspect-video bg-black">
             <iframe 
               src={url} 
               className="w-full h-full" 
               allowFullScreen 
             />
          </div>
        )

      case 'list':
        const ListTag = node.tag === 'ol' ? 'ol' : 'ul'
        return (
          <ListTag 
            key={nodeKey} 
            className={`${node.tag === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 mb-5 space-y-2 text-[var(--ink)]`} 
          >
            {children}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={nodeKey} className="leading-relaxed">
            {children}
          </li>
        )
      case 'horizontalrule':
        return (
          <hr key={nodeKey} className="my-8 border-t border-[var(--line)]" />
        )
      case 'paragraph':
      default:
        const hasBlockChild = node.children?.some((child) => 
          ['upload', 'block', 'embed', 'video', 'youtube', 'list', 'horizontalrule'].includes(child.type)
        )
        const Tag = hasBlockChild ? 'div' : 'p'
        
        return (
          <Tag 
            key={nodeKey} 
            className="article-paragraph"
          >
            {children}
          </Tag>
        )
    }
  }) as any
}
