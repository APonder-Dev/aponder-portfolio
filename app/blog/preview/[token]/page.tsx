import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { secret } from '@/lib/auth'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import Link from 'next/link'
import ScrollProgress from '@/components/ScrollProgress'
import CopyCodeEnhancer from '@/components/CopyCodeEnhancer'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ token: string }> }

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

export default async function PreviewPage({ params }: Props) {
  const { token } = await params

  let postId: number
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.preview !== true || typeof payload.postId !== 'number') notFound()
    postId = payload.postId as number
  } catch {
    notFound()
  }

  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) notFound()

  const tags    = JSON.parse(post.tags || '[]') as string[]
  const mins    = readingTime(post.content)
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unpublished draft'

  return (
    <main className="min-h-screen bg-dark-950">
      <PageHeader />
      <ScrollProgress />
      <CopyCodeEnhancer />

      {/* Draft banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm text-black text-center py-2 text-xs font-semibold tracking-wide">
        DRAFT PREVIEW — not yet published · <Link href="/admin/blog" className="underline">Back to admin</Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-32">
        <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition-colors mb-10 block">
          ← All posts
        </Link>

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
                <span key={tag} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded font-mono border border-blue-500/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.05]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">A</div>
            <div>
              <div className="text-sm font-medium text-white">Anthony Ponder</div>
              <div className="text-xs text-slate-500">{dateStr} · {mins} min read</div>
            </div>
          </div>
        </header>

        <article className="prose-blog">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  )
}
