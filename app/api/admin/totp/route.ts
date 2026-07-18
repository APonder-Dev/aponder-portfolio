import { NextRequest, NextResponse } from 'next/server'
import { getTotpConfig, setTotpConfig } from '@/lib/site-settings'
import { generateTotpSecret, verifyTotp, otpauthUri } from '@/lib/totp'
import { logAction } from '@/lib/logger'

// Admin-authed via the proxy (deliberately NOT under /api/admin/auth/*,
// which is exempt from auth for the login flow).

export async function GET() {
  const totp = await getTotpConfig()
  return NextResponse.json({ enabled: totp.enabled, pending: !totp.enabled && !!totp.secret })
}

export async function POST(req: NextRequest) {
  const { action, code } = await req.json()
  const totp = await getTotpConfig()

  if (action === 'setup') {
    if (totp.enabled) {
      return NextResponse.json({ error: '2FA is already enabled.' }, { status: 400 })
    }
    const secret = generateTotpSecret()
    await setTotpConfig({ enabled: false, secret })
    return NextResponse.json({ secret, uri: otpauthUri(secret) })
  }

  if (action === 'enable') {
    if (totp.enabled)  return NextResponse.json({ error: '2FA is already enabled.' }, { status: 400 })
    if (!totp.secret)  return NextResponse.json({ error: 'Run setup first.' }, { status: 400 })
    if (!verifyTotp(totp.secret, String(code ?? ''))) {
      return NextResponse.json({ error: 'Invalid code — check your authenticator app.' }, { status: 400 })
    }
    await setTotpConfig({ enabled: true, secret: totp.secret })
    await logAction('totp_enabled', 'Two-factor authentication enabled')
    return NextResponse.json({ ok: true })
  }

  if (action === 'disable') {
    if (!totp.enabled) return NextResponse.json({ error: '2FA is not enabled.' }, { status: 400 })
    if (!verifyTotp(totp.secret, String(code ?? ''))) {
      return NextResponse.json({ error: 'Invalid code — check your authenticator app.' }, { status: 400 })
    }
    await setTotpConfig({ enabled: false, secret: '' })
    await logAction('totp_disabled', 'Two-factor authentication disabled')
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
