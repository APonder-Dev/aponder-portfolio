import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Github, CheckCircle, Layers, ArrowLeft, ArrowRight, Terminal,
  Puzzle, Globe, Wrench, Lock, FolderOpen, Activity, Boxes,
} from 'lucide-react'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { db } from '@/lib/db'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlowCard from '@/components/ui/GlowCard'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

interface Accent {
  pill:  string
  dot:   string
  glow:  string
  check: string
  chip:  string
  text:  string
}

const ACCENTS: Record<string, Accent> = {
  blue:    { pill: 'text-blue-400 border-blue-500/30 bg-blue-500/10',          dot: 'bg-blue-400',    glow: 'from-blue-500/[0.13]',    check: 'text-blue-400',    chip: 'hover:border-blue-500/30 hover:text-blue-300',       text: 'text-blue-400'    },
  cyan:    { pill: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',          dot: 'bg-cyan-400',    glow: 'from-cyan-500/[0.13]',    check: 'text-cyan-400',    chip: 'hover:border-cyan-500/30 hover:text-cyan-300',       text: 'text-cyan-400'    },
  emerald: { pill: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', dot: 'bg-emerald-400', glow: 'from-emerald-500/[0.13]', check: 'text-emerald-400', chip: 'hover:border-emerald-500/30 hover:text-emerald-300', text: 'text-emerald-400' },
  indigo:  { pill: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',    dot: 'bg-indigo-400',  glow: 'from-indigo-500/[0.13]',  check: 'text-indigo-400',  chip: 'hover:border-indigo-500/30 hover:text-indigo-300',   text: 'text-indigo-400'  },
  purple:  { pill: 'text-purple-400 border-purple-500/30 bg-purple-500/10',    dot: 'bg-purple-400',  glow: 'from-purple-500/[0.13]',  check: 'text-purple-400',  chip: 'hover:border-purple-500/30 hover:text-purple-300',   text: 'text-purple-400'  },
  orange:  { pill: 'text-orange-400 border-orange-500/30 bg-orange-500/10',    dot: 'bg-orange-400',  glow: 'from-orange-500/[0.13]',  check: 'text-orange-400',  chip: 'hover:border-orange-500/30 hover:text-orange-300',   text: 'text-orange-400'  },
  amber:   { pill: 'text-amber-400 border-amber-500/30 bg-amber-500/10',       dot: 'bg-amber-400',   glow: 'from-amber-500/[0.13]',   check: 'text-amber-400',   chip: 'hover:border-amber-500/30 hover:text-amber-300',     text: 'text-amber-400'   },
  yellow:  { pill: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',    dot: 'bg-yellow-400',  glow: 'from-yellow-500/[0.13]',  check: 'text-yellow-400',  chip: 'hover:border-yellow-500/30 hover:text-yellow-300',   text: 'text-yellow-400'  },
  slate:   { pill: 'text-slate-400 border-slate-500/30 bg-slate-500/10',       dot: 'bg-slate-400',   glow: 'from-slate-500/[0.13]',   check: 'text-slate-400',   chip: 'hover:border-slate-500/30 hover:text-slate-300',     text: 'text-slate-400'   },
  teal:    { pill: 'text-teal-400 border-teal-500/30 bg-teal-500/10',          dot: 'bg-teal-400',    glow: 'from-teal-500/[0.13]',    check: 'text-teal-400',    chip: 'hover:border-teal-500/30 hover:text-teal-300',       text: 'text-teal-400'    },
}

const GLOW_ACCENTS = new Set(['blue', 'cyan', 'indigo', 'purple', 'emerald', 'orange', 'yellow'])
const glowAccent = (c: string) =>
  (GLOW_ACCENTS.has(c) ? c : 'blue') as 'blue' | 'cyan' | 'indigo' | 'purple' | 'emerald' | 'orange' | 'yellow'

function typeIcon(typeLabel: string) {
  const l = typeLabel.toLowerCase()
  if (l.includes('web') || l.includes('site') || l.includes('platform')) return Globe
  if (l.includes('tool') || l.includes('cli') || l.includes('script'))   return Wrench
  return Puzzle
}

interface ViewProject {
  name:          string
  typeLabel:     string
  description:   string
  stack:         string[]
  statusLabel:   string
  accentColor:   string
  githubUrl?:    string
  highlights:    string[]
  architecture?: string
}

interface RelatedProject {
  href:        string
  name:        string
  typeLabel:   string
  description: string
  accentColor: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const staticProject = projects.find(p => p.id === slug)
  if (staticProject) {
    return {
      title:       `${staticProject.name} — APonder.dev`,
      description: staticProject.description,
      alternates:  { canonical: `https://aponder.dev/projects/${slug}` },
      openGraph: {
        title:       `${staticProject.name} — APonder.dev`,
        description: staticProject.description,
        url:         `https://aponder.dev/projects/${slug}`,
        type:        'article',
      },
    }
  }

  const custom = await db.customProject.findFirst({ where: { id: parseInt(slug) || 0 } })
  if (custom) {
    return {
      title:       `${custom.name} — APonder.dev`,
      description: custom.description || undefined,
      alternates:  { canonical: `https://aponder.dev/projects/${slug}` },
    }
  }

  return {}
}

async function getRelated(currentSlug: string): Promise<RelatedProject[]> {
  const related: RelatedProject[] = projects
    .filter(p => p.id !== currentSlug)
    .map(p => ({
      href:        `/projects/${p.id}`,
      name:        p.name,
      typeLabel:   p.typeLabel,
      description: p.description,
      accentColor: p.accentColor,
    }))

  try {
    const customs = await db.customProject.findMany({
      orderBy: { sortOrder: 'asc' },
      take:    6,
    })
    for (const c of customs) {
      if (String(c.id) === currentSlug) continue
      related.push({
        href:        `/projects/${c.id}`,
        name:        c.name,
        typeLabel:   c.typeLabel,
        description: c.description,
        accentColor: c.accentColor,
      })
    }
  } catch { /* DB unavailable — statics only */ }

  return related.slice(0, 3)
}

function ProjectView({ p, related }: { p: ViewProject; related: RelatedProject[] }) {
  const a    = ACCENTS[p.accentColor] ?? ACCENTS.blue
  const Icon = typeIcon(p.typeLabel)

  const stats = [
    { Icon,               label: 'Type',   value: p.typeLabel },
    { Icon: Activity,     label: 'Status', value: p.statusLabel },
    { Icon: Boxes,        label: 'Stack',  value: `${p.stack.length} technolog${p.stack.length === 1 ? 'y' : 'ies'}` },
    p.githubUrl
      ? { Icon: FolderOpen, label: 'Source', value: 'Open on GitHub' }
      : { Icon: Lock,       label: 'Source', value: 'Private / client-owned' },
  ]

  return (
    <main className="min-h-screen bg-dark-950 grid-bg flex flex-col">
      <PageHeader />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b ${a.glow} to-transparent pointer-events-none`} />
        <div className="absolute top-24 -left-32 w-96 h-96 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-cyan-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* Breadcrumb */}
          <AnimatedSection direction="fade">
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-10 font-mono" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-slate-300 transition-colors">~</Link>
              <span>/</span>
              <Link href="/#projects" className="hover:text-slate-300 transition-colors">projects</Link>
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[14rem]">{p.name.toLowerCase().replace(/\s+/g, '-')}</span>
            </nav>
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono ${a.pill}`}>
                <Icon size={12} />
                {p.typeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${a.dot} animate-status-pulse`} />
                {p.statusLabel}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">{p.name}</span>
            </h1>

            {p.description && (
              <p className="text-slate-400 mt-6 text-lg leading-relaxed max-w-2xl">
                {p.description}
              </p>
            )}
          </AnimatedSection>

          {/* Stat strip */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="rounded-xl bg-dark-900/70 backdrop-blur-sm border border-white/[0.06] p-4 flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${a.pill}`}>
                    <s.Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{s.label}</div>
                    <div className="text-sm text-white font-semibold truncate" title={s.value}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Body: content + sidebar ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1">
        <div className="grid lg:grid-cols-[1fr_310px] gap-10">

          {/* Main column */}
          <div className="min-w-0">
            {p.highlights.length > 0 && (
              <AnimatedSection>
                <section className="mb-12">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                    <CheckCircle size={14} className="text-emerald-400" /> Highlights
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {p.highlights.map((h, i) => (
                      <GlowCard key={i} accent={glowAccent(p.accentColor)} className="p-4">
                        <div className="flex gap-3 items-start">
                          <span className={`text-[11px] font-mono font-bold mt-0.5 flex-shrink-0 ${a.text}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-slate-300 text-sm leading-relaxed">{h}</span>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </section>
              </AnimatedSection>
            )}

            {p.architecture && (
              <AnimatedSection>
                <section className="mb-12">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                    <Layers size={14} className="text-blue-400" /> Architecture
                  </h2>
                  <div className="rounded-xl bg-dark-900/80 border border-white/[0.06] overflow-hidden shadow-xl">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.05]">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      <span className="ml-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                        <Terminal size={11} /> architecture.md
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-300 text-[15px] leading-[1.8]">{p.architecture}</p>
                    </div>
                  </div>
                </section>
              </AnimatedSection>
            )}

            {/* CTA */}
            <AnimatedSection>
              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-dark-900 to-dark-900/40 p-7 sm:p-8 relative overflow-hidden">
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${a.glow} to-transparent blur-2xl pointer-events-none`} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Need something like this?</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      I build custom plugins, backend systems, and web platforms — engineered to spec.
                    </p>
                  </div>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all flex-shrink-0 group"
                  >
                    Start a Project
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start space-y-4">
            <AnimatedSection direction="left">
              <div className="rounded-xl bg-dark-900/70 backdrop-blur-sm border border-white/[0.06] p-5">
                <h3 className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-4">Tech Stack</h3>
                {p.stack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map(s => (
                      <span
                        key={s}
                        className={`text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 font-mono transition-colors ${a.chip}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">Not listed.</p>
                )}

                <div className="border-t border-white/[0.05] mt-5 pt-5 space-y-2.5">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.09] hover:border-white/20 transition-all"
                    >
                      <Github size={15} />
                      View Source
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-sm text-slate-600">
                      <Lock size={13} />
                      Private source
                    </div>
                  )}
                  <Link
                    href="/#contact"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all"
                  >
                    Request Similar Build
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>

        {/* ── More projects ──────────────────────────────────── */}
        {related.length > 0 && (
          <AnimatedSection>
            <section className="mt-16 pt-10 border-t border-white/[0.05]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">More Projects</h2>
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors group"
                >
                  View all
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(r => {
                  const ra    = ACCENTS[r.accentColor] ?? ACCENTS.blue
                  const RIcon = typeIcon(r.typeLabel)
                  return (
                    <Link key={r.href} href={r.href} className="group">
                      <GlowCard accent={glowAccent(r.accentColor)} className="p-5 h-full">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono mb-3 ${ra.pill}`}>
                          <RIcon size={11} />
                          <span className="truncate max-w-[10rem]">{r.typeLabel}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {r.name}
                        </h3>
                        <p className="text-[13px] text-slate-500 mt-2 leading-relaxed line-clamp-3">
                          {r.description}
                        </p>
                      </GlowCard>
                    </Link>
                  )
                })}
              </div>
            </section>
          </AnimatedSection>
        )}

        <div className="mt-12">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to projects
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params

  const staticProject = projects.find(p => p.id === slug)
  if (staticProject) {
    return (
      <ProjectView
        related={await getRelated(slug)}
        p={{
          name:         staticProject.name,
          typeLabel:    staticProject.typeLabel,
          description:  staticProject.description,
          stack:        staticProject.stack,
          statusLabel:  staticProject.statusLabel,
          accentColor:  staticProject.accentColor,
          githubUrl:    staticProject.githubUrl,
          highlights:   staticProject.modal?.highlights ?? [],
          architecture: staticProject.modal?.architecture,
        }}
      />
    )
  }

  const customId = parseInt(slug)
  if (!isNaN(customId)) {
    const custom = await db.customProject.findUnique({ where: { id: customId } })
    if (custom) {
      return (
        <ProjectView
          related={await getRelated(slug)}
          p={{
            name:         custom.name,
            typeLabel:    custom.typeLabel,
            description:  custom.description,
            stack:        JSON.parse(custom.stack || '[]') as string[],
            statusLabel:  custom.statusLabel,
            accentColor:  custom.accentColor,
            githubUrl:    custom.githubUrl || undefined,
            highlights:   JSON.parse(custom.highlights || '[]') as string[],
            architecture: custom.architecture || undefined,
          }}
        />
      )
    }
  }

  notFound()
}
