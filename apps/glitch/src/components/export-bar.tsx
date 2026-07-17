import type { RefObject } from 'react'
import { Errors } from '../errors/app-error'
import { outputFilename } from '../export/output'
import { shareOrDownloadCanvas } from '../utils/share'
import { useToastError } from './toast-provider'
import Button from './ui/button'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  isLive?: boolean
}

/**
 * Takes the result out. Capture and PNG Export are the same act on a different Source — the canvas
 * *is* the output either way, so a Capture only reads the pixels the rAF loop last painted and
 * never touches the loop itself.
 */
export default function ExportBar({ canvasRef, isLive }: Props) {
  const toastError = useToastError()

  async function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    try {
      await shareOrDownloadCanvas(canvas, outputFilename(isLive ? 'capture' : 'png-export'))
    } catch {
      toastError(Errors.exportFailed().message)
    }
  }

  return (
    <div className="flex gap-xs sm:gap-sm sm:justify-end">
      <Button variant="primary" onClick={exportPng} className="flex-1 sm:flex-none">
        {isLive ? 'capture' : 'export png'}
      </Button>
    </div>
  )
}
