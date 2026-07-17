// Pure naming decisions for PNG Export. Blob construction stays in the shells.

/** Domain terms (CONTEXT.md). Recording is still to come. */
export type OutputKind = 'png-export' | 'capture'

export function outputFilename(kind: OutputKind): string {
  switch (kind) {
    case 'png-export':
      return 'glitch.png'
    case 'capture':
      return 'glitch-capture.png'
  }
}
