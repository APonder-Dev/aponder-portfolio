'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2, GripVertical, Check } from 'lucide-react'
import type { FAQItem } from '@/lib/content-types'
import { DEFAULT_FAQS } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

export default function FaqTab() {
  const { toast } = useToast()
  const [faqs, setFaqs]       = useState<FAQItem[]>(DEFAULT_FAQS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/faq')
      .then(r => r.json())
      .then(({ value }) => { if (value) setFaqs(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/faq', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqs),
    })
    setSaving(false)
    if (res.ok) { toast('FAQ saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const update = (i: number, field: 'q' | 'a', val: string) =>
    setFaqs(f => { const n = [...f]; n[i] = { ...n[i], [field]: val }; return n })

  const remove = (i: number) => setFaqs(f => f.filter((_, idx) => idx !== i))

  const add = () => setFaqs(f => [...f, { q: '', a: '' }])

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= faqs.length) return
    setFaqs(f => { const n = [...f]; [n[i], n[j]] = [n[j], n[i]]; return n })
  }

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[1, 2, 3, 4].map(n => (
        <div key={n} className="h-[52px] rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="space-y-3 max-w-2xl">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-600">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="p-1 text-slate-600 hover:text-slate-400 disabled:opacity-30 transition-colors" title="Move up">
                <GripVertical size={13} className="rotate-90" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === faqs.length - 1}
                className="p-1 text-slate-600 hover:text-slate-400 disabled:opacity-30 transition-colors" title="Move down">
                <GripVertical size={13} className="-rotate-90" />
              </button>
              <button onClick={() => remove(i)}
                className="p-1 text-slate-600 hover:text-red-400 transition-colors ml-1" title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <div>
            <label className={LABEL}>Question</label>
            <input value={faq.q} onChange={e => update(i, 'q', e.target.value)} placeholder="Enter question…" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Answer</label>
            <textarea rows={3} value={faq.a} onChange={e => update(i, 'a', e.target.value)} placeholder="Enter answer…" className={INPUT + ' resize-none'} />
          </div>
        </div>
      ))}

      <button onClick={add}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15] text-sm transition-colors w-full justify-center">
        <Plus size={14} /> Add Question
      </button>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save FAQ'}
      </button>
    </div>
  )
}
