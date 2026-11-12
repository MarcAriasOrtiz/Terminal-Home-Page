import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CONFLUENCE_CAPTION, CONFLUENCE_OUTPUT, RIVERS } from '../../career/resume'

// Confluence rivers — five disciplines whose currents merge into one trunk
// that thickens at every junction and feeds the working system. Geometry is
// measured from the actual DOM (no fixed viewBox), so paths always touch the
// buttons they connect. Data comes from cv.md via RIVERS.

interface Pt {
  x: number
  y: number
}

interface StageGeo {
  /** Stage box, CSS pixels. */
  w: number
  h: number
  /** Below the breakpoint the rivers flow downwards instead of rightwards. */
  vertical: boolean
  /** Stream anchors: right edge midpoint on desktop, bottom-right on mobile. */
  anchors: Pt[]
  /** Output anchor: left edge midpoint on desktop, top midpoint on mobile. */
  out: Pt
}

interface Geo {
  /** One path per stream, in RIVERS order. */
  streams: string[]
  /** Trunk segments; segment k carries rivers 0..k and sits after junction k. */
  segs: Array<{ d: string; w: number }>
}

const R = (n: number) => Math.round(n * 100) / 100

// Horizontal-friendly cubic between two points with horizontal handles.
function cubic(x1: number, y1: number, x2: number, y2: number, bend = 0.45): string {
  const dx = (x2 - x1) * bend
  return `M ${R(x1)} ${R(y1)} C ${R(x1 + dx)} ${R(y1)}, ${R(x2 - dx)} ${R(y2)}, ${R(x2)} ${R(y2)}`
}

// Vertical-friendly cubic between two points with vertical handles.
function cubicV(x1: number, y1: number, x2: number, y2: number): string {
  const dy = (y2 - y1) * 0.5
  return `M ${R(x1)} ${R(y1)} C ${R(x1)} ${R(y1 + dy)}, ${R(x2)} ${R(y2 - dy)}, ${R(x2)} ${R(y2)}`
}

const TRUNK_WIDTHS = [2.4, 3.4, 4.5, 5.6, 6.6]

function buildGeometry(g: StageGeo): Geo {
  const n = RIVERS.length
  const scale = Math.min(1.25, Math.max(0.7, Math.min(g.w, g.h) / 420))
  const widths = TRUNK_WIDTHS.map((v) => R(v * scale))

  if (!g.vertical) {
    const startX = Math.max(...g.anchors.map((a) => a.x)) + 48
    const endX = g.out.x - 34
    const y0 = g.anchors[0].y
    // Small alternating offset so the trunk reads as a river, not a ruler.
    const jit = (k: number) => (k % 2 ? -1 : 1) * Math.min(g.h * 0.035, 12)
    const junctions = Array.from({ length: n }, (_, k) => ({
      x: startX + (endX - startX) * (k / (n - 1)),
      y: y0 + (g.out.y - y0) * (k / (n - 1)) + (k === 0 ? 0 : jit(k)),
    }))
    const streams = g.anchors.map((a, i) => cubic(a.x, a.y, junctions[i].x, junctions[i].y))
    const segs: Geo['segs'] = []
    for (let k = 0; k < n - 1; k++) {
      segs.push({ d: cubic(junctions[k].x, junctions[k].y, junctions[k + 1].x, junctions[k + 1].y, 0.5), w: widths[k] })
    }
    segs.push({ d: cubic(junctions[n - 1].x, junctions[n - 1].y, g.out.x, g.out.y, 0.5), w: widths[n - 1] })
    return { streams, segs }
  }

  // Vertical: a rail beside the rows, each river taps in below its own row.
  const spine = g.w - 16
  const junctions = g.anchors.map((a) => ({ x: spine, y: a.y + 10 }))
  const streams = g.anchors.map((a) => cubicV(a.x, a.y, spine, a.y + 10))
  const segs: Geo['segs'] = []
  for (let k = 0; k < n - 1; k++) {
    segs.push({ d: `M ${R(spine)} ${R(junctions[k].y)} L ${R(spine)} ${R(junctions[k + 1].y)}`, w: widths[k] })
  }
  segs.push({ d: cubicV(spine, junctions[n - 1].y, g.out.x, g.out.y), w: widths[n - 1] })
  return { streams, segs }
}

export default function Confluence() {
  const stageRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLButtonElement | null>(null)
  const streamRefs = useRef<Array<HTMLButtonElement | null>>([])
  const timerRef = useRef<number | null>(null)

  const [geometry, setGeometry] = useState<StageGeo | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'run' | 'done'>('idle')
  const [step, setStep] = useState(0)

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])
  useEffect(() => stop, [stop])

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const sb = stage.getBoundingClientRect()
    if (sb.width < 40) return
    const vertical = sb.width < 620
    const anchors = streamRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      return vertical
        ? { x: R(r.left + r.width / 2 - sb.left), y: R(r.bottom - sb.top) }
        : { x: R(r.right - sb.left), y: R(r.top + r.height / 2 - sb.top) }
    })
    let out = { x: sb.width / 2, y: 0 }
    const el = outputRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      out = vertical
        ? { x: R(r.left + r.width / 2 - sb.left), y: R(r.top - sb.top) }
        : { x: R(r.left - sb.left), y: R(r.top + r.height / 2 - sb.top) }
    }
    setGeometry({ w: sb.width, h: sb.height, vertical, anchors, out })
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (stageRef.current) ro.observe(stageRef.current)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {})
    }
    return () => ro.disconnect()
  }, [measure])

  // The run finishes when every discipline has joined.
  useEffect(() => {
    if (phase === 'run' && step >= RIVERS.length) {
      stop()
      setPhase('done')
    }
  }, [phase, step, stop])

  const run = () => {
    stop()
    setPinned(null)
    setHovered(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(RIVERS.length)
      setPhase('done')
      return
    }
    setStep(0)
    setPhase('run')
    timerRef.current = window.setInterval(() => setStep((s) => Math.min(s + 1, RIVERS.length)), 650)
  }

  const setStream = (id: string) => {
    stop()
    setPhase('idle')
    setStep(0)
    setPinned((prev) => (prev === id ? null : id))
  }

  const reset = () => {
    stop()
    setPhase('idle')
    setStep(0)
    setPinned(null)
  }

  const activeId = phase === 'idle' ? (hovered ?? pinned) : null
  const activeIdx = activeId ? RIVERS.findIndex((r) => r.id === activeId) : -1
  const activeRiver = activeIdx >= 0 ? RIVERS[activeIdx] : null
  const running = phase === 'run'

  const geo = useMemo(() => (geometry ? buildGeometry(geometry) : null), [geometry])

  const streamAttrs = (i: number) => {
    if (running || phase === 'done') {
      const joined = i < step
      return { strokeOpacity: running ? (joined ? 0.95 : 0.15) : 0.92, strokeWidth: 1.6 }
    }
    if (activeIdx < 0) return { strokeOpacity: 0.66, strokeWidth: 1.6 }
    return activeIdx === i
      ? { strokeOpacity: 1, strokeWidth: 2.6 }
      : { strokeOpacity: 0.16, strokeWidth: 1.4 }
  }

  const segAttrs = (k: number) => {
    if (running) return { strokeOpacity: k < step ? 0.95 : 0.14 }
    if (phase === 'done' || activeIdx < 0) return { strokeOpacity: 0.92 }
    // Water from stream i flows through trunk segments i..n-1.
    return k >= activeIdx ? { strokeOpacity: 0.95 } : { strokeOpacity: 0.16 }
  }

  const logLines = useMemo(() => {
    if (running) {
      const lines: Array<{ cls: string; text: string }> = RIVERS.slice(0, step).map((r) => ({
        cls: 'ok',
        text: `[ok] ${r.id}.${r.fn}()`,
      }))
      if (step < RIVERS.length && RIVERS[step]) {
        lines.push({ cls: 'dim', text: `[..] ${RIVERS[step].id}.${RIVERS[step].fn}()` })
      }
      return lines
    }
    if (phase === 'done') {
      return [
        { cls: 'ok', text: '[ok] 5 rivers merged' },
        { cls: 'arrow', text: 'working system: online' },
      ]
    }
    if (activeRiver) {
      return [
        { cls: 'ok', text: `[ok] ${activeRiver.id}.${activeRiver.fn}()` },
        { cls: 'arrow', text: 'joins trunk into working system' },
      ]
    }
    return [
      { cls: 'ok', text: '[ok] 5 rivers on trunk' },
      { cls: 'arrow', text: 'working system: online' },
    ]
  }, [running, phase, step, activeRiver])

  const codeLine = running || phase === 'done' ? 'pipeline.run()' : activeRiver ? `${activeRiver.id}.${activeRiver.fn}()` : 'system.status()'
  const title = running ? 'Converging…' : activeRiver ? activeRiver.label : CONFLUENCE_OUTPUT
  const body = activeRiver ? activeRiver.summary : CONFLUENCE_CAPTION

  return (
    <div className="confluence">
      <div className="confluence__left">
        <div className="confluence__stage" ref={stageRef}>
          {geo && (
            <svg className="confluence__rivers" aria-hidden="true" focusable="false">
              {geo.streams.map((d, i) => (
                <path
                  key={RIVERS[i].id}
                  className="confluence__river"
                  d={d}
                  stroke={`rgb(${RIVERS[i].color})`}
                  strokeLinecap="round"
                  {...streamAttrs(i)}
                />
              ))}
              {geo.segs.map((s, k) => (
                <path
                  key={k}
                  className="confluence__seg"
                  d={s.d}
                  stroke="rgb(182, 255, 108)"
                  fill="none"
                  {...segAttrs(k)}
                  strokeWidth={s.w}
                />
              ))}
            </svg>
          )}
          <div className="confluence__streams">
            {RIVERS.map((river, i) => (
              <button
                key={river.id}
                ref={(el) => {
                  streamRefs.current[i] = el
                }}
                type="button"
                className={`confluence__stream${!running && activeIdx === i ? ' is-active' : ''}`}
                style={{ '--river-color': river.color } as CSSProperties}
                aria-pressed={pinned === river.id && phase === 'idle' ? 'true' : 'false'}
                onMouseEnter={() => setHovered(river.id)}
                onFocus={() => setHovered(river.id)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered((prev) => (prev === river.id ? null : prev))}
                onClick={() => setStream(river.id)}
              >
                <span className="confluence__stream-num">0{i + 1} / {river.id}</span>
                <span className="confluence__stream-title">{river.label}</span>
                <small>{river.sub}</small>
              </button>
            ))}
          </div>
          <button
            type="button"
            ref={outputRef}
            className="confluence__output"
            aria-label={`${CONFLUENCE_OUTPUT}: show all rivers`}
            aria-pressed={pinned === null && phase !== 'run' ? 'true' : 'false'}
            onClick={reset}
          >
            <span className="confluence__output-tag">Output</span>
            <span className="confluence__output-name">{CONFLUENCE_OUTPUT}</span>
            <span className={`confluence__output-status${running ? ' is-building' : ''}`}>
              {running ? `Building ${step}/${RIVERS.length}` : 'Online'}
            </span>
          </button>
        </div>

        <div className="confluence__controls">
          <span className="confluence__hint">Hover a river to trace its path, or run the pipeline to watch them merge.</span>
          <button type="button" className="confluence__run" onClick={running ? stop : run}>
            {running ? 'Pause run' : phase === 'done' ? 'Run again' : 'Run pipeline'}
          </button>
        </div>
      </div>

      <aside className="confluence__panel">
        <div className="confluence__panel-head">
          <h3>{title}</h3>
          <code className="confluence__code">{codeLine}</code>
        </div>
        <p>{body}</p>
        {activeRiver && (
          <ul className="confluence__tags">
            {activeRiver.tags.map((tag) => (
              <li key={tag} className="confluence__tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="confluence__term" aria-live="polite">
          {logLines.map((line, i) => (
            <span key={`${line.text}-${i}`} className={`confluence__${line.cls}`}>
              {line.text}
            </span>
          ))}
        </div>
      </aside>

      <ul className="confluence__print">
        <li>
          <strong>{CONFLUENCE_OUTPUT}.</strong> {CONFLUENCE_CAPTION}
        </li>
        {RIVERS.map((river) => (
          <li key={river.id}>
            <strong>{river.label}.</strong> {river.summary}
          </li>
        ))}
      </ul>
    </div>
  )
}
