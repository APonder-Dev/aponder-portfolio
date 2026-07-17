'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Server, Globe, Database, Terminal, Cpu } from 'lucide-react'
import AnimatedSection from './ui/AnimatedSection'
import type { AboutContent } from '@/lib/content-types'
import { DEFAULT_ABOUT } from '@/lib/content-defaults'

const SPEC_ICONS = [Code2, Cpu, Server, Globe, Terminal, Database]
const SPEC_COLORS = ['blue', 'cyan', 'indigo', 'purple', 'emerald', 'orange']

const BADGE: Record<string, string> = {
  blue:    'border-blue-500/20   bg-blue-500/[0.07]   text-blue-400',
  cyan:    'border-cyan-500/20   bg-cyan-500/[0.07]   text-cyan-400',
  indigo:  'border-indigo-500/20 bg-indigo-500/[0.07] text-indigo-400',
  purple:  'border-purple-500/20 bg-purple-500/[0.07] text-purple-400',
  emerald: 'border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400',
  orange:  'border-orange-500/20 bg-orange-500/[0.07] text-orange-400',
}

export default function About({ content }: { content?: AboutContent }) {
  const c = content ?? DEFAULT_ABOUT
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(99,102,241,0.05),transparent)]" />
      <div className="absolute inset-0 blueprint-grid opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-4">About APonder</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Engineered for{' '}
            <span className="gradient-text">real servers.</span>
          </h2>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: Profile card ────────────────────────── */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-8 overflow-hidden">
                {/* inner grid */}
                <div className="absolute inset-0 grid-bg opacity-60" />

                <div className="relative">
                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex flex-col items-center justify-center shadow-[0_0_32px_rgba(59,130,246,0.4)] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)' }} />
                      <span className="text-[10px] font-mono text-white/40 leading-none mb-0.5 tracking-widest select-none">&gt;_</span>
                      <span className="text-[22px] font-black text-white font-mono leading-none">AP</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-dark-950 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-900" />
                    </div>
                  </div>

                  <div className="text-center mb-7">
                    <h3 className="text-xl font-bold text-white">Anthony Ponder</h3>
                    <p className="text-sm text-slate-400 mt-1">Minecraft Plugin Developer &amp; Software Engineer</p>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {c.profileStats.map(s => (
                      <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3">
                        <div className="text-base font-bold text-white font-mono">{s.value}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Language bar */}
                  <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <p className="text-[11px] text-slate-600 font-mono mb-3 uppercase tracking-widest">Primary Stack</p>
                    <div className="space-y-2">
                      {[
                        { lang: 'Java', pct: 65, color: 'bg-blue-500'  },
                        { lang: 'SQL',  pct: 15, color: 'bg-cyan-500'  },
                        { lang: 'TS',   pct: 12, color: 'bg-indigo-500'},
                        { lang: 'Bash', pct:  8, color: 'bg-slate-500' },
                      ].map(item => (
                        <div key={item.lang} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 w-8 font-mono">{item.lang}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${item.color}`}
                              initial={{ width: 0 }}
                              animate={isInView ? { width: `${item.pct}%` } : { width: 0 }}
                              transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-slate-600 w-7 text-right">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              {c.openToWork && (
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-bold text-white shadow-lg">
                  Open to Work
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* ── Right: Content ────────────────────────────── */}
          <AnimatedSection direction="right">
            <div className="space-y-7">
              <div className="space-y-4 text-[15px] text-slate-400 leading-[1.8]">
                {c.bio.map((para, i) => <p key={i}>{para}</p>)}
              </div>

              {/* Spec cards */}
              <div className="grid grid-cols-2 gap-3">
                {c.specs.map((spec, i) => {
                  const Icon  = SPEC_ICONS[i] ?? Code2
                  const color = SPEC_COLORS[i] ?? 'blue'
                  return (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.07 }}
                    className={`rounded-xl border p-4 ${BADGE[color]} hover:-translate-y-0.5 transition-transform duration-300 cursor-default`}
                  >
                    <Icon size={16} className="mb-2 shrink-0" />
                    <div className="text-[13px] font-semibold text-white">{spec.label}</div>
                    <div className="text-[11px] opacity-65 mt-0.5 leading-snug">{spec.desc}</div>
                  </motion.div>
                  )
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
