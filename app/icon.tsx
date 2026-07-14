import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 13,
          fontWeight: 900,
          fontFamily: 'monospace',
          letterSpacing: -1,
        }}
      >
        {'>_'}
      </div>
    ),
    { ...size },
  )
}
