'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, ChevronDown, Plus, Trash2, ChevronUp, Check } from 'lucide-react'
import type { SkillItem, SkillStatus } from '@/lib/content-types'
import { DEFAULT_SKILLS } from '@/lib/content-defaults'
import { useToast } from '../_AdminToastContext'

const INPUT = 'w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors'
const LABEL = 'block text-[11px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'
const STATUSES: SkillStatus[] = ['Expert', 'Advanced', 'Proficient', 'Learning']

const STATUS_COLOR: Record<SkillStatus, string> = {
  Expert:     'text-green-400  bg-green-400/10  border-green-400/20',
  Advanced:   'text-blue-400   bg-blue-400/10   border-blue-400/20',
  Proficient: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Learning:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

const BLANK = (): SkillItem => ({
  id: '', name: '', percentage: 80, status: 'Advanced', description: '', tags: [],
})

export default function SkillsTab() {
  const { toast } = useToast()
  const [skills,  setSkills]  = useState<SkillItem[]>(DEFAULT_SKILLS)
  const [open,    setOpen]    = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [adding,  setAdding]  = useState(false)
  const [draft,   setDraft]   = useState<SkillItem>(BLANK())
  const [armed,   setArmed]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content/skills')
      .then(r => r.json())
      .then(({ value }) => { if (value) setSkills(value) })
      .finally(() => setLoading(false))
  }, [])

  /* ── Save ──────────────────────────────────────────────────── */
  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/content/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skills),
    })
    setSaving(false)
    if (res.ok) {
      toast('Skills saved')
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } else {
      toast('Failed to save', 'error')
    }
  }

  /* ── Update existing ───────────────────────────────────────── */
  const update = (id: string, field: keyof SkillItem, val: string | number | string[]) =>
    setSkills(s => s.map(sk => sk.id === id ? { ...sk, [field]: val } : sk))

  /* ── Add new ───────────────────────────────────────────────── */
  const addSkill = () => {
    const id = draft.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `skill-${Date.now().toString(36)}`
    setSkills(s => [...s, { ...draft, id }])
    setDraft(BLANK())
    setAdding(false)
    setOpen(id)
  }

  /* ── Reorder ────────────────────────────────────────────────── */
  const move = (id: string, dir: -1 | 1) => {
    setSkills(prev => {
      const idx  = prev.findIndex(s => s.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr  = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  /* ── Delete ─────────────────────────────────────────────────── */
  const deleteSkill = (id: string) => {
    setSkills(s => s.filter(sk => sk.id !== id))
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

      {/* Skill cards */}
      {skills.map((skill, i) => (
        <div key={skill.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">

          {/* Accordion header */}
          <div className="flex items-center gap-2 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
            <button
              onClick={() => setOpen(open === skill.id ? null : skill.id)}
              className="flex-1 flex items-center gap-3 text-left min-w-0"
            >
              <span className="text-sm font-semibold text-white truncate">{skill.name || 'Untitled'}</span>
              <span className="text-xs text-slate-500 font-mono flex-shrink-0">{skill.percentage}%</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${STATUS_COLOR[skill.status]}`}>
                {skill.status}
              </span>
            </button>

            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={() => move(skill.id, -1)} disabled={i === 0}
                className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                <ChevronUp size={13} />
              </button>
              <button onClick={() => move(skill.id, 1)} disabled={i === skills.length - 1}
                className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                <ChevronDown size={13} />
              </button>
              {armed === skill.id ? (
                <>
                  <button onClick={() => deleteSkill(skill.id)}
                    className="px-1.5 py-0.5 text-[11px] text-red-400 hover:bg-red-500/10 rounded transition-all">Yes</button>
                  <button onClick={() => setArmed(null)}
                    className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-white rounded transition-colors">No</button>
                </>
              ) : (
                <button onClick={() => setArmed(skill.id)}
                  className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded">
                  <Trash2 size={13} />
                </button>
              )}
              <button onClick={() => setOpen(open === skill.id ? null : skill.id)}
                className="p-1 text-slate-500 transition-colors rounded">
                <ChevronDown size={13} className={`transition-transform ${open === skill.id ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expanded editor */}
          {open === skill.id && (
            <div className="px-4 pb-5 pt-2 space-y-4 border-t border-white/[0.05]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Name</label>
                  <input value={skill.name} onChange={e => update(skill.id, 'name', e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Percentage (0–100)</label>
                  <input
                    type="number" min={0} max={100}
                    value={skill.percentage}
                    onChange={e => update(skill.id, 'percentage', Math.min(100, Math.max(0, Number(e.target.value))))}
                    className={INPUT}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select value={skill.status} onChange={e => update(skill.id, 'status', e.target.value as SkillStatus)} className={INPUT + ' cursor-pointer'}>
                  {STATUSES.map(s => <option key={s} value={s} className="bg-dark-900">{s}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea rows={2} value={skill.description}
                  onChange={e => update(skill.id, 'description', e.target.value)}
                  className={INPUT + ' resize-none'} />
              </div>
              <div>
                <label className={LABEL}>Tags (comma-separated)</label>
                <input
                  value={skill.tags.join(', ')}
                  onChange={e => update(skill.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="Java, OOP, Paper API"
                  className={INPUT}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Skill form */}
      {adding ? (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.03] p-4 space-y-4">
          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest font-mono">New Skill</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Name *</label>
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                placeholder="TypeScript" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Percentage (0–100)</label>
              <input
                type="number" min={0} max={100}
                value={draft.percentage}
                onChange={e => setDraft(d => ({ ...d, percentage: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                className={INPUT}
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value as SkillStatus }))} className={INPUT + ' cursor-pointer'}>
              {STATUSES.map(s => <option key={s} value={s} className="bg-dark-900">{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={2} value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              placeholder="What you use this skill for…" className={INPUT + ' resize-none'} />
          </div>
          <div>
            <label className={LABEL}>Tags (comma-separated)</label>
            <input
              value={draft.tags.join(', ')}
              onChange={e => setDraft(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
              placeholder="TypeScript, React, Next.js"
              className={INPUT}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addSkill} disabled={!draft.name.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Check size={13} /> Add Skill
            </button>
            <button onClick={() => { setAdding(false); setDraft(BLANK()) }}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/[0.08] rounded-lg hover:border-white/20 transition-all">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-sm text-slate-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all">
          <Plus size={14} /> Add Skill
        </button>
      )}

      {/* Save */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-600">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Skills'}
        </button>
      </div>
    </div>
  )
}
