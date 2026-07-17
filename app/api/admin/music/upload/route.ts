import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { MUSIC_DIR } from '@/lib/uploads'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

const ALLOWED_EXT = new Set(['mp3', 'ogg', 'wav', 'm4a', 'flac'])
const MAX_BYTES   = 128 * 1024 * 1024 // 128 MB

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 128 MB).' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: 'File type not allowed (mp3, ogg, wav, m4a, flac).' }, { status: 400 })
  }

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  await mkdir(MUSIC_DIR, { recursive: true })
  await writeFile(path.join(MUSIC_DIR, safeName), Buffer.from(await file.arrayBuffer()))

  const title = (formData.get('title') as string | null)?.trim()
    || file.name.replace(/\.[^.]+$/, '')

  const last  = await db.musicTrack.findFirst({ orderBy: { sortOrder: 'desc' } })
  const track = await db.musicTrack.create({
    data: {
      title,
      artist:    (formData.get('artist') as string | null)?.trim() ?? '',
      url:       `/uploads/music/${safeName}`,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  })

  await logAction('music_uploaded', `${track.title} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`)
  return NextResponse.json(track)
}
