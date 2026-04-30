import { useCallback, useEffect, useRef, useState } from 'react'

type SourceMode = 'upload' | 'webcam'

interface Props {
  onImage: (img: HTMLImageElement) => void
  onVideoStream: (video: HTMLVideoElement | null) => void
}

export default function UploadZone({ onImage, onVideoStream }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [mode, setMode] = useState<SourceMode>('upload')
  const [live, setLive] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setLive(false)
    onVideoStream(null)
  }, [onVideoStream])

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.playsInline = true
      video.muted = true
      await video.play()
      setLive(true)
      onVideoStream(video)
    } catch {
      streamRef.current = null
      setMode('upload')
      setLive(false)
      onVideoStream(null)
    }
  }, [onVideoStream])

  const switchMode = useCallback((next: SourceMode) => {
    if (next === mode) return
    if (mode === 'webcam') stopWebcam()
    setMode(next)
    if (next === 'webcam') startWebcam()
  }, [mode, stopWebcam, startWebcam])

  useEffect(() => () => stopWebcam(), [stopWebcam])

  const load = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      onImage(img)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [onImage])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) load(file)
  }, [load])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) load(file)
  }, [load])

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.4rem 0',
    fontSize: '0.7rem',
    fontFamily: 'var(--btn-font)',
    letterSpacing: 'var(--btn-tracking)',
    borderRadius: 'var(--radius-xs)',
    cursor: 'pointer',
    border: active ? '1px solid var(--violet)' : '1px solid var(--slate)',
    background: active ? 'rgba(184,41,255,0.08)' : 'transparent',
    color: active ? 'var(--violet)' : 'var(--fg-muted)',
    transition: 'all 0.12s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button style={toggleStyle(mode === 'upload')} onClick={() => switchMode('upload')}>
          ↑ upload
        </button>
        <button style={toggleStyle(mode === 'webcam')} onClick={() => switchMode('webcam')}>
          ◉ webcam
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{
            border: `1px solid ${dragging ? 'var(--violet)' : 'var(--slate)'}`,
            borderRadius: 'var(--radius-xs)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            minHeight: '120px',
            background: dragging ? 'rgba(184,41,255,0.05)' : 'transparent',
            transition: 'border-color 0.15s, background 0.15s',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '1.5rem', color: 'var(--violet)' }}>⬆</span>
          <span style={{ color: 'var(--fg)', fontSize: '0.875rem' }}>
            drag & drop or click to upload
          </span>
          <span style={{ color: 'var(--fg-muted)', fontSize: '0.75rem' }}>
            jpg · png · webp
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
        </div>
      ) : (
        <div style={{
          border: `1px solid ${live ? 'var(--hot-pink)' : 'var(--slate)'}`,
          borderRadius: 'var(--radius-xs)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: '120px',
          transition: 'border-color 0.3s',
        }}>
          <span style={{ fontSize: '1.5rem', color: live ? 'var(--hot-pink)' : 'var(--fg-muted)' }}>
            {live ? '◉' : '○'}
          </span>
          <span style={{
            color: live ? 'var(--hot-pink)' : 'var(--fg-muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}>
            {live ? 'LIVE' : 'starting camera...'}
          </span>
          {live && (
            <span style={{ color: 'var(--fg-muted)', fontSize: '0.7rem', textAlign: 'center' }}>
              adjust controls to tune the feed
            </span>
          )}
        </div>
      )}
    </div>
  )
}
