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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--slate)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--violet)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          ASCII//CONVERT
        </span>
        <span style={{ color: 'var(--slate)', fontSize: '0.75rem' }}>—</span>
        <span style={{ color: 'var(--fg-muted)', fontSize: '0.7rem' }}>
          image → ascii art
        </span>
      </header>

      {/* Body */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        overflow: 'hidden',
      }}
        className="layout"
      >
        {/* Left: controls */}
        <aside style={{
          borderRight: '1px solid var(--slate)',
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <UploadZone onImage={handleImage} onVideoStream={handleVideoStream} />
          <div style={{ width: '100%', height: '1px', background: 'var(--slate)' }} />
          <ControlPanel settings={settings} onChange={patchSettings} />
        </aside>

        {/* Right: canvas */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {sourceImage || sourceVideo ? (
              <AsciiCanvas
                sourceImage={sourceImage}
                sourceVideo={sourceVideo}
                settings={settings}
                onConverted={setAsciiRows}
                canvasRef={canvasRef}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-muted)',
                fontSize: '0.8rem',
              }}>
                upload an image or enable webcam to begin
              </div>
            )}
          </div>
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--slate)',
            flexShrink: 0,
          }}>
            <DownloadBar canvasRef={canvasRef} asciiRows={asciiRows} isLive={isLive} />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr;
          }
        }
      `}</style>
    </div>
  )
}
