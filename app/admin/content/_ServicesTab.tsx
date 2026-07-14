'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, ChevronDown, Plus, Trash2, ChevronUp, Check } from 'lucide-react'
import type { ServiceItem } from '@/lib/content-types'
import { DEFAULT_SERVICES } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

const ICONS = [
  'puzzle', 'wrench', 'refresh-cw', 'layers', 'layout', 'trending-up',
  'terminal', 'globe', 'code', 'server', 'database', 'cpu', 'shield',
]
const COLORS = [
  'blue', 'orange', 'cyan', 'indigo', 'purple',
  'emerald', 'teal', 'sky', 'red', 'green', 'pink',
]
const COLOR_DOT: Record<string, string> = {
  blue: 'bg-blue-500', orange: 'bg-orange-500', cyan: 'bg-cyan-500',
  indigo: 'bg-indigo-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500',
  teal: 'bg-teal-500', sky: 'bg-sky-500', red: 'bg-red-500',
  green: 'bg-green-500', pink: 'bg-pink-500',
}

const BLANK = (): ServiceItem => ({
  id: '', title: '', description: '', features: [], icon: 'puzzle', accentColor: 'blue',
})

export default function ServicesTab() {
  const { toast } = useToast()
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES)
  const [open,     setOpen]     = useState<string | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [adding,   setAdding]   = useState(false)
  const [draft,    setDraft]    = useState<ServiceItem>(BLANK())
  const [armed,    setArmed]    = useState<string | null>(null)
  const [featText, setFeatText] = useState('')

  useEffect(() => {
    fetch('/api/admin/content/services')
      .then(r => r.json())
      .then(({ value }) => { if (value) setServices(value) })
      .finally(() => setLoading(false))
  }, [])

  /* ── Save ──────────────────────────────────────────────────── */
  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(services),
    })
    setSaving(false)
    if (res.ok) {
      toast('Services saved')
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } else {
      toast('Failed to save', 'error')
    }
  }

  /* ── Update existing ───────────────────────────────────────── */
  const update = (id: string, field: keyof ServiceItem, val: string | string[]) =>
    setServices(s => s.map(svc => svc.id === id ? { ...svc, [field]: val } : svc))

  /* ── Add new ───────────────────────────────────────────────── */
  const addService = () => {
    const id = draft.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `svc-${Date.now().toString(36)}`
    const features = featText.split('\n').map(s => s.trim()).filter(Boolean)
    setServices(s => [...s, { ...draft, id, features }])
    setDraft(BLANK())
    setFeatText('')
    setAdding(false)
    setOpen(id)
  }

  /* ── Reorder ────────────────────────────────────────────────── */
  const move = (id: string, dir: -1 | 1) => {
    setServices(prev => {
      const idx  = prev.findIndex(s => s.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr  = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  /* ── Delete ─────────────────────────────────────────────────── */
  const deleteService = (id: string) => {
    setServices(s => s.filter(svc => svc.id !== id))
    if (open === id) setOpen(null)
    setArmed(null)
  }

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[1, 2, 3].map(n => (
        <div key={n} className="h-[52px] rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="space-y-3 max-w-2xl">

      {/* Service cards */}
      {services.map((svc, i) => (
        <div key={svc.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">

          {/* Accordion header */}
          <div className="flex items-center gap-2 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
            <button
              onClick={() => setOpen(open === svc.id ? null : svc.id)}
              className="flex-1 flex items-center gap-3 text-left min-w-0"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${COLOR_DOT[svc.accentColor] ?? 'bg-slate-500'}`} />
              <span className="text-sm font-semibold text-white truncate">{svc.title || 'Untitled'}</span>
              <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">{svc.icon}</span>
            </button>

            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={() => move(svc.id, -1)} disabled={i === 0}
                className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                <ChevronUp size={13} />
              </button>
              <button onClick={() => move(svc.id, 1)} disabled={i === services.length - 1}
                className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                <ChevronDown size={13} />
              </button>
              {armed === svc.id ? (
                <>
                  <button onClick={() => deleteService(svc.id)}
                    className="px-1.5 py-0.5 text-[11px] text-red-400 hover:bg-red-500/10 rounded transition-all">Yes</button>
                  <button onClick={() => setArmed(null)}
                    className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-white rounded transition-colors">No</button>
                </>
              ) : (
                <button onClick={() => setArmed(svc.id)}
                  className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded">
                  <Trash2 size={13} />
                </button>
              )}
              <button onClick={() => setOpen(open === svc.id ? null : svc.id)}
                className="p-1 text-slate-500 transition-colors rounded">
                <ChevronDown size={13} className={`transition-transform ${open === svc.id ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expanded editor */}
          {open === svc.id && (
            <div className="px-4 pb-5 pt-2 space-y-4 border-t border-white/[0.05]">
              <div>
                <label className={LABEL}>Title</label>
                <input value={svc.title} onChange={e => update(svc.id, 'title', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} value={svc.description}
                  onChange={e => update(svc.id, 'description', e.target.value)}
                  className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className={LABEL}>Features — one per line</label>
                <textarea
                  rows={5}
                  value={svc.features.join('\n')}
                  onChange={e => update(svc.id, 'features', e.target.value.split('\n'))}
                  className={INPUT + ' resize-none font-mono text-xs leading-relaxed'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Icon</label>
                  <select value={svc.icon} onChange={e => update(svc.id, 'icon', e.target.value)} className={INPUT + ' cursor-pointer'}>
                    {ICONS.map(ic => <option key={ic} value={ic} className="bg-dark-900">{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Accent Color</label>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${COLOR_DOT[svc.accentColor] ?? 'bg-slate-500'}`} />
                    <select value={svc.accentColor} onChange={e => update(svc.id, 'accentColor', e.target.value)} className={INPUT + ' cursor-pointer'}>
                      {COLORS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Service form */}
      {adding ? (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.03] p-4 space-y-4">
          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest font-mono">New Service</p>
          <div>
            <label className={LABEL}>Title *</label>
            <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              placeholder="Custom Minecraft Plugins" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={2} value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              placeholder="What this service covers…" className={INPUT + ' resize-none'} />
          </div>
          <div>
            <label className={LABEL}>Features — one per line</label>
            <textarea rows={4} value={featText}
              onChange={e => setFeatText(e.target.value)}
              placeholder={'Full source code delivery\n30-day support window'}
              className={INPUT + ' resize-none font-mono text-xs leading-relaxed'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Icon</label>
              <select value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} className={INPUT + ' cursor-pointer'}>
                {ICONS.map(ic => <option key={ic} value={ic} className="bg-dark-900">{ic}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Accent Color</label>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${COLOR_DOT[draft.accentColor] ?? 'bg-slate-500'}`} />
                <select value={draft.accentColor} onChange={e => setDraft(d => ({ ...d, accentColor: e.target.value }))} className={INPUT + ' cursor-pointer'}>
                  {COLORS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addService} disabled={!draft.title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Check size={13} /> Add Service
            </button>
            <button onClick={() => { setAdding(false); setDraft(BLANK()); setFeatText('') }}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/[0.08] rounded-lg hover:border-white/20 transition-all">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-sm text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all">
          <Plus size={14} /> Add Service
        </button>
      )}

      {/* Save */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-600">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Services'}
        </button>
      </div>
    </div>
  )
}
