'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Terminal, Menu, X, ArrowRight } from 'lucide-react'

const NAV = [
  { label: 'About',    href: '/#about'    },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog',     href: '/blog'      },
  { label: 'Services', href: '/#services' },
  { label: 'Contact',  href: '/#contact'  },
]

export default function PageHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-2xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.55)] transition-shadow duration-300">
              <Terminal size={15} className="text-white" />
            </div>
            <span className="font-black text-[17px] tracking-tight">
              <span className="text-white">A</span>
              <span className="gradient-text-blue-cyan">Ponder</span>
              <span className="text-white/35">.dev</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/#contact"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white
                bg-gradient-to-r from-blue-600 to-cyan-600
                hover:from-blue-500 hover:to-cyan-500
                shadow-[0_0_20px_rgba(59,130,246,0.3)]
                hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]
                transition-all duration-300"
            >
              Start a Project
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.05] bg-dark-950/96 backdrop-blur-2xl">
          <div className="px-4 py-4 space-y-1">
            {NAV.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.05]">
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                Start a Project <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
