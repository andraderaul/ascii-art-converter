import { useCallback, useState } from 'react'

export type ToastItem = {
  id: number
  message: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const error = useCallback(
    (message: string) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  return { toasts, error, dismiss }
}
