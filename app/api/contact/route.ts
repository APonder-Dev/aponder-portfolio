import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { mailer } from '@/lib/mailer'
import { getIp, isRateLimited } from '@/lib/rate-limit'

const LIMIT  = 3
const WINDOW = 60 * 60 * 1000

export async function POST(req: Request) {
  try {
    const { name, email, projectType, budget, message, website } = await req.json()

    if (website) return NextResponse.json({ ok: true }) // honeypot

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (await isRateLimited(getIp(req), LIMIT, WINDOW)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    await db.contactSubmission.create({
      data: { name, email, projectType: projectType ?? '', budget: budget ?? '', message },
    })

    // Notification to Anthony
    mailer.sendMail({
      from:    `"APonder.dev Contact" <${process.env.OUTLOOK_EMAIL}>`,
      to:      'Anthony@aponder.dev',
      replyTo: email,
      subject: `[Portfolio] ${projectType || 'Project Inquiry'} from ${name}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#60a5fa;margin-bottom:24px;font-size:18px;">New Portfolio Inquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;width:130px;">Name</td><td style="padding:8px 0;color:#f1f5f9;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;color:#60a5fa;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Project Type</td><td style="padding:8px 0;color:#f1f5f9;">${projectType || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Budget</td><td style="padding:8px 0;color:#f1f5f9;">${budget || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="color:#94a3b8;margin-bottom:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          <p style="color:#e2e8f0;white-space:pre-wrap;line-height:1.7;">${message}</p>
        </div>
      `,
    }).catch(err => console.error('[contact email]', err))

    // Auto-reply to submitter
    mailer.sendMail({
      from:    `"Anthony Ponder" <${process.env.OUTLOOK_EMAIL}>`,
      to:      email,
      subject: `Got your message, ${name.split(' ')[0]}!`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#60a5fa;margin-bottom:16px;font-size:18px;">Thanks for reaching out!</h2>
          <p style="color:#94a3b8;line-height:1.7;margin-bottom:16px;">
            Hey ${name.split(' ')[0]},<br/><br/>
            I received your message and will get back to you within 1–2 business days.
          </p>
          ${projectType ? `<p style="color:#64748b;font-size:13px;margin-bottom:4px;">Project type: <span style="color:#e2e8f0;">${projectType}</span></p>` : ''}
          ${budget ? `<p style="color:#64748b;font-size:13px;margin-bottom:16px;">Budget: <span style="color:#e2e8f0;">${budget}</span></p>` : ''}
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="color:#475569;font-size:12px;">— Anthony Ponder · <a href="https://aponder.dev" style="color:#60a5fa;">aponder.dev</a></p>
        </div>
      `,
    }).catch(err => console.error('[contact auto-reply]', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
