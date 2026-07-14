import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import BlogList from '@/components/BlogList'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:       'Blog — APonder.dev',
  description: 'Devlogs, tutorials, and thoughts on Minecraft plugin development, backend systems, and software engineering.',
  alternates:  { canonical: 'https://aponder.dev/blog' },
  openGraph: {
    title:       'Blog — APonder.dev',
    description: 'Devlogs, tutorials, and thoughts on Minecraft plugin development, backend systems, and software engineering.',
    url:         'https://aponder.dev/blog',
    siteName:    'APonder.dev',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Blog — APonder.dev',
    description: 'Devlogs, tutorials, and thoughts on Minecraft plugin development, backend systems, and software engineering.',
  },
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

interface Props { searchParams: Promise<{ tag?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const { tag: activeTag } = await searchParams

  const raw = await db.post.findMany({
    where:   { published: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    select:  { title: true, slug: true, excerpt: true, tags: true, content: true, publishedAt: true },
  })

  const posts = raw.map(p => ({
    slug:        p.slug,
    title:       p.title,
    excerpt:     p.excerpt,
    tags:        JSON.parse(p.tags || '[]') as string[],
    publishedAt: p.publishedAt?.toISOString() ?? null,
    mins:        readingTime(p.content),
  }))

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort()

  return (
    <main className="min-h-screen bg-dark-950 grid-bg">
      <PageHeader />
      <div className="max-w-3xl mx-auto px-4 py-28">
        <div className="mb-10">
          <span className="section-label mb-4">Devlog</span>
          <h1 className="text-4xl font-black text-white mt-4 leading-tight">Blog</h1>
          <p className="text-slate-400 mt-3 leading-relaxed">
            Thoughts on plugin development, backend systems, and engineering.
          </p>
        </div>

        <BlogList posts={posts} allTags={allTags} activeTag={activeTag} />

        <div className="mt-14 pt-8 border-t border-white/[0.05]">
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
