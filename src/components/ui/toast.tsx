interface Props {
  message: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: Props) {
  return (
    <div
      role="alert"
      className="flex items-start gap-sm p-sm bg-shadow border border-hot-pink rounded-xs"
      style={{
        minWidth: '260px',
        maxWidth: '360px',
        boxShadow: '0 0 12px rgba(255, 45, 120, 0.15)',
      }}
    >
      <span className="text-danger text-xs shrink-0">⚠</span>
      <span className="text-fg text-xs flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="dismiss"
        className="text-fg-subtle text-xs cursor-pointer shrink-0 leading-tight bg-transparent border-none p-0"
      >
        ×
      </button>
    </div>
  )
}
