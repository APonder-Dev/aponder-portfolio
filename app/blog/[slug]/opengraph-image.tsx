import { ImageResponse } from 'next/og'
import { db } from '@/lib/db'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic     = 'force-dynamic'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let title   = 'APonder.dev'
  let tags: string[] = []

  try {
    const post = await db.post.findUnique({
      where:  { slug },
      select: { title: true, tags: true },
    })
    if (post) {
      title = post.title
      tags  = JSON.parse(post.tags || '[]') as string[]
    }
  } catch { /* DB not ready */ }

  const fontSize = title.length > 55 ? 44 : title.length > 35 ? 52 : 60

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: '#080d1a',
          padding: '64px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '400px',
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(59,130,246,0.14), transparent)',
        }} />
        {/* Left accent line */}
        <div style={{
          position: 'absolute', left: 0, top: '80px', bottom: '80px', width: '3px',
          background: 'linear-gradient(to bottom, transparent, #3b82f6, transparent)',
        }} />

        {/* Content column */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

          {/* Top: logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '20px', fontWeight: 900,
            }}>A</div>
            <span style={{ color: '#475569', fontSize: '15px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              APonder.dev · Blog
            </span>
          </div>

          {/* Middle: tags + title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    padding: '5px 12px',
                    background: 'rgba(59,130,246,0.12)',
                    color: '#60a5fa',
                    borderRadius: '6px',
                    fontSize: '14px',
                    border: '1px solid rgba(59,130,246,0.25)',
                    letterSpacing: '0.04em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div style={{
              color: '#f1f5f9',
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              maxWidth: '1050px',
            }}>
              {title}
            </div>
          </div>

          {/* Bottom: author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: '18px',
            }}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 700 }}>Anthony Ponder</span>
              <span style={{ color: '#475569', fontSize: '14px' }}>Minecraft Plugin Developer & Software Engineer</span>
            </div>
          </div>

        </div>
      </div>
    ),
    { ...size }
  )
}
