'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Server, Database, Globe, Terminal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { skills as defaultSkills, type Skill } from '@/data/skills'
import type { SkillItem } from '@/lib/content-types'

const ICONS: Record<string, LucideIcon> = {
  'java':             Code2,
  'mc-plugins':       Server,
  'backend-systems':  Database,
  'web-development':  Globe,
  'automation':       Terminal,
}

const ACCENT: Record<string, { bar: string; border: string; glow: string; icon: string }> = {
  'java':            { bar: 'from-blue-500    to-blue-400',    border: 'hover:border-blue-500/40',    glow: 'hover:shadow-[0_0_28px_rgba(59,130,246,0.14)]',    icon: 'group-hover:text-blue-400'    },
  'mc-plugins':      { bar: 'from-emerald-500 to-emerald-400', border: 'hover:border-emerald-500/40', glow: 'hover:shadow-[0_0_28px_rgba(16,185,129,0.14)]',    icon: 'group-hover:text-emerald-400' },
  'backend-systems': { bar: 'from-indigo-500  to-indigo-400',  border: 'hover:border-indigo-500/40',  glow: 'hover:shadow-[0_0_28px_rgba(99,102,241,0.14)]',    icon: 'group-hover:text-indigo-400'  },
  'web-development': { bar: 'from-purple-500  to-purple-400',  border: 'hover:border-purple-500/40',  glow: 'hover:shadow-[0_0_28px_rgba(168,85,247,0.14)]',    icon: 'group-hover:text-purple-400'  },
  'automation':      { bar: 'from-cyan-500    to-cyan-400',    border: 'hover:border-cyan-500/40',    glow: 'hover:shadow-[0_0_28px_rgba(6,182,212,0.14)]',     icon: 'group-hover:text-cyan-400'    },
}

const STATUS_COLOR: Record<string, string> = {
  Expert:     'text-green-400  bg-green-400/10  border-green-400/20',
  Advanced:   'text-blue-400   bg-blue-400/10   border-blue-400/20',
  Proficient: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Learning:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

function SkillCard({ skill, barVisible }: { skill: Skill; barVisible: boolean }) {
  const Icon = ICONS[skill.id] ?? Code2
  const a    = ACCENT[skill.id] ?? ACCENT['java']

  return (
    <div className={`
      flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.025]
      backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 group h-full
      ${a.border} ${a.glow}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 transition-colors shrink-0 ${a.icon}`}>
            <Icon size={17} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white leading-tight">{skill.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-1 ${STATUS_COLOR[skill.status]}`}>
              {skill.status}
            </span>
          </div>
        </div>
        <span className="text-[22px] font-black text-white/10 font-mono leading-none shrink-0 ml-2 tabular-nums">
          {skill.percentage}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${a.bar}`}
            initial={{ width: 0 }}
            animate={{ width: barVisible ? `${skill.percentage}%` : 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        <div className="flex justify-end mt-1.5">
          <span className="text-[10px] text-slate-600 font-mono">{skill.percentage}%</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-slate-500 leading-relaxed mb-4 flex-1">{skill.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {skill.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.05] text-[10px] text-slate-400 font-mono">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

export default function Skills({ skills: skillsProp }: { skills?: SkillItem[] }) {
  const skills = (skillsProp ?? defaultSkills) as Skill[]
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section id="skills" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.05),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">Technical Stack</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Skill <span className="gradient-text">telemetry.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Real proficiency levels — no inflated bars. Every percentage reflects production experience.
          </p>
        </div>

        {/* Cards — all 5 in a single row on XL, balanced 3+2 on LG */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <SkillCard skill={skill} barVisible={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
