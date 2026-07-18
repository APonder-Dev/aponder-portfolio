import { Terminal, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import { getMaintenanceSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'Under Maintenance — APonder.dev',
  robots: { index: false, follow: false },
}

export default async function MaintenancePage() {
  const { message } = await getMaintenanceSettings()

  return (
    <main className="min-h-screen bg-dark-950 grid-bg flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
          <Terminal size={24} className="text-white" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono mb-5 ml-3 align-top mt-3">
          <Wrench size={12} />
          MAINTENANCE
        </div>

        <h1 className="text-3xl font-black text-white leading-tight">
          Be right back.
        </h1>
        <p className="text-slate-400 mt-4 leading-relaxed">
          {message || 'The site is getting an upgrade. Check back in a little while.'}
        </p>

        <p className="text-[11px] text-slate-600 font-mono mt-10">
          APONDER.DEV — scheduled maintenance
        </p>
      </div>
    </main>
  )
}
