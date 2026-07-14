import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    await db.post.update({
      where: { slug },
      data:  { views: { increment: 1 } },
    })
  } catch { /* post may not exist yet — ignore */ }
  return NextResponse.json({ ok: true })
}
