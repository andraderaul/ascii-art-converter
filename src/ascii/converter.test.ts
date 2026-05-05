import { describe, expect, it } from 'vitest'
import { getAsciiChar } from './converter'
import { CHARSET_MAPS } from './types'

describe('getAsciiChar', () => {
  it('returns first character for brightness 0', () => {
    expect(getAsciiChar(0, 'classic')).toBe(CHARSET_MAPS.classic[0])
  })

  it('returns last character for brightness 255', () => {
    expect(getAsciiChar(255, 'classic')).toBe(CHARSET_MAPS.classic[CHARSET_MAPS.classic.length - 1])
  })

  it('maps midpoint brightness to middle of map', () => {
    const map = CHARSET_MAPS.sharp
    const idx = Math.floor((127 / 255) * (map.length - 1))
    expect(getAsciiChar(127, 'sharp')).toBe(map[idx])
  })

  it('clamps brightness below 0', () => {
    expect(getAsciiChar(-50, 'classic')).toBe(getAsciiChar(0, 'classic'))
  })

  it('clamps brightness above 255', () => {
    expect(getAsciiChar(300, 'classic')).toBe(getAsciiChar(255, 'classic'))
  })

  it('works for all charsets', () => {
    for (const charset of ['classic', 'sharp', 'binary', 'blocks'] as const) {
      expect(() => getAsciiChar(128, charset)).not.toThrow()
    }
  })
})
