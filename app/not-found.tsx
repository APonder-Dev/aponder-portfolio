'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Terminal, Home, MessageSquare } from 'lucide-react'

type LineType = 'cmd' | 'error' | 'output' | 'cursor'

interface Line {
  type: LineType
  text: string
  delay: number
}

const SCRIPT: Line[] = [
  { type: 'cmd',    text: 'navigate /unknown-path',                       delay: 300  },
  { type: 'error',  text: 'bash: /unknown-path: No such file or directory', delay: 750  },
  { type: 'cmd',    text: 'ls /',                                          delay: 1200 },
  { type: 'output', text: 'about  skills  projects  services  contact',    delay: 1550 },
  { type: 'cursor', text: '',                                              delay: 1900 },
]

export default function NotFound() {
  const [visible, setVisible]   = useState<Set<number>>(new Set())
  const [cursor,  setCursor]    = useState(true)

  useEffect(() => {
    const timers = SCRIPT.map((line, i) =>
      setTimeout(() => setVisible(s => new Set([...s, i])), line.delay)
    )
    const blink = setInterval(() => setCursor(p => !p), 530)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(blink)
    }
  }, [])

  return (
    <main className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6">
      {/* Giant 404 watermark */}
      <div className="text-[160px] sm:text-[200px] font-black text-white/[0.03] font-mono leading-none select-none mb-[-40px] z-0">
        404
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Terminal card */}
        <div className="rounded-xl border border-blue-500/20 bg-[#090e1a] font-mono text-sm shadow-[0_0_48px_rgba(59,130,246,0.1)] overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.015]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="flex-1 text-center text-[11px] text-slate-600">~/aponder — bash</span>
            <Terminal size={12} className="text-slate-700" />
          </div>

          {/* Body */}
          <div className="p-5 min-h-[160px] space-y-1.5">
            {SCRIPT.map((line, i) => {
              if (!visible.has(i)) return null
              if (line.type === 'cursor') {
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-400">❯</span>
                    <span
                      className={`inline-block w-[7px] h-[14px] bg-blue-400 transition-opacity duration-100 ${cursor ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                )
              }
              if (line.type === 'cmd') {
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-400">❯</span>
                    <span className="text-white">{line.text}</span>
                  </div>
                )
              }
              if (line.type === 'error') {
                return <div key={i} className="text-red-400/80 text-[12px] ml-5">{line.text}</div>
              }
              return <div key={i} className="text-cyan-400 text-[12px] ml-5">{line.text}</div>
            })}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] bg-white/[0.01] text-[11px]">
            <span className="text-slate-600 font-mono">exit code 1</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-red-400/70">Not Found</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Page not found.</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The path you hit doesn&apos;t exist on this server. Double-check the URL or head back home.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
              shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
              transition-all duration-300"
          >
            <Home size={14} /> Go Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300
              border border-white/[0.1] hover:border-blue-500/35 hover:text-white hover:bg-blue-500/[0.05]
              transition-all duration-300"
          >
            <MessageSquare size={14} /> Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
