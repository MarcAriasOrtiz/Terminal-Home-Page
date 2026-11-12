import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, type Edge, type EdgeProps } from '@xyflow/react'
import { EDGE_STYLES } from '../../lab/graph'
import type { Connection } from '../../lab/systems'

export type ConnectionEdgeData = { connection: Connection }

function ConnectionEdge(props: EdgeProps<Edge<ConnectionEdgeData>>) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, markerStart, data } = props
  const connection = data?.connection
  const style = connection ? EDGE_STYLES[connection.type] : undefined
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 14,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        markerStart={markerStart}
        className="lab-edge-path"
        style={{ stroke: style?.stroke, strokeDasharray: style?.dash }}
      />
      {connection && (
        <text
          className={`lab-edge-label lab-edge-label--${connection.type}`}
          x={labelX}
          y={labelY - 10}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {connection.label}
        </text>
      )}
    </>
  )
}

export default memo(ConnectionEdge)
