import { type AsciiCell, CHARSET_MAPS, type Charset } from './types'

const BT601_RED_LUMA_WEIGHT = 0.299
const BT601_GREEN_LUMA_WEIGHT = 0.587
const BT601_BLUE_LUMA_WEIGHT = 0.114
const RGB_CHANNEL_MAX = 255
const NORMALIZED_MIDPOINT = 0.5
const RGBA_CHANNEL_COUNT = 4
const GREEN_CHANNEL_OFFSET = 1
const BLUE_CHANNEL_OFFSET = 2

export function getAsciiChar(brightness: number, charset: Charset): string {
  const map = CHARSET_MAPS[charset]
  const clamped = Math.max(0, Math.min(RGB_CHANNEL_MAX, brightness))
  const index = Math.floor((clamped / RGB_CHANNEL_MAX) * (map.length - 1))
  return map[index]
}

function applyBrightnessContrast(value: number, brightness: number, contrast: number): number {
  let v = value / RGB_CHANNEL_MAX
  v = (v - NORMALIZED_MIDPOINT) * contrast + NORMALIZED_MIDPOINT
  v = v * brightness
  return Math.max(0, Math.min(RGB_CHANNEL_MAX, Math.round(v * RGB_CHANNEL_MAX)))
}

export function convertImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cols: number,
  rows: number,
  options: { brightness: number; contrast: number; charset: Charset },
): AsciiCell[][] {
  const { brightness, contrast, charset } = options

  ctx.drawImage(img, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const result: AsciiCell[][] = []

  for (let row = 0; row < rows; row++) {
    const rowData: AsciiCell[] = []
    for (let col = 0; col < cols; col++) {
      const i = (row * cols + col) * RGBA_CHANNEL_COUNT
      const r = data[i]
      const g = data[i + GREEN_CHANNEL_OFFSET]
      const b = data[i + BLUE_CHANNEL_OFFSET]
      // ITU-R BT.601 luminosity coefficients
      const lum =
        BT601_RED_LUMA_WEIGHT * r + BT601_GREEN_LUMA_WEIGHT * g + BT601_BLUE_LUMA_WEIGHT * b
      const adjusted = applyBrightnessContrast(lum, brightness, contrast)
      rowData.push({ char: getAsciiChar(adjusted, charset), r, g, b })
    }
    result.push(rowData)
  }

  return result
}
