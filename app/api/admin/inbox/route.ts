import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const submissions = await db.contactSubmission.findMany({
    where:   status && status !== 'all' ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(submissions)
}
