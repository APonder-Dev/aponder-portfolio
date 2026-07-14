import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function GET() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const {
    title, slug, excerpt, content, coverImage, tags, published,
    publishedAt: customPublishedAt, series, seriesOrder,
  } = await req.json()

  if (!title?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'title and slug are required' }, { status: 400 })
  }

  const tagArr = typeof tags === 'string'
    ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : (Array.isArray(tags) ? tags : [])

  const post = await db.post.create({
    data: {
      title:       title.trim(),
      slug:        slug.trim(),
      excerpt:     excerpt ?? '',
      content:     content ?? '',
      coverImage:  coverImage ?? '',
      tags:        JSON.stringify(tagArr),
      published:   !!published,
      publishedAt: published ? (customPublishedAt ? new Date(customPublishedAt) : new Date()) : null,
      series:      series ?? '',
      seriesOrder: seriesOrder ?? 0,
    },
  })

  await logAction('post_created', post.title)
  return NextResponse.json(post, { status: 201 })
}
