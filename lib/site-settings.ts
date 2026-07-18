import { db } from './db'

// Typed accessors for admin-managed settings stored in SiteContent.
// Each returns its defaults when the row is missing or malformed.

export interface MusicSettings {
  enabled:       boolean
  autoplay:      boolean
  defaultVolume: number
}

export interface MaintenanceSettings {
  enabled: boolean
  message: string
}

export interface SecuritySettings {
  loginLimit:      number
  loginWindowMins: number
}

export interface BlogSettings {
  postsPerPage:   number // 0 = show all
  defaultOgImage: string
  showNewsletter: boolean
}

export interface RedirectRule {
  from: string
  to:   string
}

export interface TotpConfig {
  enabled: boolean
  secret:  string
}

export const DEFAULT_MUSIC_SETTINGS: MusicSettings = {
  enabled: true, autoplay: true, defaultVolume: 0.05,
}
export const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false, message: '',
}
export const DEFAULT_SECURITY: SecuritySettings = {
  loginLimit: 10, loginWindowMins: 15,
}
export const DEFAULT_BLOG_SETTINGS: BlogSettings = {
  postsPerPage: 0, defaultOgImage: '', showNewsletter: true,
}

async function readObject<T extends object>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.siteContent.findUnique({ where: { key } })
    if (!row) return fallback
    const parsed = JSON.parse(row.value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed }
    }
    return fallback
  } catch {
    return fallback
  }
}

export const getMusicSettings       = () => readObject('music_settings', DEFAULT_MUSIC_SETTINGS)
export const getMaintenanceSettings = () => readObject('maintenance', DEFAULT_MAINTENANCE)
export const getSecuritySettings    = () => readObject('security', DEFAULT_SECURITY)
export const getBlogSettings        = () => readObject('blog_settings', DEFAULT_BLOG_SETTINGS)
export const getTotpConfig          = () => readObject<TotpConfig>('totp_config', { enabled: false, secret: '' })

export async function getRedirects(): Promise<RedirectRule[]> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: 'redirects' } })
    if (!row) return []
    const parsed = JSON.parse(row.value)
    return Array.isArray(parsed)
      ? parsed.filter((r): r is RedirectRule => !!r && typeof r.from === 'string' && typeof r.to === 'string')
      : []
  } catch {
    return []
  }
}

export async function setTotpConfig(config: TotpConfig): Promise<void> {
  await db.siteContent.upsert({
    where:  { key: 'totp_config' },
    create: { key: 'totp_config', value: JSON.stringify(config) },
    update: { value: JSON.stringify(config) },
  })
}
