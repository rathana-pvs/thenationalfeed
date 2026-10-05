'use client'

import React, { useEffect, useState } from 'react'
import { useForm, useFormModified } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'

export const ConfirmLeave: React.FC = () => {
  const { id } = useDocumentInfo()
  const isModified = useFormModified()
  const { submit, dispatchFields } = useForm()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Only apply to the "create new article" page (when id is not present)
  const isCreatePage = !id

  useEffect(() => {
    if (!isCreatePage) return

    // 1. Handle tab close/reload/external links
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModified && !isSaving) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    // 2. Handle internal link clicks in the Payload admin UI
    const handleDocumentClick = (e: MouseEvent) => {
      if (!isModified || isSaving) return

      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Don't intercept:
      // - anchors/hashes (#)
      // - target="_blank" (opens in new tab, doesn't leave the current page)
      // - buttons/links inside our custom modal
      if (
        href.startsWith('#') ||
        target.getAttribute('target') === '_blank' ||
        target.closest('.confirm-leave-modal')
      ) {
        return
      }

      // Check if it's an internal admin link
      const isInternal = href.startsWith('/') || href.startsWith(window.location.origin)
      if (!isInternal) return

      // Intercept navigation
      e.preventDefault()
      e.stopPropagation()

      setPendingUrl(href)
      setShowDialog(true)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleDocumentClick, true) // capture phase to intercept before React router

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [isModified, isCreatePage, isSaving])

  if (!isCreatePage || !showDialog) return null

  const handleSaveAsDraft = async () => {
    setIsSaving(true)
    try {
      // Set status to 'draft' in form state
      dispatchFields({
        type: 'UPDATE',
        path: 'status',
        value: 'draft',
      })

      // Wait brief moment for state propagation, then submit the form
      setTimeout(async () => {
        try {
          const result = await submit({
            skipValidation: false,
          })
          
          // If successful, navigate to the page they clicked
          if (pendingUrl) {
            window.location.href = pendingUrl
          }
        } catch (err) {
          console.error('Failed to save draft:', err)
          alert('Could not save draft. Please check for validation errors.')
          setIsSaving(false)
        }
      }, 150)
    } catch (err) {
      console.error(err)
      setIsSaving(false)
    }
  }

  const handleLeave = () => {
    setShowDialog(false)
    if (pendingUrl) {
      window.location.href = pendingUrl
    }
  }

  const handleCancel = () => {
    setShowDialog(false)
    setPendingUrl(null)
  }

  return (
    <div
      className="confirm-leave-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          background: '#131314',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 8px 0',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Unsaved Changes
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 24px 0',
            lineHeight: '1.5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          You are creating a new article. Would you like to save it as a draft before leaving, or discard your changes?
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
          >
            {isSaving ? 'Saving Draft...' : '💾 Save as Draft & Leave'}
          </button>
          
          <button
            type="button"
            onClick={handleLeave}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
          >
            🗑️ Leave without saving
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Keep Editing
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmLeave
