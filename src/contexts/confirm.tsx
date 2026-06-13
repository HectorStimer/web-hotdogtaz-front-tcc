import React, { createContext, useContext, useState, ReactNode } from 'react'

type ConfirmOptions = {
  title?: string
  confirmText?: string
  cancelText?: string
}

type ConfirmContextValue = (message: string, opts?: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmContextValue>(() => Promise.resolve(false))

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<null | {
    message: string
    options?: ConfirmOptions
    resolve: (value: boolean) => void
  }>(null)

  function confirm(message: string, options?: ConfirmOptions) {
    return new Promise<boolean>((resolve) => {
      setCurrent({ message, options, resolve })
    })
  }

  function handleResolve(value: boolean) {
    if (current) {
      current.resolve(value)
      setCurrent(null)
    }
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{current.options?.title ?? 'Confirmação'}</h2>
                <p className="text-sm text-gray-500 mt-1">{current.message}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleResolve(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {current.options?.cancelText ?? 'Cancelar'}
                </button>
                <button
                  onClick={() => handleResolve(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  {current.options?.confirmText ?? 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  return useContext(ConfirmContext)
}

export default ConfirmContext
