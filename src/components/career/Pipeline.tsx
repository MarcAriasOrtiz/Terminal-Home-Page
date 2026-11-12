import { useEffect, useRef } from 'react'

const DOMAIN_ORDER = ['data', 'ai', 'software', 'automation', 'infra']
const CALLS = ['ingest', 'represent', 'retrieve', 'act', 'ship']
const SVG_NS = 'http://www.w3.org/2000/svg'

// Gentle sine-like curves (horizontal desktop / vertical mobile).
const HORIZONTAL_PATH = 'M 30 110 C 150 60 210 160 360 110 C 510 60 570 160 690 110'
const VERTICAL_PATH = 'M 160 40 C 110 160 210 220 160 320 C 110 420 210 480 160 520'

function initPipeline(root: HTMLElement): () => void {
  const svg = root.querySelector<SVGSVGElement>('.pipeline__svg')!
  const rail = root.querySelector<SVGPathElement>('.pipeline__rail')!
  const packet = root.querySelector<SVGCircleElement>('.pipeline__packet')!
  const stations = Array.from(root.querySelectorAll<SVGGElement>('.pipeline__station'))
  const log = root.querySelector<HTMLDivElement>('.pipeline__log')!
  const counter = root.querySelector<HTMLDivElement>('.pipeline__counter')!
  const calls = Array.from(root.querySelectorAll<HTMLElement>('.pipeline__call'))
  const career = root.closest('.career')

  const CALL_OF: Record<string, string> = {
    data: 'ingest',
    ai: 'represent',
    software: 'retrieve',
    automation: 'act',
    infra: 'ship',
  }
  const LOGS: Record<string, string> = {
    data: 'ingested 42 docs',
    ai: 'embedded 1.2k chunks',
    software: 'built api payload',
    automation: 'dispatched 3 agents',
    infra: 'answered in 340ms',
  }

  const PAUSE_MS = 500
  const MOVE_MS = 800
  const FADE_MS = 300
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let horizontal = true
  let stationLengths: number[] = []
  let stationPoints: Array<{ x: number; y: number }> = []

  function readLabel(domain: string): string {
    const el = career?.querySelector(
      `.career__domains .career__domain[data-domain="${domain}"] .career__domain-name`,
    )
    return el ? (el.textContent || '').trim() : domain
  }

  function splitLabel(text: string): string[] {
    if (text.length <= 15) return [text]
    const mid = Math.floor(text.length / 2)
    const space = text.lastIndexOf(' ', mid)
    if (space > 0) return [text.slice(0, space), text.slice(space + 1)]
    return [text.slice(0, mid), text.slice(mid)]
  }

  function setLabel(g: SVGGElement, text: string) {
    const t = g.querySelector<SVGTextElement>('.pipeline__label')
    if (!t) return
    while (t.firstChild) t.removeChild(t.firstChild)
    const lines = splitLabel(text)
    const x = horizontal ? 0 : 22
    t.setAttribute('x', String(x))
    t.setAttribute('y', horizontal ? '26' : '4')
    t.setAttribute('text-anchor', horizontal ? 'middle' : 'start')
    lines.forEach((line, i) => {
      const tspan = document.createElementNS(SVG_NS, 'tspan')
      tspan.setAttribute('x', String(x))
      tspan.setAttribute('dy', i === 0 ? '0' : '1.1em')
      tspan.textContent = line
      t.appendChild(tspan)
    })
  }

  function build() {
    horizontal = root.clientWidth >= 640
    const W = horizontal ? 720 : 320
    const H = horizontal ? 220 : 560
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    rail.setAttribute('d', horizontal ? HORIZONTAL_PATH : VERTICAL_PATH)
    const total = rail.getTotalLength()
    stationLengths = DOMAIN_ORDER.map((_, i) => (i / (DOMAIN_ORDER.length - 1)) * total)
    stationPoints = stationLengths.map((l) => rail.getPointAtLength(l))
    stations.forEach((g, i) => {
      const p = stationPoints[i]
      g.setAttribute('transform', `translate(${p.x}, ${p.y})`)
      setLabel(g, readLabel(DOMAIN_ORDER[i]))
    })
  }

  function positionPacket(len: number) {
    const p = rail.getPointAtLength(len)
    packet.setAttribute('cx', String(p.x))
    packet.setAttribute('cy', String(p.y))
  }

  function setLog(domain: string, warn = false) {
    if (warn) {
      log.textContent = '[warn] retrying…'
      return
    }
    log.textContent = `${domain.padEnd(10, '\u00a0')} → [ok] ${LOGS[domain]}`
  }

  function setCurrentCall(domain: string) {
    calls.forEach((c) => c.classList.toggle('is-current', c.dataset.call === CALL_OF[domain]))
  }

  function pulseStation(domain: string) {
    const dot = stations.find((s) => s.dataset.domain === domain)?.querySelector('.pipeline__dot')
    if (!dot) return
    dot.classList.add('is-pulsing')
    window.setTimeout(() => dot.classList.remove('is-pulsing'), 400)
  }

  // Cross-hover: station <-> list item
  function setActive(domain: string | null, on: boolean) {
    career?.querySelectorAll('.career__domains .career__domain').forEach((li) => {
      li.classList.toggle('is-active', on && (li as HTMLElement).dataset.domain === domain)
    })
    stations.forEach((s) => {
      const isThis = s.dataset.domain === domain
      s.classList.toggle('is-active', on && isThis)
      s.classList.toggle('is-dimmed', on && !isThis)
    })
  }

  function bindHover() {
    const onEnter = (e: Event) => setActive((e.currentTarget as HTMLElement).dataset.domain ?? null, true)
    const onLeave = () => setActive(null, false)
    stations.forEach((s) => {
      s.setAttribute('tabindex', '0')
      s.addEventListener('mouseenter', onEnter)
      s.addEventListener('mouseleave', onLeave)
      s.addEventListener('focus', onEnter)
      s.addEventListener('blur', onLeave)
    })
    career?.querySelectorAll('.career__domains .career__domain').forEach((li) => {
      li.addEventListener('mouseenter', onEnter)
      li.addEventListener('mouseleave', onLeave)
    })
  }

  // --- Loop ---
  let running = false
  let rafId = 0
  let phase: 'pause' | 'move' | 'teleport' = 'pause'
  let phaseStart = 0
  let stationIndex = 0
  let from = 0
  let to = 0
  let iteration = 1482391

  function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  function arrive(i: number) {
    const domain = DOMAIN_ORDER[i]
    pulseStation(domain)
    setCurrentCall(domain)
    if (i === DOMAIN_ORDER.length - 1 && Math.random() < 0.05) {
      setLog(domain, true)
      window.setTimeout(() => setLog(domain), 800)
    } else {
      setLog(domain)
    }
  }

  function teleport() {
    packet.classList.add('is-fading')
    window.setTimeout(() => {
      positionPacket(stationLengths[0])
      packet.classList.remove('is-fading')
      stationIndex = 0
      iteration++
      counter.textContent = `iteration: ${iteration}`
      arrive(0)
      phase = 'pause'
      phaseStart = performance.now()
    }, FADE_MS)
  }

  function tick(now: number) {
    if (!running) return
    const dt = now - phaseStart
    if (phase === 'pause') {
      if (dt >= PAUSE_MS) {
        if (stationIndex === DOMAIN_ORDER.length - 1) {
          phase = 'teleport'
          teleport()
        } else {
          from = stationLengths[stationIndex]
          to = stationLengths[stationIndex + 1]
          phase = 'move'
          phaseStart = now
        }
      }
    } else if (phase === 'move') {
      const t = Math.min(dt / MOVE_MS, 1)
      positionPacket(from + (to - from) * easeInOut(t))
      if (t >= 1) {
        stationIndex++
        arrive(stationIndex)
        phase = 'pause'
        phaseStart = now
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (running) return
    running = true
    root.classList.add('is-live')
    phase = 'pause'
    phaseStart = performance.now()
    stationIndex = 0
    positionPacket(stationLengths[0])
    arrive(0)
    rafId = requestAnimationFrame(tick)
  }

  function pause() {
    running = false
    root.classList.remove('is-live')
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
  }

  build()
  bindHover()
  counter.textContent = `iteration: ${iteration}`

  // Static resting frame.
  positionPacket(stationLengths[0])
  setCurrentCall(DOMAIN_ORDER[0])
  setLog(DOMAIN_ORDER[0])

  let io: IntersectionObserver | null = null
  if (reduced) {
    root.classList.add('is-static')
  } else {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start()
          else pause()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(root)
  }

  let resizeTimer = 0
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      const wasRunning = running
      pause()
      build()
      positionPacket(stationLengths[stationIndex])
      if (wasRunning && !reduced) start()
    }, 150)
  }
  window.addEventListener('resize', onResize)

  return () => {
    pause()
    window.removeEventListener('resize', onResize)
    window.clearTimeout(resizeTimer)
    io?.disconnect()
  }
}

export default function Pipeline() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    return initPipeline(root)
  }, [])

  return (
    <div className="pipeline" data-pipeline ref={rootRef}>
      <div className="pipeline__code" aria-hidden="true">
        <span className="pipeline__code-line pipeline__code-line--while">while live == True:</span>
        <span className="pipeline__code-line">
          {CALLS.map((call, i) => (
            <span key={call}>
              {i > 0 && <span className="pipeline__sep"> → </span>}
              <span className="pipeline__call" data-call={call}>
                {call}()
              </span>
            </span>
          ))}
        </span>
      </div>

      <div className="pipeline__counter" aria-hidden="true">
        iteration: 1482391
      </div>

      <div className="pipeline__track">
        <svg
          className="pipeline__svg"
          viewBox="0 0 720 220"
          role="img"
          aria-label="A pipeline of five disciplines processing a data packet in an endless loop"
        >
          <path className="pipeline__rail" d={HORIZONTAL_PATH} />
          {DOMAIN_ORDER.map((domain) => (
            <g className="pipeline__station" data-domain={domain} key={domain}>
              <circle className="pipeline__hit" r="24" fill="none" />
              <circle className="pipeline__dot" r="6" />
              <text className="pipeline__label" textAnchor="middle" />
            </g>
          ))}
          <circle className="pipeline__packet" r="4" cx="30" cy="110" />
        </svg>
      </div>

      <div className="pipeline__log" aria-live="off" />
    </div>
  )
}
