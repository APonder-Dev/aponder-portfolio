'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Terminal, LayoutDashboard, FileText, DollarSign,
  FolderOpen, ExternalLink, LogOut, Layout, Mail, Menu, X, Image,
  Users, Settings, Activity, Music,
} from 'lucide-react'
import { AdminToastProvider } from './_AdminToastContext'

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { href: '/admin',         label: 'Dashboard',    Icon: LayoutDashboard },
      { href: '/admin/content', label: 'Site Content', Icon: Layout          },
      { href: '/admin/blog',    label: 'Blog Posts',   Icon: FileText        },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/inbox',       label: 'Inbox',       Icon: Mail       },
      { href: '/admin/subscribers', label: 'Subscribers', Icon: Users      },
      { href: '/admin/media',       label: 'Media',       Icon: Image      },
      { href: '/admin/music',       label: 'Music',       Icon: Music      },
      { href: '/admin/pricing',     label: 'Pricing',     Icon: DollarSign },
      { href: '/admin/projects',    label: 'Projects',    Icon: FolderOpen },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/logs',     label: 'Activity Log', Icon: Activity },
      { href: '/admin/settings', label: 'Settings',     Icon: Settings },
    ],
  },
]

function isActive(href: string, pathname: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminToastProvider>
    <div className="min-h-screen bg-dark-950 flex">
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={`
        fixed left-0 top-0 h-screen w-56 bg-dark-900 border-r border-white/[0.06]
        flex flex-col z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-4 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Terminal size={13} className="text-white" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">APonder</div>
              <div className="text-[10px] text-slate-500 font-mono leading-tight">Admin Panel</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 text-slate-600 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <div className="px-3 mb-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-widest select-none">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = isActive(item.href, pathname)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                        active
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                      }`}
                    >
                      <item.Icon
                        size={15}
                        className={`flex-shrink-0 transition-colors ${active ? 'text-blue-400' : 'group-hover:text-blue-400'}`}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-2 py-4 border-t border-white/[0.06] space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <ExternalLink size={15} className="flex-shrink-0" />
            View Site
          </a>
          <a
            href="/api/admin/auth/logout"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
          >
            <LogOut size={15} className="flex-shrink-0" />
            Logout
          </a>
        </div>
      </aside>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="lg:ml-56 flex-1 min-h-screen flex flex-col">
        <div className="lg:hidden sticky top-0 z-20 flex items-center h-14 px-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Terminal size={10} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">APonder Admin</span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
    </AdminToastProvider>
  )
}
