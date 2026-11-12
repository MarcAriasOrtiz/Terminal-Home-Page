import { Fragment, useEffect, useState } from 'react'
import {
  INTRO_BANNER,
  INTRO_HINT,
  INTRO_LOG,
  INTRO_SHORTCUTS,
  INTRO_TIMING,
  INTRO_WELCOME,
} from '../terminal/intro'
import type { Segment } from '../terminal/intro'

type Block =
  | {
      kind: 'typed'
      className: string
      segments: Segment[]
      text: string
      speed: number
      pause: number
    }
  | { kind: 'banner'; lines: string[]; pause: number }
  | { kind: 'shortcuts' }

interface IntroProps {
  onRun: (command: string) => void
}

function typed(
  className: string,
  segments: Segment[],
  speed: number,
  pause: number,
): Block {
  return {
    kind: 'typed',
    className,
    segments,
    text: segments.map((segment) => segment.text).join(''),
    speed,
    pause,
  }
}

function buildBlocks(): Block[] {
  const narrow = window.matchMedia('(max-width: 640px)').matches
  const logs = INTRO_LOG.map((segments, i) =>
    typed(
      'intro__log',
      segments,
      INTRO_TIMING.logChar,
      i === INTRO_LOG.length - 1 ? INTRO_TIMING.beforeBanner : INTRO_TIMING.logPause,
    ),
  )
  return [
    ...logs,
    { kind: 'banner', lines: narrow ? INTRO_BANNER.narrow : INTRO_BANNER.wide, pause: INTRO_TIMING.afterBanner },
    typed('intro__text', [{ text: INTRO_WELCOME, className: '' }], INTRO_TIMING.welcomeChar, INTRO_TIMING.textPause),
    typed(
      'intro__text',
      [{ text: narrow ? INTRO_HINT.narrow : INTRO_HINT.wide, className: '' }],
      INTRO_TIMING.hintChar,
      INTRO_TIMING.textPause,
    ),
    { kind: 'shortcuts' },
  ]
}

function sliceSegments(segments: Segment[], count: number): Segment[] {
  let remaining = count
  const out: Segment[] = []
  for (const segment of segments) {
    if (remaining <= 0) break
    out.push({ ...segment, text: segment.text.slice(0, remaining) })
    remaining -= segment.text.length
  }
  return out
}

export default function Intro({ onRun }: IntroProps) {
  const [blocks] = useState(buildBlocks)
  const [index, setIndex] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? blocks.length : 0,
  )
  const [chars, setChars] = useState(0)
  const done = index >= blocks.length

  useEffect(() => {
    if (index >= blocks.length) return
    const block = blocks[index]

    if (block.kind === 'typed' && chars < block.text.length) {
      const timer = window.setTimeout(() => setChars(chars + 1), block.speed)
      return () => window.clearTimeout(timer)
    }

    const delay = block.kind === 'shortcuts' ? 0 : block.pause
    const timer = window.setTimeout(() => {
      setIndex(index + 1)
      setChars(0)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [blocks, index, chars])

  // Any key skips the rest of the sequence; typing still reaches the input.
  useEffect(() => {
    if (done) return
    const skip = () => setIndex(blocks.length)
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [blocks.length, done])

  return (
    <div className="intro" onClick={() => setIndex(blocks.length)}>
      {blocks.slice(0, index + 1).map((block, i) => {
        const current = i === index && !done

        if (block.kind === 'typed') {
          const shown = current ? sliceSegments(block.segments, chars) : block.segments
          return (
            <p className={block.className} key={i}>
              <span aria-hidden="true">
                {shown.map((segment, j) => (
                  <span className={segment.className || undefined} key={j}>
                    {segment.text}
                  </span>
                ))}
              </span>
              <span className="sr-only">{block.text}</span>
            </p>
          )
        }

        if (block.kind === 'banner') {
          return (
            <Fragment key={i}>
              <pre className="intro__banner" aria-hidden="true">
                {block.lines.join('\n')}
              </pre>
              <p className="sr-only">mao.home</p>
            </Fragment>
          )
        }

        return (
          <ul className="intro__shortcuts" key={i}>
            {INTRO_SHORTCUTS.map((shortcut) => (
              <li key={shortcut.command}>
                <button
                  type="button"
                  className="intro__shortcut"
                  onClick={() => onRun(shortcut.command)}
                >
                  <span className="intro__shortcut-command">{shortcut.label}</span>
                  <span className="intro__shortcut-desc">{shortcut.description}</span>
                </button>
              </li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}
