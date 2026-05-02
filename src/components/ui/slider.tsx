import Label from './label'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toFixed(1),
}: Props) {
  return (
    <div className="flex flex-col gap-2xs">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-violet text-xs">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ touchAction: 'pan-y' }}
      />
    </div>
  )
}
