import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

// RFC 6238 TOTP (SHA-1, 6 digits, 30s steps) — the scheme used by
// Google Authenticator, Authy, 1Password, etc. No external deps.

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const STEP_SECONDS = 30
const DIGITS       = 6

export function generateTotpSecret(): string {
  const bytes = randomBytes(20)
  let bits = ''
  for (const b of bytes) bits += b.toString(2).padStart(8, '0')
  let out = ''
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    out += B32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)]
  }
  return out
}

function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = ''
  for (const ch of clean) {
    bits += B32_ALPHABET.indexOf(ch).toString(2).padStart(5, '0')
  }
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }
  return Buffer.from(bytes)
}

function hotp(secret: string, counter: number): string {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const hmac   = createHmac('sha1', base32Decode(secret)).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const code   = ((hmac[offset] & 0x7f) << 24) |
                 ((hmac[offset + 1] & 0xff) << 16) |
                 ((hmac[offset + 2] & 0xff) << 8) |
                 (hmac[offset + 3] & 0xff)
  return (code % 10 ** DIGITS).toString().padStart(DIGITS, '0')
}

// Accepts the current step plus one either side to tolerate clock drift.
export function verifyTotp(secret: string, code: string): boolean {
  const cleaned = code.replace(/\s+/g, '')
  if (!/^\d{6}$/.test(cleaned) || !secret) return false
  const counter = Math.floor(Date.now() / 1000 / STEP_SECONDS)
  const input   = Buffer.from(cleaned)
  for (const step of [0, -1, 1]) {
    const expected = Buffer.from(hotp(secret, counter + step))
    if (expected.length === input.length && timingSafeEqual(expected, input)) return true
  }
  return false
}

export function otpauthUri(secret: string): string {
  const label  = encodeURIComponent('APonder Admin')
  const issuer = encodeURIComponent('APonder.dev')
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=${DIGITS}&period=${STEP_SECONDS}`
}
