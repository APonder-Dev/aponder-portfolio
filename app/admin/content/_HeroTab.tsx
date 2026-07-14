'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import type { HeroContent } from '@/lib/content-types'
import { DEFAULT_HERO } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

export default function HeroTab() {
  const { toast } = useToast()
  const [data, setData]       = useState<HeroContent>(DEFAULT_HERO)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/hero')
      .then(r => r.json())
      .then(({ value }) => { if (value) setData(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/hero', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) { toast('Hero saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const set = (key: keyof HeroContent, value: HeroContent[keyof HeroContent]) =>
    setData(d => ({ ...d, [key]: value }))

  const setStat = (i: number, field: 'value' | 'label', val: string) =>
    setData(d => {
      const stats = [...d.stats]
      stats[i] = { ...stats[i], [field]: val }
      return { ...d, stats }
    })

  const setHeadline = (i: number, val: string) =>
    setData(d => {
      const h = [...d.headline] as [string, string, string, string]
      h[i] = val
      return { ...d, headline: h }
    })

  if (loading) return (
    <div className="space-y-5 max-w-2xl">
      {[38, 38, 80, 38, 38].map((h, n) => (
        <div key={n} className="rounded-lg bg-white/[0.04] animate-pulse" style={{ height: h }} />
      ))}
    </div>
  )

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Headline */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Headline (4 lines)</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['Line 1', 'Line 2 (gradient)', 'Line 3', 'Line 4 (muted)'] as const).map((lbl, i) => (
            <div key={i}>
              <label className={LABEL}>{lbl}</label>
              <input value={data.headline[i]} onChange={e => setHeadline(i, e.target.value)} className={INPUT} />
            </div>
          ))}
        </div>
      </div>

      {/* Meta line */}
      <div>
        <label className={LABEL}>Meta line (monospace header)</label>
        <input value={data.metaLine} onChange={e => set('metaLine', e.target.value)} className={INPUT} />
      </div>

      {/* Subtitle */}
      <div>
        <label className={LABEL}>Subtitle</label>
        <textarea rows={3} value={data.subtitle} onChange={e => set('subtitle', e.target.value)} className={INPUT + ' resize-none'} />
      </div>

      {/* CTA Labels */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Primary CTA label</label>
          <input value={data.cta1Label} onChange={e => set('cta1Label', e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Secondary CTA label</label>
          <input value={data.cta2Label} onChange={e => set('cta2Label', e.target.value)} className={INPUT} />
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Stats strip (4 cards)</h3>
        <div className="space-y-3">
          {data.stats.map((s, i) => (
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

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Hero'}
      </button>
    </div>
  )
}
