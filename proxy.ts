import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { COOKIE, secret } from '@/lib/auth'

interface SiteFlags {
  maintenance: { enabled: boolean }
  redirects:   { from: string; to: string }[]
}

// Prisma isn't usable here, so flags come from an internal API call,
// cached in-process so we don't hit the DB on every request.
let flagsCache: { flags: SiteFlags; at: number } | null = null
const FLAGS_TTL_MS = 10_000

async function getFlags(origin: string): Promise<SiteFlags | null> {
  if (flagsCache && Date.now() - flagsCache.at < FLAGS_TTL_MS) return flagsCache.flags
  try {
    const res = await fetch(`${origin}/api/site-flags`, { cache: 'no-store' })
    if (!res.ok) return flagsCache?.flags ?? null
    const flags = (await res.json()) as SiteFlags
    flagsCache = { flags, at: Date.now() }
    return flags
  } catch {
    return flagsCache?.flags ?? null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Never intercept the flags endpoint itself (avoids fetch recursion).
  if (pathname === '/api/site-flags') return NextResponse.next()

  // ── Admin auth ─────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname.startsWith('/api/admin/auth') || pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = req.cookies.get(COOKIE)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, secret())
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ── Public routes: custom redirects, then maintenance ──────
  const flags = await getFlags(req.nextUrl.origin)
  if (flags) {
    const rule = flags.redirects?.find(r => r.from === pathname)
    if (rule?.to && rule.to !== pathname) {
      const dest = /^https?:\/\//.test(rule.to) ? rule.to : new URL(rule.to, req.url)
      return NextResponse.redirect(dest, 308)
    }

    if (flags.maintenance?.enabled && pathname !== '/maintenance' && !pathname.startsWith('/api')) {
      return NextResponse.rewrite(new URL('/maintenance', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // All pages plus /api, excluding Next internals and static files (paths
  // containing a dot: uploads, feed.xml, sitemap.xml, favicon, etc.).
  matcher: ['/((?!_next|.*\\..*).*)'],
}
