import { SignJWT, jwtVerify } from 'jose'

export const COOKIE = 'admin_token'

export const secret = () =>
  new TextEncoder().encode(process.env.ADMIN_SECRET ?? 'dev-secret-please-change-in-env')

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret())
}

export async function signPreviewToken(postId: number): Promise<string> {
  return new SignJWT({ postId, preview: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('72h')
    .setIssuedAt()
    .sign(secret())
}

export async function signUnsubToken(email: string): Promise<string> {
  return new SignJWT({ email, unsub: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1y')
    .setIssuedAt()
    .sign(secret())
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload.admin === true
  } catch {
    return false
  }
}
