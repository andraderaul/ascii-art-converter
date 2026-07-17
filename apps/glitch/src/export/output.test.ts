import { describe, expect, it } from 'vitest'
import { outputFilename } from './output'

describe('outputFilename', () => {
  it('names a PNG Export', () => {
    expect(outputFilename('png-export')).toBe('glitch.png')
  })

  it('names a Capture apart from a PNG Export', () => {
    expect(outputFilename('capture')).toBe('glitch-capture.png')
    expect(outputFilename('capture')).not.toBe(outputFilename('png-export'))
  })
})
