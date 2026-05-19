import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  id: string
  content: string
}

export default function Tooltip({ id, content }: Props) {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!visible) {
      return
    }

    function handleOutsideClick(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node)) {
        return
      }
      setVisible(false)
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [visible])

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="more info"
        aria-expanded={visible}
        aria-describedby={id}
        className="font-mono text-xs text-fg-subtle hover:text-violet transition-colors cursor-default p-0 bg-transparent border-none leading-none"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={(e) => {
          e.stopPropagation()
          setVisible((v) => !v)
        }}
      >
        &#x24D8;
      </button>
      <div
        id={id}
        role="tooltip"
        aria-hidden={!visible}
        className={cn(
          'absolute z-10 w-48 p-xs bg-shadow border border-slate rounded-xs font-mono text-xs text-fg-muted leading-relaxed',
          'top-full left-0 mt-2xs',
          visible ? 'block' : 'hidden',
        )}
      >
        {content}
      </div>
    </span>
  )
}
