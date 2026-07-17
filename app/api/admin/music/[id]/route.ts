import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { MUSIC_DIR } from '@/lib/uploads'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const body = await req.json()

  const existing = await db.musicTrack.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const track = await db.musicTrack.update({
    where: { id },
    data: {
      ...(body.title   !== undefined && { title:   String(body.title).trim() }),
      ...(body.artist  !== undefined && { artist:  String(body.artist).trim() }),
      ...(body.enabled !== undefined && { enabled: Boolean(body.enabled) }),
    },
  })

  await logAction('music_updated', track.title)
  return NextResponse.json(track)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)

  const existing = await db.musicTrack.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.musicTrack.delete({ where: { id } })

  // Remove the audio file; the url is always /uploads/music/<name> written by our upload route.
  const name = existing.url.split('/').pop() ?? ''
  if (name && !name.includes('..')) {
    try {
      await unlink(path.join(MUSIC_DIR, name))
    } catch { /* file already gone */ }
  }

  await logAction('music_deleted', existing.title)
  return NextResponse.json({ ok: true })
}
