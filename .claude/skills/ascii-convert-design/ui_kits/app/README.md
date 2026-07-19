# ASCII//Convert · App UI Kit

A click-through prototype of the full ASCII Art Converter web app. Pixel-faithful to the source repo (`andraderaul/ascii-art-converter`), with a working ASCII conversion pipeline ported into vanilla JS.

## What's here

- `index.html` — entry point. Open this directly in a browser.
- `styles.css` — every component style; imports `../../colors_and_type.css`.
- `ascii-engine.js` — the conversion pipeline (luminance → char + RGB), `paintFrame`, and a tiny procedural image generator for demo sources.
- `Primitives.jsx` — `Button`, `ToggleGroup`, `Slider`, `Label`, `Modal`, `Badge`, `Toast`.
- `Sidebar.jsx` — `UploadZone`, `ControlPanel`.
- `AsciiCanvas.jsx` — the visible canvas + render-on-change effect.
- `DownloadBar.jsx` — bottom action area; varies by source kind.
- `Modals.jsx` — `AboutModal`, `ApiKeyModal`, `AnalysisModal` + demo analyses.
- `App.jsx` — top-level shell, state.

## What you can click

- **Upload zone** — click the drop area to load a procedurally-generated demo image. Each click cycles through three sample sources (portrait / city / cat).
- **Webcam** — switch to the webcam tab to see the LIVE state with an animated procedural feed at ~15fps.
- **Charset, Color Mode, Resolution, Brightness, Contrast** — all functional and re-render the canvas live.
- **Export PNG / Export TXT** — produces a real downloaded file from the current canvas.
- **⚿ configure ai** — opens the API key modal; saving switches the button to "ai configured" and reveals the `◈ scan & analyze` action.
- **◈ scan & analyze** — opens the Neural Scan results modal with a fake threat assessment after a short pulse.
- **about** — opens the About modal.

## What's intentionally simplified

- No real webcam access (browser permission prompt would interrupt the prototype).
- No real AI calls. The analyze modal returns a hardcoded "demo analysis" after a 1.4s pulse.
- Recording UI is present but stops without producing a real `MediaRecorder` blob.
- No `localStorage` persistence — settings reset on reload.

## Mapping to source files

| This kit | Original |
|---|---|
| `App.jsx` | `src/app.tsx` |
| `Sidebar.jsx :: UploadZone` | `src/components/upload-zone.tsx` |
| `Sidebar.jsx :: ControlPanel` | `src/components/control-panel.tsx` |
| `AsciiCanvas.jsx` | `src/components/ascii-canvas.tsx` |
| `DownloadBar.jsx` | `src/components/download-bar.tsx` |
| `Modals.jsx :: ApiKeyModal` | `src/components/api-key-modal.tsx` |
| `Modals.jsx :: AnalysisModal` | `src/components/analysis-modal.tsx` |
| `Modals.jsx :: AboutModal` | `src/components/about-modal.tsx` |
| `Primitives.jsx` | `src/components/ui/*` |
| `ascii-engine.js` | `src/ascii/{converter,renderer,types}.ts` |

When fidelity questions come up, the source files in `../../repo_reference/src/` are canonical.
