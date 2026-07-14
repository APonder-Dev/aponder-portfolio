import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Github, CheckCircle, Layers } from 'lucide-react'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { db } from '@/lib/db'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

const COLOR_MAP: Record<string, string> = {
  blue:    'text-blue-400 border-blue-500/30 bg-blue-500/10',
  cyan:    'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  indigo:  'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  purple:  'text-purple-400 border-purple-500/30 bg-purple-500/10',
  orange:  'text-orange-400 border-orange-500/30 bg-orange-500/10',
  amber:   'text-amber-400 border-amber-500/30 bg-amber-500/10',
  yellow:  'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  slate:   'text-slate-400 border-slate-500/30 bg-slate-500/10',
  teal:    'text-teal-400 border-teal-500/30 bg-teal-500/10',
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

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params

  // Try static projects first
  const staticProject = projects.find(p => p.id === slug)

  if (staticProject) {
    const colorClass = COLOR_MAP[staticProject.accentColor] ?? COLOR_MAP.blue
    return (
      <main className="min-h-screen bg-dark-950 grid-bg">
        <PageHeader />
        <div className="max-w-3xl mx-auto px-4 py-28">
          <Link href="/#projects" className="text-sm text-slate-500 hover:text-white transition-colors mb-10 block">
            ← All projects
          </Link>

          <header className="mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-4 ${colorClass}`}>
              {staticProject.typeLabel}
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">{staticProject.name}</h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">{staticProject.description}</p>

            <div className="flex flex-wrap gap-2 mt-6">
              {staticProject.stack.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 font-mono">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/[0.05]">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}>
                {staticProject.statusLabel}
              </span>
              {staticProject.githubUrl && (
                <a
                  href={staticProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Github size={14} /> View on GitHub
                </a>
              )}
            </div>
          </header>

          {staticProject.modal && (
            <>
              {staticProject.modal.highlights.length > 0 && (
                <section className="mb-10">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                    <CheckCircle size={14} className="text-emerald-400" /> Highlights
                  </h2>
                  <ul className="space-y-3">
                    {staticProject.modal.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 items-start p-4 rounded-xl bg-dark-900/60 border border-white/[0.05]">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
                        <span className="text-slate-300 text-sm leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {staticProject.modal.architecture && (
                <section>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                    <Layers size={14} className="text-blue-400" /> Architecture
                  </h2>
                  <div className="p-5 rounded-xl bg-dark-900/60 border border-white/[0.05]">
                    <p className="text-slate-300 text-sm leading-relaxed">{staticProject.modal.architecture}</p>
                  </div>
                </section>
              )}
            </>
          )}

          <div className="mt-14 pt-8 border-t border-white/[0.05]">
            <Link href="/#projects" className="text-sm text-slate-500 hover:text-white transition-colors">
              ← Back to projects
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Try custom projects (by numeric id in slug)
  const customId = parseInt(slug)
  if (!isNaN(customId)) {
    const custom = await db.customProject.findUnique({ where: { id: customId } })
    if (custom) {
      const colorClass = COLOR_MAP[custom.accentColor] ?? COLOR_MAP.blue
      const stack      = JSON.parse(custom.stack || '[]') as string[]
      const highlights = JSON.parse(custom.highlights || '[]') as string[]

      return (
        <main className="min-h-screen bg-dark-950 grid-bg">
          <PageHeader />
          <div className="max-w-3xl mx-auto px-4 py-28">
            <Link href="/#projects" className="text-sm text-slate-500 hover:text-white transition-colors mb-10 block">
              ← All projects
            </Link>

            <header className="mb-10">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-4 ${colorClass}`}>
                {custom.typeLabel}
              </div>
              <h1 className="text-4xl font-black text-white leading-tight">{custom.name}</h1>
              {custom.description && (
                <p className="text-slate-400 mt-4 text-lg leading-relaxed">{custom.description}</p>
              )}

              {stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {stack.map((s: string) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {custom.githubUrl && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.05]">
                  <a
                    href={custom.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Github size={14} /> View on GitHub
                  </a>
                </div>
              )}
            </header>

            {highlights.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                  <CheckCircle size={14} className="text-emerald-400" /> Highlights
                </h2>
                <ul className="space-y-3">
                  {highlights.map((h: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start p-4 rounded-xl bg-dark-900/60 border border-white/[0.05]">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
                      <span className="text-slate-300 text-sm leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {custom.architecture && (
              <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-5">
                  <Layers size={14} className="text-blue-400" /> Architecture
                </h2>
                <div className="p-5 rounded-xl bg-dark-900/60 border border-white/[0.05]">
                  <p className="text-slate-300 text-sm leading-relaxed">{custom.architecture}</p>
                </div>
              </section>
            )}

            <div className="mt-14 pt-8 border-t border-white/[0.05]">
              <Link href="/#projects" className="text-sm text-slate-500 hover:text-white transition-colors">
                ← Back to projects
              </Link>
            </div>
          </div>
        </main>
      )
    }
  }

  notFound()
}
