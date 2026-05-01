import { AsciiCell, ConversionSettings } from './types'

export interface RenderInstruction {
  char: string
  x: number
  y: number
  color: string
}

const COLOR_MODE_COLORS: Record<string, string> = {
  matrix: '#00ff41',
  bw:     '#c8c8e0',
  retro:  '#ffe600',
  sepia:  '#c4a46b',
  neon:   '#ff2d78',
}

export const MONOSPACE_CHAR_WIDTH_RATIO = 0.6

// Pure: derives render instructions and ascii text from a cell grid — no DOM, fully testable.
// See ADR 0005 for the pure/impure boundary rationale.
export function computeFrame(
  cells: AsciiCell[][],
  settings: Pick<ConversionSettings, 'resolution' | 'colorMode'>
): { instructions: RenderInstruction[]; asciiRows: string[] } {
  const { resolution, colorMode } = settings
  const charW = resolution * MONOSPACE_CHAR_WIDTH_RATIO
  const charH = resolution

  const instructions: RenderInstruction[] = []
  const asciiRows: string[] = []

  for (let row = 0; row < cells.length; row++) {
    let line = ''
    for (let col = 0; col < cells[row].length; col++) {
      const cell = cells[row][col]
      const color = colorMode === 'original'
        ? `rgb(${cell.r},${cell.g},${cell.b})`
        : COLOR_MODE_COLORS[colorMode] ?? '#c8c8e0'
      instructions.push({ char: cell.char, x: col * charW, y: row * charH, color })
      line += cell.char
    }
    asciiRows.push(line)
  }

  return { instructions, asciiRows }
}

// Impure: only function that writes to CanvasRenderingContext2D for rendering.
export function paintFrame(
  ctx: CanvasRenderingContext2D,
  instructions: RenderInstruction[],
  resolution: number
): void {
  const { width: W, height: H } = ctx.canvas
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, W, H)
  ctx.font = `${resolution}px ${getComputedStyle(document.body).getPropertyValue('--font-mono') || 'monospace'}`
  ctx.textBaseline = 'top'

  for (const { char, x, y, color } of instructions) {
    ctx.fillStyle = color
    ctx.fillText(char, x, y)
  }
}
