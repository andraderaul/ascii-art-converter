import { useEffect, useRef, type RefObject } from 'react'
import { ConversionSettings } from '../ascii/types'
import { convertImage } from '../ascii/converter'
import { resizeImage } from '../ascii/image-utils'
import { computeFrame, MONOSPACE_CHAR_WIDTH_RATIO, paintFrame } from '../ascii/renderer'

const LIVE_SOURCE_TARGET_FPS = 15
const LIVE_SOURCE_FRAME_INTERVAL_MS = 1000 / LIVE_SOURCE_TARGET_FPS
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

interface Props {
  sourceImage: HTMLImageElement | null
  sourceVideo: HTMLVideoElement | null
  settings: ConversionSettings
  onConverted: (rows: string[]) => void
  canvasRef: RefObject<HTMLCanvasElement>
}

function renderFrame(
  source: CanvasImageSource,
  canvasEl: HTMLCanvasElement,
  hiddenEl: HTMLCanvasElement,
  settings: ConversionSettings,
  onConverted?: (rows: string[]) => void
): void {
  const ctx = canvasEl.getContext('2d')!
  const hiddenCtx = hiddenEl.getContext('2d')!

  const { resolution, brightness, contrast, charset } = settings
  const charW = resolution * MONOSPACE_CHAR_WIDTH_RATIO
  const charH = resolution
  const cols = Math.floor(canvasEl.width / charW)
  const rows = Math.floor(canvasEl.height / charH)

  if (cols < 1 || rows < 1) return

  hiddenEl.width = cols
  hiddenEl.height = rows

  const cells = convertImage(hiddenCtx, source, cols, rows, { brightness, contrast, charset })
  const { instructions, asciiRows } = computeFrame(cells, settings)
  paintFrame(ctx, instructions, resolution)
  onConverted?.(asciiRows)
}

export default function AsciiCanvas({ sourceImage, sourceVideo, settings, onConverted, canvasRef }: Props) {
  const hiddenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !sourceImage) return
    renderFrame(resizeImage(sourceImage), canvas, hiddenRef.current, settings, onConverted)
  }, [sourceImage, settings, onConverted, canvasRef])

  // rAF loop throttled to ~15fps — see ADR 0002 for Web Worker upgrade path
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !sourceVideo) return

    const video = sourceVideo
    let rafId: number
    let lastTime = 0

    function loop(now: number) {
      rafId = requestAnimationFrame(loop)
      if (now - lastTime < LIVE_SOURCE_FRAME_INTERVAL_MS) return
      lastTime = now
      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        renderFrame(video, canvas!, hiddenRef.current, settings)
      }
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [sourceVideo, settings, canvasRef])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="w-full h-full block bg-bg [image-rendering:pixelated]"
    />
  )
}
