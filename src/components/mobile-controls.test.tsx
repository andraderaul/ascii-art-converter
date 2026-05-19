import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MobileControls from './mobile-controls'

vi.mock('./upload-zone', () => ({
  default: () => <div>Source content</div>,
}))

vi.mock('./control-panel', () => ({
  default: () => <div>Settings content</div>,
}))

vi.mock('../hooks/use-webcam-state', () => ({
  useWebcamState: vi.fn(() => ({
    state: { mode: 'upload', live: false, facingMode: 'user', error: null },
    switchCamera: vi.fn(),
    switchMode: vi.fn(),
    startWebcam: vi.fn(),
    stopWebcam: vi.fn(),
  })),
}))

const defaultProps = {
  onImage: vi.fn(),
  onVideoStream: vi.fn(),
  onFacingModeChange: vi.fn(),
  settings: {
    resolution: 12,
    brightness: 1,
    contrast: 1,
    colorMode: 'matrix' as const,
    charset: 'sharp' as const,
  },
  onSettingsChange: vi.fn(),
}

describe('MobileControls', () => {
  it('renders controls trigger button', () => {
    render(<MobileControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: /controls/i })).toBeInTheDocument()
  })

  it('opens sheet with Source tab active by default when trigger is clicked', () => {
    render(<MobileControls {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /controls/i }))
    expect(screen.getByText('Source content')).toBeInTheDocument()
  })

  it('switches to Settings tab', () => {
    render(<MobileControls {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(screen.getByText('Settings content')).toBeInTheDocument()
    expect(screen.queryByText('Source content')).not.toBeInTheDocument()
  })

  it('closes sheet when backdrop is clicked', () => {
    render(<MobileControls {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /controls/i }))
    expect(screen.getByText('Source content')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('sheet-backdrop'))
    expect(screen.queryByText('Source content')).not.toBeInTheDocument()
  })
})
