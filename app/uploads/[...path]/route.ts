import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { createReadStream } from 'fs'
import { Readable } from 'stream'
import path from 'path'
import { UPLOADS_DIR } from '@/lib/uploads'

// Files uploaded at runtime are not served by Next.js static handling
// (public/ is snapshotted at build time, especially with output: 'standalone'),
// so this route streams them from disk. Covers admin media images at
// /uploads/<file> and music at /uploads/music/<file>, with Range support
// so audio seeking works.

const MIME: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  webp: 'image/webp',
  svg:  'image/svg+xml',
  mp3:  'audio/mpeg',
  ogg:  'audio/ogg',
  wav:  'audio/wav',
  m4a:  'audio/mp4',
  flac: 'audio/flac',
}

const BASE_DIR = UPLOADS_DIR

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params

  if (
    !Array.isArray(segments) || segments.length === 0 || segments.length > 2 ||
    segments.some(s => !s || s === '..' || s.includes('/') || s.includes('\\'))
  ) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const filePath = path.join(BASE_DIR, ...segments)
  if (!filePath.startsWith(BASE_DIR + path.sep)) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const ext  = filePath.split('.').pop()?.toLowerCase() ?? ''
  const mime = MIME[ext]
  if (!mime) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  let size: number
  try {
    size = (await stat(filePath)).size
  } catch {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const baseHeaders = {
    'Content-Type':           mime,
    'Accept-Ranges':          'bytes',
    'Cache-Control':          'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  }

  const range = req.headers.get('range')
  if (range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/)
    if (!match || (match[1] === '' && match[2] === '')) {
      return new NextResponse(null, {
        status:  416,
        headers: { 'Content-Range': `bytes */${size}` },
      })
    }
    const start = match[1] === '' ? Math.max(0, size - parseInt(match[2])) : parseInt(match[1])
    const end   = match[1] !== '' && match[2] !== '' ? Math.min(parseInt(match[2]), size - 1) : size - 1
    if (start >= size || start > end) {
      return new NextResponse(null, {
        status:  416,
        headers: { 'Content-Range': `bytes */${size}` },
      })
    }

    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream
    return new NextResponse(stream, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Range':  `bytes ${start}-${end}/${size}`,
        'Content-Length': String(end - start + 1),
      },
    })
  }

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream
  return new NextResponse(stream, {
    headers: { ...baseHeaders, 'Content-Length': String(size) },
  })
}
