import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const subscribers = await db.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(subscribers)
}
