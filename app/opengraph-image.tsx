import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rakibul Hasan — Senior Frontend Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0d0d0d',
          color: '#faf9f7',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 60,
            height: 3,
            backgroundColor: '#c0392b',
            marginBottom: 32,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}
        >
          Rakibul Hasan
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 28,
            color: '#a09890',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            marginBottom: 40,
          }}
        >
          Senior Frontend Developer
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontStyle: 'italic',
            color: '#7a746c',
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          I craft interfaces that{' '}
          <span style={{ color: '#c0392b', fontStyle: 'normal', fontWeight: 900 }}>
            perform.
          </span>
        </div>

        {/* Bottom tech tags */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 'auto',
          }}
        >
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
            <div
              key={tech}
              style={{
                fontSize: 14,
                color: '#7a746c',
                border: '1px solid #2a2725',
                padding: '8px 16px',
                fontFamily: 'monospace',
                letterSpacing: '0.04em',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
