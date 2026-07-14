'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MessageSquare, CheckCircle } from 'lucide-react'
import type { ContactContent } from '@/lib/content-types'
import { DEFAULT_CONTACT } from '@/lib/content-defaults'

const PROJECT_TYPES = [
  'Custom Minecraft Plugin',
  'Plugin Fix / Rebuild',
  'Plugin Modernization',
  'Multi-Version Support',
  'GUI System',
  'Economy Integration',
  'Server Tooling / Automation',
  'Portfolio / Store Website',
  'Other',
]

const BUDGETS = [
  'Under $100',
  '$100 – $300',
  '$300 – $600',
  '$600 – $1,000',
  '$1,000+',
  'Not sure yet',
]

export default function Contact({ contact: contactProp }: { contact?: ContactContent }) {
  const ct = contactProp ?? DEFAULT_CONTACT
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const [form, setForm]           = useState({ name: '', email: '', projectType: '', budget: '', message: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      if (!res.ok) throw new Error('api_failed')
      setSubmitted(true)
    } catch {
      // Fallback: open mail client with pre-filled data
      const subject = encodeURIComponent(`[Portfolio] ${form.projectType || 'Project Inquiry'} from ${form.name}`)
      const body    = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nProject Type: ${form.projectType}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`
      )
      window.location.href = `mailto:${ct.email}?subject=${subject}&body=${body}`
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
    text-[14px] text-white placeholder:text-slate-600
    focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04]
    transition-all duration-200 font-sans
  `

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_50%,rgba(59,130,246,0.06),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">Get in Touch</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Tell me what you need{' '}
            <span className="gradient-text">built.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Fill out the form and I&apos;ll get back to you within 24 hours with questions, timeline, and a quote.
          </p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

          {/* ── Form ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center rounded-2xl border border-green-500/20 bg-green-500/[0.04]">
                <CheckCircle size={44} className="text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Got it — I&apos;ll review your inquiry and get back to you within {ct.responseTime}. You can also reach me directly at {ct.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-7">
                {/* Honeypot — hidden from real users, bots will fill it */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-2">Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-2">Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={e => set('projectType', e.target.value)}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="" className="bg-dark-900">Select project type…</option>
                    {PROJECT_TYPES.map(t => (
                      <option key={t} value={t} className="bg-dark-900">{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-2">Budget Range</label>
                  <select
                    value={form.budget}
                    onChange={e => set('budget', e.target.value)}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="" className="bg-dark-900">Select budget range…</option>
                    {BUDGETS.map(b => (
                      <option key={b} value={b} className="bg-dark-900">{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Describe what you need built — as much detail as possible helps me give you an accurate quote faster."
                    className={inputClass + ' resize-none'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[14px] text-white
                    bg-gradient-to-r from-blue-600 to-cyan-600
                    hover:from-blue-500 hover:to-cyan-500
                    shadow-[0_0_24px_rgba(59,130,246,0.3)]
                    hover:shadow-[0_0_36px_rgba(59,130,246,0.5)]
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-300"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Sidebar ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Info */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-white">Contact Info</h3>

              <a
                href={`mailto:${ct.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-blue-500/25 hover:bg-blue-500/[0.04] transition-all group"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-600 font-mono uppercase tracking-wider">Email</div>
                  <div className="text-[13px] text-slate-300 group-hover:text-white transition-colors">{ct.email}</div>
                </div>
              </a>

              <a
                href={ct.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/25 hover:bg-indigo-500/[0.04] transition-all group"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-slate-600 font-mono uppercase tracking-wider">Discord</div>
                  <div className="text-[13px] text-slate-300 group-hover:text-white transition-colors">{ct.discordHandle}</div>
                </div>
              </a>
            </div>

            {/* Response SLA */}
            <div className="rounded-2xl border border-green-500/15 bg-green-500/[0.04] backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-[status-pulse_2s_ease-in-out_infinite]" />
                <span className="text-[12px] font-semibold text-green-400">Typically replies within {ct.responseTime}</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                I review every inquiry personally. The more detail you provide upfront, the faster I can turn around an accurate quote.
              </p>
            </div>

            {/* Process summary */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
              <h3 className="text-[13px] font-bold text-white mb-3">What to expect</h3>
              <ol className="space-y-2.5">
                {[
                  'Review your request & ask clarifying questions',
                  'Send written scope summary + starting price',
                  'Agree on timeline and deliverables',
                  'Development begins',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[9px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[12px] text-slate-500">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
