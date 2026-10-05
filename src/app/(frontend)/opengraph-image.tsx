import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'The National Feed — Authoritative US Policy, Governance & World News'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* White accent line top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#ffffff',
          }}
        />

        {/* 3-block Logo mark: T N F */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
              fontWeight: 900,
              borderRadius: '4px',
            }}
          >
            T
          </div>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
              fontWeight: 900,
              borderRadius: '4px',
            }}
          >
            N
          </div>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
              fontWeight: 900,
              borderRadius: '4px',
            }}
          >
            F
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            The National Feed
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.5px',
            margin: 0,
          }}
        >
          Authoritative Reporting on US Governance, Policy, Defense &amp; Global Affairs
        </p>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '18px',
            letterSpacing: '0.1em',
          }}
        >
          thenationalfeed.com
        </div>
      </div>
    ),
    { ...size }
  )
}
