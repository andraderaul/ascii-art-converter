# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # tsc -b && vite build
npm run test       # run all tests (vitest)
npx vitest run src/ascii/renderer.test.ts  # run a single test file
```

No lint script is configured.

## Architecture

Single-page React/TS/Vite app. Fully client-side — no backend server. AI analysis is optional and uses the user's own API key.

### Conversion pipeline

1. `UploadZone` hands either an `HTMLImageElement` (Source Image) or `HTMLVideoElement` (Live Source) to `App`
2. `App` holds `ConversionSettings` state and passes both down to `AsciiCanvas`
3. `AsciiCanvas` keeps a **hidden off-screen canvas** (`hiddenRef`) sized `cols × rows` — this is used only for pixel sampling via `getImageData`. The visible canvas is sized in pixels. These two canvases must stay separate (see ADR 0001)
4. `renderFrame()` in `ascii-canvas.tsx` orchestrates a single render: draws source onto the hidden canvas → `convertImage()` → `computeFrame()` → `paintFrame()`
5. `computeFrame()` is **pure** — given cells and settings, returns `RenderInstruction[]` and `asciiRows` with no DOM access (see ADR 0005)
6. `paintFrame()` is the only function that writes to `CanvasRenderingContext2D` for rendering
7. For Live Source, `renderFrame` is called in a `requestAnimationFrame` loop throttled to ~15fps (see ADR 0002). For static Source Image, it runs once per settings change via `useEffect`
8. `onConverted` callback sends the plain-text rows up to `App`, where they're held in `asciiRows` state for TXT Export

### Domain language (from CONTEXT.md)

Use these terms precisely — avoid the listed alternatives:

| Term | Meaning | Avoid |
|------|---------|-------|
| **Charset** | Symbol set mapping luminosity to a character | density, symbol set |
| **Source Image** | Static uploaded image; immutable during session | uploadedImage, input image |
| **Live Source** | Active webcam stream | stream, camera, video source |
| **ConversionSettings** | All conversion params (charset, colorMode, resolution, brightness, contrast) | options, settings |
| **AsciiCell** | Atomic unit: one character + its original RGB | ProcessedPixel |
| **Color Mode** | Colorization scheme applied during render | colorMode as domain term |
| **Resolution** | Chars-per-canvas (controlled by character size) | fontSize, granularity |
| **Export** | Taking the result out (PNG or TXT) | download |
| **Capture** | Exporting a single frame from Live Source (doesn't stop the loop) | snapshot, screenshot |

### Design system

All visual tokens live as CSS custom properties in `src/index.css`. Tailwind is configured in `tailwind.config.js` to reference those same variables — so `text-violet` and `var(--violet)` resolve to the same value. Components use Tailwind classes for static tokens and inline `var(--token)` references for runtime-dynamic values (e.g. threat level colors).

### Key files

- `src/ascii/types.ts` — `ConversionSettings`, `ColorMode`, `Charset`, `CHARSET_MAPS`, `AsciiCell`
- `src/ascii/converter.ts` — `convertImage()`, `getAsciiChar()`, luminosity math
- `src/ascii/image-utils.ts` — `resizeImage()` (caps Source Image at 800px wide before sampling)
- `src/ascii/renderer.ts` — `computeFrame()` (pure), `paintFrame()` (side effects) — see ADR 0005
- `src/components/ascii-canvas.tsx` — lifecycle coordinator: drives static and rAF render paths
- `src/components/error-boundary.tsx` — generic React error boundary with customizable fallback
- `docs/adr/` — architectural decisions (0001–0005)
