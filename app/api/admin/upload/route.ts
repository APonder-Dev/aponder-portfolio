import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { UPLOADS_DIR } from '@/lib/uploads'
import { logAction } from '@/lib/logger'

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])
const MAX_BYTES    = 5 * 1024 * 1024 // 5 MB

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
    return NextResponse.json({ error: 'File too large (max 5 MB).' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: 'File type not allowed.' }, { status: 400 })
  }

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  await mkdir(UPLOADS_DIR, { recursive: true })
  await writeFile(path.join(UPLOADS_DIR, safeName), Buffer.from(await file.arrayBuffer()))
  await logAction('media_uploaded', `${file.name} (${(file.size / 1024).toFixed(1)} KB)`)

  return NextResponse.json({ url: `/uploads/${safeName}` })
}
