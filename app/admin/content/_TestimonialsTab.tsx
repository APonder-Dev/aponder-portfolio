'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import type { TestimonialItem } from '@/lib/content-types'
import { DEFAULT_TESTIMONIALS } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const COLORS = ['blue', 'cyan', 'emerald', 'indigo', 'purple', 'orange', 'amber', 'teal', 'rose', 'slate']

const IN = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'
const LBL = 'block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5'

const EMPTY: TestimonialItem = {
  quote: '', author: '', server: '', discord: '', initials: '', color: 'blue',
}

export default function TestimonialsTab() {
  const { toast } = useToast()
  const [items,   setItems]   = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [open,    setOpen]    = useState<number | null>(0)

  useEffect(() => {
    fetch('/api/admin/content/testimonials')
      .then(r => r.json())
      .then(d => { if (d.value) setItems(d.value) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/content/testimonials', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(items),
    })
    setSaving(false)
    if (res.ok) { toast('Testimonials saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const set = (i: number, k: keyof TestimonialItem, v: string) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item))

  const add  = () => { setItems(prev => [...prev, { ...EMPTY }]); setOpen(items.length) }
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
    setOpen(j)
  }

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[1, 2, 3].map(n => (
        <div key={n} className="h-[52px] rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-3">
      {items.map((t, i) => (
        <div key={i} className={`rounded-xl border overflow-hidden ${open === i ? 'border-blue-500/25' : 'border-white/[0.06]'} bg-dark-900`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(open === i ? null : i)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === i ? null : i) } }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="min-w-0">
              <span className="text-sm font-medium text-white">{t.server || `Testimonial ${i + 1}`}</span>
              {t.author && <span className="text-xs text-slate-500 ml-2">{t.author}</span>}
            </div>
            <div className="flex items-center gap-1 ml-4 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); move(i, -1) }} disabled={i === 0} className="p-1.5 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
              <button onClick={e => { e.stopPropagation(); move(i, 1) }} disabled={i === items.length - 1} className="p-1.5 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
              <button onClick={e => { e.stopPropagation(); remove(i) }} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              {open === i ? <ChevronUp size={14} className="text-slate-500 ml-1" /> : <ChevronDown size={14} className="text-slate-500 ml-1" />}
            </div>
          </div>

          {open === i && (
            <div className="px-5 pb-5 border-t border-white/[0.05] pt-4 space-y-3">
              <div>
                <label className={LBL}>Quote *</label>
                <textarea
                  value={t.quote}
                  onChange={e => set(i, 'quote', e.target.value)}
                  rows={4}
                  className={`${IN} resize-none`}
                  placeholder="What the client said…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LBL}>Author / Title</label>
                  <input value={t.author} onChange={e => set(i, 'author', e.target.value)} className={IN} placeholder="Owner" />
                </div>
                <div>
                  <label className={LBL}>Server / Company</label>
                  <input value={t.server} onChange={e => set(i, 'server', e.target.value)} className={IN} placeholder="DaylightSMP" />
                </div>
                <div>
                  <label className={LBL}>Initials (avatar)</label>
                  <input value={t.initials} onChange={e => set(i, 'initials', e.target.value)} className={IN} placeholder="DS" maxLength={3} />
                </div>
                <div>
                  <label className={LBL}>Accent Color</label>
                  <select value={t.color} onChange={e => set(i, 'color', e.target.value)} className={IN}>
                    {COLORS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={LBL}>Discord URL (optional)</label>
                  <input value={t.discord} onChange={e => set(i, 'discord', e.target.value)} className={IN} placeholder="https://discord.gg/…" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-2 py-1.5 transition-colors"
      >
        <Plus size={14} /> Add Testimonial
      </button>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Testimonials'}
        </button>
      </div>
    </div>
  )
}
