'use client'

import { useEffect, useState } from 'react'
import { Terminal, ArrowUpRight } from 'lucide-react'
import type { ContactContent, FooterLink } from '@/lib/content-types'
import { DEFAULT_CONTACT, DEFAULT_FOOTER_LINKS } from '@/lib/content-defaults'
import { footerIcon } from '@/lib/footer-icons'

const QUICK_LINKS = [
  { label: 'Blog',            href: '/blog',                           external: false },
  { label: 'GitHub',          href: 'https://github.com/APonder-Dev',  external: true  },
  { label: 'FadedCloud LLC',  href: 'https://github.com/FadedCloud-LLC', external: true },
  { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/aponder.dev', external: true },
]

export default function Footer({ contact: contactProp }: { contact?: ContactContent }) {
  const ct = contactProp ?? DEFAULT_CONTACT
  const [links, setLinks] = useState<FooterLink[]>(
    DEFAULT_FOOTER_LINKS.map(l => (l.id === 'email' ? { ...l, url: `mailto:${ct.email}` } : l))
  )

  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then((data: FooterLink[]) => { if (Array.isArray(data) && data.length > 0) setLinks(data) })
      .catch(() => {})
  }, [])
  return (
    <footer className="relative border-t border-white/[0.05] bg-dark-950/90 backdrop-blur-sm">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Terminal size={15} className="text-white" />
              </div>
              <span className="font-black text-[17px] tracking-tight">
                <span className="text-white">A</span>
                <span className="gradient-text-blue-cyan">Ponder</span>
                <span className="text-white/35">.dev</span>
              </span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Minecraft Plugin Developer &amp; Software Engineer. Building production-ready plugins, backend systems, and modern web experiences.
            </p>

            {/* Socials — managed in Admin → Site Content → Footer */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {links.map(link => {
                const Icon     = footerIcon(link.icon)
                const external = !link.url.startsWith('mailto:')
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-200"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 tracking-widest uppercase mb-4 font-mono">Explore</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 group flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/[0.05] gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} APonder.dev — All rights reserved.
          </p>
          <p className="text-xs text-slate-700 font-mono">
            Built with Next.js, Tailwind CSS &amp; TypeScript.
          </p>
        </div>
      </div>
    </footer>
  )
}
