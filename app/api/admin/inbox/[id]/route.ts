import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const { status } = await req.json()

  const submission = await db.contactSubmission.update({
    where: { id },
    data:  { status },
  })
  if (status === 'archived') await logAction('inbox_archived', submission.email ?? `id:${id}`)
  return NextResponse.json(submission)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const existing = await db.contactSubmission.findUnique({ where: { id }, select: { email: true } })
  await db.contactSubmission.delete({ where: { id } })
  await logAction('inbox_deleted', existing?.email ?? `id:${id}`)
  return NextResponse.json({ ok: true })
}
