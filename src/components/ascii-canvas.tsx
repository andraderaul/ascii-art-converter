import { useEffect, useRef, type RefObject } from 'react'
import { ConversionSettings } from '../types'
import { convertImage } from '../utils/ascii-converter'
import { resizeImage } from '../utils/image-utils'

interface Props {
  sourceImage: HTMLImageElement | null
  sourceVideo: HTMLVideoElement | null
  settings: ConversionSettings
  onConverted: (rows: string[]) => void
  canvasRef: RefObject<HTMLCanvasElement>
}

const COLOR_MODE_COLORS: Record<string, string> = {
  matrix: '#00ff41',
  bw:     '#c8c8e0',
  retro:  '#ffe600',
  sepia:  '#c4a46b',
  neon:   '#ff2d78',
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

  const { resolution, brightness, contrast, colorMode, charset } = settings

  const W = canvasEl.width
  const H = canvasEl.height
  const charW = resolution * 0.6
  const charH = resolution

  const cols = Math.floor(W / charW)
  const rows = Math.floor(H / charH)

  if (cols < 1 || rows < 1) return

  hiddenEl.width = cols
  hiddenEl.height = rows

  const cells = convertImage(hiddenCtx, source, cols, rows, { brightness, contrast, charset })

  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, W, H)
  ctx.font = `${resolution}px ${getComputedStyle(document.body).getPropertyValue('--font-mono') || 'monospace'}`
  ctx.textBaseline = 'top'

  const asciiRows: string[] = []

  for (let row = 0; row < rows; row++) {
    let line = ''
    for (let col = 0; col < cols; col++) {
      const cell = cells[row][col]
      const x = col * charW
      const y = row * charH

      if (colorMode === 'original') {
        ctx.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`
      } else {
        ctx.fillStyle = COLOR_MODE_COLORS[colorMode] ?? '#c8c8e0'
      }

      ctx.fillText(cell.char, x, y)
      line += cell.char
    }
    asciiRows.push(line)
  }

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
    const INTERVAL = 66

    function loop(now: number) {
      rafId = requestAnimationFrame(loop)
      if (now - lastTime < INTERVAL) return
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
      width={800}
      height={600}
      className="w-full h-full block bg-bg [image-rendering:pixelated]"
    />
  )
}
