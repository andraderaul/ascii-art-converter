import { useCallback, useRef, useState } from 'react'
import { ConversionSettings } from './types'
import UploadZone from './components/upload-zone'
import ControlPanel from './components/control-panel'
import AsciiCanvas from './components/ascii-canvas'
import DownloadBar from './components/download-bar'

const DEFAULT_SETTINGS: ConversionSettings = {
  resolution: 12,
  brightness: 1.0,
  contrast: 1.0,
  colorMode: 'matrix',
  charset: 'complex',
}

export default function App() {
  const [settings, setSettings] = useState<ConversionSettings>(DEFAULT_SETTINGS)
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null)
  const [sourceVideo, setSourceVideo] = useState<HTMLVideoElement | null>(null)
  const [asciiRows, setAsciiRows] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const patchSettings = useCallback((patch: Partial<ConversionSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleImage = useCallback((img: HTMLImageElement) => {
    setSourceVideo(null)
    setSourceImage(img)
  }, [])

  const handleVideoStream = useCallback((video: HTMLVideoElement | null) => {
    setSourceImage(null)
    setSourceVideo(video)
  }, [])

  const isLive = !!sourceVideo

  return (
    <div className="flex flex-col h-screen">
      <header className="py-sm px-lg border-b border-base flex items-center gap-sm shrink-0">
        <span className="text-violet text-base font-bold tracking-wide">ASCII//CONVERT</span>
        <span className="text-slate text-xs">—</span>
        <span className="text-fg-muted text-xs">image → ascii art</span>
      </header>

      <div className="flex-1 grid grid-cols-1 [grid-template-rows:auto_1fr] sm:grid-cols-[280px_1fr] sm:[grid-template-rows:1fr] overflow-hidden">
        <aside className="border-r border-base p-md overflow-y-auto flex flex-col gap-lg">
          <UploadZone onImage={handleImage} onVideoStream={handleVideoStream} />
          <div className="w-full h-px bg-slate" />
          <ControlPanel settings={settings} onChange={patchSettings} />
        </aside>

        <main className="flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            {sourceImage || sourceVideo ? (
              <AsciiCanvas
                sourceImage={sourceImage}
                sourceVideo={sourceVideo}
                settings={settings}
                onConverted={setAsciiRows}
                canvasRef={canvasRef}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-fg-muted text-sm">
                upload an image or enable webcam to begin
              </div>
            )}
          </div>
          <div className="py-sm px-md border-t border-base shrink-0">
            <DownloadBar canvasRef={canvasRef} asciiRows={asciiRows} isLive={isLive} />
          </div>
        </main>
      </div>
    </div>
  )
}
