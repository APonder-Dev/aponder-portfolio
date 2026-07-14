import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { projectId, hidden } = (await req.json()) as { projectId: string; hidden: boolean }

  if (hidden) {
    await db.projectHide.upsert({
      where:  { projectId },
      create: { projectId },
      update: {},
    })
  } else {
    await db.projectHide.deleteMany({ where: { projectId } })
  }

  return NextResponse.json({ ok: true })
}
