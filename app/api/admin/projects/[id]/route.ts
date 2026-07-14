import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const body = await req.json()

  const project = await db.customProject.update({
    where: { id },
    data: {
      ...(body.name         !== undefined && { name:         body.name }),
      ...(body.typeLabel    !== undefined && { typeLabel:    body.typeLabel }),
      ...(body.description  !== undefined && { description:  body.description }),
      ...(body.stack        !== undefined && {
        stack: typeof body.stack === 'string' ? body.stack : JSON.stringify(body.stack),
      }),
      ...(body.highlights   !== undefined && {
        highlights: typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights),
      }),
      ...(body.architecture !== undefined && { architecture: body.architecture }),
      ...(body.status       !== undefined && { status:       body.status }),
      ...(body.statusLabel  !== undefined && { statusLabel:  body.statusLabel }),
      ...(body.featured     !== undefined && { featured:     !!body.featured }),
      ...(body.accentColor  !== undefined && { accentColor:  body.accentColor }),
      ...(body.githubUrl    !== undefined && { githubUrl:    body.githubUrl }),
      ...(body.sortOrder    !== undefined && { sortOrder:    body.sortOrder }),
    },
  })
  await logAction('project_updated', project.name)

  return NextResponse.json(project)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const existing = await db.customProject.findUnique({ where: { id }, select: { name: true } })
  await db.customProject.delete({ where: { id } })
  await logAction('project_deleted', existing?.name ?? `id:${id}`)
  return NextResponse.json({ ok: true })
}
