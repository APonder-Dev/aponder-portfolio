import { db } from '@/lib/db'
import Link from 'next/link'
import { FileText, DollarSign, FolderOpen, Plus, Mail, CheckCircle, Clock, Activity } from 'lucide-react'
import AvailabilityToggle from './_AvailabilityToggle'

const LOG_COLORS: Record<string, string> = {
  post_created:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  post_updated:       'text-blue-400 bg-blue-500/10 border-blue-500/20',
  post_deleted:       'text-red-400 bg-red-500/10 border-red-500/20',
  post_published:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  post_broadcast:     'text-purple-400 bg-purple-500/10 border-purple-500/20',
  content_updated:    'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  project_created:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  project_updated:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  project_deleted:    'text-red-400 bg-red-500/10 border-red-500/20',
  project_hidden:     'text-slate-400 bg-slate-800/50 border-slate-700/50',
  project_shown:      'text-teal-400 bg-teal-500/10 border-teal-500/20',
  media_uploaded:     'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  media_deleted:      'text-red-400 bg-red-500/10 border-red-500/20',
  inbox_replied:      'text-blue-400 bg-blue-500/10 border-blue-500/20',
  inbox_archived:     'text-slate-400 bg-slate-800/50 border-slate-700/50',
  inbox_deleted:      'text-red-400 bg-red-500/10 border-red-500/20',
  subscriber_removed: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  pricing_updated:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  password_changed:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [total, published, drafts, priceOverrides, unreadInbox] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { published: true  } }),
    db.post.count({ where: { published: false } }),
    db.priceOverride.count(),
    db.contactSubmission.count({ where: { status: 'unread' } }),
  ])

  const [recentPosts, recentLogs] = await Promise.all([
    db.post.findMany({
      take:    5,
      orderBy: { createdAt: 'desc' },
      select:  { id: true, title: true, published: true, createdAt: true },
    }),
    db.adminLog.findMany({
      take:    5,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const STATS = [
    { label: 'Total Posts',     value: total,          color: 'text-blue-400',    bg: 'bg-blue-500/[0.08]',    Icon: FileText     },
    { label: 'Published',       value: published,      color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', Icon: CheckCircle  },
    { label: 'Drafts',          value: drafts,         color: 'text-amber-400',   bg: 'bg-amber-500/[0.08]',   Icon: Clock        },
    { label: 'Price Overrides', value: priceOverrides, color: 'text-purple-400',  bg: 'bg-purple-500/[0.08]',  Icon: DollarSign   },
  ]

  const ACTIONS = [
    { href: '/admin/blog/new',  label: 'New Blog Post',    Icon: Plus,       desc: 'Write and publish a devlog or article',   iconCls: 'text-blue-400'    },
    { href: '/admin/pricing',   label: 'Edit Pricing',     Icon: DollarSign, desc: 'Override plan prices on the live site',   iconCls: 'text-cyan-400'    },
    { href: '/admin/projects',  label: 'Manage Projects',  Icon: FolderOpen, desc: 'Show/hide projects and add custom ones',  iconCls: 'text-indigo-400'  },
    { href: '/admin/inbox',     label: 'View Inbox',       Icon: Mail,       desc: `${unreadInbox} unread message${unreadInbox !== 1 ? 's' : ''}`, iconCls: 'text-emerald-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Anthony.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-dark-900 rounded-xl border border-white/[0.06] p-5">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.Icon size={16} className={s.color} />
            </div>
            <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Availability + Recent Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AvailabilityToggle />
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Recent Activity</h2>
            <Link href="/admin/logs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          {recentLogs.length === 0 ? (
            <div className="bg-dark-900 rounded-xl border border-white/[0.06] flex items-center justify-center py-10">
              <div className="text-center">
                <Activity size={20} className="mx-auto text-slate-700 mb-2" />
                <p className="text-xs text-slate-600">No activity yet.</p>
              </div>
            </div>
          ) : (
            <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
              {recentLogs.map((log, i) => {
                const color = LOG_COLORS[log.action] ?? 'text-slate-400 bg-slate-800/50 border-slate-700/50'
                const ts = new Date(log.createdAt)
                return (
                  <div
                    key={log.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.015] transition-colors ${i < recentLogs.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                  >
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${color}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 truncate flex-1">{log.detail || '—'}</span>
                    <time className="text-[11px] text-slate-600 flex-shrink-0 tabular-nums">
                      {ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </time>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ACTIONS.map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-dark-900 rounded-xl border border-white/[0.06] p-5 hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all group"
          >
            <a.Icon size={20} className={`${a.iconCls} mb-3`} />
            <div className="font-medium text-white group-hover:text-blue-200 transition-colors">{a.label}</div>
            <div className="text-sm text-slate-500 mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Recent Posts</h2>
            <Link href="/admin/blog" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
          </div>
          <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {recentPosts.map((post, i) => (
              <div
                key={post.id}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.015] transition-colors ${i < recentPosts.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <Link href={`/admin/blog/${post.id}`} className="text-sm text-white hover:text-blue-300 transition-colors font-medium truncate">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-slate-600 hidden sm:block">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
