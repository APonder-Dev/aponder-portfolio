'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Check } from 'lucide-react'
import { useToast } from './_AdminToastContext'

interface Settings {
  available:    boolean
  availableMsg: string
  resumeUrl:    string
  calUrl:       string
}

const DEFAULT: Settings = { available: true, availableMsg: 'Available for Projects', resumeUrl: '', calUrl: '' }

const INPUT = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors'

export default function AvailabilityToggle() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>(DEFAULT)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/site_settings')
      .then(r => r.json())
      .then(d => { if (d.value) setSettings({ ...DEFAULT, ...d.value }) })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/content/site_settings', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) { toast('Settings saved'); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else toast('Failed to save', 'error')
  }

  return (
    <div className="bg-dark-900 rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-white">Availability</div>
          <div className="text-xs text-slate-500 mt-0.5">Shown as a badge in the Hero section</div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <Check size={12} /> : <Save size={12} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setSettings(s => ({ ...s, available: !s.available }))}>
          <div className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${settings.available ? 'bg-emerald-500' : 'bg-dark-700 border border-white/[0.1]'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.available ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
          <span className={`text-sm font-medium ${settings.available ? 'text-emerald-400' : 'text-slate-500'}`}>
            {settings.available ? 'Available for Work' : 'Not Available'}
          </span>
        </label>

        <div>
          <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Badge Text</label>
          <input
            value={settings.availableMsg}
            onChange={e => setSettings(s => ({ ...s, availableMsg: e.target.value }))}
            className={INPUT}
            placeholder="Available for Projects"
          />
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
            Resume / CV URL <span className="normal-case tracking-normal font-normal text-slate-600">(leave blank to hide button)</span>
          </label>
          <input
            value={settings.resumeUrl}
            onChange={e => setSettings(s => ({ ...s, resumeUrl: e.target.value }))}
            className={INPUT}
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
            Booking URL <span className="normal-case tracking-normal font-normal text-slate-600">(Cal.com / Calendly — leave blank to hide button)</span>
          </label>
          <input
            value={settings.calUrl}
            onChange={e => setSettings(s => ({ ...s, calUrl: e.target.value }))}
            className={INPUT}
            placeholder="https://cal.com/yourname"
          />
        </div>
      </div>
    </div>
  )
}
