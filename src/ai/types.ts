export type AIProviderName = 'anthropic' | 'openai' | 'gemini'

export interface AIConfig {
  provider: AIProviderName
  key: string
}

export type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN'

export interface Analysis {
  description: string
  threatLevel: ThreatLevel
  tags: string[]
}

export interface AIProvider {
  analyze(imageBase64: string): Promise<unknown>
}
