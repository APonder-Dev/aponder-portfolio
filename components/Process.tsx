'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, FileText, Code2, TestTube, Rocket, ArrowRight } from 'lucide-react'
import type { ProcessStep } from '@/lib/content-types'
import { DEFAULT_PROCESS } from '@/lib/content-defaults'

const STEP_ICONS = [Search, FileText, Code2, TestTube, Rocket]

const STEPS_STATIC = [
  {
    n: '01',
    label: 'Discovery',
    Icon: Search,
    color: 'blue',
    title: 'Requirements & Scope',
    desc: 'We align on exactly what you need. I gather requirements, ask the right questions, and define the full scope before a single line of code is written.',
    detail: ['Goals & non-goals defined', 'Version & platform requirements', 'Timeline expectations', 'Delivery format agreed upon'],
  },
  {
    n: '02',
    label: 'Specification',
    Icon: FileText,
    color: 'cyan',
    title: 'PRD & Architecture',
    desc: 'I produce a Product Requirements Document with system design, command structure, config layout, database schema, and dependency map.',
    detail: ['Written PRD delivered', 'API & event mapping', 'Config YAML structure', 'Milestone plan created'],
  },
  {
    n: '03',
    label: 'Development',
    Icon: Code2,
    color: 'indigo',
    title: 'Iterative Build',
    desc: 'Development happens in milestones with progress updates at each stage. You stay informed — no radio silence between kickoff and delivery.',
    detail: ['Milestone-based progress', 'Clean architecture', 'Async-safe design', 'Code review checkpoints'],
  },
  {
    n: '04',
    label: 'Testing',
    Icon: TestTube,
    color: 'purple',
    title: 'QA & Validation',
    desc: 'Every plugin is tested on real Paper servers across targeted version ranges. Edge cases, concurrency issues, and config validation are all covered.',
    detail: ['Multi-version server testing', 'Load and concurrency checks', 'Config validation', 'Edge case coverage'],
  },
  {
    n: '05',
    label: 'Delivery',
    Icon: Rocket,
    color: 'emerald',
    title: 'Delivery & Support',
    desc: 'You receive the compiled JAR, full source code, config files, and documentation. 30-day support window included for post-launch questions.',
    detail: ['Source + compiled JAR', 'Full documentation', 'Setup walkthrough', '30-day support window'],
  },
]

const COLOR: Record<string, { text: string; bg: string; border: string; line: string }> = {
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/[0.1]',    border: 'border-blue-500/30',   line: 'from-blue-500/40'    },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/[0.1]',    border: 'border-cyan-500/30',   line: 'from-cyan-500/40'    },
  indigo:  { text: 'text-indigo-400',  bg: 'bg-indigo-500/[0.1]',  border: 'border-indigo-500/30', line: 'from-indigo-500/40'  },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/[0.1]',  border: 'border-purple-500/30', line: 'from-purple-500/40'  },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/[0.1]', border: 'border-emerald-500/30', line: 'from-emerald-500/40' },
}

export default function Process({ steps: stepsProp }: { steps?: ProcessStep[] }) {
  const steps = stepsProp ?? DEFAULT_PROCESS
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="process" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(6,182,212,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-4">How It Works</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            A process that <span className="gradient-text">ships.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Five clear stages from discovery to delivery. No guesswork, no surprises, no scope creep.
          </p>
        </div>

        {/* Desktop: horizontal timeline connector */}
        <div className="hidden lg:block relative mb-8" ref={ref}>
          <div className="absolute top-[28px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
          {steps.map((step, i) => {
            const c    = COLOR[step.color] ?? COLOR.blue
            const Icon = STEP_ICONS[i] ?? Rocket
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 hover:border-white/[0.1] hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Step number + icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} border ${c.border} ${c.text} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[28px] font-black leading-none opacity-10 font-mono ${c.text}`}>{step.n}</span>
                </div>

                {/* Label + title */}
                <span className={`text-[10px] font-semibold tracking-widest uppercase font-mono ${c.text} mb-1`}>
                  {step.label}
                </span>
                <h3 className="text-[14px] font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4 flex-1">{step.desc}</p>

                {/* Detail list */}
                <ul className="space-y-1.5">
                  {step.detail.map(d => (
                    <li key={d} className="flex items-start gap-2">
                      <div className={`mt-[5px] w-1 h-1 rounded-full shrink-0 ${c.text} opacity-60`} style={{ background: 'currentColor' }} />
                      <span className="text-[11px] text-slate-500">{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Step indicator line at bottom */}
                <div className={`absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r ${c.line} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm mb-5">Ready to start? Discovery calls are free — no commitment required.</p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Start the Process <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
