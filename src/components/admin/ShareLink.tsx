'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDocumentInfo, useFormFields, useForm, useFormModified } from '@payloadcms/ui'

export const ShareLink: React.FC = () => {
  const { id } = useDocumentInfo()
  const { submit } = useForm()
  const modified = useFormModified()
  const slugValue = useFormFields((args) => args?.[0]?.slug?.value)
  
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Tracking links state
  const [links, setLinks] = useState<any[]>([])
  const [label, setLabel] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && slugValue) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      setShareUrl(`${siteUrl}/article/${slugValue}`)
    } else {
      setShareUrl('')
    }
  }, [slugValue])

  const fetchLinks = useCallback(async () => {
    if (!id) return
    try {
      setLoadingLinks(true)
      const response = await fetch(`/api/share-links?where[article][equals]=${id}&limit=100&depth=0`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data?.docs || [])
      }
    } catch (error) {
      console.error('Failed to fetch share links:', error)
    } finally {
      setLoadingLinks(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchLinks()
    }
  }, [id, fetchLinks])

  const handleGenerate = async (e?: any) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!id || isGenerating) return

    try {
      setIsGenerating(true)
      const response = await fetch('/api/share-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: id,
          label: label.trim() || undefined,
        }),
      })

      if (response.ok) {
        setLabel('')
        await fetchLinks()
      } else {
        alert('Failed to generate link')
      }
    } catch (error) {
      console.error('Error generating link:', error)
      alert('An error occurred while generating the link')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this share link?')) return

    try {
      const response = await fetch(`/api/share-links/${linkId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchLinks()
      } else {
        alert('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleCopyLink = async (url: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLinkId(linkId)
      setTimeout(() => setCopiedLinkId(null), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const getFullUrl = (key: string) => {
    if (typeof window !== 'undefined') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      return `${siteUrl}/article/${key}/${slugValue || ''}`
    }
    return `/article/${key}/${slugValue || ''}`
  }

  // Intercept Next.js navigation clicks
  useEffect(() => {
    // Only intercept if we are on a new unsaved document (no id) and form is modified
    if (!id && modified) {
      const handleGlobalClick = (event: MouseEvent) => {
        let element = event.target as HTMLElement | null
        while (element && element.tagName !== 'A') {
          element = element.parentElement
        }

        if (element) {
          const anchor = element as HTMLAnchorElement
          const currentUrl = window.location.href
          const newUrl = anchor.href

          const isDownload = anchor.download !== ''
          const isNewTab = anchor.target === '_blank' || event.metaKey || event.ctrlKey
          
          let isInternalAnchor = false
          try {
            const currentUrlObj = new URL(currentUrl)
            const newUrlObj = new URL(newUrl)
            isInternalAnchor = currentUrlObj.pathname === newUrlObj.pathname && 
                               currentUrlObj.search === newUrlObj.search && 
                               newUrlObj.hash !== ''
          } catch (e) {}

          const isPageLeaving = !(newUrl === currentUrl || isInternalAnchor || isDownload || isNewTab)

          if (isPageLeaving) {
            event.preventDefault()
            event.stopPropagation()
            setPendingUrl(newUrl)
            setShowConfirmModal(true)
          }
        }
      }

      document.addEventListener('click', handleGlobalClick, true)
      return () => {
        document.removeEventListener('click', handleGlobalClick, true)
      }
    }
  }, [id, modified])

  // Prevent page reloads / tab closes
  useEffect(() => {
    if (!id && modified) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault()
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [id, modified])

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSaveDraftAndLeave = async () => {
    if (!submit) return
    try {
      setIsSaving(true)
      const result = await submit({ overrides: { status: 'draft' } })
      setIsSaving(false)
      if (result) {
        setShowConfirmModal(false)
        if (pendingUrl) {
          window.location.href = pendingUrl
        }
      } else {
        alert('Validation failed. Please check for required fields.')
      }
    } catch (err) {
      console.error(err)
      setIsSaving(false)
      alert('An error occurred while saving the draft.')
    }
  }

  const handleDiscardAndLeave = () => {
    setShowConfirmModal(false)
    if (pendingUrl) {
      window.location.href = pendingUrl
    }
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
    setPendingUrl(null)
  }

  const modalElement = showConfirmModal && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--theme-elevation-100, #1c2128)',
        border: '1px solid var(--theme-border-color, #30363d)',
        borderRadius: '8px',
        maxWidth: '480px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.5)',
        fontFamily: 'var(--font-sans, sans-serif)',
        color: 'var(--theme-text-color, #f5f0e8)'
      }}>
        {isSaving ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#2085ec',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>Saving Draft...</h3>
            <p style={{ margin: 0, color: 'var(--theme-text-muted, #8b949e)', fontSize: '14px' }}>
              Please wait while we save your changes.
            </p>
          </div>
        ) : (
          <div>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display, Playfair Display, serif)'
            }}>
              Unsaved Changes
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              color: 'var(--theme-text-muted, #8b949e)',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              You are leaving this page with unsaved content. Would you like to save it to drafts or discard it?
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 16px',
                  borderRadius: '4px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  backgroundColor: 'var(--theme-elevation-150, #21262d)',
                  color: 'var(--theme-text-color, #f5f0e8)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDiscardAndLeave}
                style={{
                  padding: '10px 16px',
                  borderRadius: '4px',
                  border: '1px solid #e74c3c',
                  backgroundColor: 'transparent',
                  color: '#e74c3c',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveDraftAndLeave}
                style={{
                  padding: '10px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#2ecc71',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Save to Draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  try {
    if (!id) {
      return (
        <>
          <div style={{
            padding: '16px',
            border: '1px solid var(--theme-border-color, #30363d)',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-elevation-50, #161b22)',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            color: 'var(--theme-text-muted, #8b949e)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--theme-text-color, #f5f0e8)' }}>
              Shareable Links
            </div>
            <p style={{ margin: 0 }}>Save the article to generate shareable links.</p>
          </div>
          {modalElement}
        </>
      )
    }

    return (
      <>
        <div style={{
          padding: '16px',
          border: '1px solid var(--theme-border-color, #30363d)',
          borderRadius: '4px',
          backgroundColor: 'var(--theme-elevation-50, #161b22)',
          marginBottom: '20px',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '12px'
        }}>
          {/* Canonical Link section */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-text-color, #f5f0e8)', fontFamily: 'var(--font-mono, monospace)' }}>
              Canonical Link
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                readOnly
                value={shareUrl || 'Generating...'}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--theme-input-bg, #0d1117)',
                  color: 'var(--theme-text-color, #f5f0e8)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  textOverflow: 'ellipsis'
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: copied ? '#2ecc71' : 'var(--theme-elevation-150, #21262d)',
                  color: copied ? '#ffffff' : 'var(--theme-text-color, #f5f0e8)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s ease',
                  fontSize: '11px',
                  borderStyle: 'solid'
                }}
              >
                {copied ? 'Copied!' : 'Copy Canonical'}
              </button>
              {shareUrl && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    border: '1px solid var(--theme-border-color, #30363d)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--theme-elevation-150, #21262d)',
                    color: 'var(--theme-text-color, #f5f0e8)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'inline-block',
                    fontSize: '11px'
                  }}
                >
                  View Article
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Share Links Section */}
          <div style={{ borderTop: '1px solid var(--theme-border-color, #30363d)', paddingTop: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-text-color, #f5f0e8)', fontFamily: 'var(--font-mono, monospace)' }}>
              Anti-Spam / Tracking Links
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Label (e.g. FB Group Comment)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    void handleGenerate()
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid var(--theme-border-color, #30363d)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--theme-input-bg, #0d1117)',
                  color: 'var(--theme-text-color, #f5f0e8)',
                  fontSize: '11px',
                }}
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#2ecc71',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '11px',
                  opacity: isGenerating ? 0.6 : 1,
                }}
              >
                {isGenerating ? '...' : 'Create'}
              </button>
            </div>

            {loadingLinks ? (
              <div style={{ color: 'var(--theme-text-muted, #8b949e)', fontSize: '11px', textAlign: 'center', padding: '10px 0' }}>
                Loading links...
              </div>
            ) : links.length === 0 ? (
              <div style={{ color: 'var(--theme-text-muted, #8b949e)', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                No tracking links generated yet.
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {links.map((link, index) => {
                  const fullUrl = getFullUrl(link?.key || '')
                  const isCopied = copiedLinkId === link?.id
                  return (
                    <div key={link?.id || index} style={{
                      padding: '10px',
                      border: '1px solid var(--theme-border-color, #30363d)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--theme-elevation-100, #1c2128)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--theme-text-color, #f5f0e8)' }}>
                          {link?.label || 'Unnamed Link'}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--theme-elevation-150, #21262d)',
                          color: 'var(--theme-text-color, #f5f0e8)',
                          fontWeight: 'bold',
                          fontSize: '10px'
                        }}>
                          {link?.clicks || 0} clicks
                        </span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={fullUrl}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid var(--theme-border-color, #30363d)',
                          borderRadius: '4px',
                          backgroundColor: 'var(--theme-input-bg, #0d1117)',
                          color: 'var(--theme-text-color, #f5f0e8)',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono, monospace)',
                          textOverflow: 'ellipsis',
                          marginBottom: '8px'
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(fullUrl, link?.id || '')}
                          style={{
                            flex: 1,
                            padding: '6px',
                            border: '1px solid var(--theme-border-color, #30363d)',
                            borderRadius: '4px',
                            backgroundColor: isCopied ? '#2ecc71' : 'var(--theme-elevation-150, #21262d)',
                            color: isCopied ? '#ffffff' : 'var(--theme-text-color, #f5f0e8)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link?.id || '')}
                          style={{
                            padding: '6px 10px',
                            border: '1px solid #e74c3c',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '10px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {modalElement}
      </>
    )
  } catch (err: any) {
    console.error("ShareLink render error:", err)
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e74c3c',
        borderRadius: '4px',
        backgroundColor: '#fdf2f2',
        color: '#e74c3c',
        fontSize: '12px',
        fontFamily: 'monospace',
        marginBottom: '20px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          ShareLink Error:
        </div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{err?.stack || err?.message || String(err)}</pre>
      </div>
    )
  }
}
