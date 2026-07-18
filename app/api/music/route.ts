import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getMusicSettings, DEFAULT_MUSIC_SETTINGS } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getMusicSettings()
    if (!settings.enabled) {
      return NextResponse.json({ ...settings, tracks: [] })
    }
    const tracks = await db.musicTrack.findMany({
      where:   { enabled: true },
      orderBy: { sortOrder: 'asc' },
      select:  { id: true, title: true, artist: true, url: true },
    })
    return NextResponse.json({ ...settings, tracks })
  } catch {
    return NextResponse.json({ ...DEFAULT_MUSIC_SETTINGS, enabled: false, tracks: [] })
  }
}
