import { db } from '@/lib/db'
import { Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

const ACTION_COLORS: Record<string, string> = {
  // blog
  post_created:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  post_updated:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  post_deleted:   'text-red-400 bg-red-500/10 border-red-500/20',
  post_published: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  post_broadcast: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  // content
  content_updated: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  // projects
  project_created: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  project_updated: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  project_deleted: 'text-red-400 bg-red-500/10 border-red-500/20',
  project_hidden:  'text-slate-400 bg-slate-800/50 border-slate-700/50',
  project_shown:   'text-teal-400 bg-teal-500/10 border-teal-500/20',
  // media
  media_uploaded: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  media_deleted:  'text-red-400 bg-red-500/10 border-red-500/20',
  // inbox
  inbox_replied:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  inbox_archived:  'text-slate-400 bg-slate-800/50 border-slate-700/50',
  inbox_deleted:   'text-red-400 bg-red-500/10 border-red-500/20',
  // subscribers
  subscriber_removed: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  // pricing & settings
  pricing_updated:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  password_changed: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

export default async function LogsPage() {
  const logs = await db.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-slate-500 text-sm mt-1">Last {logs.length} admin actions</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-white/[0.06]">
          <Activity size={28} className="mx-auto text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="bg-dark-900 rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
          {logs.map(log => {
            const color = ACTION_COLORS[log.action] ?? 'text-slate-400 bg-slate-800/50 border-slate-700/50'
            const ts = new Date(log.createdAt)
            return (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors">
                <span className={`mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${color}`}>
                  {log.action.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{log.detail || '—'}</p>
                </div>
                <time className="text-xs text-slate-600 flex-shrink-0 mt-0.5 tabular-nums">
                  {ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' '}
                  {ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </time>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
