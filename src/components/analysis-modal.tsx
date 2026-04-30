import type { Analysis, ThreatLevel } from '../ai/types'

type AnalysisState =
  | { status: 'loading' }
  | { status: 'success'; analysis: Analysis }
  | { status: 'auth-error' }
  | { status: 'parse-error' }
  | { status: 'quota-error' }

interface Props {
  state: AnalysisState
  onClose: () => void
  onRetry?: () => void
}

const THREAT_COLOR: Record<ThreatLevel, string> = {
  LOW:      'var(--cyan)',
  MODERATE: 'var(--electric)',
  HIGH:     'var(--hot-pink)',
  CRITICAL: 'var(--hot-pink)',
  UNKNOWN:  'var(--muted)',
}

const THREAT_BG: Record<ThreatLevel, string> = {
  LOW:      'rgba(0,229,255,0.07)',
  MODERATE: 'rgba(255,230,0,0.07)',
  HIGH:     'rgba(255,45,120,0.07)',
  CRITICAL: 'rgba(255,45,120,0.12)',
  UNKNOWN:  'rgba(107,107,154,0.07)',
}

export default function AnalysisModal({ state, onClose, onRetry }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,10,15,0.9)' }}
      onClick={state.status !== 'loading' ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm flex flex-col gap-md"
        style={{
          background: 'var(--abyss)',
          border: '1px solid var(--slate)',
          borderTop: '2px solid var(--violet)',
          padding: 'var(--gap-xl)',
          minHeight: '220px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-violet font-bold tracking-wide" style={{ fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wider)' }}>
            ◈ NEURAL SCAN RESULTS
          </span>
          {state.status !== 'loading' && (
            <button
              onClick={onClose}
              style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              ✕
            </button>
          )}
        </div>

        {state.status === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-md" style={{ padding: 'var(--gap-xl) 0' }}>
            <span className="animate-pulse" style={{ color: 'var(--violet)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wider)' }}>
              ▸ SCANNING VISUAL FEED...
            </span>
            <span style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>
              interfacing with AI Provider
            </span>
          </div>
        )}

        {state.status === 'success' && (
          <>
            <div
              className="flex items-center justify-between"
              style={{
                background: THREAT_BG[state.analysis.threatLevel],
                border: `1px solid ${THREAT_COLOR[state.analysis.threatLevel]}`,
                padding: '10px 14px',
              }}
            >
              <span style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)' }}>
                THREAT LEVEL
              </span>
              <span
                className="font-bold"
                style={{
                  color: THREAT_COLOR[state.analysis.threatLevel],
                  fontSize: 'var(--text-sm)',
                  letterSpacing: 'var(--tracking-wider)',
                  textShadow: state.analysis.threatLevel === 'CRITICAL'
                    ? `0 0 8px ${THREAT_COLOR[state.analysis.threatLevel]}`
                    : undefined,
                }}
              >
                {state.analysis.threatLevel}
              </span>
            </div>

            <p style={{ color: 'var(--ghost)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)', margin: 0 }}>
              {state.analysis.description}
            </p>

            <div className="flex flex-wrap gap-xs">
              {state.analysis.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    color: 'var(--cyan)',
                    background: 'rgba(0,229,255,0.06)',
                    border: '1px solid rgba(0,229,255,0.2)',
                    padding: '2px 8px',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wide)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}

        {state.status === 'auth-error' && (
          <div className="flex-1 flex flex-col gap-sm justify-center" style={{ padding: 'var(--gap-md) 0' }}>
            <span style={{ color: 'var(--hot-pink)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)' }}>
              ✕ AUTH FAILED
            </span>
            <span style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)' }}>
              Invalid or expired API key. Review your key in settings and try again.
            </span>
          </div>
        )}

        {state.status === 'quota-error' && (
          <div className="flex-1 flex flex-col gap-sm justify-center" style={{ padding: 'var(--gap-md) 0' }}>
            <span style={{ color: 'var(--electric)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)' }}>
              ◈ QUOTA EXCEEDED
            </span>
            <span style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)' }}>
              API quota limit reached. Check your plan and billing in your provider's dashboard.
            </span>
          </div>
        )}

        {state.status === 'parse-error' && (
          <div className="flex-1 flex flex-col gap-sm justify-center" style={{ padding: 'var(--gap-md) 0' }}>
            <span style={{ color: 'var(--electric)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)' }}>
              ◈ FEED CORRUPTED
            </span>
            <span style={{ color: 'var(--dim)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)' }}>
              Analysis feed returned unexpected data. No threat assessment available.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 'var(--gap-sm)',
                  padding: 'var(--btn-secondary-padding)',
                  fontSize: 'var(--btn-secondary-size)',
                  border: 'var(--border-info)',
                  color: 'var(--cyan)',
                  background: 'var(--color-info-bg)',
                  borderRadius: 'var(--btn-radius)',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export type { AnalysisState }
