'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useFormFields, useForm } from '@payloadcms/ui'

interface AIResult {
  title?: string
  content?: string
  excerpt?: string
  tags?: string[]
  region?: string
  dateline?: string
  isVideo?: boolean
  videoDuration?: string
  metaTitle?: string
  metaDescription?: string
  coverImage?: number | string
  scrapedImageUrl?: string
}

type Action = 'full' | 'content_only' | 'seo_only' | 'scrape_direct'

export const AIAssistant: React.FC = () => {
  const { dispatchFields } = useForm()
  const titleValue = useFormFields(([fields]) => fields?.title?.value as string || '')
  const excerptValue = useFormFields(([fields]) => fields?.excerpt?.value as string || '')

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [result, setResult] = useState<AIResult | null>(null)
  const [error, setError] = useState('')
  const [applied, setApplied] = useState<Record<string, boolean>>({})
  const [pulse, setPulse] = useState(true)
  const [scrapeUrlValue, setScrapeUrlValue] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setPulse(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const callAI = async (action: Action) => {
    setStatus('loading')
    setActiveAction(action)
    setError('')
    setResult(null)
    setApplied({})

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          title: titleValue,
          content: excerptValue,
          url: action === 'scrape_direct' ? scrapeUrlValue : undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Something went wrong')
      }
      setResult(json.data)
      setStatus('success')
    } catch (err: any) {
      setError(err?.message || 'Failed to generate. Try again.')
      setStatus('error')
    }
  }

  const handleImport = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault()
    if (!scrapeUrlValue) return
    await callAI('scrape_direct')
  }

  const convertTextToLexicalJson = (text: string) => {
    if (!text) return null
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean)

    const children = paragraphs.map(paraText => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'text',
          text: paraText,
          format: 0,
          style: '',
          version: 1,
        },
      ],
      direction: 'ltr',
    }))

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
            direction: 'ltr',
          }
        ],
        direction: 'ltr',
      },
    }
  }

  const applyField = (fieldName: string, value: any) => {
    if (fieldName === 'excerpt' && typeof value === 'string' && result?.title) {
      let cleanExcerpt = value
      const cleanT = result.title.trim().toLowerCase()
      const prefix = cleanT.substring(0, Math.min(25, cleanT.length))
      if (cleanExcerpt.trim().toLowerCase().startsWith(prefix)) {
        cleanExcerpt = cleanExcerpt.trim().substring(result.title.length).replace(/^[\s:\-–—\.\,\!]+/, '').trim()
      }
      dispatchFields({ type: 'UPDATE', path: 'excerpt', value: cleanExcerpt, valid: true })
    } else if (fieldName === 'tags' && Array.isArray(value)) {
      dispatchFields({ type: 'UPDATE', path: 'tags', value: value.map((tag: string) => ({ tag })), valid: true })
    } else if (fieldName === 'metaTitle') {
      dispatchFields({ type: 'UPDATE', path: 'og.metaTitle', value, valid: true })
      dispatchFields({ type: 'UPDATE', path: 'meta.title', value, valid: true })
    } else if (fieldName === 'metaDescription') {
      dispatchFields({ type: 'UPDATE', path: 'og.metaDescription', value, valid: true })
      dispatchFields({ type: 'UPDATE', path: 'meta.description', value, valid: true })
    } else if (fieldName === 'coverImage') {
      dispatchFields({ type: 'UPDATE', path: 'coverImage', value, initialValue: value, valid: true })
      dispatchFields({ type: 'UPDATE', path: 'og.ogImage', value, initialValue: value, valid: true })
      dispatchFields({ type: 'UPDATE', path: 'meta.image', value, initialValue: value, valid: true })
    } else if (fieldName === 'content') {
      let lexicalValue = typeof value === 'string' ? convertTextToLexicalJson(value) : JSON.parse(JSON.stringify(value))
      if (lexicalValue?.root?.children && result?.title) {
        const cleanT = result.title.trim().toLowerCase()
        const prefix = cleanT.substring(0, Math.min(25, cleanT.length))
        
        const getNodeText = (node: any): string => {
          if (!node) return ''
          if (typeof node.text === 'string') return node.text
          if (node.children && Array.isArray(node.children)) {
            return node.children.map(getNodeText).join(' ')
          }
          return ''
        }

        lexicalValue.root.children = lexicalValue.root.children.filter((node: any, idx: number) => {
          if (idx >= 5) return true
          const text = getNodeText(node).trim().toLowerCase()
          if (!text) return true
          if (
            text === cleanT ||
            (prefix.length > 5 && text.startsWith(prefix)) ||
            (text.length > 5 && cleanT.startsWith(text.substring(0, 25)))
          ) {
            return false
          }
          return true
        })
      }
      dispatchFields({ type: 'UPDATE', path: 'content', value: lexicalValue, initialValue: lexicalValue, valid: true })
    } else {
      dispatchFields({ type: 'UPDATE', path: fieldName, value, valid: true })
    }
    setApplied(prev => ({ ...prev, [fieldName]: true }))
  }

  const applyAll = () => {
    if (!result) return
    if (result.title) applyField('title', result.title)
    if (result.coverImage) applyField('coverImage', result.coverImage)
    if (result.excerpt) applyField('excerpt', result.excerpt)
    if (result.content) applyField('content', result.content)
    if (result.region) applyField('region', result.region)
    if (result.dateline) applyField('dateline', result.dateline)
    if (result.isVideo) applyField('isVideo', result.isVideo)
    if (result.videoDuration) applyField('videoDuration', result.videoDuration)
    if (result.tags && result.tags.length > 0) applyField('tags', result.tags)
    if (result.metaTitle) applyField('metaTitle', result.metaTitle)
    if (result.metaDescription) applyField('metaDescription', result.metaDescription)
  }

  const allApplied = Boolean(
    result &&
    (!result.title || applied['title']) &&
    (!result.coverImage || applied['coverImage']) &&
    (!result.excerpt || applied['excerpt']) &&
    (!result.content || applied['content']) &&
    (!result.tags || applied['tags']) &&
    (!result.metaTitle || applied['metaTitle']) &&
    (!result.metaDescription || applied['metaDescription'])
  )

  const buttons: { action: Action; icon: string; label: string; desc: string }[] = [
    { action: 'full', icon: '✍️', label: 'Full', desc: 'Generate content, excerpt & SEO' },
    { action: 'content_only', icon: '📝', label: 'Content Only', desc: 'Generate excerpt & content body' },
    { action: 'seo_only', icon: '🔍', label: 'SEO Only', desc: 'Generate excerpt, OG & Meta fields' },
  ]

  const isLoading = status === 'loading'

  if (!mounted) return null

  return createPortal(
    <>
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,106,247,0.6); }
          50% { box-shadow: 0 0 0 10px rgba(124,106,247,0); }
        }
        @keyframes ai-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ai-slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ai-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-fab {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 999999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c6af7 0%, #2085ec 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: white;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px rgba(124,106,247,0.5);
        }
        .ai-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(124,106,247,0.7);
        }
        .ai-fab.pulse {
          animation: ai-pulse 1.8s ease-in-out infinite;
        }
        .ai-panel {
          position: fixed;
          bottom: 100px;
          right: 32px;
          z-index: 999998;
          width: 340px;
          max-height: 80vh;
          overflow-y: auto;
          border-radius: 16px;
          background: var(--theme-elevation-100, #1c2128);
          border: 1px solid rgba(124,106,247,0.3);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
          animation: ai-slide-in 0.25s ease forwards;
        }
        .ai-panel::-webkit-scrollbar { width: 4px; }
        .ai-panel::-webkit-scrollbar-track { background: transparent; }
        .ai-panel::-webkit-scrollbar-thumb { background: rgba(124,106,247,0.4); border-radius: 4px; }
        .ai-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999997;
        }
        .import-btn {
          width: 100%;
          padding: 10px 14px;
          border: none;
          border-radius: 6px;
          background: #ff7a00;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .import-btn:hover:not(:disabled) {
          background: #e66d00;
        }
        .import-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ai-action-btn {
          width: 100%;
          padding: 11px 14px;
          border: 1px solid var(--theme-border-color, #30363d);
          border-radius: 8px;
          background: var(--theme-elevation-150, #21262d);
          color: var(--theme-text-color, #f5f0e8);
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .ai-action-btn:hover:not(:disabled) {
          border-color: #7c6af7;
          background: rgba(124,106,247,0.1);
          transform: translateY(-1px);
        }
        .ai-action-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .ai-apply-btn {
          width: 100%;
          padding: 7px 12px;
          border: none;
          border-radius: 6px;
          background: #7c6af7;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
          font-family: inherit;
        }
        .ai-apply-btn:hover:not(:disabled) { background: #6558e0; }
        .ai-apply-btn:disabled { background: #2ecc71; cursor: default; }
        .ai-apply-all-btn {
          width: 100%;
          padding: 10px 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          font-family: inherit;
        }
        .ai-apply-all-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
        .ai-apply-all-btn:disabled {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.4);
          box-shadow: none;
          cursor: default;
          transform: none;
        }
        .ai-result { animation: ai-fade-in 0.3s ease forwards; }
        .ai-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(124,106,247,0.15);
          border: 1px solid rgba(124,106,247,0.3);
          font-size: 10px;
          color: #a89bf5;
        }
      `}</style>

      {open && <div className="ai-backdrop" onClick={() => setOpen(false)} />}

      <button
        className={`ai-fab${pulse && !open ? ' pulse' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="AI Writing Assistant"
        type="button"
      >
        {open ? '✕' : '✨'}
      </button>

      {open && (
        <div className="ai-panel">
          <div style={{
            padding: '14px',
            borderBottom: '1px solid var(--theme-border-color, #30363d)',
            background: 'var(--theme-elevation-150, #21262d)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--theme-text-color, #f5f0e8)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✨</span> AI Writing Assistant
              </div>
              <div style={{ fontSize: 9, color: 'var(--theme-text-muted, #8b949e)', marginTop: 2 }}>Scrapes URL or Uses Google Gemini AI</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent', border: 'none', color: 'var(--theme-text-muted, #8b949e)',
                cursor: 'pointer', fontSize: 16, padding: 4, display: 'flex', alignItems: 'center',
              }}
            >✕</button>
          </div>

          <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Section 1: Link Importer */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--theme-text-muted, #8b949e)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                🔌 Link Importer
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--theme-text-muted, #8b949e)', lineHeight: 1.4 }}>
                Enter an article URL to scrape and populate fields.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="url"
                  placeholder="Paste article or blog link..."
                  value={scrapeUrlValue}
                  onChange={(e) => setScrapeUrlValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleImport(e)
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--theme-border-color, #30363d)',
                    background: 'var(--theme-elevation-200, #1c2128)',
                    color: 'var(--theme-text-color, #f5f0e8)',
                    fontSize: 11,
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  className="import-btn"
                  onClick={handleImport}
                  disabled={isLoading || !scrapeUrlValue}
                >
                  {isLoading && activeAction === 'scrape_direct' ? (
                    <>
                      <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ai-spin 0.7s linear infinite' }} />
                      Importing...
                    </>
                  ) : 'Import Link'}
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--theme-border-color, #30363d)', margin: '4px 0' }} />

            {/* Section 2: AI Writing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--theme-text-muted, #8b949e)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ✍️ AI Writing Options
              </div>

              {!titleValue && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,193,7,0.08)',
                  border: '1px solid rgba(255,193,7,0.25)',
                  fontSize: '11px',
                  color: '#f0b429',
                }}>
                  ⚠️ Enter an article title first.
                </div>
              )}

              {buttons.map(({ action, icon, label, desc }) => (
                <button
                  key={action}
                  type="button"
                  className="ai-action-btn"
                  disabled={isLoading || !titleValue}
                  onClick={() => callAI(action)}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                    {activeAction === action && isLoading ? (
                      <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ai-spin 0.7s linear infinite' }} />
                    ) : icon}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--theme-text-muted, #8b949e)', marginTop: 1 }}>
                      {activeAction === action && isLoading ? 'Generating...' : desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {status === 'error' && (
              <div className="ai-result" style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(231,76,60,0.08)',
                border: '1px solid rgba(231,76,60,0.3)',
                fontSize: 11,
                color: '#e74c3c',
                lineHeight: 1.4,
              }}>
                ✕ {error}
              </div>
            )}

            {status === 'success' && result && (
              <div className="ai-result" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#2ecc71',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>✅ Ready — click to apply</div>
                </div>

                <button
                  type="button"
                  className="ai-apply-all-btn"
                  onClick={applyAll}
                  disabled={allApplied}
                >
                  {allApplied ? '✓ All Fields Applied' : '🚀 Apply All Fields (1-Click)'}
                </button>

                <div style={{ height: '1px', background: 'var(--theme-border-color, #30363d)', margin: '2px 0' }} />

                {result.title && (
                  <ResultCard label="Title" value={result.title} applied={!!applied['title']} onApply={() => applyField('title', result.title)} />
                )}
                {result.coverImage && (
                  <ResultCard 
                    label="Cover Image" 
                    value={`Image imported to media library. ID: ${result.coverImage}`} 
                    applied={!!applied['coverImage']} 
                    onApply={() => applyField('coverImage', result.coverImage)} 
                    imageUrl={result.scrapedImageUrl}
                  />
                )}
                {result.excerpt && (
                  <ResultCard label="Excerpt" value={result.excerpt} applied={!!applied['excerpt']} onApply={() => applyField('excerpt', result.excerpt)} />
                )}
                {result.content && (
                  <ResultCard 
                    label="Article Content" 
                    value={
                      typeof result.content === 'string'
                        ? (result.content.length > 160 ? result.content.substring(0, 160) + '...' : result.content)
                        : (() => {
                            const children = (result.content as any)?.root?.children || []
                            const pCount = children.filter((c: any) => c.type === 'paragraph').length
                            const hCount = children.filter((c: any) => c.type === 'heading').length
                            const imgCount = children.filter((c: any) => c.type === 'upload').length
                            const vidCount = children.filter((c: any) => c.type === 'block' && c.fields?.blockType === 'videoEmbed').length
                            const quoteCount = children.filter((c: any) => c.type === 'quote').length
                            const listCount = children.filter((c: any) => c.type === 'list').length
                            const parts = [`${pCount} paragraphs`]
                            if (hCount > 0) parts.push(`${hCount} subheadings`)
                            if (imgCount > 0) parts.push(`${imgCount} inline images`)
                            if (vidCount > 0) parts.push(`${vidCount} video embeds`)
                            if (quoteCount > 0) parts.push(`${quoteCount} quotes`)
                            if (listCount > 0) parts.push(`${listCount} lists`)
                            return `Full Article: ${parts.join(', ')} (formatted rich text)`
                          })()
                    } 
                    applied={!!applied['content']} 
                    onApply={() => applyField('content', result.content)} 
                  />
                )}
                {result.tags && (
                  <div style={{ padding: 12, borderRadius: 8, background: 'var(--theme-elevation-150, #21262d)', border: '1px solid var(--theme-border-color, #30363d)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--theme-text-muted, #8b949e)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Tags</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {result.tags.map((tag, i) => <span key={i} className="ai-tag">{tag}</span>)}
                    </div>
                    <button className="ai-apply-btn" disabled={!!applied['tags']} onClick={() => applyField('tags', result.tags)}>
                      {applied['tags'] ? '✓ Applied' : 'Apply Tags'}
                    </button>
                  </div>
                )}
                {result.metaTitle && (
                  <ResultCard label="SEO Meta Title" value={result.metaTitle} applied={!!applied['metaTitle']} onApply={() => applyField('metaTitle', result.metaTitle)} />
                )}
                {result.metaDescription && (
                  <ResultCard label="SEO Meta Description" value={result.metaDescription} applied={!!applied['metaDescription']} onApply={() => applyField('metaDescription', result.metaDescription)} />
                )}
                
                {activeAction !== 'scrape_direct' && (
                  <button
                    type="button"
                    onClick={() => activeAction && callAI(activeAction)}
                    style={{
                      width: '100%', padding: '8px', border: '1px solid var(--theme-border-color, #30363d)',
                      borderRadius: 6, background: 'transparent', color: 'var(--theme-text-muted, #8b949e)',
                      cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                    }}
                  >🔄 Regenerate</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body
  )
}

function ResultCard({ label, value, applied, onApply, imageUrl }: {
  label: string; value: string; applied: boolean; onApply: () => void; imageUrl?: string
}) {
  return (
    <div style={{ padding: 12, borderRadius: 8, background: 'var(--theme-elevation-150, #21262d)', border: '1px solid var(--theme-border-color, #30363d)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--theme-text-muted, #8b949e)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      {imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img 
          src={imageUrl} 
          alt={label} 
          style={{ width: '100%', height: 'auto', maxHeight: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8, border: '1px solid var(--theme-border-color, #30363d)' }} 
        />
      )}
      <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--theme-text-color, #f5f0e8)', lineHeight: 1.5, wordBreak: 'break-word' }}>{value}</p>
      <button className="ai-apply-btn" disabled={applied} onClick={onApply}>
        {applied ? '✓ Applied' : `Apply ${label}`}
      </button>
    </div>
  )
}
