import type { RefObject } from 'react'
import { Errors } from '../errors/app-error'
import { formatElapsedTime } from '../hooks/use-recording'
import { isTouchDevice } from '../utils/device'
import { useToastError } from './toast-provider'
import Button from './ui/button'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  asciiRows: string[]
  isLive?: boolean
  hasAiConfig: boolean
  onAnalyze: () => void
  canRecord?: boolean
  isRecording?: boolean
  elapsedSeconds?: number
  onStartRecording?: () => void
  onStopRecording?: () => void
}

function triggerDownload(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = filename
  a.click()
}

async function shareOrDownload(canvas: HTMLCanvasElement, filename: string) {
  return new Promise<void>((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        triggerDownload(canvas, filename)
        resolve()
        return
      }
      const file = new File([blob], filename, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] })
        } catch (err) {
          // AbortError = user dismissed the sheet, not an error worth falling back from
          if ((err as Error).name !== 'AbortError') {
            triggerDownload(canvas, filename)
          }
        }
      } else {
        triggerDownload(canvas, filename)
      }
      resolve()
    }, 'image/png')
  })
}

export default function DownloadBar({
  canvasRef,
  asciiRows,
  isLive,
  hasAiConfig,
  onAnalyze,
  canRecord,
  isRecording,
  elapsedSeconds = 0,
  onStartRecording,
  onStopRecording,
}: Props) {
  const toastError = useToastError()

  async function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    try {
      await shareOrDownload(canvas, 'ascii-art.png')
    } catch {
      toastError(Errors.exportFailed('png').message)
    }
  }

  function exportTxt() {
    if (!asciiRows.length) {
      return
    }
    try {
      const blob = new Blob([asciiRows.join('\n')], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'ascii-art.txt'
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toastError(Errors.exportFailed('txt').message)
    }
  }

  async function capture() {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    try {
      await shareOrDownload(canvas, `ascii-capture-${Date.now()}.png`)
    } catch {
      toastError(Errors.captureFailed().message)
    }
  }

  const analyzeBtn = hasAiConfig ? (
    <Button variant="analyze" onClick={onAnalyze} className="flex-1 sm:flex-none">
      {isTouchDevice ? '◈ analyze' : '◈ scan & analyze'}
    </Button>
  ) : null

  if (isLive) {
    if (isRecording) {
      return (
        <div className="flex gap-xs sm:gap-sm sm:justify-end">
          <Button variant="danger" onClick={capture} className="flex-1 sm:flex-none">
            ◎ capture
          </Button>
          <Button variant="danger" onClick={onStopRecording} className="flex-1 sm:flex-none">
            ● {formatElapsedTime(elapsedSeconds)} ⏹ stop
          </Button>
        </div>
      )
    }

    return (
      <div className="flex gap-xs sm:gap-sm sm:justify-end">
        {analyzeBtn}
        <Button variant="danger" onClick={capture} className="flex-1 sm:flex-none">
          ◎ capture
        </Button>
        {canRecord && (
          <Button variant="secondary" onClick={onStartRecording} className="flex-1 sm:flex-none">
            ⏺ record
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-xs sm:gap-sm sm:justify-end">
      {analyzeBtn}
      <Button variant="primary" onClick={exportPng} className="flex-1 sm:flex-none">
        export png
      </Button>
      <Button variant="secondary" onClick={exportTxt} className="flex-1 sm:flex-none">
        export txt
      </Button>
    </div>
  )
}
