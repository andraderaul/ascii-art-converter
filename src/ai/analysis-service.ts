import { ParseError } from './errors'
import type { AIConfig, Analysis, ThreatLevel } from './types'

const THREAT_LEVELS: ThreatLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'UNKNOWN']

function validate(data: unknown): Analysis {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as Record<string, unknown>).description !== 'string' ||
    !THREAT_LEVELS.includes((data as Record<string, unknown>).threatLevel as ThreatLevel) ||
    !Array.isArray((data as Record<string, unknown>).tags) ||
    !(data as Record<string, unknown[]>).tags.every((t) => typeof t === 'string')
  ) {
    throw new ParseError()
  }
  return data as Analysis
}

export async function analyzeCanvas(dataUrl: string, config: AIConfig): Promise<Analysis> {
  const base64 = dataUrl.split(',')[1]

  if (config.provider === 'anthropic') {
    const { AnthropicAdapter } = await import('./adapters/anthropic')
    const raw = await new AnthropicAdapter(config.key).analyze(base64)
    return validate(raw)
  }

  if (config.provider === 'openai') {
    const { OpenAIAdapter } = await import('./adapters/openai')
    const raw = await new OpenAIAdapter(config.key).analyze(base64)
    return validate(raw)
  }

  if (config.provider !== 'gemini') {
    throw new Error(`unknown provider: ${config.provider}`)
  }

  const { GeminiAdapter } = await import('./adapters/gemini')
  const raw = await new GeminiAdapter(config.key).analyze(base64)
  return validate(raw)
}
