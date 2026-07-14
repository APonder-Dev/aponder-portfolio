'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Server, Users, ShoppingBag, Package, Layers, Globe, ArrowRight } from 'lucide-react'

const CARDS = [
  {
    Icon:  Server,
    title: 'Minecraft Server Owners',
    color: 'blue',
    problem:  'Off-the-shelf plugins rarely fit your exact gameplay loop or server identity.',
    solution: 'Custom plugins built precisely to your specs — your config structure, your UX, your vision.',
    deliverables: ['Full plugin source', 'YAML config system', 'Admin command suite', 'Setup documentation'],
    cta: 'Start a Plugin',
  },
  {
    Icon:  Users,
    title: 'Survival / SMP Networks',
    color: 'emerald',
    problem:  'SMP servers need unique mechanics that keep long-term players engaged and returning.',
    solution: 'Relics, contracts, bounties, progression systems — custom gameplay loops that define your server.',
    deliverables: ['Custom game mechanics', 'Player progression', 'Economy integrations', 'Anti-exploit design'],
    cta: 'Design My SMP',
  },
  {
    Icon:  ShoppingBag,
    title: 'Economy Servers',
    color: 'cyan',
    problem:  'Generic economy plugins create boring, broken, or exploited market systems.',
    solution: 'Deep Vault-integrated economy plugins with anti-exploit protection, logging, and full config control.',
    deliverables: ['Vault integration', 'Trade & coinflip systems', 'Transaction logs', 'Balance monitoring'],
    cta: 'Build My Economy',
  },
  {
    Icon:  Package,
    title: 'Plugin Marketplaces',
    color: 'purple',
    problem:  'Premium plugin marketplaces need polished, well-documented, production-stable products.',
    solution: 'Marketplace-ready plugins with full docs, clean configs, version support, and professional packaging.',
    deliverables: ['SpigotMC / Polymart ready', 'Full documentation', 'Demo server config', 'Version matrix'],
    cta: 'Create a Product',
  },
  {
    Icon:  Layers,
    title: 'Private Server Projects',
    color: 'indigo',
    problem:  'Private networks need confidential, exclusive systems that competitors can\'t replicate.',
    solution: 'NDA-protected private builds with source code delivery, no public release, and full ownership transfer.',
    deliverables: ['Private source delivery', 'NDA available', 'Server-locked options', 'Ongoing retainer'],
    cta: 'Go Private',
  },
  {
    Icon:  Globe,
    title: 'Web & Portfolio Clients',
    color: 'sky',
    problem:  'Minecraft developers and server owners need professional web presences that match their brand.',
    solution: 'Next.js portfolio and plugin store websites — fast, SEO-friendly, and built to convert visitors.',
    deliverables: ['Next.js 14 + TypeScript', 'Mobile-first design', 'SEO & Open Graph', 'VPS deployment'],
    cta: 'Build My Site',
  },
]

const COLOR: Record<string, { border: string; icon: string; cta: string; glow: string }> = {
  blue:    { border: 'border-blue-500/15   hover:border-blue-500/35',   icon: 'text-blue-400',    cta: 'text-blue-400   hover:text-blue-300',   glow: 'hover:shadow-[0_0_28px_rgba(59,130,246,0.12)]'  },
  cyan:    { border: 'border-cyan-500/15   hover:border-cyan-500/35',   icon: 'text-cyan-400',    cta: 'text-cyan-400   hover:text-cyan-300',   glow: 'hover:shadow-[0_0_28px_rgba(6,182,212,0.12)]'   },
  emerald: { border: 'border-emerald-500/15 hover:border-emerald-500/35', icon: 'text-emerald-400', cta: 'text-emerald-400 hover:text-emerald-300', glow: 'hover:shadow-[0_0_28px_rgba(16,185,129,0.12)]' },
  purple:  { border: 'border-purple-500/15 hover:border-purple-500/35', icon: 'text-purple-400',  cta: 'text-purple-400 hover:text-purple-300', glow: 'hover:shadow-[0_0_28px_rgba(168,85,247,0.12)]' },
  indigo:  { border: 'border-indigo-500/15 hover:border-indigo-500/35', icon: 'text-indigo-400',  cta: 'text-indigo-400 hover:text-indigo-300', glow: 'hover:shadow-[0_0_28px_rgba(99,102,241,0.12)]' },
  sky:     { border: 'border-sky-500/15    hover:border-sky-500/35',    icon: 'text-sky-400',     cta: 'text-sky-400    hover:text-sky-300',    glow: 'hover:shadow-[0_0_28px_rgba(14,165,233,0.12)]'  },
}

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Audience() {
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section id="audience" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_60%,rgba(6,182,212,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-4">Who I Work With</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Built for{' '}
            <span className="gradient-text">your server.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-xl mx-auto leading-relaxed">
            Whether you run a private SMP or a commercial marketplace — I deliver production-ready solutions sized for your exact situation.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, i) => {
            const c = COLOR[card.color]
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`
                  relative rounded-xl border bg-white/[0.02] backdrop-blur-sm p-6
                  transition-all duration-300 hover:-translate-y-1 group cursor-default
                  ${c.border} ${c.glow}
                `}
              >
                {/* Icon */}
                <div className={`${c.icon} mb-4`}>
                  <card.Icon size={22} />
                </div>

                <h3 className="text-[15px] font-bold text-white mb-2">{card.title}</h3>

                {/* Problem / Solution */}
                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest font-mono">Problem</span>
                    <p className="text-[13px] text-slate-400 mt-0.5 leading-relaxed">{card.problem}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest font-mono">Solution</span>
                    <p className="text-[13px] text-slate-400 mt-0.5 leading-relaxed">{card.solution}</p>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mb-5">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest font-mono">Deliverables</span>
                  <ul className="mt-2 space-y-1">
                    {card.deliverables.map(d => (
                      <li key={d} className="flex items-center gap-2 text-[12px] text-slate-400">
                        <div className={`w-1 h-1 rounded-full shrink-0 ${c.icon}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  onClick={() => scrollTo('#contact')}
                  className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-200 ${c.cta}`}
                >
                  {card.cta} <ArrowRight size={13} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
