import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'
import { hashPassword } from '@/lib/password'

async function getStoredHash(): Promise<string | null> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: 'admin_password_hash' } })
    return row ? JSON.parse(row.value) as string : null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const { current, next } = await req.json()

  if (!current || !next) {
    return NextResponse.json({ error: 'Current and new password required.' }, { status: 400 })
  }
  if (next.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const storedHash = await getStoredHash()
  const validFromDb  = storedHash ? storedHash === hashPassword(current) : false
  const validFromEnv = !storedHash && current === process.env.ADMIN_PASSWORD

  if (!validFromDb && !validFromEnv) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })
  }

  await db.siteContent.upsert({
    where:  { key: 'admin_password_hash' },
    update: { value: JSON.stringify(hashPassword(next)) },
    create: { key: 'admin_password_hash', value: JSON.stringify(hashPassword(next)) },
  })

  await logAction('password_changed', 'Admin password updated')
  return NextResponse.json({ ok: true })
}
