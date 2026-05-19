import type { ReactNode } from 'react'
import { useRef } from 'react'
import { cn } from '../utils/cn'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function MobileBottomSheet({ isOpen, onClose, children }: Props) {
  const touchStartY = useRef<number | null>(null)
  const touchCurrentY = useRef<number | null>(null)

  if (!isOpen) {
    return null
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchCurrentY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const start = touchStartY.current
    const current = touchCurrentY.current
    if (start !== null && current !== null && current - start >= 80) {
      onClose()
    }
    touchStartY.current = null
    touchCurrentY.current = null
  }

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <button
        type="button"
        data-testid="sheet-backdrop"
        className={cn(
          'absolute inset-0 w-full h-full bg-modal-overlay backdrop-blur-sm',
          'cursor-default border-none',
        )}
        onClick={onClose}
        aria-label="dismiss"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Controls"
        className="absolute bottom-0 left-0 right-0 bg-abyss border-t border-slate rounded-t-sm max-h-[80vh] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between px-md py-sm border-b border-base shrink-0">
          <div className="w-8 h-1 bg-slate rounded-full mx-auto" />
          <button
            type="button"
            onClick={onClose}
            className="text-muted text-sm cursor-pointer bg-transparent border-none ml-auto"
            aria-label="close"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-md">{children}</div>
      </div>
    </div>
  )
}
