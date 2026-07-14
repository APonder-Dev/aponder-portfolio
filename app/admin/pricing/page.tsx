'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Trash2, Pencil, ChevronUp, ChevronDown, Loader2, Save,
  Check, X,
  Code2, Zap, Star, Crown, Package, Wrench, Settings,
  Layers, Globe, Server, Shield, Database, Terminal, Puzzle,
  RefreshCw, BarChart2, type LucideIcon,
} from 'lucide-react'
import { CATEGORIES as STATIC_CATS, PLANS as STATIC_PLANS } from '@/data/pricing'
import type { PricingCategoryData, PricingPlanData } from '@/lib/content-types'

/* ── Icon catalogue ─────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  Code2, Zap, Star, Crown, Package, Wrench, Settings, Layers, Globe,
  Server, Shield, Database, Terminal, Puzzle, RefreshCw, BarChart2,
}
const ICON_NAMES = Object.keys(ICON_MAP)

/* ── Color options ──────────────────────────────────────────── */
const COLOR_OPTS = ['blue', 'cyan', 'indigo', 'purple', 'glass'] as const
const COLOR_DOT: Record<string, string> = {
  blue:   'bg-blue-500',
  cyan:   'bg-cyan-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  glass:  'bg-slate-500',
}
const PLAN_ICON_CLS: Record<string, string> = {
  blue:   'bg-blue-500/10 text-blue-400',
  cyan:   'bg-cyan-500/10 text-cyan-400',
  indigo: 'bg-indigo-500/10 text-indigo-400',
  purple: 'bg-purple-500/10 text-purple-400',
  glass:  'bg-white/[0.06] text-slate-400',
}

/* ── Seed static defaults into DB shape ─────────────────────── */
const ICON_TO_NAME = new Map<LucideIcon, string>(
  ICON_NAMES.map(n => [ICON_MAP[n], n])
)
function seedCategories(): PricingCategoryData[] {
  return Object.entries(STATIC_CATS).map(([id, c]) => ({
    id,
    label:       c.label,
    description: c.description,
    disclaimer:  c.disclaimer,
    layout:      id === 'sys-admin' ? 'horizontal' : 'cards',
  }))
}
function seedPlans(): PricingPlanData[] {
  return STATIC_PLANS.map(p => ({
    id:          p.id,
    category:    p.category,
    name:        p.name,
    iconName:    ICON_TO_NAME.get(p.Icon) ?? 'Code2',
    price:       p.price,
    subtitle:    p.subtitle,
    color:       p.color,
    featured:    p.featured,
    features:    p.features,
    notIncluded: p.notIncluded,
    cta:         p.cta,
  }))
}

/* ── Blank templates ────────────────────────────────────────── */
const BLANK_CAT = (): PricingCategoryData => ({
  id: '', label: '', description: '', disclaimer: '', layout: 'cards',
})
const BLANK_PLAN = (category: string): PricingPlanData => ({
  id:          `plan-${Date.now().toString(36)}`,
  category,
  name:        '',
  iconName:    'Code2',
  price:       '',
  subtitle:    '',
  color:       'blue',
  featured:    false,
  features:    [],
  notIncluded: [],
  cta:         'Get Started',
})

/* ── Shared styles ──────────────────────────────────────────── */
const INP = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors'
const LBL = 'block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

/* ═══════════════════════════════════════════════════════════════
   Plan editor
   ══════════════════════════════════════════════════════════════ */
interface PlanDraft extends PricingPlanData {
  featuresText: string
  notIncText:   string
}

function PlanEditor({
  plan, categories, onSave, onCancel,
}: {
  plan:       PricingPlanData
  categories: PricingCategoryData[]
  onSave:     (p: PricingPlanData) => void
  onCancel:   () => void
}) {
  const [f, setF] = useState<PlanDraft>({
    ...plan,
    featuresText: plan.features.join('\n'),
    notIncText:   plan.notIncluded.join('\n'),
  })
  const set = <K extends keyof PlanDraft>(k: K, v: PlanDraft[K]) =>
    setF(prev => ({ ...prev, [k]: v }))

  const PreviewIcon = ICON_MAP[f.iconName] ?? Code2

  const commit = () =>
    onSave({
      id:          f.id,
      category:    f.category,
      name:        f.name.trim(),
      iconName:    f.iconName,
      price:       f.price.trim(),
      subtitle:    f.subtitle.trim(),
      color:       f.color,
      featured:    f.featured,
      cta:         f.cta.trim() || 'Get Started',
      features:    f.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      notIncluded: f.notIncText.split('\n').map(s => s.trim()).filter(Boolean),
    })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {plan.name ? `Editing: ${plan.name}` : 'New Plan'}
        </h3>
        <button onClick={onCancel} className="p-1 text-slate-500 hover:text-white transition-colors rounded">
          <X size={15} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LBL}>Plan Name *</label>
          <input value={f.name} onChange={e => set('name', e.target.value)} placeholder="Starter Plugin" className={INP} />
        </div>
        <div>
          <label className={LBL}>Subtitle</label>
          <input value={f.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Ideal for small utility plugins" className={INP} />
        </div>
        <div>
          <label className={LBL}>Price *</label>
          <input value={f.price} onChange={e => set('price', e.target.value)} placeholder="$14.99" className={INP} />
        </div>
        <div>
          <label className={LBL}>CTA Button Text</label>
          <input value={f.cta} onChange={e => set('cta', e.target.value)} placeholder="Get Started" className={INP} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={LBL}>Category</label>
          <select
            value={f.category}
            onChange={e => set('category', e.target.value)}
            className={INP + ' cursor-pointer'}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id} className="bg-dark-900">{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LBL}>Icon</label>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${PLAN_ICON_CLS[f.color] ?? PLAN_ICON_CLS.glass}`}>
              <PreviewIcon size={15} />
            </div>
            <select
              value={f.iconName}
              onChange={e => set('iconName', e.target.value)}
              className={INP + ' cursor-pointer'}
            >
              {ICON_NAMES.map(n => (
                <option key={n} value={n} className="bg-dark-900">{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={LBL}>Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => set('color', c)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                f.color === c
                  ? 'border-blue-500/50 bg-blue-500/10 text-white'
                  : 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${COLOR_DOT[c]}`} />
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none w-fit">
        <div
          onClick={() => set('featured', !f.featured)}
          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            f.featured ? 'bg-blue-600 border-blue-500' : 'border-white/[0.15] bg-white/[0.03]'
          }`}
        >
          {f.featured && <Check size={11} className="text-white" />}
        </div>
        Featured <span className="text-slate-500 font-mono text-xs">(shows &ldquo;Most Popular&rdquo; badge)</span>
      </label>

      <div>
        <label className={LBL}>Features — one per line</label>
        <textarea
          value={f.featuresText}
          onChange={e => set('featuresText', e.target.value)}
          rows={6}
          placeholder={'Full YAML config system\nSQLite database\nVault & PAPI support\n14-day support window'}
          className={INP + ' resize-none font-mono text-xs leading-relaxed'}
        />
      </div>

      <div>
        <label className={LBL}>Not Included — one per line</label>
        <textarea
          value={f.notIncText}
          onChange={e => set('notIncText', e.target.value)}
          rows={3}
          placeholder={'MySQL support\nSource code delivery'}
          className={INP + ' resize-none font-mono text-xs leading-relaxed'}
        />
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
        <button
          onClick={commit}
          disabled={!f.name.trim() || !f.price.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={13} /> Save Plan
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/[0.08] rounded-lg hover:border-white/20 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Main page
   ══════════════════════════════════════════════════════════════ */
export default function PricingAdminPage() {
  const [categories, setCategories] = useState<PricingCategoryData[]>([])
  const [plans,      setPlans]      = useState<PricingPlanData[]>([])
  const [activeCat,  setActiveCat]  = useState('')

  const [editingPlan, setEditingPlan] = useState<PricingPlanData | null>(null)
  const [editCatId,   setEditCatId]   = useState<string | null>(null)
  const [catDraft,    setCatDraft]    = useState<PricingCategoryData>(BLANK_CAT())
  const [addingCat,   setAddingCat]   = useState(false)
  const [armedPlan,   setArmedPlan]   = useState<string | null>(null)
  const [armedCat,    setArmedCat]    = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  /* load ─────────────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/pricing')
    const data = await res.json() as { categories: PricingCategoryData[]; plans: PricingPlanData[] }

    if (data.categories.length) {
      setCategories(data.categories)
      setPlans(data.plans)
      setActiveCat(data.categories[0]?.id ?? '')
    } else {
      const cats  = seedCategories()
      const plns  = seedPlans()
      setCategories(cats)
      setPlans(plns)
      setActiveCat(cats[0]?.id ?? '')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  /* save ─────────────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/pricing', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ categories, plans }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  /* category actions ─────────────────────────────────────────── */
  const addCategory = () => {
    const id = catDraft.id.trim().toLowerCase().replace(/\s+/g, '-')
    if (!id || !catDraft.label.trim()) return
    const newCat: PricingCategoryData = { ...catDraft, id }
    setCategories(prev => [...prev, newCat])
    setActiveCat(id)
    setAddingCat(false)
    setCatDraft(BLANK_CAT())
  }

  const saveEditCat = () => {
    if (!catDraft.label.trim()) return
    setCategories(prev => prev.map(c => c.id === editCatId ? { ...catDraft, id: c.id } : c))
    setEditCatId(null)
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeCat === id) setActiveCat(next[0]?.id ?? '')
      return next
    })
    setPlans(prev => prev.filter(p => p.category !== id))
    setArmedCat(null)
  }

  const moveCat = (id: string, dir: -1 | 1) => {
    setCategories(prev => {
      const idx  = prev.findIndex(c => c.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr  = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  /* plan actions ─────────────────────────────────────────────── */
  const savePlan = (plan: PricingPlanData) => {
    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id)
      return idx >= 0 ? prev.map(p => p.id === plan.id ? plan : p) : [...prev, plan]
    })
    setEditingPlan(null)
  }

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id))
    setArmedPlan(null)
  }

  const movePlan = (id: string, dir: -1 | 1) => {
    const catPlans = plans.filter(p => p.category === activeCat)
    const idx      = catPlans.findIndex(p => p.id === id)
    const next     = idx + dir
    if (next < 0 || next >= catPlans.length) return
    const reordered = [...catPlans];
    [reordered[idx], reordered[next]] = [reordered[next], reordered[idx]]
    setPlans([...plans.filter(p => p.category !== activeCat), ...reordered])
  }

  /* derived ──────────────────────────────────────────────────── */
  const catPlans    = plans.filter(p => p.category === activeCat)
  const activeCatObj = categories.find(c => c.id === activeCat)

  /* render ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 size={18} className="animate-spin mr-2" /> Loading…
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pricing</h1>
          <p className="text-slate-500 text-sm mt-1">
            {categories.length} categories · {plans.length} plans
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save All'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        {/* ── Left: Categories ───────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">Categories</span>
              <button
                onClick={() => { setAddingCat(true); setEditCatId(null) }}
                className="p-1 rounded text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                title="Add category"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {categories.map((cat, i) => (
                <div key={cat.id}>

                  {/* ── Inline category editor ──────────────── */}
                  {editCatId === cat.id ? (
                    <div className="p-3 space-y-2.5 bg-blue-500/[0.03] border-l-2 border-blue-500/40">
                      <div>
                        <label className={LBL}>Label</label>
                        <input value={catDraft.label} onChange={e => setCatDraft(d => ({ ...d, label: e.target.value }))} className={INP} />
                      </div>
                      <div>
                        <label className={LBL}>Description</label>
                        <textarea value={catDraft.description} onChange={e => setCatDraft(d => ({ ...d, description: e.target.value }))} rows={2} className={INP + ' resize-none text-xs'} />
                      </div>
                      <div>
                        <label className={LBL}>Disclaimer</label>
                        <textarea value={catDraft.disclaimer} onChange={e => setCatDraft(d => ({ ...d, disclaimer: e.target.value }))} rows={2} className={INP + ' resize-none text-xs'} />
                      </div>
                      <div>
                        <label className={LBL}>Card Layout</label>
                        <select value={catDraft.layout} onChange={e => setCatDraft(d => ({ ...d, layout: e.target.value as 'cards' | 'horizontal' }))} className={INP + ' cursor-pointer'}>
                          <option value="cards" className="bg-dark-900">Grid cards</option>
                          <option value="horizontal" className="bg-dark-900">Horizontal rows</option>
                        </select>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={saveEditCat} className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-blue-600 text-white rounded font-semibold hover:bg-blue-500 transition-colors">
                          <Check size={10} /> Save
                        </button>
                        <button onClick={() => setEditCatId(null)} className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white border border-white/[0.08] rounded transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>

                  ) : (
                    /* ── Category row ───────────────────────── */
                    <div
                      onClick={() => { setActiveCat(cat.id); setEditingPlan(null) }}
                      className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                        activeCat === cat.id
                          ? 'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500/50'
                          : 'text-slate-400 hover:bg-white/[0.03] hover:text-white border-l-2 border-transparent'
                      }`}
                    >
                      <span className="flex-1 text-[13px] font-medium truncate">{cat.label}</span>
                      <span className="text-[10px] text-slate-600 font-mono flex-shrink-0">
                        {plans.filter(p => p.category === cat.id).length}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); moveCat(cat.id, -1) }}
                          disabled={i === 0}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); moveCat(cat.id, 1) }}
                          disabled={i === categories.length - 1}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setEditCatId(cat.id); setCatDraft({ ...cat }) }}
                          className="p-0.5 text-slate-500 hover:text-blue-400 transition-colors rounded"
                        >
                          <Pencil size={11} />
                        </button>
                        {armedCat === cat.id ? (
                          <>
                            <button onClick={e => { e.stopPropagation(); deleteCategory(cat.id) }} className="px-1 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10 rounded transition-all">
                              Yes
                            </button>
                            <button onClick={e => { e.stopPropagation(); setArmedCat(null) }} className="px-1 py-0.5 text-[10px] text-slate-500 hover:text-white rounded transition-colors">
                              No
                            </button>
                          </>
                        ) : (
                          <button onClick={e => { e.stopPropagation(); setArmedCat(cat.id) }} className="p-0.5 text-slate-600 hover:text-red-400 transition-colors rounded">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add category form */}
            {addingCat && (
              <div className="p-3 border-t border-white/[0.06] space-y-2.5 bg-white/[0.01]">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">New Category</p>
                <div>
                  <label className={LBL}>ID (slug) *</label>
                  <input value={catDraft.id} onChange={e => setCatDraft(d => ({ ...d, id: e.target.value }))} placeholder="my-category" className={INP} />
                </div>
                <div>
                  <label className={LBL}>Label *</label>
                  <input value={catDraft.label} onChange={e => setCatDraft(d => ({ ...d, label: e.target.value }))} placeholder="My Category" className={INP} />
                </div>
                <div>
                  <label className={LBL}>Description</label>
                  <input value={catDraft.description} onChange={e => setCatDraft(d => ({ ...d, description: e.target.value }))} placeholder="What this covers" className={INP} />
                </div>
                <div>
                  <label className={LBL}>Disclaimer</label>
                  <input value={catDraft.disclaimer} onChange={e => setCatDraft(d => ({ ...d, disclaimer: e.target.value }))} placeholder="Pricing note" className={INP} />
                </div>
                <div>
                  <label className={LBL}>Layout</label>
                  <select value={catDraft.layout} onChange={e => setCatDraft(d => ({ ...d, layout: e.target.value as 'cards' | 'horizontal' }))} className={INP + ' cursor-pointer'}>
                    <option value="cards" className="bg-dark-900">Grid cards</option>
                    <option value="horizontal" className="bg-dark-900">Horizontal rows</option>
                  </select>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={addCategory} className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-blue-600 text-white rounded font-semibold hover:bg-blue-500 transition-colors">
                    <Plus size={10} /> Add
                  </button>
                  <button onClick={() => { setAddingCat(false); setCatDraft(BLANK_CAT()) }} className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white border border-white/[0.08] rounded transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Plans ────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {activeCatObj?.label ?? '—'}
                <span className="text-slate-600 ml-1.5 text-xs font-mono">({catPlans.length})</span>
              </span>
              {!editingPlan && activeCat && (
                <button
                  onClick={() => setEditingPlan(BLANK_PLAN(activeCat))}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/15 border border-blue-500/25 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/25 transition-all"
                >
                  <Plus size={13} /> Add Plan
                </button>
              )}
            </div>

            <div className="p-5">
              {/* ── Plan editor form ────────────────────────── */}
              {editingPlan ? (
                <PlanEditor
                  plan={editingPlan}
                  categories={categories}
                  onSave={savePlan}
                  onCancel={() => setEditingPlan(null)}
                />

              ) : catPlans.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <p className="text-sm">No plans in this category.</p>
                  <button
                    onClick={() => setEditingPlan(BLANK_PLAN(activeCat))}
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                  >
                    + Add first plan
                  </button>
                </div>

              ) : (
                /* ── Plan list ──────────────────────────────── */
                <div className="space-y-2">
                  {catPlans.map((plan, i) => {
                    const PlanIcon = ICON_MAP[plan.iconName] ?? Code2
                    return (
                      <div
                        key={plan.id}
                        className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all"
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${PLAN_ICON_CLS[plan.color] ?? PLAN_ICON_CLS.glass}`}>
                          <PlanIcon size={15} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white truncate">{plan.name}</span>
                            {plan.featured && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-mono leading-none">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-slate-400">{plan.price}</span>
                            <span className="text-slate-700">·</span>
                            <span>{plan.features.length} features</span>
                            {plan.notIncluded.length > 0 && (
                              <><span className="text-slate-700">·</span><span>{plan.notIncluded.length} excluded</span></>
                            )}
                            <span className="text-slate-700">·</span>
                            <span className="text-slate-600">{plan.subtitle}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => movePlan(plan.id, -1)} disabled={i === 0}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                            <ChevronUp size={14} />
                          </button>
                          <button onClick={() => movePlan(plan.id, 1)} disabled={i === catPlans.length - 1}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors rounded">
                            <ChevronDown size={14} />
                          </button>
                          <button onClick={() => setEditingPlan({ ...plan })}
                            className="p-1 text-slate-500 hover:text-blue-400 transition-colors rounded">
                            <Pencil size={14} />
                          </button>
                          {armedPlan === plan.id ? (
                            <>
                              <button onClick={() => deletePlan(plan.id)}
                                className="px-1.5 py-0.5 text-[11px] text-red-400 hover:bg-red-500/10 rounded transition-all">Yes</button>
                              <button onClick={() => setArmedPlan(null)}
                                className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-white rounded transition-colors">No</button>
                            </>
                          ) : (
                            <button onClick={() => setArmedPlan(plan.id)}
                              className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
