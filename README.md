# ASCII Art Converter

A client-side tool that converts images and webcam into interactive ASCII art, with real-time preview and export.

No server. No external AI. Everything runs in the browser.

## Features

- Upload an image and watch it turn into ASCII instantly
- Use the webcam as a live source with continuous rendering
- Adjust charset, color mode, resolution, brightness, and contrast in real time
- Export as PNG (with colors) or TXT (plain ASCII)
- Capture a frame from the Live Source without stopping the loop

## Running locally

**Requirements:** Node.js 20+ (see `.nvmrc`)

```bash
# install dependencies
npm install

# start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Other commands

```bash
npm run build   # production build (TypeScript + Vite)
npm run test    # run all tests (Vitest)
```

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with a design system via CSS custom properties
- **Vitest** for unit tests
- Zero runtime dependencies beyond React

## How it works

```
Source Image / Live Source
        │
        ▼
  AsciiCanvas (hidden canvas for pixel sampling)
        │
        ▼
  convertImage() → grid of AsciiCell (char + original RGB)
        │
        ▼
  Render on the visible canvas applying the Color Mode
        │
        ▼
  PNG Export  /  TXT Export
```

The hidden canvas (`cols × rows` pixels) is used exclusively for pixel reading via `getImageData`. The visible canvas is independent and renders the characters. For Live Source, the loop runs via `requestAnimationFrame` throttled to ~15fps.

## Project structure

```
src/
├── app.tsx                        # global state, orchestrates components
├── types.ts                       # ConversionSettings, ColorMode, Charset, CHARSET_MAPS
├── components/
│   ├── ascii-canvas.tsx           # renderFrame(), static and rAF render loops
│   ├── control-panel.tsx          # ConversionSettings controls
│   ├── upload-zone.tsx            # image upload and Live Source activation
│   └── download-bar.tsx           # PNG Export and TXT Export
└── utils/
    ├── ascii-converter.ts         # convertImage(), luminosity math
    └── image-utils.ts             # resizeImage() (caps Source Image at 800px)
```
