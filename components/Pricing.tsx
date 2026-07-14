'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Check, ArrowRight,
  Code2, Zap, Star, Crown, Package, Wrench, Settings, Layers, Globe,
  Server, Shield, Database, Terminal, Puzzle, RefreshCw, BarChart2,
  type LucideIcon,
} from 'lucide-react'
import { CATEGORIES, PLANS } from '@/data/pricing'
import type { PricingCategoryData, PricingPlanData } from '@/lib/content-types'

const ICON_MAP: Record<string, LucideIcon> = {
  Code2, Zap, Star, Crown, Package, Wrench, Settings, Layers, Globe,
  Server, Shield, Database, Terminal, Puzzle, RefreshCw, BarChart2,
}

function resolveIcon(plan: { Icon?: LucideIcon; iconName?: string }): LucideIcon {
  if (plan.Icon) return plan.Icon
  return ICON_MAP[plan.iconName ?? ''] ?? Code2
}

// COLOR MAP — border, icon badge, background tint per card
// 'glass' = fully transparent card (backdrop-blur + thin border only)
const COLOR: Record<string, { border: string; icon: string; bg: string; shadow: string; ring: string }> = {
  blue: {
    border: 'border-blue-500/20',
    icon:   'text-blue-400 bg-blue-500/10',
    bg:     'bg-blue-500/[0.03]',
    shadow: '',
    ring:   '',
  },
  cyan: {
    border: 'border-cyan-500/40',
    icon:   'text-cyan-400 bg-cyan-500/10',
    bg:     'bg-[rgba(6,182,212,0.04)]',
    shadow: 'shadow-[0_0_48px_rgba(6,182,212,0.15)]',
    ring:   'ring-1 ring-cyan-500/25',
  },
  indigo: {
    border: 'border-indigo-500/20',
    icon:   'text-indigo-400 bg-indigo-500/10',
    bg:     'bg-indigo-500/[0.03]',
    shadow: '',
    ring:   '',
  },
  purple: {
    border: 'border-purple-500/20',
    icon:   'text-purple-400 bg-purple-500/10',
    bg:     'bg-purple-500/[0.03]',
    shadow: '',
    ring:   '',
  },
  glass: {
    border: 'border-white/[0.08]',
    icon:   'text-slate-400 bg-white/[0.06]',
    bg:     'bg-transparent',
    shadow: '',
    ring:   '',
  },
}

function scrollToContact() {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
}

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
}

export default function Pricing({
  priceOverrides = {},
  dbCategories,
  dbPlans,
}: {
  priceOverrides?: Record<string, string>
  dbCategories?:  PricingCategoryData[]
  dbPlans?:       PricingPlanData[]
}) {
  // Use DB data when available, fall back to static defaults
  const useDb       = !!(dbCategories?.length && dbPlans?.length)
  const catEntries  = useDb
    ? dbCategories!.map(c => [c.id, c] as [string, PricingCategoryData])
    : Object.entries(CATEGORIES)
  const defaultCat  = catEntries[0]?.[0] ?? 'plugin-dev'

  const [activeCategory, setActiveCategory] = useState(defaultCat)
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const cat = useDb
    ? dbCategories!.find(c => c.id === activeCategory)
    : CATEGORIES[activeCategory]

  const filtered = useDb
    ? (dbPlans ?? []).filter(p => p.category === activeCategory)
    : PLANS.filter(p => p.category === activeCategory)

  const activeLayout = useDb
    ? (dbCategories!.find(c => c.id === activeCategory)?.layout ?? 'cards')
    : (activeCategory === 'sys-admin' ? 'horizontal' : 'cards')

  return (
    <section id="pricing" className="relative py-20 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(6,182,212,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-label justify-center mb-4">Investment</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Transparent <span className="gradient-text">pricing.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-xl mx-auto">
            Starting prices across all services. Every project is scoped individually — reach out for an accurate quote.
          </p>
        </div>

        {/* Category tabs */}
        <div ref={ref} className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {catEntries.map(([key, c]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                activeCategory === key
                  ? 'bg-blue-600 text-white shadow-[0_0_18px_rgba(59,130,246,0.4)]'
                  : 'text-slate-400 hover:text-white border border-white/[0.07] hover:border-blue-500/30 hover:bg-blue-500/[0.05]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Category description — remounts on key change to re-run entrance */}
        <motion.p
          key={activeCategory + '-desc'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center text-slate-500 text-[13px] mb-10"
        >
          {cat?.description}
        </motion.p>

        {/* Cards — horizontal layout for row-style categories, grid for others */}
        {activeLayout === 'horizontal' ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-5 max-w-4xl mx-auto"
          >
            {filtered.map((plan, i) => {
              const c        = COLOR[plan.color] ?? COLOR.glass
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const PlanIcon = resolveIcon(plan as any)
              return (
                <motion.div
                  key={plan.id}
                  custom={i}
                  variants={CARD_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className={`
                    relative flex flex-col sm:flex-row gap-8 rounded-2xl border backdrop-blur-sm p-7
                    transition-all duration-300
                    ${c.border} ${c.bg} ${c.shadow} ${c.ring}
                  `}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-[11px] font-bold text-white shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {/* Left: icon + name + price + CTA */}
                  <div className="flex flex-col justify-between sm:w-52 shrink-0">
                    <div>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.icon} mb-4`}>
                        <PlanIcon size={19} />
                      </div>
                      <h3 className="text-[18px] font-bold text-white leading-tight">{plan.name}</h3>
                      <p className="text-[12px] text-slate-500 mt-1">{plan.subtitle}</p>
                    </div>
                    <div className="mt-6">
                      <span className="text-[36px] font-black text-white leading-none">{priceOverrides[plan.id] ?? plan.price}</span>
                      <p className="text-[11px] text-slate-600 font-mono mt-1 mb-4">Fixed · per engagement</p>
                      <button
                        onClick={scrollToContact}
                        className={`
                          w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-300
                          ${plan.featured
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_32px_rgba(6,182,212,0.5)]'
                            : 'border border-white/[0.1] text-slate-300 hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]'}
                        `}
                      >
                        {plan.cta} <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden sm:block w-px bg-white/[0.06] self-stretch" />

                  {/* Right: features in 2 columns */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 content-start pt-1">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-[12px] text-slate-300">{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map(f => (
                      <div key={f} className="flex items-start gap-2 opacity-30">
                        <span className="text-slate-600 text-[12px] ml-0.5 shrink-0 mt-0.5">–</span>
                        <span className="text-[12px] text-slate-500 line-through">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto"
          >
            {filtered.map((plan, i) => {
              const c        = COLOR[plan.color] ?? COLOR.glass
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const PlanIcon = resolveIcon(plan as any)
              return (
                <motion.div
                  key={plan.id}
                  custom={i}
                  variants={CARD_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  className={`
                    relative flex flex-col rounded-2xl border backdrop-blur-sm p-5 lg:p-6
                    transition-all duration-300 hover:-translate-y-1
                    ${c.border} ${c.bg} ${c.shadow} ${c.ring}
                  `}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-[11px] font-bold text-white shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.icon}`}>
                      <PlanIcon size={19} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white">{plan.name}</h3>
                      <p className="text-[11px] text-slate-500">{plan.subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-[32px] font-black text-white leading-none">{priceOverrides[plan.id] ?? plan.price}</span>
                    <p className="text-[11px] text-slate-600 mt-1 font-mono">Starting price · scope may vary</p>
                  </div>

                  <div className="h-px bg-white/[0.05] mb-5" />

                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={13} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-[12px] text-slate-300">{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-start gap-2.5 opacity-35">
                        <span className="text-slate-600 mt-0.5 shrink-0 text-[12px] ml-0.5">–</span>
                        <span className="text-[12px] text-slate-500 line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={scrollToContact}
                    className={`
                      w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[13px] transition-all duration-300
                      ${plan.featured
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:shadow-[0_0_36px_rgba(6,182,212,0.5)]'
                        : 'border border-white/[0.1] text-slate-300 hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]'}
                    `}
                  >
                    {plan.cta} <ArrowRight size={14} />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Per-category disclaimer */}
        <motion.p
          key={activeCategory + '-disclaimer'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="text-center text-slate-600 text-[12px] mt-10 max-w-xl mx-auto leading-relaxed"
        >
          {cat?.disclaimer} Ongoing retainer arrangements available for teams.
        </motion.p>

      </div>
    </section>
  )
}
