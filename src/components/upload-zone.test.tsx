import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UploadZone from './upload-zone'

vi.mock('../hooks/use-webcam-state', () => ({
  useWebcamState: vi.fn(() => ({
    state: { mode: 'upload', live: false, facingMode: 'user', error: null },
    switchCamera: vi.fn(),
    switchMode: vi.fn(),
    startWebcam: vi.fn(),
    stopWebcam: vi.fn(),
  })),
}))

let lastImg: { onload: (() => void) | null; onerror: (() => void) | null } | null = null

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  constructor() {
    lastImg = this
  }
}

function makeFile(name: string, type: string) {
  return new File(['x'], name, { type })
}

function getDropZone() {
  return screen.getByText(/drag & drop/i).closest('label') as HTMLElement
}

describe('UploadZone', () => {
  beforeEach(() => {
    lastImg = null
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() })
  })

  it('ignores non-image files dropped onto the drop zone', () => {
    const onImage = vi.fn()
    render(<UploadZone onImage={onImage} onVideoStream={vi.fn()} />)

    fireEvent.drop(getDropZone(), {
      dataTransfer: { files: [makeFile('doc.pdf', 'application/pdf')] },
    })

    expect(onImage).not.toHaveBeenCalled()
    expect(lastImg).toBeNull()
  })

  it('calls onImage with the loaded image when a valid image is dropped', () => {
    const onImage = vi.fn()
    render(<UploadZone onImage={onImage} onVideoStream={vi.fn()} />)

    fireEvent.drop(getDropZone(), {
      dataTransfer: { files: [makeFile('photo.jpg', 'image/jpeg')] },
    })
    act(() => {
      lastImg?.onload?.()
    })

    expect(onImage).toHaveBeenCalledWith(lastImg)
  })

  it('shows error message when the image fails to load', () => {
    render(<UploadZone onImage={vi.fn()} onVideoStream={vi.fn()} />)

    fireEvent.drop(getDropZone(), {
      dataTransfer: { files: [makeFile('bad.jpg', 'image/jpeg')] },
    })
    act(() => {
      lastImg?.onerror?.()
    })

    expect(screen.getByText(/failed to load image/i)).toBeInTheDocument()
  })

  it('calls onImage when a valid image is selected via file input', () => {
    const onImage = vi.fn()
    render(<UploadZone onImage={onImage} onVideoStream={vi.fn()} />)
    const fileInput = document.querySelector('#file-upload') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [makeFile('photo.png', 'image/png')] } })
    act(() => {
      lastImg?.onload?.()
    })

    expect(onImage).toHaveBeenCalledWith(lastImg)
  })

  it('applies active border on dragover and removes it on dragleave', () => {
    render(<UploadZone onImage={vi.fn()} onVideoStream={vi.fn()} />)
    const dropZone = getDropZone()

    fireEvent.dragOver(dropZone)
    expect(dropZone).toHaveClass('border-violet')

    fireEvent.dragLeave(dropZone)
    expect(dropZone).toHaveClass('border-base')
  })
})
