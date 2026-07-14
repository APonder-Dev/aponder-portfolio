import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
  return NextResponse.json(submission)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  await db.contactSubmission.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
