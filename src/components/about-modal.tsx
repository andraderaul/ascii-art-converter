interface Props {
  onClose: () => void
}

export default function AboutModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(10,10,15,0.85)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-lg p-xl rounded-sm border border-base"
        style={{ background: 'var(--bg-elevated)', maxWidth: 480, width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <span
            className="text-violet font-bold tracking-wide"
            style={{ fontSize: 'var(--text-base)' }}
          >
            ASCII//CONVERT
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
            }}
          >
            ✕
          </button>
        </div>

        <p className="text-fg-muted" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
          Turn any photo or your webcam into ASCII art — images made entirely of text characters.
          Upload a picture, tweak the settings, and export the result as an image or a text file.
          Everything happens in your browser, nothing is uploaded anywhere.
        </p>

        <div className="flex flex-col gap-sm">
          <span className="text-fg-muted text-xs tracking-wide uppercase">AI Scan</span>
          <p className="text-fg-muted" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
            There's an optional feature that lets an AI describe what it sees in your ASCII art. To
            use it, you need your own API key from Anthropic, OpenAI, or Google. Your key is saved
            only on your device and goes straight to the AI service — we never see it or store it on
            any server.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          <span className="text-fg-muted text-xs tracking-wide uppercase">Made with AI</span>
          <p className="text-fg-muted" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
            This project was built in collaboration with AI — not just the code, but the design
            decisions, documentation, and architecture too. It's an experiment in what a thoughtful
            human + AI workflow looks like in practice.
          </p>
        </div>

        <div className="flex gap-sm flex-wrap">
          <a
            href="https://github.com/andraderaul/ascii-art-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono tracking-wide transition-all"
            style={{ color: 'var(--cyan)', textDecoration: 'none' }}
          >
            source code →
          </a>
          <a
            href="https://www.linkedin.com/in/andraderaul/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono tracking-wide transition-all"
            style={{ color: 'var(--cyan)', textDecoration: 'none' }}
          >
            author →
          </a>
        </div>
      </div>
    </div>
  )
}
