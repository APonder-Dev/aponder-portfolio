import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tracks = await db.musicTrack.findMany({
      where:   { enabled: true },
      orderBy: { sortOrder: 'asc' },
      select:  { id: true, title: true, artist: true, url: true },
    })
    return NextResponse.json(tracks)
  } catch {
    return NextResponse.json([])
  }
}
