'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ChevronDown, Download, Terminal, Shield, Code, Globe, Zap } from 'lucide-react'
import type { HeroContent } from '@/lib/content-types'
import { DEFAULT_HERO } from '@/lib/content-defaults'

/* ── Terminal animation data ─────────────────────────────── */
const LINES = [
  { id: 0,  text: '$ cat skills.toml',          type: 'cmd',     delay: 200  },
  { id: 1,  text: '',                            type: 'gap',     delay: 450  },
  { id: 2,  text: '[backend]',                   type: 'section', delay: 650  },
  { id: 3,  text: 'java = 95',                   type: 'val',     delay: 900,  skill: 'Java',      pct: 95 },
  { id: 4,  text: 'minecraft_plugins = 95',      type: 'val',     delay: 1350, skill: 'MC Plugins', pct: 95 },
  { id: 5,  text: 'backend_systems = 90',        type: 'val',     delay: 1800, skill: 'Backend',   pct: 90 },
  { id: 6,  text: '',                            type: 'gap',     delay: 2100 },
  { id: 7,  text: '[web_and_tools]',             type: 'section', delay: 2300 },
  { id: 8,  text: 'web_development = 85',        type: 'val',     delay: 2550, skill: 'Web Dev',   pct: 85 },
  { id: 9,  text: 'automation = 80',             type: 'val',     delay: 2950, skill: 'Automation', pct: 80 },
]

const STAT_ICONS = [Code, Shield, Zap, Globe]

/* ── ASCII-style skill bar ───────────────────────────────── */
function SkillBar({ label, pct, visible }: { label: string; pct: number; visible: boolean }) {
  const filled = Math.round((pct / 100) * 18)
  const empty  = 18 - filled
  return (
    <div className="flex items-center gap-2 text-[11px] mt-1 ml-4 font-mono">
      <span className="text-slate-500 w-[72px] shrink-0 truncate">{label}</span>
      <span className="text-cyan-400">
        {'['}
        <span className="text-blue-400">{visible ? '█'.repeat(filled) : ''}</span>
        <span className="text-slate-700">{'░'.repeat(visible ? empty : 18)}</span>
        {']'}
      </span>
      <span className="text-slate-500">{pct}%</span>
    </div>
  )
}

/* ── Terminal card ───────────────────────────────────────── */
function TerminalCard() {
  const [visible,   setVisible]   = useState<Set<number>>(new Set())
  const [animated,  setAnimated]  = useState<Set<number>>(new Set())
  const [cursor,    setCursor]    = useState(true)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    LINES.forEach(line => {
      timers.push(setTimeout(() => setVisible(s => new Set([...s, line.id])), line.delay))
      if (line.pct) {
        timers.push(setTimeout(() => setAnimated(s => new Set([...s, line.id])), line.delay + 450))
      }
    })
    const lastDelay = LINES[LINES.length - 1].delay + 600
    timers.push(setTimeout(() => setDone(true), lastDelay))

    const blink = setInterval(() => setCursor(p => !p), 530)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(blink)
    }
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-blue-500/20 bg-[#090e1a] font-mono text-sm shadow-[0_0_48px_rgba(59,130,246,0.15),0_0_96px_rgba(59,130,246,0.06)] scanlines">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.015]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="flex-1 text-center text-[11px] text-slate-600">~/aponder — bash</span>
        <Terminal size={12} className="text-slate-700" />
      </div>

      {/* Body */}
      <div className="p-5 min-h-[290px] space-y-0.5">
        {LINES.map(line => (
          <div
            key={line.id}
            className={`transition-all duration-300 ${visible.has(line.id) ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
          >
            {line.type === 'cmd' && (
              <div className="flex items-center gap-2">
                <span className="text-green-400">❯</span>
                <span className="text-white">{line.text}</span>
              </div>
            )}
            {line.type === 'section' && (
              <div className="text-cyan-400 mt-2 text-[12px]">{line.text}</div>
            )}
            {line.type === 'val' && (
              <div>
                <span className="text-slate-300 text-[12px]">{line.text}</span>
                {line.pct && (
                  <SkillBar label={line.skill!} pct={line.pct} visible={animated.has(line.id)} />
                )}
              </div>
            )}
            {line.type === 'gap' && <div className="h-1" />}
          </div>
        ))}

        {done && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-400">❯</span>
            <span
              className={`inline-block w-[7px] h-[15px] bg-blue-400 transition-opacity duration-100 ${cursor ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] bg-white/[0.01] text-[11px]">
        <span className="text-slate-600 font-mono">Java 17/21/25 · Spigot · Paper · Folia</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[status-pulse_2s_ease-in-out_infinite]" />
          <span className="text-green-400/70">Available</span>
        </div>
      </div>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────── */
export default function Hero({
  content,
  available    = true,
  availableMsg = 'Available for Projects',
  resumeUrl,
  calUrl,
}: {
  content?:      HeroContent
  available?:    boolean
  availableMsg?: string
  resumeUrl?:    string
  calUrl?:       string
}) {
  const c = content ?? DEFAULT_HERO
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial glow at top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(59,130,246,0.1),transparent)]" />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 -left-48 w-[480px] h-[480px] rounded-full bg-blue-500/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-[480px] h-[480px] rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                available
                  ? 'border-green-500/20 bg-green-500/[0.06]'
                  : 'border-orange-500/20 bg-orange-500/[0.06]'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-400 animate-[status-pulse_2s_ease-in-out_infinite]' : 'bg-orange-400'}`} />
              <span className={`text-[13px] font-medium tracking-wide ${available ? 'text-green-400' : 'text-orange-400'}`}>
                {availableMsg}
              </span>
            </motion.div>

            {/* Meta */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-mono text-[11px] text-slate-600 tracking-[0.2em] uppercase"
            >
              {c.metaLine}
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="text-5xl sm:text-6xl xl:text-[72px] font-black leading-[0.92] tracking-tight"
            >
              <span className="block text-white">{c.headline[0]}</span>
              <span className="block gradient-text">{c.headline[1]}</span>
              <span className="block text-white mt-1">{c.headline[2]}</span>
              <span className="block text-slate-400">{c.headline[3]}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-[17px] text-slate-400 leading-[1.7] max-w-[520px]"
            >
              {c.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[14px] text-white
                  bg-gradient-to-r from-blue-600 to-cyan-600
                  hover:from-blue-500 hover:to-cyan-500
                  shadow-[0_0_28px_rgba(59,130,246,0.35)]
                  hover:shadow-[0_0_40px_rgba(59,130,246,0.55)]
                  hover:-translate-y-0.5 transition-all duration-300"
              >
                {c.cta1Label} <ArrowRight size={15} />
              </a>
              <a
                href="#projects"
                onClick={e => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[14px] text-slate-300
                  border border-white/[0.1]
                  hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]
                  transition-all duration-300"
              >
                {c.cta2Label} <ChevronDown size={15} />
              </a>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[14px] text-slate-300
                    border border-white/[0.1]
                    hover:border-cyan-500/35 hover:text-cyan-300 hover:bg-cyan-500/[0.04]
                    transition-all duration-300"
                >
                  <Download size={15} /> Resume
                </a>
              )}
              {calUrl && (
                <a
                  href={calUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[14px] text-slate-300
                    border border-white/[0.1]
                    hover:border-emerald-500/35 hover:text-emerald-300 hover:bg-emerald-500/[0.04]
                    transition-all duration-300"
                >
                  Book a Call
                </a>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="h-px bg-gradient-to-r from-blue-500/25 via-cyan-500/15 to-transparent origin-left"
            />
          </div>

          {/* ── Right — Terminal ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative"
          >
            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-9 h-9 border-t-[1.5px] border-l-[1.5px] border-blue-500/30 rounded-tl-xl pointer-events-none" />
            <div className="absolute -top-3 -right-3 w-9 h-9 border-t-[1.5px] border-r-[1.5px] border-cyan-500/30 rounded-tr-xl pointer-events-none" />
            <div className="absolute -bottom-3 -left-3 w-9 h-9 border-b-[1.5px] border-l-[1.5px] border-cyan-500/30 rounded-bl-xl pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-9 h-9 border-b-[1.5px] border-r-[1.5px] border-blue-500/30 rounded-br-xl pointer-events-none" />

            {/* Ambient float */}
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-blue-500/8 blur-2xl animate-[float_6s_ease-in-out_infinite] pointer-events-none" />

            <TerminalCard />
          </motion.div>
        </div>

        {/* ── Stats strip ───────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {c.stats.map((stat, i) => {
            const Icon = STAT_ICONS[i] ?? Code
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.7 + i * 0.08 }}
                className="rounded-xl p-4 border border-white/[0.06] bg-white/[0.02] group hover:border-blue-500/25 hover:bg-blue-500/[0.03] transition-all duration-300"
              >
                <Icon size={17} className="text-blue-400/50 mb-2.5 group-hover:text-blue-400 transition-colors" />
                <div className="text-[15px] font-bold text-white font-mono leading-tight">{stat.value}</div>
                <div className="text-[11px] text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-slate-700 tracking-[0.2em] uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-blue-500/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
