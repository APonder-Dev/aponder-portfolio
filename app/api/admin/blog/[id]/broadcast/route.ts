import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'
import { mailer } from '@/lib/mailer'
import { signUnsubToken } from '@/lib/auth'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)

  const post = await db.post.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  if (!post.published || !post.publishedAt || post.publishedAt > new Date()) {
    return NextResponse.json({ error: 'Post must be live before broadcasting.' }, { status: 400 })
  }

  const subscribers = await db.subscriber.findMany()
  if (subscribers.length === 0) return NextResponse.json({ sent: 0, total: 0 })

  const postUrl = `https://aponder.dev/blog/${post.slug}`
  let sent = 0

  for (const sub of subscribers) {
    try {
      const unsubUrl = `https://aponder.dev/api/unsubscribe?token=${encodeURIComponent(await signUnsubToken(sub.email))}`

      await mailer.sendMail({
        from:    `"Anthony Ponder" <${process.env.OUTLOOK_EMAIL}>`,
        to:      sub.email,
        subject: post.title,
        html: `
          <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <p style="color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 20px;">APonder.dev · New Post</p>
            <h1 style="color:#f1f5f9;font-size:22px;font-weight:900;line-height:1.25;margin:0 0 14px;">${post.title}</h1>
            ${post.excerpt ? `<p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;font-size:14px;">${post.excerpt}</p>` : ''}
            <a href="${postUrl}" style="display:inline-block;padding:11px 22px;background:linear-gradient(90deg,#2563eb,#0891b2);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:13px;">Read Post →</a>
            <hr style="border:none;border-top:1px solid #1e293b;margin:32px 0 14px;" />
            <p style="color:#334155;font-size:11px;margin:0;line-height:1.6;">
              You subscribed at <a href="https://aponder.dev" style="color:#475569;text-decoration:none;">aponder.dev</a>. ·
              <a href="${unsubUrl}" style="color:#475569;">Unsubscribe</a>
            </p>
          </div>
        `,
      })
      sent++
    } catch (err) {
      console.error(`[broadcast] failed for ${sub.email}:`, err)
    }
  }

  await logAction('post_broadcast', `"${post.title}" → ${sent}/${subscribers.length} delivered`)
  return NextResponse.json({ sent, total: subscribers.length })
}
