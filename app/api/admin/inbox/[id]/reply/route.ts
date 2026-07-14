import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'
import { mailer } from '@/lib/mailer'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const { subject, body } = await req.json()

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 })
  }

  const submission = await db.contactSubmission.findUnique({ where: { id } })
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  try {
    await mailer.sendMail({
      from:    `"Anthony Ponder" <${process.env.OUTLOOK_EMAIL}>`,
      to:      `"${submission.name}" <${submission.email}>`,
      replyTo: process.env.OUTLOOK_EMAIL,
      subject: subject.trim(),
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <div style="white-space:pre-wrap;line-height:1.75;font-size:14px;color:#cbd5e1;">${body.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0 16px;" />
          <p style="color:#475569;font-size:12px;margin:0;">— Anthony Ponder · <a href="https://aponder.dev" style="color:#60a5fa;text-decoration:none;">aponder.dev</a></p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[inbox reply]', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }

  await db.contactSubmission.update({ where: { id }, data: { status: 'replied' } })
  await logAction('inbox_replied', `To: ${submission.email} — ${subject.trim()}`)
  return NextResponse.json({ ok: true })
}
