import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MobileBottomSheet from './mobile-bottom-sheet'

describe('MobileBottomSheet', () => {
  it('renders children when open', () => {
    render(
      <MobileBottomSheet isOpen={true} onClose={vi.fn()}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    expect(screen.getByText('Sheet content')).toBeInTheDocument()
  })

  it('does not render children when closed', () => {
    render(
      <MobileBottomSheet isOpen={false} onClose={vi.fn()}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument()
  })

  it('calls onClose when overlay backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <MobileBottomSheet isOpen={true} onClose={onClose}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    fireEvent.click(screen.getByTestId('sheet-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <MobileBottomSheet isOpen={true} onClose={onClose}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on swipe-down gesture of 80px+', () => {
    const onClose = vi.fn()
    render(
      <MobileBottomSheet isOpen={true} onClose={onClose}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    const panel = screen.getByRole('dialog')
    fireEvent.touchStart(panel, { touches: [{ clientY: 100 }] })
    fireEvent.touchMove(panel, { touches: [{ clientY: 190 }] })
    fireEvent.touchEnd(panel)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close on short swipe-down (< 80px)', () => {
    const onClose = vi.fn()
    render(
      <MobileBottomSheet isOpen={true} onClose={onClose}>
        <div>Sheet content</div>
      </MobileBottomSheet>,
    )
    const panel = screen.getByRole('dialog')
    fireEvent.touchStart(panel, { touches: [{ clientY: 100 }] })
    fireEvent.touchMove(panel, { touches: [{ clientY: 150 }] })
    fireEvent.touchEnd(panel)
    expect(onClose).not.toHaveBeenCalled()
  })
})
