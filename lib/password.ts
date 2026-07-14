import crypto from 'crypto'

export function hashPassword(password: string): string {
  const pepper = process.env.ADMIN_SECRET ?? 'dev-secret-please-change-in-env'
  return crypto.createHash('sha256').update(password + pepper).digest('hex')
}
