import { createContext, type ReactNode, useContext } from 'react'
import { useToast } from '../hooks/use-toast'
import Toast from './ui/toast'

export const ToastContext = createContext<(message: string) => void>(() => {})

export function useToastError() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, error, dismiss } = useToast()

  return (
    <ToastContext.Provider value={error}>
      {children}
      <div
        className="fixed flex flex-col gap-xs pointer-events-none"
        style={{ bottom: 'var(--gap-md)', right: 'var(--gap-md)', zIndex: 1000 }}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast message={t.message} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
