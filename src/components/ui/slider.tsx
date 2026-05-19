import Label from './label'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
  defaultValue?: number
  marks?: number[]
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toFixed(1),
  defaultValue,
  marks,
}: Props) {
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`

  const isAtDefault = defaultValue !== undefined && value === defaultValue

  return (
    <div className="flex flex-col gap-2xs">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-violet text-xs">{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onDoubleClick={() => {
            if (defaultValue !== undefined) {
              onChange(defaultValue)
            }
          }}
          style={{ touchAction: 'pan-y' }}
        />
        {defaultValue !== undefined && (
          <div
            data-testid="default-marker"
            className={`absolute w-0.5 h-2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-pill pointer-events-none ${isAtDefault ? 'bg-violet' : 'bg-slate'}`}
            style={{ left: pct(defaultValue) }}
          />
        )}
        {marks && marks.length > 0 && (
          <div className="relative h-1 mt-0.5">
            {marks.map((mark) => (
              <div
                key={mark}
                data-testid="tick-mark"
                className="absolute w-px h-1 bg-slate -translate-x-1/2 pointer-events-none"
                style={{ left: pct(mark) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
