import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import BulkList from './_BulkList'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })

  // Serialize dates for client component
  const serialized = posts.map(p => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt:   p.createdAt.toISOString(),
    updatedAt:   p.updatedAt.toISOString(),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all"
        >
          <Plus size={14} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-white/[0.06]">
          <p className="text-slate-500 text-sm">No posts yet.</p>
          <Link href="/admin/blog/new" className="text-sm text-blue-400 hover:text-blue-300 mt-2 block transition-colors">
            Write your first post →
          </Link>
        </div>
      ) : (
        <BulkList posts={serialized} />
      )}
    </div>
  )
}
