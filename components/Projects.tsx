'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowRight, Puzzle, Globe, Wrench, X, Check, Github } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { projects as STATIC_PROJECTS, type Project } from '@/data/projects'

interface DbProject {
  id: number; name: string; typeLabel: string; description: string
  stack: string; status: string; statusLabel: string
  featured: boolean; accentColor: string; githubUrl: string
  highlights?: string; architecture?: string
}

function inferType(typeLabel: string): Project['type'] {
  const l = typeLabel.toLowerCase()
  if (l.includes('web') || l.includes('site')) return 'web'
  if (l.includes('tool') || l.includes('cli') || l.includes('script')) return 'tool'
  return 'minecraft'
}

function dbToProject(p: DbProject): Project {
  const highlights = p.highlights
    ? (JSON.parse(p.highlights || '[]') as string[])
    : []
  return {
    id:          `custom-${p.id}`,
    name:        p.name,
    type:        inferType(p.typeLabel),
    typeLabel:   p.typeLabel,
    description: p.description,
    stack:       JSON.parse(p.stack || '[]') as string[],
    status:      p.status as Project['status'],
    statusLabel: p.statusLabel,
    featured:    p.featured,
    accentColor: p.accentColor,
    githubUrl:   p.githubUrl || undefined,
    ...(highlights.length > 0 || p.architecture ? {
      modal: {
        highlights,
        architecture: p.architecture ?? '',
      },
    } : {}),
  }
}

const FILTERS = [
  { key: 'all',       label: 'All Projects' },
  { key: 'minecraft', label: 'Minecraft'    },
  { key: 'web',       label: 'Web'          },
  { key: 'tool',      label: 'Tools'        },
]

const STATUS_STYLE: Record<string, string> = {
  production: 'text-green-400  bg-green-400/10  border-green-400/25',
  active:     'text-blue-400   bg-blue-400/10   border-blue-400/25',
  private:    'text-slate-400  bg-slate-400/10  border-slate-400/20',
  archived:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

const ACCENT_GLOW: Record<string, string> = {
  blue:    'hover:border-blue-500/35   hover:shadow-[0_0_32px_rgba(59,130,246,0.16)]',
  cyan:    'hover:border-cyan-500/35   hover:shadow-[0_0_32px_rgba(6,182,212,0.16)]',
  indigo:  'hover:border-indigo-500/35 hover:shadow-[0_0_32px_rgba(99,102,241,0.16)]',
  purple:  'hover:border-purple-500/35 hover:shadow-[0_0_32px_rgba(168,85,247,0.16)]',
  emerald: 'hover:border-emerald-500/35 hover:shadow-[0_0_32px_rgba(16,185,129,0.16)]',
  orange:  'hover:border-orange-500/35 hover:shadow-[0_0_32px_rgba(249,115,22,0.16)]',
  yellow:  'hover:border-yellow-500/35 hover:shadow-[0_0_32px_rgba(234,179,8,0.16)]',
  slate:   'hover:border-slate-500/35  hover:shadow-[0_0_16px_rgba(100,116,139,0.12)]',
}

const ACCENT_DOT: Record<string, string> = {
  blue:    'bg-blue-500',
  cyan:    'bg-cyan-500',
  indigo:  'bg-indigo-500',
  purple:  'bg-purple-500',
  emerald: 'bg-emerald-500',
  orange:  'bg-orange-500',
  yellow:  'bg-yellow-500',
  slate:   'bg-slate-500',
}

const ACCENT_BADGE: Record<string, string> = {
  blue:    'text-blue-400    bg-blue-400/10    border-blue-400/20',
  cyan:    'text-cyan-400    bg-cyan-400/10    border-cyan-400/20',
  indigo:  'text-indigo-400  bg-indigo-400/10  border-indigo-400/20',
  purple:  'text-purple-400  bg-purple-400/10  border-purple-400/20',
  emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  orange:  'text-orange-400  bg-orange-400/10  border-orange-400/20',
  yellow:  'text-yellow-400  bg-yellow-400/10  border-yellow-400/20',
  slate:   'text-slate-400   bg-slate-400/10   border-slate-400/20',
}

const TYPE_ICON: Record<string, LucideIcon> = {
  minecraft: Puzzle,
  web:       Globe,
  tool:      Wrench,
}

function scrollToContact() {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
}

function detailSlug(project: Project): string {
  if (project.id.startsWith('custom-')) return project.id.replace('custom-', '')
  return project.id
}

// ─── Project Card ──────────────────────────────────────────────
function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const Icon        = TYPE_ICON[project.type] ?? Puzzle
  const glowClass   = ACCENT_GLOW[project.accentColor]  ?? ''
  const dotClass    = ACCENT_DOT[project.accentColor]   ?? 'bg-blue-500'
  const statusStyle = STATUS_STYLE[project.status]      ?? STATUS_STYLE.active
  const hasModal    = Boolean(project.modal)

  return (
    <div
      onClick={() => hasModal && onOpen(project)}
      className={`
        flex flex-col h-full rounded-xl border border-white/[0.06] bg-white/[0.025]
        backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 group
        ${glowClass} ${hasModal ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.07] min-w-0">
          <Icon size={11} className="text-slate-500 shrink-0" />
          <span className="text-[11px] text-slate-500 font-mono truncate" title={project.typeLabel}>
            {project.typeLabel}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap shrink-0 ${statusStyle}`}>
          {project.statusLabel}
        </span>
      </div>

      {/* Name */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
        <h3 className="text-[16px] font-bold text-white">{project.name}</h3>
        {hasModal && (
          <span className="ml-auto text-[10px] text-slate-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            details →
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[13px] text-slate-400 leading-relaxed mb-5 flex-1">{project.description}</p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.stack.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-mono">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05]">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Github size={12} /> GitHub
          </a>
        )}
        {hasModal && (
          <Link
            href={`/projects/${detailSlug(project)}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={12} /> Full Details
          </Link>
        )}
        {!hasModal && !project.githubUrl && (
          <button
            onClick={e => { e.stopPropagation(); scrollToContact() }}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowRight size={12} /> Inquire
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); scrollToContact() }}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-300 transition-colors ml-auto"
        >
          <ArrowRight size={12} /> Request Similar
        </button>
      </div>
    </div>
  )
}

// ─── Project Modal ─────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dotClass    = ACCENT_DOT[project.accentColor]    ?? 'bg-blue-500'
  const badgeClass  = ACCENT_BADGE[project.accentColor]  ?? ACCENT_BADGE.blue
  const statusStyle = STATUS_STYLE[project.status]       ?? STATUS_STYLE.active
  const Icon        = TYPE_ICON[project.type]            ?? Puzzle

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0,  y: 16,  scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-dark-900/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] scrollbar-thin"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-7 py-6 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.05]">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold text-white leading-tight">{project.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07]">
                  <Icon size={10} className="text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-mono">{project.typeLabel}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle}`}>
                  {project.statusLabel}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-7">
          {/* Description */}
          <p className="text-[14px] text-slate-300 leading-relaxed">{project.description}</p>

          {/* Stack */}
          <div>
            <p className="text-[10px] font-semibold text-slate-600 font-mono uppercase tracking-widest mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map(tag => (
                <span key={tag} className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${badgeClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {project.modal?.highlights && (
            <div>
              <p className="text-[10px] font-semibold text-slate-600 font-mono uppercase tracking-widest mb-3">Key Features</p>
              <ul className="space-y-2.5">
                {project.modal.highlights.map(h => (
                  <li key={h} className="flex items-start gap-3">
                    <Check size={13} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-300 leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture */}
          {project.modal?.architecture && (
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
              <p className="text-[10px] font-semibold text-slate-600 font-mono uppercase tracking-widest mb-2">Architecture Note</p>
              <p className="text-[13px] text-slate-400 leading-relaxed">{project.modal.architecture}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-7 py-5 border-t border-white/[0.05] flex-wrap">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white
                bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
                shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
            >
              <Github size={14} /> View on GitHub
            </a>
          )}
          <Link
            href={`/projects/${detailSlug(project)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-300
              border border-white/[0.1] hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]
              transition-all duration-300"
          >
            <ExternalLink size={14} /> Full Details
          </Link>
          <button
            onClick={() => { onClose(); scrollToContact() }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-300
              border border-white/[0.1] hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]
              transition-all duration-300"
          >
            <ArrowRight size={14} /> Request Similar
          </button>
          <button
            onClick={onClose}
            className="ml-auto text-[12px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ───────────────────────────────────────────────────
const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

export default function Projects({
  hiddenProjectIds  = [],
  customProjects    = [],
  projectOverrides  = {},
  projectOrder      = [],
}: {
  hiddenProjectIds?:  string[]
  customProjects?:    DbProject[]
  projectOverrides?:  Record<string, Partial<Project>>
  projectOrder?:      string[]
}) {
  const [filter,   setFilter]   = useState('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  const allProjects = [
    ...STATIC_PROJECTS
      .filter(p => !hiddenProjectIds.includes(p.id))
      .map(p => projectOverrides[p.id] ? { ...p, ...projectOverrides[p.id] } : p),
    ...customProjects.map(dbToProject),
  ]

  const projects = projectOrder.length > 0
    ? [
        ...projectOrder
          .map(id => allProjects.find(p => p.id === id))
          .filter((p): p is Project => !!p),
        ...allProjects.filter(p => !projectOrder.includes(p.id)),
      ]
    : allProjects

  const visible = filter === 'all' ? projects : projects.filter(p => p.type === filter)

  return (
    <section id="projects" className="relative py-20 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.06),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-label justify-center mb-4">Project Portfolio</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            The work <span className="gradient-text">speaks.</span>
          </h2>
          <p className="text-slate-400 text-[16px] max-w-lg mx-auto">
            Production-deployed plugins and systems used on real servers by real players.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(59,130,246,0.4)]'
                  : 'text-slate-400 hover:text-white border border-white/[0.07] hover:border-blue-500/30 hover:bg-blue-500/[0.05]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                variants={CARD_VARIANTS}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                exit="hidden"
                transition={{ duration: 0.4, delay: isInView ? i * 0.06 : 0 }}
              >
                <ProjectCard project={project} onOpen={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={CARD_VARIANTS}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm mb-4">More private work available upon request under NDA.</p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white
              bg-gradient-to-r from-blue-600 to-cyan-600
              hover:from-blue-500 hover:to-cyan-500
              shadow-[0_0_20px_rgba(59,130,246,0.3)]
              hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
              transition-all duration-300"
          >
            Discuss Your Project <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
