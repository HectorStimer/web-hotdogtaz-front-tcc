import React, { createContext, useContext, useState, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: number
  message: string
  type: ToastType
}

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({
  show: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function show(message: string, type: ToastType = 'info') {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-sm border ${
              t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : t.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export default ToastContext
