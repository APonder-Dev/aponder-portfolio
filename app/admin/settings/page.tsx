'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  KeyRound, Loader2, CheckCircle, Eye, EyeOff, BarChart3, Wrench,
  ShieldAlert, ShieldCheck, FileText, ArrowRightLeft, Plus, Trash2,
  Save, Check, Copy,
} from 'lucide-react'

const INPUT = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'
const LABEL = 'block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5'

const GA_ID_RE = /^G-[A-Z0-9]{4,20}$/

// ── Shared bits ──────────────────────────────────────────────────

const TONES = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/[0.08]'    },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/[0.08]'   },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/[0.08]'    },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]' },
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/[0.08]'  },
  orange:  { icon: 'text-orange-400',  bg: 'bg-orange-500/[0.08]'  },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-500/[0.08]'  },
} as const

function Card({ Icon, title, subtitle, tone = 'blue', children }: {
  Icon: typeof KeyRound; title: string; subtitle: string
  tone?: keyof typeof TONES; children: ReactNode
}) {
  const t = TONES[tone]
  return (
    <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
        <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={14} className={t.icon} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white leading-tight">{title}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">{subtitle}</div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onClick}
        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
          on ? 'bg-blue-500' : 'bg-dark-700 border border-white/[0.1]'
        }`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}

function SaveButton({ saving, saved, onClick, label = 'Save' }: {
  saving: boolean; saved: boolean; onClick: () => void; label?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
    >
      {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
      {saved ? 'Saved!' : saving ? 'Saving…' : label}
    </button>
  )
}

// Loads a SiteContent key, merges over defaults, exposes save().
function useSetting<T extends object>(key: string, defaults: T) {
  const [data,    setData]    = useState<T>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    fetch(`/api/admin/content/${key}`)
      .then(r => r.json())
      .then(({ value }) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          setData(d => ({ ...d, ...value }))
        }
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const save = useCallback(async (payload?: T) => {
    setSaving(true)
    const res = await fetch(`/api/admin/content/${key}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload ?? data),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    return res.ok
  }, [key, data])

  return { data, setData, loading, saving, saved, save }
}

// ── Maintenance ──────────────────────────────────────────────────

function MaintenanceCard() {
  const { data, setData, loading, saving, saved, save } = useSetting('maintenance', {
    enabled: false, message: '',
  })

  if (loading) return <Card tone="amber" Icon={Wrench} title="Maintenance Mode" subtitle="Loading…"><div className="h-20 bg-white/[0.03] rounded-lg animate-pulse" /></Card>

  return (
    <Card tone="amber" Icon={Wrench} title="Maintenance Mode" subtitle="Show a 'back soon' page to visitors; /admin stays accessible">
      <div className="space-y-4">
        <Toggle
          on={data.enabled}
          onClick={() => setData(d => ({ ...d, enabled: !d.enabled }))}
          label="Maintenance mode active"
        />
        {data.enabled && (
          <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
            The public site is hidden while this is on. Changes apply within ~10 seconds of saving.
          </div>
        )}
        <div>
          <label className={LABEL}>Message (optional)</label>
          <textarea
            value={data.message}
            onChange={e => setData(d => ({ ...d, message: e.target.value }))}
            placeholder="The site is getting an upgrade. Check back in a little while."
            rows={2}
            className={INPUT + ' resize-none'}
          />
        </div>
        <SaveButton saving={saving} saved={saved} onClick={() => save()} label="Save Maintenance" />
      </div>
    </Card>
  )
}

// ── Security (login lockout) ─────────────────────────────────────

function SecurityCard() {
  const { data, setData, loading, saving, saved, save } = useSetting('security', {
    loginLimit: 10, loginWindowMins: 15,
  })

  if (loading) return <Card tone="orange" Icon={ShieldAlert} title="Login Lockout" subtitle="Loading…"><div className="h-20 bg-white/[0.03] rounded-lg animate-pulse" /></Card>

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(v) || min))

  return (
    <Card tone="orange" Icon={ShieldAlert} title="Login Lockout" subtitle="Rate-limit failed admin login attempts per IP">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Max attempts</label>
            <input
              type="number" min={3} max={100}
              value={data.loginLimit}
              onChange={e => setData(d => ({ ...d, loginLimit: clamp(parseInt(e.target.value), 3, 100) }))}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Window (minutes)</label>
            <input
              type="number" min={1} max={1440}
              value={data.loginWindowMins}
              onChange={e => setData(d => ({ ...d, loginWindowMins: clamp(parseInt(e.target.value), 1, 1440) }))}
              className={INPUT}
            />
          </div>
        </div>
        <p className="text-xs text-slate-600">
          Currently: lock an IP out after {data.loginLimit} failed attempts within {data.loginWindowMins} minutes.
        </p>
        <SaveButton saving={saving} saved={saved} onClick={() => save()} label="Save Security" />
      </div>
    </Card>
  )
}

// ── Two-factor auth ──────────────────────────────────────────────

function TwoFactorCard() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [setup,   setSetup]   = useState<{ secret: string; uri: string } | null>(null)
  const [code,    setCode]    = useState('')
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')
  const [copied,  setCopied]  = useState(false)

  const refresh = useCallback(() => {
    fetch('/api/admin/totp')
      .then(r => r.json())
      .then(d => setEnabled(!!d.enabled))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const post = async (body: object) => {
    setBusy(true)
    setError('')
    const res  = await fetch('/api/admin/totp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return null }
    return data
  }

  const startSetup = async () => {
    const data = await post({ action: 'setup' })
    if (data?.secret) { setSetup({ secret: data.secret, uri: data.uri }); setCode('') }
  }

  const confirmEnable = async () => {
    const data = await post({ action: 'enable', code })
    if (data?.ok) { setEnabled(true); setSetup(null); setCode('') }
  }

  const disable = async () => {
    const data = await post({ action: 'disable', code })
    if (data?.ok) { setEnabled(false); setCode('') }
  }

  const copySecret = () => {
    if (!setup) return
    navigator.clipboard.writeText(setup.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <Card tone="emerald" Icon={ShieldCheck} title="Two-Factor Authentication" subtitle="Loading…"><div className="h-20 bg-white/[0.03] rounded-lg animate-pulse" /></Card>

  return (
    <Card tone="emerald" Icon={ShieldCheck} title="Two-Factor Authentication" subtitle="Require an authenticator-app code at login (TOTP)">
      <div className="space-y-4">
        <div className={`flex items-center gap-2 text-sm ${enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          {enabled ? '2FA is enabled' : '2FA is disabled'}
        </div>

        {!enabled && !setup && (
          <button
            onClick={startSetup}
            disabled={busy}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
            Set Up 2FA
          </button>
        )}

        {!enabled && setup && (
          <div className="space-y-4">
            <div>
              <label className={LABEL}>1. Add this secret to your authenticator app</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2.5 rounded-lg bg-dark-950 border border-white/[0.08] text-sm text-blue-300 font-mono tracking-wider break-all select-all">
                  {setup.secret}
                </code>
                <button
                  onClick={copySecret}
                  className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all flex-shrink-0"
                  aria-label="Copy secret"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                In Google Authenticator / Authy / 1Password: add account → enter setup key → time-based.
                Or open this link on a device with your authenticator installed:{' '}
                <a href={setup.uri} className="text-blue-400 hover:text-blue-300 break-all">otpauth link</a>
              </p>
            </div>
            <div>
              <label className={LABEL}>2. Enter the 6-digit code it shows</label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className={INPUT + ' font-mono tracking-[0.3em] w-40'}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmEnable}
                disabled={busy || code.length !== 6}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Verify &amp; Enable
              </button>
              <button
                onClick={() => { setSetup(null); setCode(''); setError('') }}
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {enabled && (
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Enter a current code to disable</label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className={INPUT + ' font-mono tracking-[0.3em] w-40'}
              />
            </div>
            <button
              onClick={disable}
              disabled={busy || code.length !== 6}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all disabled:opacity-40"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <ShieldAlert size={13} />}
              Disable 2FA
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </Card>
  )
}

// ── Blog defaults ────────────────────────────────────────────────

function BlogCard() {
  const { data, setData, loading, saving, saved, save } = useSetting('blog_settings', {
    postsPerPage: 0, defaultOgImage: '', showNewsletter: true,
  })

  if (loading) return <Card tone="indigo" Icon={FileText} title="Blog Defaults" subtitle="Loading…"><div className="h-20 bg-white/[0.03] rounded-lg animate-pulse" /></Card>

  return (
    <Card tone="indigo" Icon={FileText} title="Blog Defaults" subtitle="Pagination, share image fallback, and newsletter section">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Posts per page</label>
            <input
              type="number" min={0} max={50}
              value={data.postsPerPage}
              onChange={e => setData(d => ({ ...d, postsPerPage: Math.min(50, Math.max(0, parseInt(e.target.value) || 0)) }))}
              className={INPUT}
            />
            <p className="text-[11px] text-slate-600 mt-1">0 = show all posts on one page</p>
          </div>
          <div>
            <label className={LABEL}>Default OG image URL</label>
            <input
              value={data.defaultOgImage}
              onChange={e => setData(d => ({ ...d, defaultOgImage: e.target.value }))}
              placeholder="/uploads/…  or  https://…"
              className={INPUT + ' font-mono text-xs'}
            />
            <p className="text-[11px] text-slate-600 mt-1">Used when a post has no cover image</p>
          </div>
        </div>
        <Toggle
          on={data.showNewsletter}
          onClick={() => setData(d => ({ ...d, showNewsletter: !d.showNewsletter }))}
          label="Show newsletter signup under posts"
        />
        <SaveButton saving={saving} saved={saved} onClick={() => save()} label="Save Blog Defaults" />
      </div>
    </Card>
  )
}

// ── Redirects ────────────────────────────────────────────────────

interface Redirect { from: string; to: string }

function RedirectsCard() {
  const [rules,   setRules]   = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/admin/content/redirects')
      .then(r => r.json())
      .then(({ value }) => { if (Array.isArray(value)) setRules(value) })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setError('')
    const cleaned = rules
      .map(r => ({ from: r.from.trim(), to: r.to.trim() }))
      .filter(r => r.from || r.to)
    const bad = cleaned.find(r =>
      !r.from.startsWith('/') || !r.to || (!r.to.startsWith('/') && !/^https?:\/\//.test(r.to)) || r.from === r.to
    )
    if (bad) {
      setError('"From" must be a path starting with /. "To" must be a path or full URL, and different from "From".')
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/content/redirects', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleaned),
    })
    setSaving(false)
    if (res.ok) {
      setRules(cleaned)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (loading) return <Card tone="cyan" Icon={ArrowRightLeft} title="Redirects" subtitle="Loading…"><div className="h-20 bg-white/[0.03] rounded-lg animate-pulse" /></Card>

  return (
    <Card tone="cyan" Icon={ArrowRightLeft} title="Redirects" subtitle="Send old URLs to new ones (applies within ~10s of saving)">
      <div className="space-y-3">
        {rules.length === 0 && (
          <p className="text-sm text-slate-600">No redirects yet.</p>
        )}
        {rules.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={r.from}
              onChange={e => setRules(prev => prev.map((x, n) => n === i ? { ...x, from: e.target.value } : x))}
              placeholder="/old-path"
              className={INPUT + ' font-mono text-xs'}
              aria-label={`Redirect ${i + 1} from`}
            />
            <ArrowRightLeft size={13} className="text-slate-600 flex-shrink-0" />
            <input
              value={r.to}
              onChange={e => setRules(prev => prev.map((x, n) => n === i ? { ...x, to: e.target.value } : x))}
              placeholder="/new-path or https://…"
              className={INPUT + ' font-mono text-xs'}
              aria-label={`Redirect ${i + 1} to`}
            />
            <button
              onClick={() => setRules(prev => prev.filter((_, n) => n !== i))}
              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
              aria-label="Remove redirect"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setRules(prev => [...prev, { from: '', to: '' }])}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-white/[0.12] text-sm text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
          >
            <Plus size={13} />
            Add Redirect
          </button>
          <SaveButton saving={saving} saved={saved} onClick={save} label="Save Redirects" />
        </div>
      </div>
    </Card>
  )
}

// ── Analytics ────────────────────────────────────────────────────

function AnalyticsCard() {
  const [gaId,    setGaId]    = useState('')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/admin/content/analytics')
      .then(res => res.json())
      .then(data => setGaId(data?.value?.gaId ?? ''))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = gaId.trim().toUpperCase()
    if (trimmed && !GA_ID_RE.test(trimmed)) {
      setError('That does not look like a GA4 measurement ID (format: G-XXXXXXXXXX).')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content/analytics', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ gaId: trimmed }),
      })
      if (res.ok) {
        setGaId(trimmed)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError('Failed to save.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card tone="purple" Icon={BarChart3} title="Google Analytics" subtitle="GA4 tracking loads on all public pages when an ID is set">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="ga-id" className={LABEL}>Measurement ID</label>
          <input
            id="ga-id"
            type="text"
            value={gaId}
            onChange={e => setGaId(e.target.value)}
            placeholder={loading ? 'Loading…' : 'G-XXXXXXXXXX'}
            disabled={loading}
            className={INPUT + ' font-mono'}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs text-slate-600 mt-1.5">
            Found in Google Analytics under Admin → Data Streams. Leave empty to disable tracking.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle size={14} />
            {gaId ? 'Analytics ID saved.' : 'Analytics disabled.'}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? 'Saving…' : 'Save Analytics'}
        </button>
      </form>
    </Card>
  )
}

// ── Password ─────────────────────────────────────────────────────

function PasswordCard() {
  const [current,     setCurrent]     = useState('')
  const [next,        setNext]        = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [saving,      setSaving]      = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    setSaving(true)
    try {
      const res  = await fetch('/api/admin/auth/password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ current, next }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setCurrent('')
        setNext('')
        setConfirm('')
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError(data.error ?? 'Failed to update password.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card Icon={KeyRound} title="Change Password" subtitle="Stored securely as a hashed value in the database">
      <form onSubmit={handleSubmit} className="space-y-4">
        {([
          { label: 'Current Password', val: current, set: setCurrent, show: showCurrent, setShow: setShowCurrent, complete: 'current-password', placeholder: 'Your current password' },
          { label: 'New Password',     val: next,    set: setNext,    show: showNext,    setShow: setShowNext,    complete: 'new-password',     placeholder: 'At least 8 characters' },
          { label: 'Confirm New Password', val: confirm, set: setConfirm, show: showConfirm, setShow: setShowConfirm, complete: 'new-password', placeholder: 'Repeat new password' },
        ] as const).map(({ label, val, set, show, setShow, complete, placeholder }) => (
          <div key={label}>
            <label className={LABEL}>{label}</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={val}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                required
                className={INPUT + ' pr-10'}
                autoComplete={complete}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle size={14} />
            Password updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Site behavior, security, and account settings</p>
      </div>

      {/* Site */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono mb-3">Site</h2>
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-4">
            <MaintenanceCard />
            <AnalyticsCard />
          </div>
          <div className="space-y-4">
            <BlogCard />
            <RedirectsCard />
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono mb-3">Security</h2>
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-4">
            <TwoFactorCard />
            <SecurityCard />
          </div>
          <div className="space-y-4">
            <PasswordCard />
          </div>
        </div>
      </section>
    </div>
  )
}
