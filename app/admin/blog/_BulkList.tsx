'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Trash2, Eye, EyeOff } from 'lucide-react'
import DeletePostButton from './_DeleteButton'

interface Post {
  id:          number
  title:       string
  slug:        string
  published:   boolean
  publishedAt: Date | string | null
  createdAt:   Date | string
  views:       number
}

export default function BulkList({ posts }: { posts: Post[] }) {
  const router  = useRouter()
  const [selected,       setSelected]       = useState<Set<number>>(new Set())
  const [busy,           setBusy]           = useState(false)
  const [armedBulkDel,   setArmedBulkDel]   = useState(false)

  const allSelected = posts.length > 0 && selected.size === posts.length
  const toggle = (id: number) => setSelected(s => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(posts.map(p => p.id)))

  const bulk = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selected.size === 0) return
    setBusy(true)
    const ids = [...selected]

    if (action === 'delete') {
      await Promise.all(ids.map(id => fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })))
    } else {
      await Promise.all(ids.map(id =>
        fetch(`/api/admin/blog/${id}`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ published: action === 'publish' }),
        })
      ))
    }

    setSelected(new Set())
    setArmedBulkDel(false)
    setBusy(false)
    router.refresh()
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-xs text-slate-400">{selected.size} selected</span>
          <button
            onClick={() => bulk('publish')}
            disabled={busy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={11} className="animate-spin" /> : <Eye size={11} />}
            Publish
          </button>
          <button
            onClick={() => bulk('unpublish')}
            disabled={busy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-white/[0.06] transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={11} className="animate-spin" /> : <EyeOff size={11} />}
            Unpublish
          </button>
          {armedBulkDel ? (
            <span className="flex items-center gap-1">
              <span className="text-xs text-red-400 mr-1">Delete {selected.size} post{selected.size !== 1 ? 's' : ''}?</span>
              <button
                onClick={() => bulk('delete')}
                disabled={busy}
                className="text-xs px-2 py-0.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/25 transition-all disabled:opacity-50"
              >
                {busy ? <Loader2 size={11} className="animate-spin inline" /> : 'Confirm'}
              </button>
              <button
                onClick={() => setArmedBulkDel(false)}
                className="text-xs px-2 py-0.5 text-slate-500 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setArmedBulkDel(true)}
              disabled={busy}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all disabled:opacity-50"
            >
              <Trash2 size={11} />
              Delete
            </button>
          )}
        </div>
      )}

      <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-white/20 bg-dark-950 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                />
              </th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Views</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Date</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => {
              const isScheduled = post.published && post.publishedAt && new Date(post.publishedAt) > new Date()
              return (
                <tr
                  key={post.id}
                  className={`hover:bg-white/[0.015] transition-colors ${i < posts.length - 1 ? 'border-b border-white/[0.04]' : ''} ${selected.has(post.id) ? 'bg-blue-500/[0.03]' : ''}`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(post.id)}
                      onChange={() => toggle(post.id)}
                      className="rounded border-white/20 bg-dark-950 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="text-sm text-white font-medium">{post.title}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isScheduled
                        ? 'bg-amber-500/10 text-amber-400'
                        : post.published
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isScheduled ? 'Scheduled' : post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 tabular-nums">{(post.views ?? 0).toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-xs px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                      >
                        Edit
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
