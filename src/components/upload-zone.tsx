import { useCallback, useRef, useState } from 'react'
import { useWebcamState } from '../hooks/use-webcam-state'
import { cn } from '../utils/cn'
import { isTouchDevice } from '../utils/device'
import Button from './ui/button'
import ToggleGroup from './ui/toggle-group'

interface Props {
  onImage: (img: HTMLImageElement) => void
  onVideoStream: (video: HTMLVideoElement | null) => void
  onFacingModeChange?: (isMirrored: boolean) => void
}

export default function UploadZone({ onImage, onVideoStream, onFacingModeChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const { state, switchCamera, switchMode } = useWebcamState(onVideoStream, onFacingModeChange)
  const { mode, live, facingMode, error } = state

  const load = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return
      }
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        setImageError(null)
        onImage(img)
        URL.revokeObjectURL(url)
      }
      img.onerror = () => {
        setImageError('Failed to load image')
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

  const displayError = error ?? imageError

  return (
    <div className="flex flex-col gap-sm">
      <ToggleGroup
        options={['upload', 'webcam'] as const}
        value={mode}
        onChange={switchMode}
        fullWidth
        labels={{ upload: '↑ upload', webcam: '◉ webcam' }}
      />

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
          {live && isTouchDevice && (
            <Button variant="ghost" onClick={() => void switchCamera()} className="px-sm py-2xs">
              ⇄ {facingMode === 'user' ? 'front' : 'rear'}
            </Button>
          )}
        </div>
      )}

      {displayError && (
        <span className="text-hot-pink text-xs tracking-wide">✕ {displayError}</span>
      )}
    </div>
  )
}
