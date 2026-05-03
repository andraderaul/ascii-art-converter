import { useState } from 'react'
import { useToastError } from '../components/toast-provider'
import { Errors } from '../errors/app-error'
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
  const toastError = useToastError()

  function save(next: AIConfig) {
    try {
      localStorage.setItem('ai_config', JSON.stringify(next))
    } catch {
      toastError(Errors.storageFailed().message)
    }
    setConfig(next)
  }

  function remove() {
    try {
      localStorage.removeItem('ai_config')
    } catch {
      toastError(Errors.storageFailed().message)
    }
    setConfig(null)
  }

  return { config, save, remove }
}
