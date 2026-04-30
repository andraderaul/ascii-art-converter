import { ConversionSettings, ColorMode, Charset } from '../types'
import { cn } from '../utils/cn'

interface Props {
  settings: ConversionSettings
  onChange: (patch: Partial<ConversionSettings>) => void
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-fg-muted text-xs tracking-wide uppercase">
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
    <div className="flex gap-xs flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'py-xs px-sm text-xs font-mono rounded-xs border cursor-pointer transition-all duration-fast',
            value === opt
              ? 'border-violet bg-accent-soft text-violet'
              : 'border-base bg-transparent text-fg-muted'
          )}
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
    <div className="flex flex-col gap-2xs">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-violet text-xs">{value.toFixed(1)}</span>
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
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-2xs">
        <div className="flex justify-between">
          <Label>resolution</Label>
          <span className="text-violet text-xs">{settings.resolution}px</span>
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

      <div className="flex flex-col gap-2xs">
        <Label>color mode</Label>
        <ToggleGroup<ColorMode>
          options={['matrix', 'bw', 'retro', 'sepia', 'neon', 'original']}
          value={settings.colorMode}
          onChange={(colorMode) => onChange({ colorMode })}
        />
      </div>

      <div className="flex flex-col gap-2xs">
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
