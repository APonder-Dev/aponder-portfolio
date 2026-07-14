'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteSubscriberButton({ id }: { id: number }) {
  const router = useRouter()
  const [armed,    setArmed]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (armed) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={async () => {
            setDeleting(true)
            await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
            router.refresh()
          }}
          disabled={deleting}
          className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-all disabled:opacity-50"
        >
          {deleting ? <Loader2 size={11} className="animate-spin" /> : 'Yes'}
        </button>
        <button
          onClick={() => setArmed(false)}
          className="text-xs px-2 py-1 text-slate-500 hover:text-white rounded transition-colors"
        >
          No
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setArmed(true)}
      className="p-1.5 text-slate-600 hover:text-red-400 rounded transition-colors"
      title="Remove subscriber"
    >
      <Trash2 size={13} />
    </button>
  )
}
