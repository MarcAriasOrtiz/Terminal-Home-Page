import { memo } from 'react'
import { type Node, type NodeProps } from '@xyflow/react'
import { CATEGORY_COLORS } from '../../lab/graph'
import type { Category } from '../../lab/systems'

export type ClusterNodeData = {
  label: string
  category: Category
  width: number
  height: number
}

function ClusterNode({ data }: NodeProps<Node<ClusterNodeData>>) {
  const { label, category, width, height } = data
  return (
    <div className="rf-cluster" style={{ width, height }}>
      <span className="rf-cluster__title" style={{ color: CATEGORY_COLORS[category] }}>
        {label}
      </span>
    </div>
  )
}

export default memo(ClusterNode)
