'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router  = useRouter()
  const [pw,     setPw]     = useState('')
  const [err,    setErr]    = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr('')

    const res = await fetch('/api/admin/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password: pw }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setErr(data.error || 'Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-[0_0_32px_rgba(59,130,246,0.4)]">
            <Terminal size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">APonder Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your admin password to continue.</p>
        </div>

        <div className="bg-dark-900 rounded-xl border border-white/[0.06] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="Admin password"
                  autoFocus
                  required
                  className="w-full bg-dark-950 border border-white/[0.08] rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={loading || !pw}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
