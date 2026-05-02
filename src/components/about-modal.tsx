interface Props {
  onClose: () => void
}

export default function AboutModal({ onClose }: Props) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 flex items-center justify-center z-50 bg-void/85"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About"
        className="relative flex flex-col gap-lg p-xl rounded-sm border border-base bg-elevated max-w-[480px] w-[90%]"
      >
        <div className="flex items-start justify-between">
          <span className="text-violet font-bold tracking-wide text-base">ASCII//CONVERT</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none text-muted cursor-pointer text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-fg-muted text-sm leading-normal">
          Turn any photo or your webcam into ASCII art — images made entirely of text characters.
          Upload a picture, tweak the settings, and export the result as an image or a text file.
          Everything happens in your browser, nothing is uploaded anywhere.
        </p>

        <div className="flex flex-col gap-sm">
          <span className="text-fg-muted text-xs tracking-wide uppercase">AI Scan</span>
          <p className="text-fg-muted text-sm leading-normal">
            There's an optional feature that lets an AI describe what it sees in your ASCII art. To
            use it, you need your own API key from Anthropic, OpenAI, or Google. Your key is saved
            only on your device and goes straight to the AI service — we never see it or store it on
            any server.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          <span className="text-fg-muted text-xs tracking-wide uppercase">Made with AI</span>
          <p className="text-fg-muted text-sm leading-normal">
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
            className="text-xs font-mono tracking-wide transition-all text-cyan no-underline"
          >
            source code →
          </a>
          <a
            href="https://www.linkedin.com/in/andraderaul/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono tracking-wide transition-all text-cyan no-underline"
          >
            author →
          </a>
        </div>
      </div>
    </div>
  )
}
