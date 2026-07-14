import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  const row = await db.siteContent.findUnique({ where: { key } })
  return NextResponse.json({ value: row ? JSON.parse(row.value) : null })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  const body = await req.json()
  await db.siteContent.upsert({
    where: { key },
    create: { key, value: JSON.stringify(body) },
    update: { value: JSON.stringify(body) },
  })
  await logAction('content_updated', key)
  return NextResponse.json({ ok: true })
}
