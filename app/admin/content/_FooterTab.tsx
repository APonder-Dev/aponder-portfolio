'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Check, Plus, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { FooterLink } from '@/lib/content-types'
import { DEFAULT_FOOTER_LINKS } from '@/lib/content-defaults'
import { FOOTER_ICONS, FOOTER_ICON_LABELS, footerIcon } from '@/lib/footer-icons'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

// Native <select> options can't contain SVGs, so this is a small custom
// dropdown that previews each icon next to its name.
function IconSelect({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const Current = footerIcon(value)

  useEffect(() => {
    if (!open) return
    const onOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={INPUT + ' flex items-center gap-2 cursor-pointer text-left'}
      >
        <Current size={14} className="text-blue-400 flex-shrink-0" />
        <span className="flex-1 truncate">{FOOTER_ICON_LABELS[value] ?? value}</span>
        <ChevronsUpDown size={13} className="text-slate-600 flex-shrink-0" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-dark-900 border border-white/[0.1] shadow-2xl py-1"
        >
          {Object.keys(FOOTER_ICONS).map(key => {
            const Icon = footerIcon(key)
            const selected = key === value
            return (
              <li key={key} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => { onChange(key); setOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                    selected
                      ? 'bg-blue-500/10 text-blue-300'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <Icon size={14} className={selected ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="flex-1 truncate">{FOOTER_ICON_LABELS[key] ?? key}</span>
                  {selected && <Check size={13} className="text-blue-400 flex-shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function FooterTab() {
  const { toast } = useToast()
  const [links,   setLinks]   = useState<FooterLink[]>(DEFAULT_FOOTER_LINKS)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/footer_links')
      .then(r => r.json())
      .then(({ value }) => { if (Array.isArray(value) && value.length > 0) setLinks(value) })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    const invalid = links.find(l => !l.label.trim() || !l.url.trim())
    if (invalid) {
      toast('Every link needs a label and a URL', 'error')
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/content/footer_links', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(links),
    })
    setSaving(false)
    if (res.ok) { toast('Footer links saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  const set = (id: string, key: keyof FooterLink, val: string) =>
    setLinks(prev => prev.map(l => (l.id === id ? { ...l, [key]: val } : l)))

  const add = () =>
    setLinks(prev => [
      ...prev,
      { id: `link-${Date.now()}`, label: '', url: '', icon: 'globe' },
    ])

  const remove = (id: string) => setLinks(prev => prev.filter(l => l.id !== id))

  const move = (index: number, dir: -1 | 1) => {
    setLinks(prev => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[64, 64, 64].map((h, n) => (
        <div key={n} className="rounded-lg bg-white/[0.04] animate-pulse" style={{ height: h }} />
      ))}
    </div>
  )

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-slate-500">
        Icon links shown in the footer&apos;s social row. Use <code className="text-slate-400">mailto:you@example.com</code> for email links.
      </p>

      {links.map((link, i) => {
        const Icon = footerIcon(link.icon)
        return (
          <div key={link.id} className="bg-dark-900 rounded-xl border border-white/[0.06] p-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col flex-shrink-0 pt-6">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-slate-600 hover:text-white rounded disabled:opacity-30 transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === links.length - 1}
                  className="p-1 text-slate-600 hover:text-white rounded disabled:opacity-30 transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex-shrink-0 pt-6">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Icon size={15} className="text-blue-400" />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr] gap-3">
                <div>
                  <label className={LABEL}>Label</label>
                  <input
                    value={link.label}
                    onChange={e => set(link.id, 'label', e.target.value)}
                    placeholder="GitHub"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>URL</label>
                  <input
                    value={link.url}
                    onChange={e => set(link.id, 'url', e.target.value)}
                    placeholder="https://…"
                    className={INPUT + ' font-mono text-xs'}
                  />
                </div>
                <div>
                  <label className={LABEL}>Icon</label>
                  <IconSelect value={link.icon} onChange={icon => set(link.id, 'icon', icon)} />
                </div>
              </div>

              <button
                onClick={() => remove(link.id)}
                className="p-2 mt-6 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                aria-label={`Remove ${link.label || 'link'}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}

      <div className="flex items-center gap-3">
        <button
          onClick={add}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/[0.12] text-sm text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
        >
          <Plus size={14} />
          Add Link
        </button>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Footer'}
        </button>
      </div>
    </div>
  )
}
