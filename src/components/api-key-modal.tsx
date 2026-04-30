import { useState } from 'react'
import type { AIConfig, AIProviderName } from '../ai/types'
import { cn } from '../utils/cn'

interface Props {
  current: AIConfig | null
  onSave: (config: AIConfig) => void
  onRemove: () => void
  onClose: () => void
}

const PROVIDERS: { value: AIProviderName; label: string }[] = [
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'openai',    label: 'OpenAI (GPT-4o)' },
  { value: 'gemini',    label: 'Google (Gemini)' },
]

export default function ApiKeyModal({ current, onSave, onRemove, onClose }: Props) {
  const [provider, setProvider] = useState<AIProviderName>(current?.provider ?? 'anthropic')
  const [key, setKey] = useState(current?.key ?? '')

  function handleSave() {
    if (!key.trim()) return
    onSave({ provider, key: key.trim() })
    onClose()
  }

  function handleRemove() {
    onRemove()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,10,15,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm flex flex-col gap-md"
        style={{
          background: 'var(--abyss)',
          border: '1px solid var(--slate)',
          borderTop: '2px solid var(--violet)',
          padding: 'var(--gap-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-violet font-bold tracking-wide" style={{ fontSize: 'var(--text-sm)' }}>
            ⚿ AI CONFIG
          </span>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-sm">
          <label style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)' }}>
            PROVIDER
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProviderName)}
            style={{
              background: 'var(--input-bg)',
              border: 'var(--input-border)',
              color: 'var(--input-color)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--input-font-size)',
              borderRadius: 'var(--input-radius)',
              fontFamily: 'var(--font-mono)',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-sm">
          <label style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)' }}>
            API KEY
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="paste your key here"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            style={{
              background: 'var(--input-bg)',
              border: 'var(--input-border)',
              color: 'var(--input-color)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--input-font-size)',
              borderRadius: 'var(--input-radius)',
              fontFamily: 'var(--font-mono)',
              width: '100%',
            }}
          />
          <span style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>
            your key stays in your browser only — never sent to our servers
          </span>
        </div>

        <div className="flex gap-sm justify-between">
          {current && (
            <button
              onClick={handleRemove}
              className={cn('font-mono tracking-wide cursor-pointer transition-all')}
              style={{
                padding: 'var(--btn-secondary-padding)',
                fontSize: 'var(--btn-secondary-size)',
                border: 'var(--border-danger)',
                color: 'var(--hot-pink)',
                background: 'var(--color-danger-bg)',
                borderRadius: 'var(--btn-radius)',
              }}
            >
              remove key
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="ml-auto font-mono tracking-wide cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              padding: 'var(--btn-secondary-padding)',
              fontSize: 'var(--btn-secondary-size)',
              border: '2px solid var(--violet)',
              color: 'var(--violet)',
              background: 'var(--color-accent-bg)',
              borderRadius: 'var(--btn-radius)',
              fontWeight: 'var(--weight-bold)',
            }}
          >
            save key
          </button>
        </div>
      </div>
    </div>
  )
}
