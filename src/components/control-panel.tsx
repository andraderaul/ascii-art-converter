import { ConversionSettings, ColorMode, Charset } from '../types'

interface Props {
  settings: ConversionSettings
  onChange: (patch: Partial<ConversionSettings>) => void
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: 'var(--fg-muted)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {children}
    </span>
  )
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '0.2rem 0.5rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            borderRadius: 'var(--radius-xs)',
            border: `1px solid ${value === opt ? 'var(--violet)' : 'var(--slate)'}`,
            background: value === opt ? 'rgba(184,41,255,0.12)' : 'transparent',
            color: value === opt ? 'var(--violet)' : 'var(--fg-muted)',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>{label}</Label>
        <span style={{ color: 'var(--violet)', fontSize: '0.7rem' }}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

export default function ControlPanel({ settings, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Label>resolution</Label>
          <span style={{ color: 'var(--violet)', fontSize: '0.7rem' }}>{settings.resolution}px</span>
        </div>
        <input
          type="range"
          min={6}
          max={24}
          step={1}
          value={settings.resolution}
          onChange={(e) => onChange({ resolution: parseInt(e.target.value) })}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <Label>color mode</Label>
        <ToggleGroup<ColorMode>
          options={['matrix', 'bw', 'retro', 'sepia', 'neon', 'original']}
          value={settings.colorMode}
          onChange={(colorMode) => onChange({ colorMode })}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <Label>charset</Label>
        <ToggleGroup<Charset>
          options={['simple', 'complex', 'binary', 'blocks']}
          value={settings.charset}
          onChange={(charset) => onChange({ charset })}
        />
      </div>

      <SliderRow
        label="brightness"
        value={settings.brightness}
        min={0.5}
        max={2.0}
        step={0.05}
        onChange={(brightness) => onChange({ brightness })}
      />

      <SliderRow
        label="contrast"
        value={settings.contrast}
        min={0.5}
        max={3.0}
        step={0.05}
        onChange={(contrast) => onChange({ contrast })}
      />
    </div>
  )
}
