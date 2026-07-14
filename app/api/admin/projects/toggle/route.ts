import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const { projectId, hidden } = (await req.json()) as { projectId: string; hidden: boolean }

  if (hidden) {
    await db.projectHide.upsert({
      where:  { projectId },
      create: { projectId },
      update: {},
    })
    await logAction('project_hidden', projectId)
  } else {
    await db.projectHide.deleteMany({ where: { projectId } })
    await logAction('project_shown', projectId)
  }

  return NextResponse.json({ ok: true })
}
