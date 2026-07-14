import { db } from '@/lib/db'
import Link from 'next/link'
import { FileText, DollarSign, FolderOpen, Plus, Mail, CheckCircle, Clock } from 'lucide-react'
import AvailabilityToggle from './_AvailabilityToggle'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [total, published, drafts, priceOverrides, unreadInbox] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { published: true  } }),
    db.post.count({ where: { published: false } }),
    db.priceOverride.count(),
    db.contactSubmission.count({ where: { status: 'unread' } }),
  ])

  const recentPosts = await db.post.findMany({
    take:     5,
    orderBy:  { createdAt: 'desc' },
    select:   { id: true, title: true, published: true, createdAt: true },
  })

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

      {/* Availability + Inbox */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AvailabilityToggle />
        <Link
          href="/admin/inbox"
          className="bg-dark-900 rounded-xl border border-white/[0.06] p-5 hover:border-blue-500/20 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">Contact Inbox</div>
              <div className="text-xs text-slate-500 mt-1">Form submissions from your portfolio</div>
            </div>
            {unreadInbox > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono flex-shrink-0">
                {unreadInbox} new
              </span>
            )}
          </div>
          <div className={`text-2xl font-bold mt-3 ${unreadInbox > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
            {unreadInbox > 0 ? `${unreadInbox} unread` : 'No new messages'}
          </div>
        </Link>
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
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
              Recent Posts
            </h2>
            <Link href="/admin/blog" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="bg-dark-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {recentPosts.map((post, i) => (
              <div
                key={post.id}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.015] transition-colors ${i < recentPosts.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-sm text-white hover:text-blue-300 transition-colors font-medium truncate"
                >
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
