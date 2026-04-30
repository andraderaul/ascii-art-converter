import { useState } from 'react'
import type { AIConfig } from './types'

function readConfig(): AIConfig | null {
  try {
    const stored = localStorage.getItem('ai_config')
    return stored ? (JSON.parse(stored) as AIConfig) : null
  } catch {
    return null
  }
}

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig | null>(readConfig)

  function save(next: AIConfig) {
    try {
      localStorage.setItem('ai_config', JSON.stringify(next))
    } catch { /* localStorage unavailable */ }
    setConfig(next)
  }

  function remove() {
    try {
      localStorage.removeItem('ai_config')
    } catch { /* localStorage unavailable */ }
    setConfig(null)
  }

  return { config, save, remove }
}
