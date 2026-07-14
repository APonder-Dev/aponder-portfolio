'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import type { AboutContent } from '@/lib/content-types'
import { DEFAULT_ABOUT } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

export default function AboutTab() {
  const { toast } = useToast()
  const [data, setData]       = useState<AboutContent>(DEFAULT_ABOUT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/about')
      .then(r => r.json())
      .then(({ value }) => { if (value) setData(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/about', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) { toast('About saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const setBio = (i: number, val: string) =>
    setData(d => { const bio = [...d.bio] as [string, string, string]; bio[i] = val; return { ...d, bio } })

  const setStat = (i: number, field: 'value' | 'label', val: string) =>
    setData(d => { const s = [...d.profileStats]; s[i] = { ...s[i], [field]: val }; return { ...d, profileStats: s } })

  const setSpec = (i: number, field: 'label' | 'desc', val: string) =>
    setData(d => { const s = [...d.specs]; s[i] = { ...s[i], [field]: val }; return { ...d, specs: s } })

  if (loading) return (
    <div className="space-y-5 max-w-2xl">
      {[80, 40, 80, 40, 100].map((h, n) => (
        <div key={n} className={`h-${h === 80 ? 10 : h === 40 ? 10 : 24} rounded-lg bg-white/[0.04] animate-pulse`} style={{ height: h }} />
      ))}
    </div>
  )

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Bio */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Bio paragraphs</h3>
        <div className="space-y-3">
          {(['Paragraph 1', 'Paragraph 2', 'Paragraph 3'] as const).map((lbl, i) => (
            <div key={i}>
              <label className={LABEL}>{lbl}</label>
              <textarea rows={3} value={data.bio[i]} onChange={e => setBio(i, e.target.value)} className={INPUT + ' resize-none'} />
            </div>
          ))}
        </div>
      </div>

      {/* Profile stats */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Profile card stats</h3>
        <div className="space-y-3">
          {data.profileStats.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
              <div>
                <label className={LABEL}>Value</label>
                <input value={s.value} onChange={e => setStat(i, 'value', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Label</label>
                <input value={s.label} onChange={e => setStat(i, 'label', e.target.value)} className={INPUT} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open to Work */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setData(d => ({ ...d, openToWork: !d.openToWork }))}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${data.openToWork ? 'bg-emerald-500' : 'bg-dark-700 border border-white/[0.1]'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${data.openToWork ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-slate-300">Show "Open to Work" badge</span>
        </label>
      </div>

      {/* Spec cards */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Spec cards (6 items)</h3>
        <div className="space-y-3">
          {data.specs.map((spec, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
              <div>
                <label className={LABEL}>Label</label>
                <input value={spec.label} onChange={e => setSpec(i, 'label', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <input value={spec.desc} onChange={e => setSpec(i, 'desc', e.target.value)} className={INPUT} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save About'}
      </button>
    </div>
  )
}
