'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, ChevronDown, Check } from 'lucide-react'
import type { ProcessStep } from '@/lib/content-types'
import { DEFAULT_PROCESS } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'
const COLORS = ['blue', 'cyan', 'indigo', 'purple', 'emerald', 'orange', 'teal', 'sky']

export default function ProcessTab() {
  const { toast } = useToast()
  const [steps, setSteps]     = useState<ProcessStep[]>(DEFAULT_PROCESS)
  const [open, setOpen]       = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/process')
      .then(r => r.json())
      .then(({ value }) => { if (value) setSteps(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/process', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(steps),
    })
    setSaving(false)
    if (res.ok) { toast('Process saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const update = (i: number, field: keyof ProcessStep, val: string | string[]) =>
    setSteps(s => { const n = [...s]; n[i] = { ...n[i], [field]: val }; return n })

  const setDetail = (si: number, di: number, val: string) =>
    setSteps(s => {
      const n = [...s]
      const detail = [...n[si].detail]
      detail[di] = val
      n[si] = { ...n[si], detail }
      return n
    })

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} className="h-[52px] rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="space-y-3 max-w-2xl">
      {steps.map((step, i) => (
        <div key={step.n} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500">{step.n}</span>
              <span className="text-sm font-semibold text-white">{step.label}</span>
              <span className="text-xs text-slate-500">— {step.title}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>

          {open === i && (
            <div className="px-4 pb-5 pt-1 space-y-4 border-t border-white/[0.05]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Label (short, e.g. "Discovery")</label>
                  <input value={step.label} onChange={e => update(i, 'label', e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Color</label>
                  <select value={step.color} onChange={e => update(i, 'color', e.target.value)} className={INPUT + ' cursor-pointer'}>
                    {COLORS.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Title</label>
                <input value={step.title} onChange={e => update(i, 'title', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={3} value={step.desc} onChange={e => update(i, 'desc', e.target.value)} className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className={LABEL}>Detail points (4 bullets)</label>
                <div className="space-y-2">
                  {step.detail.map((d, di) => (
                    <input key={di} value={d} onChange={e => setDetail(i, di, e.target.value)} className={INPUT} placeholder={`Detail ${di + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60 mt-2">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Process'}
      </button>
    </div>
  )
}
