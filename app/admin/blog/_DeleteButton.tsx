'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeletePostButton({ id }: { id: number }) {
  const router   = useRouter()
  const [armed,  setArmed]   = useState(false)
  const [busy,   setBusy]    = useState(false)

  if (armed) {
    return (
      <div className="flex items-center gap-1 animate-in fade-in duration-150">
        <span className="text-xs text-red-400/80 mr-0.5">Delete?</span>
        <button
          onClick={async () => {
            setBusy(true)
            await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
            router.refresh()
          }}
          disabled={busy}
          className="text-xs px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50 font-medium"
        >
          {busy ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setArmed(false)}
          className="text-xs px-2 py-1 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setArmed(true)}
      title="Delete post"
      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
    >
      <Trash2 size={13} />
    </button>
  )
}
