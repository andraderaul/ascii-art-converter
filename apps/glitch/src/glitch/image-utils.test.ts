import { describe, expect, it } from 'vitest'
import { MAX_SAMPLE_DIM, sampleDimensions, sourceDimensions } from './image-utils'

describe('sampleDimensions', () => {
  it('leaves an image already under the cap at its intrinsic size', () => {
    expect(sampleDimensions(640, 480)).toEqual({ w: 640, h: 480 })
  })

  it('leaves an image exactly at the cap untouched', () => {
    expect(sampleDimensions(MAX_SAMPLE_DIM, 600)).toEqual({ w: MAX_SAMPLE_DIM, h: 600 })
  })

  it('downscales a wide image to the cap, preserving aspect ratio', () => {
    expect(sampleDimensions(4000, 2000)).toEqual({ w: MAX_SAMPLE_DIM, h: 400 })
  })

  it('downscales a tall image to the cap, preserving aspect ratio', () => {
    expect(sampleDimensions(2000, 4000)).toEqual({ w: 400, h: MAX_SAMPLE_DIM })
  })

  it('caps the longer edge when only height exceeds the cap', () => {
    // Width alone is under the cap — a width-only cap would let this through untouched.
    expect(sampleDimensions(500, 20000)).toEqual({ w: 20, h: MAX_SAMPLE_DIM })
  })

  it('never lets either axis exceed the cap, whatever the aspect', () => {
    for (const [w, h] of [
      [10000, 10000],
      [9000, 12],
      [12, 9000],
      [801, 801],
    ]) {
      const out = sampleDimensions(w, h)
      expect(out.w).toBeLessThanOrEqual(MAX_SAMPLE_DIM)
      expect(out.h).toBeLessThanOrEqual(MAX_SAMPLE_DIM)
    }
  })

  it('keeps an extreme aspect ratio at least one pixel on the short edge', () => {
    expect(sampleDimensions(80000, 3)).toEqual({ w: MAX_SAMPLE_DIM, h: 1 })
  })

  it('reports zero for a source with no intrinsic size yet', () => {
    expect(sampleDimensions(0, 0)).toEqual({ w: 0, h: 0 })
  })
})

describe('sourceDimensions', () => {
  it('reads a Source Image at its intrinsic size', () => {
    const img = { naturalWidth: 640, naturalHeight: 480 } as HTMLImageElement
    expect(sourceDimensions(img)).toEqual({ w: 640, h: 480 })
  })

  it('reads a Live Source at the stream size, not the element box', () => {
    // width/height on a video element are the CSS box — sampling either would stretch the frame.
    const video = {
      videoWidth: 1280,
      videoHeight: 720,
      width: 300,
      height: 150,
    } as unknown as HTMLVideoElement
    expect(sourceDimensions(video)).toEqual({ w: 1280, h: 720 })
  })

  it('reports zero for a Live Source with no frame yet', () => {
    const video = { videoWidth: 0, videoHeight: 0 } as unknown as HTMLVideoElement
    expect(sourceDimensions(video)).toEqual({ w: 0, h: 0 })
  })
})
