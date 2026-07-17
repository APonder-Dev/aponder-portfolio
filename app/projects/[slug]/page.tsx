import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Github, CheckCircle, Layers, ArrowLeft, ArrowRight, Terminal } from 'lucide-react'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { db } from '@/lib/db'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

interface Accent {
  pill:  string
  dot:   string
  glow:  string
  check: string
  chip:  string
}

const ACCENTS: Record<string, Accent> = {
  blue:    { pill: 'text-blue-400 border-blue-500/30 bg-blue-500/10',       dot: 'bg-blue-400',    glow: 'from-blue-500/[0.13]',    check: 'text-blue-400',    chip: 'hover:border-blue-500/30 hover:text-blue-300'       },
  cyan:    { pill: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',       dot: 'bg-cyan-400',    glow: 'from-cyan-500/[0.13]',    check: 'text-cyan-400',    chip: 'hover:border-cyan-500/30 hover:text-cyan-300'       },
  emerald: { pill: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', dot: 'bg-emerald-400', glow: 'from-emerald-500/[0.13]', check: 'text-emerald-400', chip: 'hover:border-emerald-500/30 hover:text-emerald-300' },
  indigo:  { pill: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', dot: 'bg-indigo-400',  glow: 'from-indigo-500/[0.13]',  check: 'text-indigo-400',  chip: 'hover:border-indigo-500/30 hover:text-indigo-300'   },
  purple:  { pill: 'text-purple-400 border-purple-500/30 bg-purple-500/10', dot: 'bg-purple-400',  glow: 'from-purple-500/[0.13]',  check: 'text-purple-400',  chip: 'hover:border-purple-500/30 hover:text-purple-300'   },
  orange:  { pill: 'text-orange-400 border-orange-500/30 bg-orange-500/10', dot: 'bg-orange-400',  glow: 'from-orange-500/[0.13]',  check: 'text-orange-400',  chip: 'hover:border-orange-500/30 hover:text-orange-300'   },
  amber:   { pill: 'text-amber-400 border-amber-500/30 bg-amber-500/10',    dot: 'bg-amber-400',   glow: 'from-amber-500/[0.13]',   check: 'text-amber-400',   chip: 'hover:border-amber-500/30 hover:text-amber-300'     },
  yellow:  { pill: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', dot: 'bg-yellow-400',  glow: 'from-yellow-500/[0.13]',  check: 'text-yellow-400',  chip: 'hover:border-yellow-500/30 hover:text-yellow-300'   },
  slate:   { pill: 'text-slate-400 border-slate-500/30 bg-slate-500/10',    dot: 'bg-slate-400',   glow: 'from-slate-500/[0.13]',   check: 'text-slate-400',   chip: 'hover:border-slate-500/30 hover:text-slate-300'     },
  teal:    { pill: 'text-teal-400 border-teal-500/30 bg-teal-500/10',       dot: 'bg-teal-400',    glow: 'from-teal-500/[0.13]',    check: 'text-teal-400',    chip: 'hover:border-teal-500/30 hover:text-teal-300'       },
}

interface ViewProject {
  name:         string
  typeLabel:    string
  description:  string
  stack:        string[]
  statusLabel:  string
  accentColor:  string
  githubUrl?:   string
  highlights:   string[]
  architecture?: string
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

function ProjectView({ p }: { p: ViewProject }) {
  const a = ACCENTS[p.accentColor] ?? ACCENTS.blue

  return (
    <main className="min-h-screen bg-dark-950 grid-bg flex flex-col">
      <PageHeader />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-[26rem] bg-gradient-to-b ${a.glow} to-transparent pointer-events-none`} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-14">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            All projects
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono ${a.pill}`}>
              {p.typeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
              {p.statusLabel}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
            {p.name}
          </h1>

          {p.description && (
            <p className="text-slate-400 mt-5 text-lg leading-relaxed max-w-2xl">
              {p.description}
            </p>
          )}

          {p.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">
              {p.stack.map(s => (
                <span
                  key={s}
                  className={`text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 font-mono transition-colors ${a.chip}`}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {p.githubUrl && (
            <div className="mt-8">
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.09] hover:border-white/20 transition-all"
              >
                <Github size={15} />
                View on GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 w-full flex-1">
        {p.highlights.length > 0 && (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
              <CheckCircle size={14} className="text-emerald-400" /> Highlights
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {p.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-4 rounded-xl bg-dark-900/60 border border-white/[0.05] hover:border-white/[0.1] transition-colors"
                >
                  <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${a.check}`} />
                  <span className="text-slate-300 text-sm leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {p.architecture && (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
              <Layers size={14} className="text-blue-400" /> Architecture
            </h2>
            <div className="rounded-xl bg-dark-900/80 border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.05]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                  <Terminal size={11} /> architecture.md
                </span>
              </div>
              <div className="p-5">
                <p className="text-slate-300 text-sm leading-relaxed">{p.architecture}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ────────────────────────────────────────────── */}
        <div className="mt-14 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-dark-900 to-dark-900/40 p-7 sm:p-8 relative overflow-hidden">
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

        <div className="mt-10">
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
