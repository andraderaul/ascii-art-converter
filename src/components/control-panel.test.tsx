import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ConversionSettings } from '../ascii/types'
import ControlPanel from './control-panel'

const DEFAULT_SETTINGS: ConversionSettings = {
  resolution: 12,
  colorMode: 'matrix',
  charset: 'classic',
  brightness: 1.0,
  contrast: 1.0,
}

function renderPanel(onChange = vi.fn()) {
  render(<ControlPanel settings={DEFAULT_SETTINGS} onChange={onChange} />)
  return { onChange }
}

describe('ControlPanel', () => {
  it('calls onChange with resolution patch when resolution slider changes', () => {
    const { onChange } = renderPanel()

    fireEvent.change(screen.getByLabelText(/resolution/i), { target: { value: '16' } })

    expect(onChange).toHaveBeenCalledWith({ resolution: 16 })
  })

  it('calls onChange with colorMode patch when a color mode button is clicked', async () => {
    const user = userEvent.setup()
    const { onChange } = renderPanel()

    await user.click(screen.getByRole('button', { name: 'neon' }))

    expect(onChange).toHaveBeenCalledWith({ colorMode: 'neon' })
  })

  it('calls onChange with charset patch when a charset button is clicked', async () => {
    const user = userEvent.setup()
    const { onChange } = renderPanel()

    await user.click(screen.getByRole('button', { name: 'sharp' }))

    expect(onChange).toHaveBeenCalledWith({ charset: 'sharp' })
  })

  it('calls onChange with brightness patch when brightness slider changes', () => {
    const { onChange } = renderPanel()

    fireEvent.change(screen.getByLabelText(/brightness/i), { target: { value: '1.5' } })

    expect(onChange).toHaveBeenCalledWith({ brightness: 1.5 })
  })

  it('calls onChange with contrast patch when contrast slider changes', () => {
    const { onChange } = renderPanel()

    fireEvent.change(screen.getByLabelText(/contrast/i), { target: { value: '2.0' } })

    expect(onChange).toHaveBeenCalledWith({ contrast: 2 })
  })
})
