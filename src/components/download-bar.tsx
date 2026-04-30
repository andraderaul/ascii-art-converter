import { type RefObject } from 'react'
import { cn } from '../utils/cn'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  asciiRows: string[]
  isLive?: boolean
}

export default function DownloadBar({ canvasRef, asciiRows, isLive }: Props) {
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
    'font-mono tracking-wide rounded-xs cursor-pointer transition-all duration-fast'
  )

  if (isLive) {
    return (
      <div className="flex gap-sm justify-end">
        <button
          onClick={capture}
          className={cn(btnBase, 'border border-hot-pink bg-danger-ghost text-hot-pink font-bold')}
        >
          ◎ capture
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-sm justify-end">
      <button
        onClick={exportPng}
        className={cn(btnBase, 'border-2 border-violet bg-accent-bg text-violet font-bold')}
      >
        export png
      </button>
      <button
        onClick={exportTxt}
        className={cn(btnBase, 'border border-info bg-info-bg text-info font-medium')}
      >
        export txt
      </button>
    </div>
  )
}
