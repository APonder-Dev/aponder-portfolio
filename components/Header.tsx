'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Terminal, ArrowRight, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

const NAV = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'Blog',     href: '/blog'     },
  { label: 'Contact',  href: '#contact'  },
]

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (!el) return
  const offset = 80 // fixed header height (~70px) + breathing room
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

function handleNavClick(href: string) {
  if (href.startsWith('/')) {
    window.location.href = href
  } else {
    scrollTo(href)
  }
}

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const { scrollYProgress }           = useScroll()
  const scaleX                        = useTransform(scrollYProgress, [0, 1], [0, 1])
  const { theme, toggleTheme }        = useTheme()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    handleNavClick(href)
  }

  return (
    <>
      {/* ── Scroll progress bar ──────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* ── Header ───────────────────────────────────────────── */}
      <header
        className={`
          fixed top-[2px] left-0 right-0 z-50 transition-all duration-500
          ${scrolled ? 'bg-dark-950/85 backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl shadow-black/30' : 'bg-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* Logo */}
            <motion.button
              onClick={() => scrollTo('#hero')}
              className="flex items-center gap-2.5 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.55)] transition-shadow duration-300">
                <Terminal size={15} className="text-white" />
              </div>
              <span className="font-black text-[17px] tracking-tight">
                <span className="text-white">A</span>
                <span className="gradient-text-blue-cyan">Ponder</span>
                <span className="text-white/35">.dev</span>
              </span>
            </motion.button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV.map((link, i) => (
                link.href.startsWith('/') ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04] group flex items-center"
                    >
                      {link.label}
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-4 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="relative px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.04] group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-4 transition-all duration-300" />
                  </motion.button>
                )
              ))}
            </nav>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <button
                onClick={() => scrollTo('#contact')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-cyan-600
                  hover:from-blue-500 hover:to-cyan-500
                  shadow-[0_0_20px_rgba(59,130,246,0.3)]
                  hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]
                  hover:-translate-y-px transition-all duration-300"
              >
                Start a Project
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-white/[0.05] bg-dark-950/96 backdrop-blur-2xl"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV.map(link => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => handleNav(link.href)}
                      className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                    >
                      {link.label}
                    </button>
                  )
                ))}
                <div className="pt-3 border-t border-white/[0.05] space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                  >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                  <button
                    onClick={() => handleNav('#contact')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    Start a Project <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
