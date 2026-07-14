import { NextRequest, NextResponse } from 'next/server'
import { signPreviewToken } from '@/lib/auth'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const postId = parseInt(rawId)
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const token = await signPreviewToken(postId)
  return NextResponse.json({ token })
}
