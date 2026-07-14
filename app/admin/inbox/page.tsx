'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, Trash2, CheckCheck, MessageSquare, Archive, ChevronDown, ChevronUp, RefreshCw, Send, Loader2, X } from 'lucide-react'

interface Submission {
  id:          number
  name:        string
  email:       string
  projectType: string
  budget:      string
  message:     string
  status:      string
  createdAt:   string
}

const STATUS_TABS = [
  { key: 'all',      label: 'All'      },
  { key: 'unread',   label: 'Unread'   },
  { key: 'read',     label: 'Read'     },
  { key: 'replied',  label: 'Replied'  },
  { key: 'archived', label: 'Archived' },
]

const STATUS_COLORS: Record<string, string> = {
  unread:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read:     'bg-slate-700/40 text-slate-400 border-slate-600/30',
  replied:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  archived: 'bg-slate-800/60 text-slate-600 border-slate-700/30',
}

const INPUT = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3 py-2 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'

export default function InboxPage() {
  const [tab,      setTab]      = useState('all')
  const [items,    setItems]    = useState<Submission[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [counts,   setCounts]   = useState<Record<string, number>>({})

  // Compose state
  const [composeFor,     setComposeFor]     = useState<number | null>(null)
  const [replySubject,   setReplySubject]   = useState('')
  const [replyBody,      setReplyBody]      = useState('')
  const [sendingReply,   setSendingReply]   = useState(false)
  const [replyError,     setReplyError]     = useState('')
  const [replySentFor,   setReplySentFor]   = useState<number | null>(null)

  const load = useCallback(async (t: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/inbox?status=${t}`)
    const data: Submission[] = await res.json()
    setItems(data)
    setLoading(false)
  }, [])

  const loadCounts = useCallback(async () => {
    const tabs = ['all', 'unread', 'read', 'replied', 'archived']
    const results = await Promise.all(
      tabs.map(t => fetch(`/api/admin/inbox?status=${t}`).then(r => r.json()))
    )
    const next: Record<string, number> = {}
    tabs.forEach((t, i) => { next[t] = results[i].length })
    setCounts(next)
  }, [])

  useEffect(() => { load(tab); loadCounts() }, [tab, load, loadCounts])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/inbox/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    setItems(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    loadCounts()
  }

  const deleteItem = async (id: number) => {
    await fetch(`/api/admin/inbox/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(s => s.id !== id))
    if (expanded === id)  setExpanded(null)
    if (composeFor === id) setComposeFor(null)
    loadCounts()
  }

  const toggle = (id: number, currentStatus: string) => {
    setExpanded(prev => prev === id ? null : id)
    if (composeFor === id) setComposeFor(null)
    if (currentStatus === 'unread') updateStatus(id, 'read')
  }

  const openCompose = (s: Submission) => {
    setComposeFor(s.id)
    setReplySubject(`Re: ${s.projectType || 'Your Portfolio Inquiry'}`)
    setReplyBody(`Hey ${s.name.split(' ')[0]},\n\n`)
    setReplyError('')
    setReplySentFor(null)
  }

  const closeCompose = () => {
    setComposeFor(null)
    setReplyError('')
  }

  const sendReply = async (id: number) => {
    if (!replySubject.trim() || !replyBody.trim()) {
      setReplyError('Subject and message are required.')
      return
    }
    setSendingReply(true)
    setReplyError('')
    try {
      const res  = await fetch(`/api/admin/inbox/${id}/reply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subject: replySubject, body: replyBody }),
      })
      const data = await res.json()
      if (res.ok) {
        setReplySentFor(id)
        setComposeFor(null)
        setItems(prev => prev.map(s => s.id === id ? { ...s, status: 'replied' } : s))
        loadCounts()
      } else {
        setReplyError(data.error ?? 'Failed to send.')
      }
    } catch {
      setReplyError('Failed to send.')
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <p className="text-slate-500 text-sm mt-1">Contact form submissions from your portfolio.</p>
        </div>
        <button
          onClick={() => { load(tab); loadCounts() }}
          className="p-2 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-white/[0.06] overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
              tab === t.key
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                t.key === 'unread' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.06] text-slate-500'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-[72px] bg-dark-900 rounded-xl border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 rounded-xl border border-white/[0.06]">
          <Mail size={28} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">No messages here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(s => (
            <div
              key={s.id}
              className={`bg-dark-900 rounded-xl border overflow-hidden transition-all ${
                s.status === 'unread' ? 'border-blue-500/20' : 'border-white/[0.06]'
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => toggle(s.id, s.status)}
                className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-white/[0.015] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${s.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>
                      {s.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[s.status] ?? STATUS_COLORS.read}`}>
                      {s.status}
                    </span>
                    {s.projectType && (
                      <span className="text-[10px] text-slate-600 font-mono">{s.projectType}</span>
                    )}
                    {replySentFor === s.id && (
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Sent</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <a href={`mailto:${s.email}`} onClick={e => e.stopPropagation()} className="hover:text-blue-400 transition-colors">
                      {s.email}
                    </a>
                    {s.budget && <span>· {s.budget}</span>}
                    <span>·</span>
                    <span>{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {expanded !== s.id && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-1">{s.message}</p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 text-slate-600">
                  {expanded === s.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </button>

              {/* Expanded message */}
              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-white/[0.05]">
                  <p className="text-sm text-slate-300 leading-relaxed mt-4 whitespace-pre-wrap">{s.message}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.04] flex-wrap">
                    <button
                      onClick={() => composeFor === s.id ? closeCompose() : openCompose(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${
                        composeFor === s.id
                          ? 'bg-white/[0.06] text-slate-400'
                          : 'bg-blue-600/80 hover:bg-blue-500/80 text-white'
                      }`}
                    >
                      {composeFor === s.id ? <X size={12} /> : <MessageSquare size={12} />}
                      {composeFor === s.id ? 'Cancel' : 'Reply'}
                    </button>

                    <a
                      href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.projectType || 'Your Portfolio Inquiry')}`}
                      onClick={() => updateStatus(s.id, 'replied')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                      title="Open system mail client"
                    >
                      <Mail size={12} />
                      Open in Mail
                    </a>

                    {s.status !== 'read' && (
                      <button
                        onClick={() => updateStatus(s.id, 'read')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                      >
                        <CheckCheck size={12} />
                        Mark Read
                      </button>
                    )}
                    {s.status !== 'replied' && (
                      <button
                        onClick={() => updateStatus(s.id, 'replied')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/[0.06] rounded-lg transition-all"
                      >
                        <CheckCheck size={12} />
                        Mark Replied
                      </button>
                    )}
                    {s.status !== 'archived' && (
                      <button
                        onClick={() => updateStatus(s.id, 'archived')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-300 hover:bg-white/[0.04] rounded-lg transition-all"
                      >
                        <Archive size={12} />
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem(s.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/[0.06] rounded-lg transition-all ml-auto"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>

                  {/* Inline compose panel */}
                  {composeFor === s.id && (
                    <div className="mt-4 p-4 rounded-xl border border-blue-500/15 bg-blue-500/[0.03] space-y-3">
                      <div className="text-[10px] text-blue-400/70 font-mono uppercase tracking-widest mb-1">
                        Compose Reply → {s.email}
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Subject</label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={e => setReplySubject(e.target.value)}
                          className={INPUT}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Message</label>
                        <textarea
                          value={replyBody}
                          onChange={e => setReplyBody(e.target.value)}
                          rows={7}
                          className={`${INPUT} resize-y`}
                          placeholder={`Hey ${s.name.split(' ')[0]},\n\n`}
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                        />
                      </div>

                      {replyError && <p className="text-xs text-red-400">{replyError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sendReply(s.id)}
                          disabled={sendingReply}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                        >
                          {sendingReply ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                          {sendingReply ? 'Sending…' : 'Send Reply'}
                        </button>
                        <button
                          onClick={closeCompose}
                          className="text-sm text-slate-500 hover:text-white transition-colors px-3 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
