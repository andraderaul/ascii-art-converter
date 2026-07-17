import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef, type RefObject } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ExportBar from './export-bar'

const shareOrDownloadCanvas = vi.hoisted(() => vi.fn(() => Promise.resolve()))
vi.mock('../utils/share', () => ({ shareOrDownloadCanvas }))

const toastError = vi.hoisted(() => vi.fn())
vi.mock('./toast-provider', () => ({ useToastError: () => toastError }))

function canvasRef(): RefObject<HTMLCanvasElement | null> {
  return { current: document.createElement('canvas') }
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('ExportBar', () => {
  it('names a static render as a PNG Export', async () => {
    const ref = canvasRef()
    render(<ExportBar canvasRef={ref} />)

    fireEvent.click(screen.getByRole('button', { name: 'export png' }))

    await waitFor(() => {
      expect(shareOrDownloadCanvas).toHaveBeenCalledWith(ref.current, 'glitch.png')
    })
  })

  it('names a Live Source frame as a Capture', async () => {
    const ref = canvasRef()
    render(<ExportBar canvasRef={ref} isLive />)

    fireEvent.click(screen.getByRole('button', { name: 'capture' }))

    await waitFor(() => {
      expect(shareOrDownloadCanvas).toHaveBeenCalledWith(ref.current, 'glitch-capture.png')
    })
  })

  // The AC behind this: a Capture must not stop the loop. It can't — the only thing this component
  // is handed is the canvas, so a Capture is a read and the rAF loop it never sees keeps painting.
  it('takes a Capture off the canvas as-is, touching nothing else', async () => {
    const ref = canvasRef()
    render(<ExportBar canvasRef={ref} isLive />)

    fireEvent.click(screen.getByRole('button', { name: 'capture' }))

    await waitFor(() => {
      expect(shareOrDownloadCanvas).toHaveBeenCalledTimes(1)
    })
    expect(toastError).not.toHaveBeenCalled()
  })

  it('surfaces a failed Export as a toast', async () => {
    shareOrDownloadCanvas.mockRejectedValueOnce(new Error('nope'))
    render(<ExportBar canvasRef={canvasRef()} />)

    fireEvent.click(screen.getByRole('button', { name: 'export png' }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled()
    })
  })

  it('does nothing when there is no canvas to take from', () => {
    render(<ExportBar canvasRef={createRef<HTMLCanvasElement>()} />)

    fireEvent.click(screen.getByRole('button', { name: 'export png' }))

    expect(shareOrDownloadCanvas).not.toHaveBeenCalled()
  })
})
