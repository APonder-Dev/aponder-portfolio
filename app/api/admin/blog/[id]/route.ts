import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const post = await db.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const body = await req.json()

  const existing = await db.post.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const tagArr = body.tags !== undefined
    ? (typeof body.tags === 'string'
        ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(body.tags) ? body.tags : [])
    : null

  const post = await db.post.update({
    where: { id },
    data: {
      ...(body.title       !== undefined && { title:       body.title.trim() }),
      ...(body.slug        !== undefined && { slug:        body.slug.trim() }),
      ...(body.excerpt     !== undefined && { excerpt:     body.excerpt }),
      ...(body.content     !== undefined && { content:     body.content }),
      ...(body.coverImage  !== undefined && { coverImage:  body.coverImage }),
      ...(tagArr !== null                && { tags:        JSON.stringify(tagArr) }),
      ...(body.series      !== undefined && { series:      body.series }),
      ...(body.seriesOrder !== undefined && { seriesOrder: body.seriesOrder }),
      ...(body.published !== undefined && {
        published:   body.published,
        publishedAt: body.published
          ? (body.publishedAt
              ? new Date(body.publishedAt)
              : (existing.publishedAt ?? new Date()))
          : null,
      }),
    },
  })

  await logAction('post_updated', post.title)
  return NextResponse.json(post)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const existing = await db.post.findUnique({ where: { id }, select: { title: true } })
  await db.post.delete({ where: { id } })
  await logAction('post_deleted', existing?.title ?? `id:${id}`)
  return NextResponse.json({ ok: true })
}
