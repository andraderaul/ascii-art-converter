import type { Charset, ColorMode, ConversionSettings } from '../ascii/types'
import { cn } from '../utils/cn'
import Label from './ui/label'
import Slider from './ui/slider'

interface Props {
  settings: ConversionSettings
  onChange: (patch: Partial<ConversionSettings>) => void
}

const RESOLUTION_RANGE = { min: 6, max: 24, step: 1 }
const BRIGHTNESS_RANGE = { min: 0.5, max: 2.0, step: 0.05 }
const CONTRAST_RANGE = { min: 0.5, max: 3.0, step: 0.05 }

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
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'min-h-[44px] py-xs px-sm text-xs font-mono rounded-xs border cursor-pointer transition-all duration-fast',
            value === opt
              ? 'border-violet bg-accent-soft text-violet'
              : 'border-base bg-transparent text-fg-muted',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function ControlPanel({ settings, onChange }: Props) {
  return (
    <div className="flex flex-col gap-md">
      <Slider
        label="resolution"
        value={settings.resolution}
        min={RESOLUTION_RANGE.min}
        max={RESOLUTION_RANGE.max}
        step={RESOLUTION_RANGE.step}
        onChange={(resolution) => onChange({ resolution })}
        format={(v) => `${v}px`}
      />

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

      <Slider
        label="brightness"
        value={settings.brightness}
        min={BRIGHTNESS_RANGE.min}
        max={BRIGHTNESS_RANGE.max}
        step={BRIGHTNESS_RANGE.step}
        onChange={(brightness) => onChange({ brightness })}
      />

      <Slider
        label="contrast"
        value={settings.contrast}
        min={CONTRAST_RANGE.min}
        max={CONTRAST_RANGE.max}
        step={CONTRAST_RANGE.step}
        onChange={(contrast) => onChange({ contrast })}
      />
    </div>
  )
}
