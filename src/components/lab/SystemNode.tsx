import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { CATEGORY_COLORS, ICON_PATHS } from '../../lab/graph'
import { CATEGORY_LABELS, type System } from '../../lab/systems'

export type SystemNodeData = { system: System; icon: string }

const DEFAULT_PATH = 'M3 3h10v10H3V3z'

function SystemNode({ data, selected }: NodeProps<Node<SystemNodeData>>) {
  const { system } = data
  const color = CATEGORY_COLORS[system.category]
  const svgPath = ICON_PATHS[system.id] ?? DEFAULT_PATH
  return (
    <div className={`rf-system rf-system--${system.status}${selected ? ' rf-system--selected' : ''}`}>
      <span className="rf-system__accent" style={{ background: color }} aria-hidden="true" />
      <Handle type="target" position={Position.Left} id="t-l" className="rf-handle" />
      <Handle type="target" position={Position.Top} id="t-t" className="rf-handle" />
      <Handle type="target" position={Position.Bottom} id="t-b" className="rf-handle" />
      <div className="rf-system__row">
        <span className="rf-system__icon" style={{ color }} aria-hidden="true">
          <svg
            className="rf-system__svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={svgPath} />
          </svg>
        </span>
        <span className="rf-system__name">{system.name}</span>
      </div>
      <div className="rf-system__row rf-system__row--meta">
        <span className="rf-system__category" style={{ color }}>
          {system.subtitle ?? CATEGORY_LABELS[system.category]}
        </span>
        <span className="rf-system__dot" aria-hidden="true" />
      </div>
      <Handle type="source" position={Position.Right} id="s-r" className="rf-handle" />
      <Handle type="source" position={Position.Top} id="s-t" className="rf-handle" />
      <Handle type="source" position={Position.Bottom} id="s-b" className="rf-handle" />
    </div>
  )
}

export default memo(SystemNode)
