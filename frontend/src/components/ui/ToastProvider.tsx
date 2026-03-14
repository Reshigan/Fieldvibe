import React, { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toasts: [] as Toast[],
      addToast: (_t: Omit<Toast, 'id'>) => {},
      removeToast: (_id: string) => {},
      success: (_title: string, _msg?: string) => {},
      error: (_title: string, _msg?: string) => {},
      warning: (_title: string, _msg?: string) => {},
      info: (_title: string, _msg?: string) => {},
    }
  }
  return {
    ...ctx,
    success: (title: string, message?: string) => ctx.addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => ctx.addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => ctx.addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => ctx.addToast({ type: 'info', title, message }),
  }
}

const TOAST_COLORS = {
  success: 'bg-green-900/90 border-green-500 text-green-100',
  error: 'bg-red-900/90 border-red-500 text-red-100',
  warning: 'bg-yellow-900/90 border-yellow-500 text-yellow-100',
  info: 'bg-blue-900/90 border-blue-500 text-blue-100',
}

const TOAST_ICONS = {
  success: '\u2713',
  error: '\u2717',
  warning: '\u26A0',
  info: '\u2139',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    const newToast = { ...toast, id }
    setToasts(prev => [...prev.slice(-4), newToast])
    setTimeout(() => removeToast(id), toast.duration || 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm" role="alert" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${TOAST_COLORS[toast.type]} border-l-4 rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm animate-slide-in`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">{TOAST_ICONS[toast.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white text-lg leading-none"
                aria-label="Dismiss notification"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
