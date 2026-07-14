'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Quote, Star, ExternalLink } from 'lucide-react'
import type { TestimonialItem } from '@/lib/content-types'
import { DEFAULT_TESTIMONIALS } from '@/lib/content-defaults'

const ACCENT: Record<string, { grad: string; ring: string; tag: string }> = {
  orange:  { grad: 'from-orange-500 to-amber-500',   ring: 'shadow-[0_0_24px_rgba(249,115,22,0.25)]',  tag: 'text-orange-400  bg-orange-400/10  border-orange-400/20'  },
  amber:   { grad: 'from-amber-500 to-yellow-500',   ring: 'shadow-[0_0_24px_rgba(245,158,11,0.25)]',  tag: 'text-amber-400   bg-amber-400/10   border-amber-400/20'   },
  blue:    { grad: 'from-blue-500 to-cyan-500',      ring: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]',  tag: 'text-blue-400    bg-blue-400/10    border-blue-400/20'    },
  cyan:    { grad: 'from-cyan-500 to-blue-500',      ring: 'shadow-[0_0_24px_rgba(6,182,212,0.25)]',   tag: 'text-cyan-400    bg-cyan-400/10    border-cyan-400/20'    },
  emerald: { grad: 'from-emerald-500 to-teal-500',   ring: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]',  tag: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  teal:    { grad: 'from-teal-500 to-cyan-500',      ring: 'shadow-[0_0_24px_rgba(20,184,166,0.25)]',  tag: 'text-teal-400    bg-teal-400/10    border-teal-400/20'    },
  indigo:  { grad: 'from-indigo-500 to-blue-500',    ring: 'shadow-[0_0_24px_rgba(99,102,241,0.25)]',  tag: 'text-indigo-400  bg-indigo-400/10  border-indigo-400/20'  },
  purple:  { grad: 'from-purple-500 to-indigo-500',  ring: 'shadow-[0_0_24px_rgba(168,85,247,0.25)]',  tag: 'text-purple-400  bg-purple-400/10  border-purple-400/20'  },
  rose:    { grad: 'from-rose-500 to-pink-500',      ring: 'shadow-[0_0_24px_rgba(244,63,94,0.25)]',   tag: 'text-rose-400    bg-rose-400/10    border-rose-400/20'    },
  slate:   { grad: 'from-slate-500 to-slate-600',    ring: 'shadow-[0_0_16px_rgba(100,116,139,0.2)]',  tag: 'text-slate-400   bg-slate-400/10   border-slate-400/20'   },
}
const ACCENT_FALLBACK = ACCENT.blue

export default function Testimonials({ testimonials }: { testimonials?: TestimonialItem[] }) {
  const items    = testimonials ?? DEFAULT_TESTIMONIALS
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  if (items.length === 0) return null

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.04),transparent)]" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">Client Reviews</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Don&apos;t take{' '}
            <span className="gradient-text">my word for it.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Real feedback from server owners I&apos;ve built for.
          </p>
        </div>

        {/* Cards */}
        <div ref={ref} className={`grid gap-6 ${items.length === 1 ? 'max-w-lg mx-auto' : 'sm:grid-cols-2 sm:items-stretch'}`}>
          {items.map((t, i) => {
            const a = ACCENT[t.color] ?? ACCENT_FALLBACK
            return (
              <motion.div
                key={t.server}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col h-full rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm p-7 hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote size={22} className="text-white/20 mb-5 shrink-0" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-[14px] text-slate-300 leading-[1.8] flex-1 mb-7">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.grad} ${a.ring} flex items-center justify-center text-[11px] font-black text-white shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{t.author}</div>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-0.5 ${a.tag}`}>
                        {t.server}
                      </div>
                    </div>
                  </div>

                  {/* Discord link */}
                  <a
                    href={t.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors duration-200 font-mono shrink-0"
                  >
                    Discord <ExternalLink size={10} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Social proof note */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="text-center text-[11px] text-slate-600 font-mono mt-10 tracking-wide"
        >
          All reviews sourced directly from Discord DMs · unedited
        </motion.p>
      </div>
    </section>
  )
}
