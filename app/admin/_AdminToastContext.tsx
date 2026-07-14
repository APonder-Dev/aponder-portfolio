'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error'
interface ToastCtx { toast: (msg: string, type?: ToastType) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [msg,     setMsg]     = useState('')
  const [type,    setType]    = useState<ToastType>('success')
  const [visible, setVisible] = useState(false)

  const toast = useCallback((m: string, t: ToastType = 'success') => {
    setMsg(m); setType(t); setVisible(true)
    setTimeout(() => setVisible(false), 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className={`fixed bottom-6 right-6 z-[200] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-sm ${
          type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/25 text-emerald-300'
            : 'bg-red-950/90 border-red-500/25 text-red-300'
        }`}>
          {type === 'success'
            ? <CheckCircle size={15} className="shrink-0" />
            : <XCircle    size={15} className="shrink-0" />}
          {msg}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
