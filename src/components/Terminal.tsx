import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { runCommand } from '../terminal/commands'
import { toTilde } from '../terminal/filesystem'
import Intro from './Intro'

type LineKind = 'command' | 'output' | 'error'

interface Line {
  id: number
  kind: LineKind
  text: string
  cwd?: string
}

let nextId = 0

const INTRO_SEEN_KEY = 'mao.home:intro-seen'

function readIntroSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    // Storage can be unavailable (private modes); the intro then shows on each load.
  }
}

function Prompt({ cwd, dollar = false }: { cwd: string; dollar?: boolean }) {
  return (
    <span className="prompt" aria-hidden="true">
      <span className="prompt__user">mao</span>@
      <span className="prompt__host">mao.home</span>:
      <span className="prompt__path">{toTilde(cwd)}</span>
      {dollar && <span className="prompt__dollar">$</span>}
    </span>
  )
}

interface TerminalProps {
  cwd: string
  floating: boolean
  open: boolean
  onNavigate: (path: string) => void
  onClose: () => void
  onOpenFile?: (path: string) => void
  onActivity: () => void
  onFocusChange: (focused: boolean) => void
}

export default function Terminal({
  cwd,
  floating,
  open,
  onNavigate,
  onClose,
  onOpenFile,
  onActivity,
  onFocusChange,
}: TerminalProps) {
  // The intro plays on the first visit of each session. `null` means no intro.
  const [introKey, setIntroKey] = useState<number | null>(() => (readIntroSeen() ? null : 0))
  const [lines, setLines] = useState<Line[]>(() =>
    introKey === null
      ? [{ id: nextId++, kind: 'output', text: 'mao.home v0.1.0 — type `help` to see commands.' }]
      : [],
  )
  const [value, setValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevOpen = useRef(open)

  useEffect(() => {
    markIntroSeen()
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, open])

  // Focus the input only when the terminal is explicitly opened (open: false -> true),
  // not on initial mount — avoids popping the mobile keyboard on load.
  useEffect(() => {
    if (open && !prevOpen.current) inputRef.current?.focus()
    prevOpen.current = open
  }, [open])

  // Close the floating terminal on Escape.
  useEffect(() => {
    if (!floating || !open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [floating, open, onClose])

  function runInput(input: string) {
    if (input.trim() === '') return
    const result = runCommand(input, cwd)
    if (result.intro) {
      setLines([])
      setIntroKey((key) => (key ?? 0) + 1)
    } else if (result.clear) {
      setLines([])
      setIntroKey(null)
    } else if (result.kind === 'open') {
      onOpenFile?.(result.openPath!)
    } else {
      setLines((prev) => [
        ...prev,
        { id: nextId++, kind: 'command', text: input, cwd },
        { id: nextId++, kind: result.kind as LineKind, text: result.text },
      ])
    }
    onNavigate(result.cwd)
    onActivity()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input = value
    setValue('')
    runInput(input)
  }

  const classes = [
    'terminal',
    floating ? 'terminal--floating' : 'terminal--docked',
    floating && !open ? 'terminal--closed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={classes}
      aria-label="Terminal"
      inert={floating && !open}
      onPointerDown={onActivity}
    >
      <header className="terminal__header">
        <span className="terminal__title">terminal</span>
        <span className="terminal__cwd">{toTilde(cwd)}</span>
        {floating && (
          <button
            type="button"
            className="terminal__close"
            aria-label="Close terminal"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </header>

      <div className="terminal__output" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        {introKey !== null && <Intro key={introKey} onRun={runInput} />}
        {lines.map((line) =>
          line.kind === 'command' ? (
            <div className="history-line history-line--command" key={line.id}>
              <Prompt cwd={line.cwd ?? cwd} dollar />
              <span>{line.text}</span>
            </div>
          ) : (
            <div className={`history-line history-line--${line.kind}`} key={line.id}>
              {line.text}
            </div>
          ),
        )}
      </div>

      <form className="terminal__input-line" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="term-input">
          Terminal command input
        </label>
        <Prompt cwd={cwd} dollar />
        <input
          id="term-input"
          ref={inputRef}
          className="terminal__input"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            onActivity()
          }}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </form>
    </section>
  )
}
