'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Copy, Check, Loader2, ImageOff } from 'lucide-react'

interface MediaFile {
  name:      string
  url:       string
  size:      number
  createdAt: string
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const [files,     setFiles]     = useState<MediaFile[]>([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied,      setCopied]      = useState<string | null>(null)
  const [armedDelete, setArmedDelete] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/media')
    setFiles(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    await fetch('/api/admin/upload', { method: 'POST', body: fd })
    await load()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (name: string) => {
    await fetch('/api/admin/media', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name }),
    })
    setFiles(prev => prev.filter(f => f.name !== name))
    setArmedDelete(null)
  }

  const copy = (url: string) => {
    navigator.clipboard.writeText(`https://aponder.dev${url}`)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-slate-500 text-sm mt-1">{files.length} uploaded image{files.length !== 1 ? 's' : ''}</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading…' : 'Upload Image'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden animate-pulse">
              <div className="w-full h-36 bg-white/[0.04]" />
              <div className="p-2.5 space-y-1.5">
                <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                <div className="h-2.5 bg-white/[0.04] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-white/[0.06]">
          <ImageOff size={32} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">No uploaded images yet.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-sm text-blue-400 hover:text-blue-300 mt-2 block mx-auto transition-colors"
          >
            Upload your first image →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map(f => (
            <div key={f.name} className="group bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden hover:border-blue-500/25 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url}
                alt={f.name}
                className="w-full h-36 object-cover bg-dark-950"
              />
              <div className="p-2.5">
                <p className="text-[11px] text-slate-400 font-mono truncate" title={f.name}>{f.name}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{fmtSize(f.size)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => copy(f.url)}
                    title="Copy URL"
                    className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all"
                  >
                    {copied === f.url ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied === f.url ? 'Copied' : 'Copy URL'}
                  </button>
                  {armedDelete === f.name ? (
                    <span className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleDelete(f.name)}
                        className="px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10 rounded transition-all"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setArmedDelete(null)}
                        className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-white rounded transition-colors"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setArmedDelete(f.name)}
                      title="Delete"
                      className="p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                    >
                      <Trash2 size={12} />
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
