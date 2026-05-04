import { render } from '@testing-library/react'
import { useRef } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ConversionSettings } from '../ascii/types'
import AsciiCanvas from './ascii-canvas'

const SETTINGS: ConversionSettings = {
  resolution: 12,
  charset: 'simple',
  colorMode: 'matrix',
  brightness: 1,
  contrast: 1,
}

function Wrapper({ sourceImage = null }: { sourceImage?: HTMLImageElement | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  return (
    <AsciiCanvas
      sourceImage={sourceImage}
      sourceVideo={null}
      settings={SETTINGS}
      onConverted={vi.fn()}
      canvasRef={canvasRef}
    />
  )
}

describe('AsciiCanvas', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
  })

  it('renders a canvas element', () => {
    render(<Wrapper />)

    expect(document.querySelector('canvas')).toBeInTheDocument()
  })

  it('renders without crashing when sourceImage is null', () => {
    expect(() => render(<Wrapper sourceImage={null} />)).not.toThrow()
  })
})
