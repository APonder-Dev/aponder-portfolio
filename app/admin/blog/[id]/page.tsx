import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import BlogEditor from '../_BlogEditor'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id: parseInt(id) } })
  if (!post) notFound()
  return <BlogEditor post={{ ...post, publishedAt: post.publishedAt?.toISOString() ?? null }} />
}
