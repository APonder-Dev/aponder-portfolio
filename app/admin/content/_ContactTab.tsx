'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import type { ContactContent } from '@/lib/content-types'
import { DEFAULT_CONTACT } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

export default function ContactTab() {
  const { toast } = useToast()
  const [data, setData]       = useState<ContactContent>(DEFAULT_CONTACT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/contact')
      .then(r => r.json())
      .then(({ value }) => { if (value) setData(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/contact', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) { toast('Contact saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const set = (key: keyof ContactContent, val: string) => setData(d => ({ ...d, [key]: val }))

  if (loading) return (
    <div className="space-y-5 max-w-2xl">
      {[38, 38, 38, 38].map((h, n) => (
        <div key={n} className="rounded-lg bg-white/[0.04] animate-pulse" style={{ height: h }} />
      ))}
    </div>
  )

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <label className={LABEL}>Email address</label>
        <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className={INPUT} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Discord handle (display)</label>
          <input value={data.discordHandle} onChange={e => set('discordHandle', e.target.value)} placeholder="aponder" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Discord URL</label>
          <input value={data.discordUrl} onChange={e => set('discordUrl', e.target.value)} placeholder="https://discord.gg/…" className={INPUT} />
        </div>
      </div>
      <div>
        <label className={LABEL}>Location</label>
        <input value={data.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Remote" className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Typical response time</label>
        <input value={data.responseTime} onChange={e => set('responseTime', e.target.value)} placeholder="24h" className={INPUT} />
        <p className="text-[11px] text-slate-600 mt-1.5">Shown on the sidebar as "Typically replies within {'{'}responseTime{'}'}"</p>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Contact'}
      </button>
    </div>
  )
}
