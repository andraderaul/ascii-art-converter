import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  children: ReactNode
  onClose: () => void
  title: ReactNode
  ariaLabel: string
  variant?: 'default' | 'cyber'
  closeable?: boolean
  containerClassName?: string
}

export default function Modal({
  children,
  onClose,
  title,
  ariaLabel,
  variant = 'cyber',
  closeable = true,
  containerClassName,
}: Props) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-modal-overlay backdrop-blur-sm"
    >
      {closeable && (
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none"
          onClick={onClose}
          tabIndex={-1}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'relative flex flex-col p-xl',
          variant === 'default'
            ? 'gap-lg bg-elevated max-w-[480px] w-[90%] rounded-sm border border-base'
            : 'gap-md bg-abyss border border-slate border-t-2 border-t-violet w-full max-w-sm',
          containerClassName,
        )}
      >
        <div className="flex items-center justify-between">
          {title}
          {closeable && (
            <button
              type="button"
              onClick={onClose}
              className="text-muted text-sm cursor-pointer bg-transparent border-none"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
