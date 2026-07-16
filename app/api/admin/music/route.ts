import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function GET() {
  const tracks = await db.musicTrack.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(tracks)
}

// Reorder: accepts { order: number[] } of track ids in the desired order.
export async function PUT(req: NextRequest) {
  const { order } = (await req.json()) as { order: number[] }
  if (!Array.isArray(order) || order.some(id => typeof id !== 'number')) {
    return NextResponse.json({ error: 'Invalid order payload.' }, { status: 400 })
  }

  await db.$transaction(
    order.map((id, i) => db.musicTrack.update({ where: { id }, data: { sortOrder: i } }))
  )

  await logAction('music_reordered', `${order.length} tracks`)
  return NextResponse.json({ ok: true })
}
