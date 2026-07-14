import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import Link from 'next/link'
import type { Metadata } from 'next'
import ScrollProgress from '@/components/ScrollProgress'
import CopyCodeEnhancer from '@/components/CopyCodeEnhancer'
import TableOfContents, { type Heading } from '@/components/TableOfContents'
import PageHeader from '@/components/PageHeader'
import ViewTracker from '@/components/ViewTracker'
import NewsletterSignup from '@/components/NewsletterSignup'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

function parseHeadings(content: string): Heading[] {
  return content.split('\n').flatMap(line => {
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (!m) return []
    const text = m[2].trim()
    const slug = text.toLowerCase()
      .replace(/[^\w\s-]/g, '').trim()
      .replace(/\s+/g, '-')
    return [{ level: m[1].length, text, slug }]
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.post.findUnique({
    where:  { slug },
    select: { title: true, excerpt: true, coverImage: true },
  })
  if (!post) return {}
  return {
    title:       `${post.title} — APonder.dev`,
    description: post.excerpt || undefined,
    alternates: { canonical: `https://aponder.dev/blog/${slug}` },
    openGraph: {
      title:       `${post.title} — APonder.dev`,
      description: post.excerpt || undefined,
      type:        'article',
      url:         `https://aponder.dev/blog/${slug}`,
      ...(post.coverImage ? { images: [{ url: post.coverImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${post.title} — APonder.dev`,
      description: post.excerpt || undefined,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await db.post.findFirst({ where: { slug, published: true, publishedAt: { lte: new Date() } } })
  if (!post) notFound()

  const tags     = JSON.parse(post.tags || '[]') as string[]
  const mins     = readingTime(post.content)
  const headings = parseHeadings(post.content)
  const hasToc   = headings.length >= 3
  const dateStr  = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  const now = new Date()

  const [prevPost, nextPost, relatedRaw, seriesSiblings] = await Promise.all([
    post.publishedAt
      ? db.post.findFirst({
          where:   { published: true, publishedAt: { lt: post.publishedAt, lte: now } },
          select:  { title: true, slug: true },
          orderBy: { publishedAt: 'desc' },
        })
      : null,
    post.publishedAt
      ? db.post.findFirst({
          where:   { published: true, publishedAt: { gt: post.publishedAt, lte: now } },
          select:  { title: true, slug: true },
          orderBy: { publishedAt: 'asc' },
        })
      : null,
    tags.length > 0
      ? db.post.findMany({
          where:   { published: true, publishedAt: { lte: now }, slug: { not: slug } },
          select:  { title: true, slug: true, excerpt: true, tags: true, publishedAt: true },
          orderBy: { publishedAt: 'desc' },
          take:    20,
        })
      : [],
    post.series
      ? db.post.findMany({
          where:   { series: post.series, published: true, publishedAt: { lte: now } },
          select:  { title: true, slug: true, seriesOrder: true },
          orderBy: { seriesOrder: 'asc' },
        })
      : [],
  ])

  const relatedPosts = relatedRaw
    .filter(p => {
      const pTags = JSON.parse(p.tags || '[]') as string[]
      return pTags.some(t => tags.includes(t))
    })
    .slice(0, 3)

  const postUrl = `https://aponder.dev/blog/${slug}`

  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      post.title,
    description:   post.excerpt || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified:  post.updatedAt.toISOString(),
    author:        { '@type': 'Person', name: 'Anthony Ponder', url: 'https://aponder.dev' },
    publisher:     { '@type': 'Person', name: 'Anthony Ponder', url: 'https://aponder.dev' },
    ...(post.coverImage ? { image: post.coverImage } : {}),
  }

  return (
    <main className="min-h-screen bg-dark-950">
      <PageHeader />
      <ViewTracker slug={slug} />
      <ScrollProgress />
      <CopyCodeEnhancer />

      <div className={`mx-auto px-4 py-28 ${hasToc ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors mb-10 block">
          ← All posts
        </Link>

        <div className={hasToc ? 'flex gap-12 items-start' : ''}>
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-xl object-cover max-h-80 mb-10 border border-white/[0.06]"
              />
            )}

            <header className="mb-10">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded font-mono border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{post.title}</h1>
              {post.excerpt && (
                <p className="text-slate-400 mt-4 text-lg leading-relaxed">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Anthony Ponder</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    {dateStr && <span>{dateStr}</span>}
                    {dateStr && <span>·</span>}
                    <span>{mins} min read</span>
                    {post.views > 0 && <><span>·</span><span>{post.views.toLocaleString()} views</span></>}
                  </div>
                </div>
              </div>
            </header>

            {/* Series nav */}
            {seriesSiblings.length > 1 && (
              <div className="mb-10 p-4 rounded-xl border border-blue-500/15 bg-blue-500/[0.03]">
                <p className="text-[10px] font-mono text-blue-400/70 uppercase tracking-widest mb-3">
                  Series — {post.series}
                </p>
                <ol className="space-y-1.5">
                  {seriesSiblings.map((s, i) => (
                    <li key={s.slug} className="flex items-start gap-2.5">
                      <span className="text-xs text-slate-600 font-mono w-4 mt-0.5 flex-shrink-0">{i + 1}.</span>
                      {s.slug === slug ? (
                        <span className="text-sm text-white font-medium">{s.title}</span>
                      ) : (
                        <Link
                          href={`/blog/${s.slug}`}
                          className="text-sm text-slate-400 hover:text-blue-300 transition-colors"
                        >
                          {s.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <article className="prose-blog">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Social share */}
            <div className="mt-12 pt-8 border-t border-white/[0.05]">
              <p className="text-xs text-slate-600 font-mono uppercase tracking-widest mb-3">Share</p>
              <div className="flex items-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all font-medium"
                >
                  Share on X
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all font-medium"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>

            <NewsletterSignup />

            <footer className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-4">
              <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors">
                ← Back to all posts
              </Link>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="text-xs px-2 py-0.5 bg-white/[0.04] text-slate-500 rounded font-mono border border-white/[0.06] hover:text-slate-300 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </footer>

            {/* Prev / Next navigation */}
            {(prevPost || nextPost) && (
              <nav className="mt-8 grid grid-cols-2 gap-3">
                <div>
                  {prevPost && (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      className="group flex flex-col gap-1 p-4 h-full rounded-xl border border-white/[0.06] hover:border-blue-500/25 hover:bg-blue-500/[0.02] transition-all"
                    >
                      <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">← Older</span>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {prevPost.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="flex justify-end">
                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="group flex flex-col gap-1 p-4 h-full w-full rounded-xl border border-white/[0.06] hover:border-blue-500/25 hover:bg-blue-500/[0.02] transition-all text-right"
                    >
                      <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Newer →</span>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {nextPost.title}
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono mb-5">Related Posts</h2>
                <div className="space-y-3">
                  {relatedPosts.map(p => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="block p-5 rounded-xl border border-white/[0.06] bg-dark-900/60 hover:border-blue-500/25 hover:bg-blue-500/[0.02] transition-all group"
                    >
                      <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {p.title}
                      </div>
                      {p.excerpt && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Table of Contents sidebar ── */}
          {hasToc && (
            <aside className="hidden xl:block w-52 flex-shrink-0 sticky top-24 self-start">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}
