import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DEFAULT_FOOTER_LINKS } from '@/lib/content-defaults'
import type { FooterLink } from '@/lib/content-types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const row = await db.siteContent.findUnique({ where: { key: 'footer_links' } })
    if (row) {
      const links = JSON.parse(row.value) as FooterLink[]
      if (Array.isArray(links)) return NextResponse.json(links)
    }
  } catch { /* fall through to defaults */ }
  return NextResponse.json(DEFAULT_FOOTER_LINKS)
}
