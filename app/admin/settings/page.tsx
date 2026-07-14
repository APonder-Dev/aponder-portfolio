'use client'

import { useState } from 'react'
import { KeyRound, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

const INPUT = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'

export default function SettingsPage() {
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
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Admin account settings</p>
      </div>

      <div className="bg-dark-900 rounded-xl border border-white/[0.06] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <KeyRound size={14} className="text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Change Password</div>
            <div className="text-xs text-slate-500 mt-0.5">Stored securely as a hashed value in the database</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {([
            { label: 'Current Password', val: current, set: setCurrent, show: showCurrent, setShow: setShowCurrent, complete: 'current-password', placeholder: 'Your current password' },
            { label: 'New Password',     val: next,    set: setNext,    show: showNext,    setShow: setShowNext,    complete: 'new-password',     placeholder: 'At least 8 characters' },
            { label: 'Confirm New Password', val: confirm, set: setConfirm, show: showConfirm, setShow: setShowConfirm, complete: 'new-password', placeholder: 'Repeat new password' },
          ] as const).map(({ label, val, set, show, setShow, complete, placeholder }) => (
            <div key={label}>
              <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5">{label}</label>
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
      </div>
    </div>
  )
}
