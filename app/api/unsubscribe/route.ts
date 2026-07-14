import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { secret } from '@/lib/auth'

function html(title: string, body: string): Response {
  return new Response(
    `<!DOCTYPE html><html><head><title>${title}</title><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    </head>
    <body style="font-family:monospace;background:#0f172a;color:#94a3b8;min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:16px;box-sizing:border-box;">
      <div style="text-align:center;max-width:420px;">${body}</div>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return html('Error', '<p>Invalid unsubscribe link.</p>')

  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.unsub !== true || typeof payload.email !== 'string') {
      return html('Error', '<p>Invalid unsubscribe link.</p>')
    }

    await db.subscriber.delete({ where: { email: payload.email } }).catch(() => {})

    return html('Unsubscribed', `
      <div style="font-size:36px;margin-bottom:16px;">✓</div>
      <h1 style="color:#f1f5f9;font-size:18px;font-weight:700;margin:0 0 8px;">You're unsubscribed.</h1>
      <p style="font-size:13px;color:#64748b;margin:0 0 20px;">You won't receive future emails from APonder.dev.</p>
      <a href="https://aponder.dev" style="color:#60a5fa;font-size:13px;text-decoration:none;">← Back to site</a>
    `)
  } catch {
    return html('Error', '<p style="color:#f87171;">This unsubscribe link is invalid or has expired.</p>')
  }
}
