'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import { useToast } from '../_AdminToastContext'

interface SeoContent {
  title:       string
  description: string
  ogImage:     string
}

const DEFAULT: SeoContent = {
  title:       'APonder — Minecraft Plugin Developer & Software Developer',
  description: 'APonder builds production-ready Minecraft plugins, backend systems, server tools, and modern web experiences for server owners and developers.',
  ogImage:     '',
}

const IN = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'
const LBL = 'block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5'

export default function SeoTab() {
  const { toast } = useToast()
  const [data,    setData]    = useState<SeoContent>(DEFAULT)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/content/seo')
      .then(r => r.json())
      .then(d => { if (d.value) setData(d.value) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/content/seo', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) { toast('SEO saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const set = (k: keyof SeoContent, v: string) => setData(d => ({ ...d, [k]: v }))

  if (loading) return (
    <div className="space-y-5 max-w-2xl">
      {[38, 38, 80, 38].map((h, n) => (
        <div key={n} className="rounded-lg bg-white/[0.04] animate-pulse" style={{ height: h }} />
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <label className={LBL}>Page Title</label>
        <input
          value={data.title}
          onChange={e => set('title', e.target.value)}
          className={IN}
          placeholder={DEFAULT.title}
        />
        <p className="text-[11px] text-slate-700 mt-1 font-mono">
          {data.title.length}/60 chars · Shown in browser tab and Google results
        </p>
      </div>

      <div>
        <label className={LBL}>Meta Description</label>
        <textarea
          value={data.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className={`${IN} resize-none`}
          placeholder={DEFAULT.description}
        />
        <p className="text-[11px] text-slate-700 mt-1 font-mono">
          {data.description.length}/160 chars · Shown in search result snippets
        </p>
      </div>

      <div>
        <label className={LBL}>OG / Social Image URL</label>
        <input
          value={data.ogImage}
          onChange={e => set('ogImage', e.target.value)}
          className={IN}
          placeholder="https://aponder.dev/og-image.png"
        />
        <p className="text-[11px] text-slate-700 mt-1 font-mono">
          Used when sharing on Twitter, Discord, LinkedIn etc. Ideal: 1200×630px
        </p>
      </div>

      {data.ogImage && (
        <div className="rounded-lg overflow-hidden border border-white/[0.08] max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.ogImage} alt="OG preview" className="w-full h-auto" />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save SEO'}
        </button>
      </div>
    </div>
  )
}
