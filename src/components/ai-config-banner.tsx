import { useState } from 'react'
import Button from './ui/button'

const SESSION_KEY = 'ai-config-banner-dismissed'

interface Props {
  onConfigure: () => void
}

export default function AiConfigBanner({ onConfigure }: Props) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true')

  if (dismissed) {
    return null
  }

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="flex items-center justify-between gap-sm px-md py-xs bg-bg-elevated border border-base rounded-xs font-mono">
      <p className="text-xs text-fg-muted">
        <span className="text-violet">AI Analyze</span> is available — add an{' '}
        <span className="text-violet">AI Config</span> to scan your ASCII art.
      </p>
      <div className="flex items-center gap-xs shrink-0">
        <Button variant="analyze" className="text-xs" onClick={onConfigure}>
          configure AI
        </Button>
        <button
          type="button"
          aria-label="dismiss"
          onClick={handleDismiss}
          className="text-fg-subtle hover:text-fg-muted font-mono text-sm leading-none px-xs min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  )
}
