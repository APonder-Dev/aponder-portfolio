'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function NewsletterSignup() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg,    setMsg]    = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setMsg(data.error ?? 'Something went wrong.')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setMsg('Something went wrong.')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-16 flex items-center gap-3 p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
        <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-white">You're in!</div>
          <div className="text-xs text-slate-400 mt-0.5">I'll send you a note when the next post goes live.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-16 p-5 rounded-xl border border-white/[0.06] bg-dark-900/40">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Mail size={14} className="text-blue-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Get notified when I post</div>
          <div className="text-xs text-slate-500">No spam. Unsubscribe any time.</div>
        </div>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="flex-1 bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors min-w-0"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
        >
          {status === 'loading' && <Loader2 size={13} className="animate-spin" />}
          Subscribe
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-400 mt-2">{msg}</p>}
    </div>
  )
}
