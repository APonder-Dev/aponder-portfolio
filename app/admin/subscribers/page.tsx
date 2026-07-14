import { db } from '@/lib/db'
import { Mail } from 'lucide-react'
import DeleteSubscriberButton from './_DeleteSubscriberButton'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={`mailto:?bcc=${subscribers.map(s => s.email).join(',')}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-dark-900 border border-white/[0.08] rounded-lg text-sm text-slate-300 hover:text-white hover:border-blue-500/30 transition-all"
          >
            <Mail size={14} />
            Email all
          </a>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-white/[0.06]">
          <Mail size={28} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">No subscribers yet.</p>
          <p className="text-slate-600 text-xs mt-1">The newsletter signup on blog posts will populate this list.</p>
        </div>
      ) : (
        <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Subscribed</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr
                  key={s.id}
                  className={`hover:bg-white/[0.015] transition-colors ${i < subscribers.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${s.email}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-slate-400">{s.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end">
                      <DeleteSubscriberButton id={s.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
