import { useState } from 'react'
import { DISCIPLINE_DETAILS, PROJECTS } from '../../career/data'

interface ConstellationProps {
  onOpen?: (path: string) => void
}

interface SchematicNode {
  id: string
  code: string
  label: string
  stage: string
  x: number
  y: number
}

const NODES: SchematicNode[] = [
  { id: 'data', code: '01', label: 'Data', stage: 'ingest', x: 96, y: 92 },
  { id: 'ai', code: '02', label: 'AI & Models', stage: 'adapt', x: 263, y: 92 },
  { id: 'software', code: '03', label: 'Software', stage: 'expose', x: 430, y: 92 },
  { id: 'automation', code: '04', label: 'Automation', stage: 'orchestrate', x: 597, y: 92 },
  { id: 'infra', code: '05', label: 'Infrastructure', stage: 'deploy', x: 764, y: 92 },
]

export default function Constellation({ onOpen }: ConstellationProps) {
  const [selectedId, setSelectedId] = useState<string>('ai')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeId = hoveredId ?? selectedId
  const activeIdx = NODES.findIndex((n) => n.id === activeId)
  const detail = DISCIPLINE_DETAILS.find((d) => d.id === activeId) ?? DISCIPLINE_DETAILS[1]
  const matchingProjects = PROJECTS.filter((p) => p.disciplines.includes(activeId))

  return (
    <div className="schematic" role="region" aria-label="Interactive engineering architecture schematic">
      <div className="schematic__canvas">
        <div className="schematic__bar">
          <span className="schematic__bar-title">arch.bus // end-to-end system loop</span>
          <span className="schematic__bar-hint">Select a layer to inspect how it connects</span>
        </div>

        <svg
          className="schematic__svg"
          viewBox="0 0 860 210"
          role="img"
          aria-label="Schematic diagram of five connected engineering layers: Data, AI and Models, Software, Automation, and Infrastructure"
        >
          <defs>
            <pattern id="schematic-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="var(--c-border)"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>

          <rect width="860" height="210" fill="url(#schematic-grid)" opacity="0.55" />

          {/* Return feedback bus: Infrastructure / Automation back to Data */}
          <path
            className="schematic__feedback"
            d="M 764 126 L 764 172 Q 764 184 752 184 L 108 184 Q 96 184 96 172 L 96 126"
            fill="none"
            stroke={activeId === 'infra' || activeId === 'automation' || activeId === 'data' ? 'var(--c-cyan)' : 'var(--c-border-accent)'}
            strokeWidth="1.25"
            strokeDasharray="4 5"
          />
          <text className="schematic__feedback-label" x="430" y="177" textAnchor="middle">
            telemetry, evaluation &amp; weekly retraining loop
          </text>

          {/* Forward bus segments between the 5 stations */}
          {NODES.slice(0, -1).map((node, i) => {
            const next = NODES[i + 1]
            const x1 = node.x + 62
            const x2 = next.x - 62
            const isConnected = activeIdx === i || activeIdx === i + 1
            return (
              <g key={`${node.id}-${next.id}`}>
                <line
                  x1={x1}
                  y1={node.y}
                  x2={x2}
                  y2={next.y}
                  stroke={isConnected ? 'var(--c-green)' : 'var(--c-border-accent)'}
                  strokeWidth={isConnected ? '2' : '1.2'}
                />
                <polygon
                  points={`${x2},${next.y} ${x2 - 6},${next.y - 3.5} ${x2 - 6},${next.y + 3.5}`}
                  fill={isConnected ? 'var(--c-green)' : 'var(--c-cyan)'}
                />
              </g>
            )
          })}

          {/* 5 Interactive Station Nodes */}
          {NODES.map((node, i) => {
            const isActive = node.id === activeId
            const isNeighbor = Math.abs(i - activeIdx) === 1
            return (
              <g
                key={node.id}
                className={`schematic__node${isActive ? ' is-active' : ''}${isNeighbor ? ' is-neighbor' : ''}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedId(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <rect
                  className="schematic__node-box"
                  x="-62"
                  y="-34"
                  width="124"
                  height="68"
                  rx="6"
                />
                <line
                  x1="-62"
                  y1="-14"
                  x2="62"
                  y2="-14"
                  stroke={isActive ? 'var(--c-green)' : 'var(--c-border)'}
                  strokeWidth="1"
                />
                <text className="schematic__node-code" x="-50" y="-21">
                  {node.code}
                </text>
                <circle
                  cx="48"
                  cy="-24"
                  r="3"
                  fill={isActive ? 'var(--c-green)' : 'var(--c-cyan)'}
                />
                <text className="schematic__node-label" x="0" y="6" textAnchor="middle">
                  {node.label}
                </text>
                <text className="schematic__node-stage" x="0" y="23" textAnchor="middle">
                  {node.stage}()
                </text>
              </g>
            )
          })}
        </svg>

        <div className="schematic__tabs" role="tablist" aria-label="Engineering layers">
          {DISCIPLINE_DETAILS.map((d) => {
            const isSelected = d.id === activeId
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`schematic__tab${isSelected ? ' is-active' : ''}`}
                onClick={() => setSelectedId(d.id)}
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span className="schematic__tab-code">{d.code}</span>
                <span className="schematic__tab-name">{d.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="schematic__inspector" aria-live="polite">
        <div className="schematic__inspector-main">
          <div className="schematic__inspector-head">
            <h3 className="schematic__inspector-title">
              {detail.code} / {detail.label}
            </h3>
            <code className="schematic__inspector-fn">{detail.stage}()</code>
          </div>
          <p className="schematic__inspector-desc">{detail.roleInSystem}</p>
          <div className="schematic__handoff">
            <span className="schematic__handoff-key">System handoff:</span>{' '}
            <span className="schematic__handoff-val">{detail.handoff}</span>
          </div>
          <ul className="schematic__examples" aria-label="Typical work in this layer">
            {detail.examples.map((ex) => (
              <li key={ex} className="schematic__example">
                {ex}
              </li>
            ))}
          </ul>
        </div>

        <div className="schematic__inspector-projects">
          <h4 className="schematic__projects-heading">
            Case studies using {detail.label} ({matchingProjects.length})
          </h4>
          <ul className="schematic__project-list">
            {matchingProjects.map((project) => (
              <li key={project.id}>
                {onOpen ? (
                  <button
                    type="button"
                    className="schematic__project-btn"
                    onClick={() => onOpen(project.target)}
                  >
                    <span className="schematic__project-name">{project.title}</span>
                    <span className="schematic__project-open">Open case study</span>
                  </button>
                ) : (
                  <span className="schematic__project-name">{project.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
