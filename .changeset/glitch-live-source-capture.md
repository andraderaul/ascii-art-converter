---
'@cyberdeck/glitch': minor
---

GLITCH//Studio: Live Source and Capture. The empty state now offers the webcam beside the upload;
activating it runs the full Pipeline over the feed in a `requestAnimationFrame` loop throttled to
~15fps (ADR 0002), painting the same canvas the static path does. **Capture** takes one glitched
frame out as PNG without stopping the loop — it only reads the pixels the loop last painted.

The shell absorbed the new Source without a second path: `renderGlitchFrame` takes a `GlitchSource`
(image *or* video), because one webcam frame is just another Source to sample. The Seed is held
across frames rather than re-rolled per frame, which is what keeps the corruption pattern still
instead of boiling — animating it stays v2.

`useWebcamState` is a hand-copy of ASCII//Convert's lifecycle hook (ADR 0011), diverging where this
app's domain demands it: its side-effects are **Commands**, since `Effect` here means a pure
`PixelBuffer` transform, and the preview is deliberately **not mirrored** — the canvas *is* the
output, so ASCII's CSS-transform mirror would hand back a Capture that disagrees with the preview.
