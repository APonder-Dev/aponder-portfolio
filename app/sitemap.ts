import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { projects } from '@/data/projects'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts:          Array<{ slug: string; updatedAt: Date }> = []
  let customProjects: Array<{ id: number; updatedAt: Date }>   = []

  try {
    ;[posts, customProjects] = await Promise.all([
      db.post.findMany({
        where:  { published: true, publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
      }),
      db.customProject.findMany({ select: { id: true, updatedAt: true } }),
    ])
  } catch {
    // DB not ready yet
  }

  return [
    {
      url:             'https://aponder.dev',
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1,
    },
    {
      url:             'https://aponder.dev/blog',
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.8,
    },
    ...posts.map(post => ({
      url:             `https://aponder.dev/blog/${post.slug}`,
      lastModified:    post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    })),
    ...projects.map(p => ({
      url:             `https://aponder.dev/projects/${p.id}`,
      lastModified:    new Date(),
      changeFrequency: 'monthly' as const,
      priority:        0.6,
    })),
    ...customProjects.map(p => ({
      url:             `https://aponder.dev/projects/${p.id}`,
      lastModified:    p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority:        0.6,
    })),
  ]
}
