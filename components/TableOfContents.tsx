'use client'

import { useEffect, useState } from 'react'

export interface Heading {
  level: number
  text:  string
  slug:  string
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const els = headings
      .map(h => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[]

    if (els.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents">
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">On this page</p>
      <ul className="space-y-1.5">
        {headings.map(h => (
          <li key={h.slug} style={{ paddingLeft: h.level === 3 ? '0.75rem' : '0' }}>
            <a
              href={`#${h.slug}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(h.slug)?.scrollIntoView({ behavior: 'smooth' })
                setActive(h.slug)
              }}
              className={`block text-[12px] leading-snug transition-colors py-0.5 border-l-2 pl-3 ${
                active === h.slug
                  ? 'border-blue-500 text-blue-400'
                  : 'border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
