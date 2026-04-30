import { describe, expect, it } from 'vitest'
import { getAsciiChar } from './ascii-converter'
import { CHARSET_MAPS } from '../types'

describe('getAsciiChar', () => {
  it('returns first character for brightness 0', () => {
    const char = getAsciiChar(0, 'simple')
    expect(char).toBe(CHARSET_MAPS.simple[0])
  })

  it('returns last character for brightness 255', () => {
    const char = getAsciiChar(255, 'simple')
    expect(char).toBe(CHARSET_MAPS.simple[CHARSET_MAPS.simple.length - 1])
  })

  it('maps midpoint brightness to middle of map', () => {
    const map = CHARSET_MAPS.complex
    const char = getAsciiChar(127, 'complex')
    const idx = Math.floor((127 / 255) * (map.length - 1))
    expect(char).toBe(map[idx])
  })

  it('clamps brightness below 0', () => {
    expect(getAsciiChar(-50, 'simple')).toBe(getAsciiChar(0, 'simple'))
  })

  it('clamps brightness above 255', () => {
    expect(getAsciiChar(300, 'simple')).toBe(getAsciiChar(255, 'simple'))
  })

  it('works for all charsets', () => {
    for (const charset of ['simple', 'complex', 'binary', 'blocks'] as const) {
      expect(() => getAsciiChar(128, charset)).not.toThrow()
    }
  })
})
