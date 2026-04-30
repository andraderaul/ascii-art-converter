export type ColorMode = 'matrix' | 'bw' | 'retro' | 'sepia' | 'neon' | 'original'
export type Charset = 'simple' | 'complex' | 'binary' | 'blocks'

export interface ConversionSettings {
  resolution: number
  brightness: number
  contrast: number
  colorMode: ColorMode
  charset: Charset
}

export const CHARSET_MAPS: Record<Charset, string> = {
  simple:  ' .:-=+*#%@',
  complex: ' .^!*<&%$#@',
  binary:  ' 01',
  blocks:  ' ░▒▓█',
}
