import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Slider from './slider'

const baseProps = {
  label: 'volume',
  value: 1.5,
  min: 0.5,
  max: 2.0,
  step: 0.05,
  onChange: vi.fn(),
}

describe('Slider', () => {
  it('renders without crashing with required props only', () => {
    render(<Slider {...baseProps} />)
    expect(screen.getByLabelText(/volume/i)).toBeInTheDocument()
  })

  it('renders a default marker when defaultValue is provided', () => {
    render(<Slider {...baseProps} defaultValue={1.0} />)
    expect(screen.getByTestId('default-marker')).toBeInTheDocument()
  })

  it('does not render a default marker when defaultValue is not provided', () => {
    render(<Slider {...baseProps} />)
    expect(screen.queryByTestId('default-marker')).not.toBeInTheDocument()
  })

  it('calls onChange with defaultValue when the range input is double-clicked', () => {
    const onChange = vi.fn()
    render(<Slider {...baseProps} onChange={onChange} defaultValue={1.0} />)
    fireEvent.dblClick(screen.getByLabelText(/volume/i))
    expect(onChange).toHaveBeenCalledWith(1.0)
  })

  it('applies violet style to marker when value equals defaultValue', () => {
    render(<Slider {...baseProps} value={1.0} defaultValue={1.0} />)
    const marker = screen.getByTestId('default-marker')
    expect(marker.className).toMatch(/violet/)
  })

  it('applies slate style to marker when value differs from defaultValue', () => {
    render(<Slider {...baseProps} value={1.5} defaultValue={1.0} />)
    const marker = screen.getByTestId('default-marker')
    expect(marker.className).toMatch(/slate/)
  })

  it('renders tick marks when marks prop is provided', () => {
    render(<Slider {...baseProps} marks={[0.5, 1.0, 1.5, 2.0]} />)
    const ticks = screen.getAllByTestId('tick-mark')
    expect(ticks).toHaveLength(4)
  })

  it('does not render tick marks when marks is empty', () => {
    render(<Slider {...baseProps} marks={[]} />)
    expect(screen.queryByTestId('tick-mark')).not.toBeInTheDocument()
  })

  it('does not render tick marks when marks is not provided', () => {
    render(<Slider {...baseProps} />)
    expect(screen.queryByTestId('tick-mark')).not.toBeInTheDocument()
  })
})
