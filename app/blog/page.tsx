import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import BlogList from '@/components/BlogList'
import PageHeader from '@/components/PageHeader'
import { getBlogSettings } from '@/lib/site-settings'

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

interface Props { searchParams: Promise<{ tag?: string; page?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const { tag: activeTag, page: pageParam } = await searchParams
  const settings = await getBlogSettings()

  const raw = await db.post.findMany({
    where:   { published: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    select:  { title: true, slug: true, excerpt: true, tags: true, content: true, publishedAt: true },
  })

  const allPosts = raw.map(p => ({
    slug:        p.slug,
    title:       p.title,
    excerpt:     p.excerpt,
    tags:        JSON.parse(p.tags || '[]') as string[],
    publishedAt: p.publishedAt?.toISOString() ?? null,
    mins:        readingTime(p.content),
  }))

  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags))).sort()

  // Pagination (admin-configurable; 0 = show all). Filtering by tag happens
  // client-side in BlogList, so paginate only the untagged view.
  const perPage    = activeTag ? 0 : Math.max(0, settings.postsPerPage)
  const totalPages = perPage > 0 ? Math.max(1, Math.ceil(allPosts.length / perPage)) : 1
  const page       = Math.min(Math.max(1, parseInt(pageParam ?? '1') || 1), totalPages)
  const posts      = perPage > 0 ? allPosts.slice((page - 1) * perPage, page * perPage) : allPosts

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

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-3.5 py-2 rounded-lg border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
              >
                ← Newer
              </Link>
            )}
            <span className="px-3 text-xs font-mono text-slate-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-3.5 py-2 rounded-lg border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
              >
                Older →
              </Link>
            )}
          </nav>
        )}

        <div className="mt-14 pt-8 border-t border-white/[0.05]">
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
