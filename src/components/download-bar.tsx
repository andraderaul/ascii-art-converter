import { type RefObject } from 'react'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  asciiRows: string[]
  isLive?: boolean
}

export default function DownloadBar({ canvasRef, asciiRows, isLive }: Props) {
  function exportPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'ascii-art.png'
    a.click()
  }

  function exportTxt() {
    if (!asciiRows.length) return
    const blob = new Blob([asciiRows.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ascii-art.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function capture() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `ascii-capture-${Date.now()}.png`
    a.click()
  }

  const btnStyle: React.CSSProperties = {
    padding: 'var(--btn-secondary-padding)',
    fontSize: 'var(--btn-secondary-size)',
    fontFamily: 'var(--btn-font)',
    letterSpacing: 'var(--btn-tracking)',
    borderRadius: 'var(--btn-radius)',
    cursor: 'pointer',
    transition: 'all 0.12s',
  }

  if (isLive) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={capture}
          style={{
            ...btnStyle,
            border: '1px solid var(--hot-pink)',
            background: 'rgba(255,45,120,0.08)',
            color: 'var(--hot-pink)',
            fontWeight: 'var(--btn-primary-weight)',
          }}
        >
          ◎ capture
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <button
        onClick={exportPng}
        style={{
          ...btnStyle,
          border: 'var(--btn-primary-border)',
          background: 'var(--color-accent-bg)',
          color: 'var(--btn-primary-color)',
          fontWeight: 'var(--btn-primary-weight)',
        }}
      >
        export png
      </button>
      <button
        onClick={exportTxt}
        style={{
          ...btnStyle,
          border: 'var(--btn-secondary-border)',
          background: 'var(--color-info-bg)',
          color: 'var(--btn-secondary-color)',
          fontWeight: 'var(--btn-secondary-weight)',
        }}
      >
        export txt
      </button>
    </div>
  )
}
