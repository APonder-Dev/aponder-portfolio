import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken, COOKIE } from '@/lib/auth'
import { hashPassword } from '@/lib/password'
import { getIp, isRateLimited, resetRateLimit } from '@/lib/rate-limit'
import { getSecuritySettings, getTotpConfig } from '@/lib/site-settings'
import { verifyTotp } from '@/lib/totp'
import { db } from '@/lib/db'

async function getStoredHash(): Promise<string | null> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: 'admin_password_hash' } })
    return row ? JSON.parse(row.value) as string : null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const ip  = getIp(req)
  const sec = await getSecuritySettings()

  if (await isRateLimited(`login:${ip}`, sec.loginLimit, sec.loginWindowMins * 60 * 1000)) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${sec.loginWindowMins} minutes.` },
      { status: 429 }
    )
  }

  const { password, code } = await req.json()
  if (!password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const storedHash = await getStoredHash()
  const valid = storedHash
    ? hashPassword(password) === storedHash
    : password === process.env.ADMIN_PASSWORD

  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // Second factor, if enabled in Settings.
  const totp = await getTotpConfig()
  if (totp.enabled && totp.secret) {
    if (!code) {
      return NextResponse.json({ need2fa: true }, { status: 401 })
    }
    if (!verifyTotp(totp.secret, String(code))) {
      return NextResponse.json({ need2fa: true, error: 'Invalid authentication code' }, { status: 401 })
    }
  }

  await resetRateLimit(`login:${ip}`)

  const token = await signAdminToken()
  const res   = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
  return res
}
