import type { RefObject } from 'react'
import { cn } from '../utils/cn'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  asciiRows: string[]
  isLive?: boolean
  hasAiConfig: boolean
  onAnalyze: () => void
}

export default function DownloadBar({
  canvasRef,
  asciiRows,
  isLive,
  hasAiConfig,
  onAnalyze,
}: Props) {
  function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'ascii-art.png'
    a.click()
  }

  function exportTxt() {
    if (!asciiRows.length) return
    const blob = new Blob([asciiRows.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ascii-art.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function capture() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `ascii-capture-${Date.now()}.png`
    a.click()
  }

  const btnBase = cn(
    '[padding:var(--btn-secondary-padding)]',
    '[font-size:var(--btn-secondary-size)]',
    'font-mono tracking-wide rounded-xs cursor-pointer transition-all duration-fast',
  )

  const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

  const analyzeBtn = hasAiConfig ? (
    <button
      type="button"
      onClick={onAnalyze}
      className={cn(btnBase, 'min-h-[44px] border border-violet bg-accent-bg text-violet')}
      style={{ borderColor: 'var(--violet)', background: 'var(--bg-accent-ghost)' }}
    >
      {isTouchDevice ? '◈ analyze' : '◈ scan & analyze'}
    </button>
  ) : null

  if (isLive) {
    return (
      <div className="flex flex-wrap gap-sm justify-end">
        {analyzeBtn}
        <button
          type="button"
          onClick={capture}
          className={cn(
            btnBase,
            'min-h-[44px] border border-hot-pink bg-danger-ghost text-hot-pink font-bold',
          )}
        >
          ◎ capture
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-sm justify-end">
      {analyzeBtn}
      <button
        type="button"
        onClick={exportPng}
        className={cn(
          btnBase,
          'min-h-[44px] border-2 border-violet bg-accent-bg text-violet font-bold',
        )}
      >
        export png
      </button>
      <button
        type="button"
        onClick={exportTxt}
        className={cn(btnBase, 'min-h-[44px] border border-info bg-info-bg text-info font-medium')}
      >
        export txt
      </button>
    </div>
  )
}
