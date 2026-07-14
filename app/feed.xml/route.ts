import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function escape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await db.post.findMany({
    where:   { published: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    select:  { title: true, slug: true, excerpt: true, content: true, publishedAt: true, updatedAt: true, tags: true },
    take:    50,
  })

  const base = 'https://aponder.dev'

  const items = posts.map(post => {
    const url  = `${base}/blog/${post.slug}`
    const date = (post.publishedAt ?? post.updatedAt).toUTCString()
    const tags = (JSON.parse(post.tags || '[]') as string[])
      .map(t => `<category>${escape(t)}</category>`)
      .join('')
    return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escape(post.excerpt || post.title)}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      ${tags}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>APonder.dev Blog</title>
    <link>${base}/blog</link>
    <description>Devlogs, tutorials, and thoughts on Minecraft plugin development, backend systems, and software engineering.</description>
    <language>en-us</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
