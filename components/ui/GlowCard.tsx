'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type AccentColor = 'blue' | 'cyan' | 'indigo' | 'purple' | 'emerald' | 'orange' | 'yellow' | 'none'

interface GlowCardProps {
  children: ReactNode
  className?: string
  accent?: AccentColor
  lift?: boolean
  onClick?: () => void
}

const hoverGlow: Record<AccentColor, string> = {
  blue:    'hover:border-blue-500/30   hover:shadow-[0_0_32px_rgba(59,130,246,0.18)]',
  cyan:    'hover:border-cyan-500/30   hover:shadow-[0_0_32px_rgba(6,182,212,0.18)]',
  indigo:  'hover:border-indigo-500/30 hover:shadow-[0_0_32px_rgba(99,102,241,0.18)]',
  purple:  'hover:border-purple-500/30 hover:shadow-[0_0_32px_rgba(168,85,247,0.18)]',
  emerald: 'hover:border-emerald-500/30 hover:shadow-[0_0_32px_rgba(16,185,129,0.18)]',
  orange:  'hover:border-orange-500/30 hover:shadow-[0_0_32px_rgba(249,115,22,0.18)]',
  yellow:  'hover:border-yellow-500/30 hover:shadow-[0_0_32px_rgba(234,179,8,0.18)]',
  none:    '',
}

export default function GlowCard({ children, className = '', accent = 'blue', lift = true, onClick }: GlowCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-sm
        transition-all duration-300
        ${lift ? `${hoverGlow[accent]} hover:-translate-y-1` : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
