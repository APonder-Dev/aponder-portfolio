'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Upload, Trash2, Loader2, Music, ChevronUp, ChevronDown,
  Eye, EyeOff, Check, Pencil, X, Play, Pause, Settings2, Save,
} from 'lucide-react'

interface Track {
  id:        number
  title:     string
  artist:    string
  url:       string
  enabled:   boolean
  sortOrder: number
  createdAt: string
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70'

interface WidgetSettings {
  enabled:       boolean
  autoplay:      boolean
  defaultVolume: number
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
        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${focusRing} ${
          on ? 'bg-blue-500' : 'bg-dark-700 border border-white/[0.1]'
        }`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}

function WidgetSettingsCard() {
  const [settings, setSettings] = useState<WidgetSettings>({ enabled: true, autoplay: true, defaultVolume: 0.05 })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/music_settings')
      .then(r => r.json())
      .then(({ value }) => { if (value) setSettings(s => ({ ...s, ...value })) })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/content/music_settings', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  return (
    <div className="bg-dark-900 rounded-xl border border-white/[0.06] p-5 mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Settings2 size={14} className="text-blue-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Widget Settings</div>
          <div className="text-xs text-slate-500 mt-0.5">How the player behaves for visitors</div>
        </div>
      </div>

      {loading ? (
        <div className="h-24 bg-white/[0.03] rounded-lg animate-pulse" />
      ) : (
        <div className="space-y-4 max-w-md">
          <Toggle
            on={settings.enabled}
            onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
            label="Show music widget on the site"
          />
          <Toggle
            on={settings.autoplay}
            onClick={() => setSettings(s => ({ ...s, autoplay: !s.autoplay }))}
            label="Autoplay for new visitors"
          />
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-300">Default volume</span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {Math.round(settings.defaultVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.defaultVolume}
              onChange={e => setSettings(s => ({ ...s, defaultVolume: parseFloat(e.target.value) }))}
              className={`mw-range w-full ${focusRing}`}
              style={{ ['--mw-fill' as string]: `${settings.defaultVolume * 100}%` }}
              aria-label="Default volume"
            />
            <p className="text-[11px] text-slate-600 mt-1">
              Applies to first-time visitors; returning visitors keep their own saved volume.
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 cursor-pointer ${focusRing}`}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function MusicPage() {
  const [tracks,    setTracks]    = useState<Track[]>([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [armedDelete, setArmedDelete] = useState<number | null>(null)
  const [editing,     setEditing]     = useState<number | null>(null)
  const [editTitle,   setEditTitle]   = useState('')
  const [editArtist,  setEditArtist]  = useState('')
  const [previewId,   setPreviewId]   = useState<number | null>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLAudioElement | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/music')
    setTracks(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Stop preview audio when leaving the page.
  useEffect(() => () => { previewRef.current?.pause() }, [])

  const togglePreview = (t: Track) => {
    if (previewId === t.id) {
      previewRef.current?.pause()
      setPreviewId(null)
      return
    }
    previewRef.current?.pause()
    const audio = new Audio(t.url)
    audio.onended = () => setPreviewId(null)
    audio.play().catch(() => setPreviewId(null))
    previewRef.current = audio
    setPreviewId(t.id)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/music/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? 'Upload failed.')
    }
    await load()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const patch = async (id: number, data: Partial<Pick<Track, 'title' | 'artist' | 'enabled'>>) => {
    const res = await fetch(`/api/admin/music/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setTracks(prev => prev.map(t => (t.id === id ? updated : t)))
    }
  }

  const handleDelete = async (id: number) => {
    if (previewId === id) {
      previewRef.current?.pause()
      setPreviewId(null)
    }
    await fetch(`/api/admin/music/${id}`, { method: 'DELETE' })
    setTracks(prev => prev.filter(t => t.id !== id))
    setArmedDelete(null)
  }

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...tracks]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setTracks(next)
    await fetch('/api/admin/music', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ order: next.map(t => t.id) }),
    })
  }

  const startEdit = (t: Track) => {
    setEditing(t.id)
    setEditTitle(t.title)
    setEditArtist(t.artist)
  }

  const saveEdit = async (id: number) => {
    await patch(id, { title: editTitle, artist: editArtist })
    setEditing(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Music</h1>
          <p className="text-slate-500 text-sm mt-1">
            {tracks.length} track{tracks.length !== 1 ? 's' : ''} · enabled tracks appear in the site player
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,.mp3,.ogg,.wav,.m4a,.flac"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 cursor-pointer ${focusRing}`}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading…' : 'Upload Track'}
          </button>
        </div>
      </div>

      <WidgetSettingsCard />

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400"
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className={`p-1 text-red-400/70 hover:text-red-300 rounded cursor-pointer ${focusRing}`}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] bg-dark-900 rounded-xl border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-white/[0.06]">
          <Music size={32} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">No tracks uploaded yet.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className={`text-sm text-blue-400 hover:text-blue-300 mt-2 block mx-auto transition-colors cursor-pointer ${focusRing} rounded`}
          >
            Upload your first track →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((t, i) => (
            <div
              key={t.id}
              className={`bg-dark-900 rounded-xl border p-3 sm:p-4 transition-all ${
                t.enabled
                  ? 'border-white/[0.06] hover:border-blue-500/20'
                  : 'border-white/[0.03] opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col flex-shrink-0">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className={`p-1 text-slate-600 hover:text-white rounded disabled:opacity-30 disabled:hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-default ${focusRing}`}
                    aria-label="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === tracks.length - 1}
                    className={`p-1 text-slate-600 hover:text-white rounded disabled:opacity-30 disabled:hover:text-slate-600 transition-colors cursor-pointer disabled:cursor-default ${focusRing}`}
                    aria-label="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <button
                  onClick={() => togglePreview(t)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${focusRing} ${
                    previewId === t.id
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-[0_0_14px_rgba(59,130,246,0.35)]'
                      : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  }`}
                  aria-label={previewId === t.id ? `Stop preview of ${t.title}` : `Preview ${t.title}`}
                >
                  {previewId === t.id ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                </button>

                <div className="flex-1 min-w-0">
                  {editing === t.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(t.id); if (e.key === 'Escape') setEditing(null) }}
                        placeholder="Title"
                        autoFocus
                        className={`px-2.5 py-1.5 bg-dark-950 border border-white/[0.08] rounded-lg text-sm text-white focus:border-blue-500/40 outline-none w-44 ${focusRing}`}
                        aria-label="Track title"
                      />
                      <input
                        value={editArtist}
                        onChange={e => setEditArtist(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(t.id); if (e.key === 'Escape') setEditing(null) }}
                        placeholder="Artist (optional)"
                        className={`px-2.5 py-1.5 bg-dark-950 border border-white/[0.08] rounded-lg text-sm text-white focus:border-blue-500/40 outline-none w-36 ${focusRing}`}
                        aria-label="Artist"
                      />
                      <button
                        onClick={() => saveEdit(t.id)}
                        className={`p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer ${focusRing}`}
                        aria-label="Save"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className={`p-2 text-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer ${focusRing}`}
                        aria-label="Cancel"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-white font-medium truncate">{t.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {t.artist || <span className="text-slate-600 italic">No artist</span>}
                      </p>
                    </>
                  )}
                </div>

                {!t.enabled && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-slate-500 border border-white/[0.06] flex-shrink-0">
                    Hidden
                  </span>
                )}

                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  {editing !== t.id && (
                    <button
                      onClick={() => startEdit(t)}
                      title="Edit title / artist"
                      className={`p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer ${focusRing}`}
                      aria-label={`Edit ${t.title}`}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => patch(t.id, { enabled: !t.enabled })}
                    title={t.enabled ? 'Disable (hide from player)' : 'Enable'}
                    className={`p-2.5 rounded-lg transition-all cursor-pointer ${focusRing} ${
                      t.enabled
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-slate-600 hover:text-white hover:bg-white/[0.05]'
                    }`}
                    aria-label={t.enabled ? `Disable ${t.title}` : `Enable ${t.title}`}
                  >
                    {t.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  {armedDelete === t.id ? (
                    <span className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className={`px-2.5 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer ${focusRing}`}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setArmedDelete(null)}
                        className={`px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-white rounded-lg transition-colors cursor-pointer ${focusRing}`}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setArmedDelete(t.id)}
                      title="Delete"
                      className={`p-2.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer ${focusRing}`}
                      aria-label={`Delete ${t.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
