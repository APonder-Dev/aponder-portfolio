import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [hidden, custom] = await Promise.all([
    db.projectHide.findMany(),
    db.customProject.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }),
  ])
  return NextResponse.json({
    hidden: hidden.map(h => h.projectId),
    custom,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, typeLabel, description, stack, status, statusLabel, featured, accentColor, githubUrl, highlights, architecture, sortOrder } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const stackStr      = typeof stack      === 'string' ? stack      : JSON.stringify(stack      ?? [])
  const highlightsStr = typeof highlights === 'string' ? highlights : JSON.stringify(highlights ?? [])

  const project = await db.customProject.create({
    data: {
      name:         name.trim(),
      typeLabel:    typeLabel    ?? 'Project',
      description:  description  ?? '',
      stack:        stackStr,
      status:       status       ?? 'active',
      statusLabel:  statusLabel  ?? 'Active',
      featured:     !!featured,
      accentColor:  accentColor  ?? 'blue',
      githubUrl:    githubUrl    ?? '',
      highlights:   highlightsStr,
      architecture: architecture ?? '',
      sortOrder:    sortOrder    ?? 0,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
