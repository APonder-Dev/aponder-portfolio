'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { FAQItem } from '@/lib/content-types'
import { DEFAULT_FAQS } from '@/lib/content-defaults'

const STATIC_FAQS: FAQItem[] = [
  {
    q: 'Do you work under NDA?',
    a: 'Yes. Confidential builds are common — I offer a standard NDA on request at no extra cost. Your plugin\'s source, design, and features stay private. I will never publish, resell, or reference your project without written permission.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'PayPal, Venmo, CashApp, and select crypto. New clients pay 50% upfront with the remainder on delivery. Projects under $30 are typically paid in full upfront. I do not begin work until the deposit is confirmed.',
  },
  {
    q: 'Do you offer revisions?',
    a: 'Yes — bug fixes and minor adjustments are included within your plan\'s support window at no charge. Scope additions (new commands, new GUI screens, new database tables) are quoted separately before any work begins.',
  },
  {
    q: 'Can I resell the plugin?',
    a: 'Full Resale Rights are included exclusively with the Production Grade plan. All other tiers license the plugin for personal server use only. If you want to sell on SpigotMC, Polymart, or BuiltByBit, the Production Grade tier is the right fit — it also includes marketplace-ready packaging and documentation.',
  },
  {
    q: 'How long does development take?',
    a: 'Simple utility plugins ship in 1–3 days. Advanced plugins with GUI systems and databases typically take 3–7 days. Complex multi-feature systems or full server tools take 1–3 weeks. A timeline estimate is always provided before work begins. Rush delivery is available for a surcharge.',
  },
  {
    q: 'What Minecraft platforms do you target?',
    a: 'Paper, Spigot, Purpur, and Folia. Multi-version builds from 1.18.2 through the latest release are available on Premium and above. Folia (regional multithreading) support can be added to any plan — just mention it in your inquiry.',
  },
  {
    q: 'Do I receive the source code?',
    a: 'Advanced and lower tiers deliver a compiled JAR. Premium, Production Grade, and most higher-tier service plans include full source code. The feature list on each pricing card is explicit about what\'s included — no surprises.',
  },
  {
    q: 'What if something breaks after delivery?',
    a: 'Every plan includes a support window. Bugs and compatibility issues within that window are fixed at no charge. After the window closes, continued support can be arranged on a per-hour or retainer basis. Minecraft API breakage caused by a major version update is always covered regardless of window.',
  },
]

function FAQCard({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`rounded-xl border transition-all duration-200 ${
        open
          ? 'border-blue-500/25 bg-blue-500/[0.04]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
      }`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[14px] font-semibold text-white leading-snug">{item.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-blue-400' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[13px] text-slate-400 leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ({ faqs: faqsProp }: { faqs?: FAQItem[] }) {
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const faqs = faqsProp ?? DEFAULT_FAQS
  const half = Math.ceil(faqs.length / 2)
  const col1 = faqs.slice(0, half)
  const col2 = faqs.slice(half)

  return (
    <section id="faq" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-4">FAQ</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Common <span className="gradient-text">questions.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Everything you'd want to know before reaching out — answered up front.
          </p>
        </div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-3 max-w-5xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-3">
            {isInView && col1.map((item, i) => (
              <FAQCard key={item.q} item={item} index={i} />
            ))}
          </div>
          {/* Column 2 */}
          <div className="space-y-3">
            {isInView && col2.map((item, i) => (
              <FAQCard key={item.q} item={item} index={i + half} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12"
        >
          <HelpCircle size={15} className="text-slate-600" />
          <p className="text-slate-500 text-sm">
            Still have questions?{' '}
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
            >
              Send me a message
            </button>{' '}
            and I&apos;ll reply within 24 hours.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
