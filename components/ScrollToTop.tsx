'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 700)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-dark-800/90 backdrop-blur-sm border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.08] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-200 shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp size={17} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
