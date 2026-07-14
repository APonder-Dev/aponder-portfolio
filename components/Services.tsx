'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Puzzle, Wrench, RefreshCw, Layers, LayoutGrid,
  TrendingUp, Terminal, Globe, Code2, Server, Database, Cpu, Shield,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { services as defaultServices, type Service } from '@/data/services'
import type { ServiceItem } from '@/lib/content-types'

const ICON_MAP: Record<string, LucideIcon> = {
  puzzle:        Puzzle,
  wrench:        Wrench,
  'refresh-cw':  RefreshCw,
  layers:        Layers,
  layout:        LayoutGrid,
  'trending-up': TrendingUp,
  terminal:      Terminal,
  globe:         Globe,
  code:          Code2,
  server:        Server,
  database:      Database,
  cpu:           Cpu,
  shield:        Shield,
}

type ColorKey = 'blue' | 'orange' | 'cyan' | 'indigo' | 'purple' | 'emerald' | 'teal' | 'sky' | 'red' | 'green' | 'pink'

const COLOR: Record<ColorKey, { ring: string; bg: string; icon: string; dot: string }> = {
  blue:    { ring: 'border-blue-500/20    hover:border-blue-500/40',    bg: 'bg-blue-500/[0.07]',    icon: 'text-blue-400',    dot: 'bg-blue-400'    },
  orange:  { ring: 'border-orange-500/20  hover:border-orange-500/40',  bg: 'bg-orange-500/[0.07]',  icon: 'text-orange-400',  dot: 'bg-orange-400'  },
  cyan:    { ring: 'border-cyan-500/20    hover:border-cyan-500/40',    bg: 'bg-cyan-500/[0.07]',    icon: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  indigo:  { ring: 'border-indigo-500/20  hover:border-indigo-500/40',  bg: 'bg-indigo-500/[0.07]',  icon: 'text-indigo-400',  dot: 'bg-indigo-400'  },
  purple:  { ring: 'border-purple-500/20  hover:border-purple-500/40',  bg: 'bg-purple-500/[0.07]',  icon: 'text-purple-400',  dot: 'bg-purple-400'  },
  emerald: { ring: 'border-emerald-500/20 hover:border-emerald-500/40', bg: 'bg-emerald-500/[0.07]', icon: 'text-emerald-400', dot: 'bg-emerald-400' },
  teal:    { ring: 'border-teal-500/20    hover:border-teal-500/40',    bg: 'bg-teal-500/[0.07]',    icon: 'text-teal-400',    dot: 'bg-teal-400'    },
  sky:     { ring: 'border-sky-500/20     hover:border-sky-500/40',     bg: 'bg-sky-500/[0.07]',     icon: 'text-sky-400',     dot: 'bg-sky-400'     },
  red:     { ring: 'border-red-500/20     hover:border-red-500/40',     bg: 'bg-red-500/[0.07]',     icon: 'text-red-400',     dot: 'bg-red-400'     },
  green:   { ring: 'border-green-500/20   hover:border-green-500/40',   bg: 'bg-green-500/[0.07]',   icon: 'text-green-400',   dot: 'bg-green-400'   },
  pink:    { ring: 'border-pink-500/20    hover:border-pink-500/40',    bg: 'bg-pink-500/[0.07]',    icon: 'text-pink-400',    dot: 'bg-pink-400'    },
}

const DEFAULT_COLOR = COLOR.blue

function ServiceCard({ svc }: { svc: Service }) {
  const Icon = ICON_MAP[svc.icon] ?? Puzzle
  const c    = COLOR[svc.accentColor as ColorKey] ?? DEFAULT_COLOR

  return (
    <div
      className={`
        flex flex-col h-full rounded-xl border bg-white/[0.025] backdrop-blur-sm p-6
        transition-all duration-300 hover:-translate-y-1 group
        ${c.ring}
      `}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} ${c.icon} mb-5 transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={19} />
      </div>

      <h3 className="text-[14px] font-bold text-white mb-2 leading-snug">{svc.title}</h3>
      <p className="text-[12px] text-slate-500 leading-relaxed mb-5 flex-1">{svc.description}</p>

      <ul className="space-y-2 mb-5">
        {svc.features.map(f => (
          <li key={f} className="flex items-start gap-2">
            <div className={`mt-[5px] w-1 h-1 rounded-full shrink-0 ${c.dot}`} />
            <span className="text-[12px] text-slate-400">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
        className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${c.icon} hover:opacity-80`}
      >
        Get a Quote <ArrowRight size={12} />
      </button>
    </div>
  )
}

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0  },
}

export default function Services({ services: servicesProp }: { services?: ServiceItem[] }) {
  const services = (servicesProp ?? defaultServices) as Service[]
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="services" className="relative py-20 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(59,130,246,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">What I Build</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Services &amp; <span className="gradient-text">specializations.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            From a single utility plugin to a complete server ecosystem — scoped, built, and delivered clean.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <ServiceCard svc={svc} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
