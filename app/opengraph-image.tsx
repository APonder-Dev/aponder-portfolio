import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'APonder.dev — Minecraft Plugin Developer & Software Engineer'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: '#030712',
          display: 'flex',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute', top: -160, left: '30%',
            width: 700, height: 500,
            background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Left: branding + copy */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
            <div
              style={{
                width: 52, height: 52,
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'white', fontWeight: 900,
              }}
            >
              {'>_'}
            </div>
            <span style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
              APonder
              <span style={{ color: 'rgba(255,255,255,0.22)' }}>.dev</span>
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, marginBottom: 28 }}>
            <span style={{ fontSize: 66, fontWeight: 900, color: 'white', letterSpacing: -2 }}>
              Minecraft Plugin
            </span>
            <span style={{ fontSize: 66, fontWeight: 900, color: '#60a5fa', letterSpacing: -2 }}>
              Developer.
            </span>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 20, color: '#475569', marginBottom: 52 }}>
            Java 17 / 21 / 25 · Paper · Spigot · Folia · 1.18 → Latest
          </div>

          {/* Stat chips */}
          <div style={{ display: 'flex', gap: 14 }}>
            {['25+ Projects', '5+ Years', '100% Custom Code', 'Illinois, USA'].map(s => (
              <div
                key={s}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  color: '#94a3b8',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Right: terminal card */}
        <div
          style={{
            width: 300, flexShrink: 0, marginLeft: 56,
            background: 'rgba(59,130,246,0.05)',
            border: '1px solid rgba(59,130,246,0.18)',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.015)',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(239,68,68,0.7)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(234,179,8,0.7)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(34,197,94,0.7)' }} />
          </div>

          {/* Terminal body */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'monospace', fontSize: 13 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#4ade80' }}>❯</span>
              <span style={{ color: '#e2e8f0' }}>cat skills.toml</span>
            </div>
            <div style={{ color: '#06b6d4', marginTop: 6 }}>[backend]</div>
            <div style={{ color: '#94a3b8' }}>java = 95</div>
            <div style={{ color: '#94a3b8' }}>minecraft_plugins = 95</div>
            <div style={{ color: '#94a3b8' }}>backend_systems = 90</div>
            <div style={{ color: '#06b6d4', marginTop: 6 }}>[web_and_tools]</div>
            <div style={{ color: '#94a3b8' }}>web_development = 85</div>
            <div style={{ color: '#94a3b8' }}>automation = 80</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ color: '#4ade80' }}>❯</span>
              <div style={{ width: 7, height: 15, background: '#3b82f6' }} />
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              marginTop: 'auto',
              padding: '10px 18px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: '#4ade80',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            Available for Projects
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
