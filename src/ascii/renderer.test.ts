import { describe, expect, it } from 'vitest'
import { computeFrame } from './renderer'
import type { AsciiCell } from './types'

function makeCell(char: string, r = 0, g = 0, b = 0): AsciiCell {
  return { char, r, g, b }
}

const SIMPLE_GRID: AsciiCell[][] = [
  [makeCell('A'), makeCell('B')],
  [makeCell('C'), makeCell('D')],
]

describe('computeFrame', () => {
  it('produces one instruction per cell', () => {
    const { instructions } = computeFrame(SIMPLE_GRID, { resolution: 12, colorMode: 'bw' })
    expect(instructions).toHaveLength(4)
  })

  it('preserves cell characters', () => {
    const { instructions } = computeFrame(SIMPLE_GRID, { resolution: 12, colorMode: 'bw' })
    expect(instructions.map((i) => i.char)).toEqual(['A', 'B', 'C', 'D'])
  })

  it('computes x positions from column index and resolution', () => {
    const resolution = 10
    const charW = resolution * 0.6
    const { instructions } = computeFrame(SIMPLE_GRID, { resolution, colorMode: 'bw' })
    expect(instructions[0].x).toBe(0)
    expect(instructions[1].x).toBe(charW)
  })

  it('computes y positions from row index and resolution', () => {
    const resolution = 10
    const { instructions } = computeFrame(SIMPLE_GRID, { resolution, colorMode: 'bw' })
    expect(instructions[0].y).toBe(0)
    expect(instructions[2].y).toBe(resolution)
  })

  it('applies fixed color for non-original color modes', () => {
    const { instructions } = computeFrame(SIMPLE_GRID, { resolution: 12, colorMode: 'matrix' })
    expect(instructions.every((i) => i.color === '#00ff41')).toBe(true)
  })

  it('applies per-cell rgb for original color mode', () => {
    const grid = [[makeCell('X', 100, 150, 200)]]
    const { instructions } = computeFrame(grid, { resolution: 12, colorMode: 'original' })
    expect(instructions[0].color).toBe('rgb(100,150,200)')
  })

  it('builds ascii rows matching cell characters', () => {
    const { asciiRows } = computeFrame(SIMPLE_GRID, { resolution: 12, colorMode: 'bw' })
    expect(asciiRows).toEqual(['AB', 'CD'])
  })

  it('returns empty arrays for empty grid', () => {
    const { instructions, asciiRows } = computeFrame([], { resolution: 12, colorMode: 'bw' })
    expect(instructions).toHaveLength(0)
    expect(asciiRows).toHaveLength(0)
  })
})
