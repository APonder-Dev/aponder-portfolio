import { db } from './db'

export function getIp(req: { headers: { get(key: string): string | null } }): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function isRateLimited(
  key:      string,
  limit:    number,
  windowMs: number
): Promise<boolean> {
  const now = new Date()
  try {
    const record = await db.rateLimit.findUnique({ where: { ip: key } })
    if (!record || record.resetAt <= now) {
      await db.rateLimit.upsert({
        where:  { ip: key },
        update: { count: 1, resetAt: new Date(Date.now() + windowMs) },
        create: { ip: key, count: 1, resetAt: new Date(Date.now() + windowMs) },
      })
      return false
    }
    if (record.count >= limit) return true
    await db.rateLimit.update({ where: { ip: key }, data: { count: { increment: 1 } } })
    return false
  } catch {
    return false
  }
}

export async function resetRateLimit(key: string): Promise<void> {
  try {
    await db.rateLimit.delete({ where: { ip: key } })
  } catch { /* may not exist */ }
}
