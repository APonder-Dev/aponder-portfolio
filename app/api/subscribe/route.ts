import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    await db.subscriber.upsert({
      where:  { email: email.trim().toLowerCase() },
      update: {},
      create: { email: email.trim().toLowerCase(), name: name?.trim() ?? '' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
