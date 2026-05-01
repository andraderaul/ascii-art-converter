import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../utils/cn'
import { isTouchDevice } from '../utils/device'

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
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => {
      t.stop()
    })
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
      setError(null)
      setLive(true)
      onVideoStream(video)
    } catch {
      streamRef.current = null
      setMode('upload')
      setLive(false)
      onVideoStream(null)
      setError('Camera access denied')
    }
  }, [onVideoStream])

  const switchMode = useCallback(
    (next: SourceMode) => {
      if (next === mode) {
        return
      }
      if (mode === 'webcam') {
        stopWebcam()
      }
      setError(null)
      setMode(next)
      if (next === 'webcam') {
        startWebcam()
      }
    },
    [mode, stopWebcam, startWebcam],
  )

  useEffect(() => () => stopWebcam(), [stopWebcam])

  const load = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return
      }
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        setError(null)
        onImage(img)
        URL.revokeObjectURL(url)
      }
      img.onerror = () => {
        setError('Failed to load image')
        URL.revokeObjectURL(url)
      }
      img.src = url
    },
    [onImage],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        load(file)
      }
    },
    [load],
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        load(file)
      }
    },
    [load],
  )

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex gap-2xs">
        <button
          type="button"
          onClick={() => switchMode('upload')}
          className={cn(
            'flex-1 min-h-[44px] py-2xs text-xs font-mono tracking-wide rounded-xs border cursor-pointer transition-all duration-fast',
            mode === 'upload'
              ? 'border-violet bg-accent-dim text-violet'
              : 'border-base bg-transparent text-fg-muted',
          )}
        >
          ↑ upload
        </button>
        <button
          type="button"
          onClick={() => switchMode('webcam')}
          className={cn(
            'flex-1 min-h-[44px] py-2xs text-xs font-mono tracking-wide rounded-xs border cursor-pointer transition-all duration-fast',
            mode === 'webcam'
              ? 'border-violet bg-accent-dim text-violet'
              : 'border-base bg-transparent text-fg-muted',
          )}
        >
          ◉ webcam
        </button>
      </div>

      {mode === 'upload' ? (
        <label
          htmlFor="file-upload"
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          className={cn(
            'border rounded-xs p-xl flex flex-col items-center justify-center gap-sm cursor-pointer min-h-[120px] select-none transition-colors duration-fast',
            dragging ? 'border-violet bg-accent-ghost' : 'border-base bg-transparent',
          )}
        >
          <span className="text-lg text-violet">⬆</span>
          <span className="text-fg text-sm">
            {isTouchDevice ? 'tap to upload' : 'drag & drop or click to upload'}
          </span>
          <span className="text-fg-muted text-xs">jpg · png · webp</span>
          <input
            id="file-upload"
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      ) : (
        <div
          className={cn(
            'border rounded-xs p-xl flex flex-col items-center justify-center gap-sm min-h-[120px] transition-colors duration-base',
            live ? 'border-hot-pink' : 'border-base',
          )}
        >
          <span className={cn('text-lg', live ? 'text-hot-pink' : 'text-fg-muted')}>
            {live ? '◉' : '○'}
          </span>
          <span className={cn('text-xs tracking-wide', live ? 'text-hot-pink' : 'text-fg-muted')}>
            {live ? 'LIVE' : 'starting camera...'}
          </span>
          {live && (
            <span className="text-fg-muted text-xs text-center">
              adjust controls to tune the feed
            </span>
          )}
        </div>
      )}

      {error && <span className="text-hot-pink text-xs tracking-wide">✕ {error}</span>}
    </div>
  )
}
