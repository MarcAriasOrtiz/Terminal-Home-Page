// Deterministic initial layout for the Personal AI Lab graph, using ELK's
// layered algorithm with partitioning to group systems into functional clusters.
import ELK from 'elkjs/lib/elk.bundled.js'
import { CONNECTIONS, SYSTEMS, type Category } from './systems'

const NODE_HEIGHT = 68

function estimateWidth(name: string): number {
  return Math.min(Math.max(140, name.length * 8 + 76), 232)
}

const CLUSTER_ORDER: Category[] = ['access', 'ai', 'data', 'infra', 'home', 'other']

export interface ClusterBox {
  category: Category
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutResult {
  positions: Record<string, { x: number; y: number }>
  clusters: ClusterBox[]
}

export interface NodeDimensions {
  width: number
  height: number
}

const elk = new ELK()

async function elkLayout(dimensions?: Record<string, NodeDimensions>): Promise<LayoutResult> {
  const size = (id: string, name: string) =>
    dimensions?.[id] ?? { width: estimateWidth(name), height: NODE_HEIGHT }

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '70',
      'elk.spacing.edgeNode': '28',
      'elk.spacing.componentComponent': '100',
      'elk.layered.spacing.nodeNodeBetweenLayers': '130',
      'elk.padding': '[top=40,left=40,bottom=40,right=40]',
      'elk.partitioning.activate': 'true',
    },
    children: CLUSTER_ORDER.map((category) => ({
      id: category,
      layoutOptions: {
        'elk.padding': '[top=56,left=40,bottom=40,right=40]',
      },
      children: SYSTEMS.filter((s) => s.category === category).map((s) => ({
        id: s.id,
        ...size(s.id, s.name),
      })),
    })),
    edges: CONNECTIONS.map((c) => ({ id: c.id, sources: [c.source], targets: [c.target] })),
  }

  const result = await elk.layout(graph)

  const positions: Record<string, { x: number; y: number }> = {}
  const clusters: ClusterBox[] = []
  for (const cluster of result.children ?? []) {
    const category = cluster.id as Category
    const cx = cluster.x ?? 0
    const cy = cluster.y ?? 0
    clusters.push({ category, x: cx, y: cy, width: cluster.width ?? 0, height: cluster.height ?? 0 })
    for (const node of cluster.children ?? []) {
      positions[node.id] = { x: cx + (node.x ?? 0), y: cy + (node.y ?? 0) }
    }
  }
  return { positions, clusters }
}

// Simple fallback in case ELK fails to load: a 3x2 cluster grid.
function fallbackLayout(): LayoutResult {
  const positions: Record<string, { x: number; y: number }> = {}
  const clusters: ClusterBox[] = []
  const place: Record<Category, [number, number]> = {
    access: [0, 0],
    ai: [1, 0],
    data: [2, 0],
    infra: [0, 1],
    home: [1, 1],
    other: [2, 1],
  }
  const colW = 360
  const rowH = 320
  for (const category of CLUSTER_ORDER) {
    const members = SYSTEMS.filter((s) => s.category === category)
    const [gx, gy] = place[category]
    const baseX = gx * colW
    const baseY = gy * rowH
    members.forEach((s, i) => {
      positions[s.id] = { x: baseX + 40, y: baseY + 40 + i * (NODE_HEIGHT + 24) }
    })
    clusters.push({
      category,
      x: baseX,
      y: baseY,
      width: colW,
      height: members.length * (NODE_HEIGHT + 24) + 60,
    })
  }
  return { positions, clusters }
}

export async function computeLayout(dimensions?: Record<string, NodeDimensions>): Promise<LayoutResult> {
  try {
    return await elkLayout(dimensions)
  } catch {
    return fallbackLayout()
  }
}
