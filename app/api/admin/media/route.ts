import { NextRequest, NextResponse } from 'next/server'
import { readdir, unlink, stat } from 'fs/promises'
import path from 'path'
import { UPLOADS_DIR } from '@/lib/uploads'
import { logAction } from '@/lib/logger'

const uploadDir = UPLOADS_DIR

export async function GET() {
  try {
    const files = await readdir(uploadDir)
    const items = await Promise.all(
      files
        .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
        .map(async f => {
          const s = await stat(path.join(uploadDir, f))
          return { name: f, url: `/uploads/${f}`, size: s.size, createdAt: s.birthtime.toISOString() }
        })
    )
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json()
  if (!name || typeof name !== 'string' || name.includes('..') || name.includes('/')) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 })
  }
  try {
    await unlink(path.join(uploadDir, name))
    await logAction('media_deleted', name)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 })
  }
}
