import { NextRequest, NextResponse } from 'next/server'
import { COOKIE } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url))
  res.cookies.delete(COOKIE)
  return res
}
