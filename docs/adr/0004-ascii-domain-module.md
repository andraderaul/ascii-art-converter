# ASCII domain module

The ASCII conversion pipeline was scattered across `src/types.ts` and `src/utils/` — a semantically generic folder that in practice held only ASCII domain logic. This made it harder to trace pipeline dependencies, move parts of it to a Web Worker (see ADR 0002), and test units in isolation.

The decision was to group everything under `src/ascii/`, following the same pattern as the `src/ai/` module:

```
src/ascii/
├── types.ts        — AsciiCell, Charset, CHARSET_MAPS, ConversionSettings, ColorMode
├── converter.ts    — convertImage(), getAsciiChar(), applyBrightnessContrast()
├── image-utils.ts  — resizeImage()
└── renderer.ts     — computeFrame(), paintFrame() (see ADR 0005)
```

React components stay in `src/components/` — they orchestrate the domain but are not part of it. `app.tsx` imports from `src/ascii/` directly; this is correct per Clean Architecture's dependency rule (UI → domain, never the reverse).

## Considered Options

- **Keep in `src/utils/`** — rejected: `utils/` implies generic, reusable utilities; the ASCII pipeline is specific domain logic.
- **Feature folder including components** — rejected: mixing UI and domain in the same module would couple the responsibilities the separation is meant to isolate.
