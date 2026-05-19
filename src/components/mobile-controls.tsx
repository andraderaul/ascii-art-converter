import { useState } from 'react'
import type { ConversionSettings } from '../ascii/types'
import { cn } from '../utils/cn'
import ControlPanel from './control-panel'
import MobileBottomSheet from './mobile-bottom-sheet'
import UploadZone from './upload-zone'

type Tab = 'source' | 'settings'

interface Props {
  onImage: (img: HTMLImageElement) => void
  onVideoStream: (video: HTMLVideoElement | null) => void
  onFacingModeChange?: (isMirrored: boolean) => void
  settings: ConversionSettings
  onSettingsChange: (patch: Partial<ConversionSettings>) => void
}

export default function MobileControls({
  onImage,
  onVideoStream,
  onFacingModeChange,
  settings,
  onSettingsChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('source')

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-md right-md z-40 sm:hidden flex items-center gap-xs bg-abyss border border-violet text-violet font-mono text-xs px-md py-sm rounded-xs"
        aria-label="controls"
      >
        ⚙ controls
      </button>

      <MobileBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-md">
          <div className="flex gap-xs border-b border-base pb-sm">
            <button
              type="button"
              onClick={() => setActiveTab('source')}
              className={cn(
                'font-mono text-xs px-sm py-2xs rounded-xs border transition-colors',
                activeTab === 'source' ? 'border-violet text-violet' : 'border-base text-fg-muted',
              )}
            >
              source
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={cn(
                'font-mono text-xs px-sm py-2xs rounded-xs border transition-colors',
                activeTab === 'settings'
                  ? 'border-violet text-violet'
                  : 'border-base text-fg-muted',
              )}
              aria-label="settings"
            >
              settings
            </button>
          </div>

          {activeTab === 'source' ? (
            <UploadZone
              onImage={onImage}
              onVideoStream={onVideoStream}
              onFacingModeChange={onFacingModeChange}
            />
          ) : (
            <ControlPanel settings={settings} onChange={onSettingsChange} />
          )}
        </div>
      </MobileBottomSheet>
    </>
  )
}
