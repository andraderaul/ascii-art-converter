import { useCallback, useRef, useState } from 'react'
import { analyzeCanvas } from './ai/analysis-service'
import { AuthError, QuotaError } from './ai/errors'
import { useAIConfig } from './ai/use-ai-config'
import type { ConversionSettings } from './ascii/types'
import AboutModal from './components/about-modal'
import AnalysisModal, { type AnalysisState } from './components/analysis-modal'
import ApiKeyModal from './components/api-key-modal'
import AsciiCanvas from './components/ascii-canvas'
import ControlPanel from './components/control-panel'
import DownloadBar from './components/download-bar'
import ErrorBoundary from './components/error-boundary'
import UploadZone from './components/upload-zone'

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
  const [isMirrored, setIsMirrored] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { config: aiConfig, save: saveAiConfig, remove: removeAiConfig } = useAIConfig()
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [analysisState, setAnalysisState] = useState<AnalysisState | null>(null)

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
    if (!video) {
      setIsMirrored(false)
    }
  }, [])

  const handleFacingModeChange = useCallback((mirrored: boolean) => {
    setIsMirrored(mirrored)
  }, [])

  async function handleAnalyze() {
    const canvas = canvasRef.current
    if (!canvas || !aiConfig) {
      return
    }

    const dataUrl = canvas.toDataURL('image/png')
    setAnalysisState({ status: 'loading' })

    try {
      const analysis = await analyzeCanvas(dataUrl, aiConfig)
      setAnalysisState({ status: 'success', analysis })
    } catch (err) {
      if (err instanceof AuthError) {
        setAnalysisState({ status: 'auth-error' })
      } else if (err instanceof QuotaError) {
        setAnalysisState({ status: 'quota-error' })
      } else {
        setAnalysisState({ status: 'parse-error' })
      }
    }
  }

  const isLive = !!sourceVideo

  return (
    <div className="flex flex-col h-screen">
      <header className="py-sm px-sm sm:px-lg border-b border-base flex items-center gap-sm shrink-0">
        <span className="text-violet text-base font-bold tracking-wide">ASCII//CONVERT</span>
        <span className="text-slate text-xs hidden sm:block">—</span>
        <span className="text-fg-muted text-xs hidden sm:block">image → ascii art</span>
        <div className="ml-auto flex items-center gap-xs">
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="font-mono tracking-wide cursor-pointer transition-all"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              letterSpacing: 'var(--tracking-wide)',
              padding: '4px 8px',
            }}
          >
            about
          </button>
          <button
            type="button"
            onClick={() => setApiKeyModalOpen(true)}
            className="font-mono tracking-wide cursor-pointer transition-all"
            style={{
              fontSize: 'var(--text-xs)',
              color: aiConfig ? 'var(--violet)' : 'var(--muted)',
              background: 'none',
              border: 'none',
              letterSpacing: 'var(--tracking-wide)',
              padding: '4px 8px',
            }}
            title="Configure AI key"
          >
            ⚿ {aiConfig ? 'ai configured' : 'configure ai'}
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 [grid-template-rows:1fr_auto] sm:grid-cols-[280px_1fr] sm:[grid-template-rows:1fr] overflow-hidden">
        <aside className="border-r border-base p-md overflow-y-auto flex flex-col gap-lg max-h-[40vh] sm:max-h-none order-last sm:order-first">
          <UploadZone
            onImage={handleImage}
            onVideoStream={handleVideoStream}
            onFacingModeChange={handleFacingModeChange}
          />
          <div className="w-full h-px bg-slate" />
          <ControlPanel settings={settings} onChange={patchSettings} />
        </aside>

        <main className="flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <ErrorBoundary
              fallback={
                <div className="h-full flex items-center justify-center text-fg-muted text-sm">
                  render failed — try a different image or adjust settings
                </div>
              }
            >
              {sourceImage || sourceVideo ? (
                <AsciiCanvas
                  sourceImage={sourceImage}
                  sourceVideo={sourceVideo}
                  settings={settings}
                  onConverted={setAsciiRows}
                  canvasRef={canvasRef}
                  isMirrored={isMirrored}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-fg-muted text-sm">
                  upload an image or enable webcam to begin
                </div>
              )}
            </ErrorBoundary>
          </div>
          <div className="py-sm px-md border-t border-base shrink-0">
            <DownloadBar
              canvasRef={canvasRef}
              asciiRows={asciiRows}
              isLive={isLive}
              hasAiConfig={!!aiConfig}
              onAnalyze={handleAnalyze}
            />
          </div>
        </main>
      </div>

      {apiKeyModalOpen && (
        <ApiKeyModal
          current={aiConfig}
          onSave={saveAiConfig}
          onRemove={removeAiConfig}
          onClose={() => setApiKeyModalOpen(false)}
        />
      )}

      {analysisState && (
        <AnalysisModal
          state={analysisState}
          onClose={() => setAnalysisState(null)}
          onRetry={analysisState.status === 'parse-error' ? handleAnalyze : undefined}
        />
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
  )
}
