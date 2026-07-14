import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const existing = await db.subscriber.findUnique({ where: { id }, select: { email: true } })
  await db.subscriber.delete({ where: { id } })
  await logAction('subscriber_removed', existing?.email ?? `id:${id}`)
  return NextResponse.json({ ok: true })
}
