// Presentation helpers for the graph: per-system technical SVG icon paths and
// connection-type visual styles. Data (SYSTEMS / CONNECTIONS) lives in systems.ts.
import { MarkerType, type EdgeMarkerType } from '@xyflow/react'
import type { Category, Connection, ConnectionType } from './systems'

/** Subtle accent colors per functional category, used on node accents and section headers. */
export const CATEGORY_COLORS: Record<Category, string> = {
  access: '#fbbf24',
  ai: '#b6ff6c',
  data: '#55e6ff',
  infra: '#7dd3fc',
  home: '#fb923c',
  other: '#8293a8',
}

/**
 * 16x16 stroke-based technical SVG paths for each node (replaces emoji icons).
 */
export const ICON_PATHS: Record<string, string> = {
  skippy: 'M4 3h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 3.5h.01M10 6.5h.01M6 9h4M8 1v2M5 13h6',
  obsidian: 'M8 1.5 13 5v6l-5 3.5L3 11V5l5-3.5zM8 1.5v13M3 5l5 3.5L13 5',
  vaults: 'M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 6v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12V4.5z',
  n8n: 'M3 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4.5 5.5h7M4.2 6.8 7 10.2M11.8 6.8 9 10.2',
  postgres: 'M3 4c0-1.1 2.2-2 5-2s5 .9 5 2v8c0 1.1-2.2 2-5 2s-5-.9-5-2V4zm0 4c0 1.1 2.2 2 5 2s5-.9 5-2M3 4c0 1.1 2.2 2 5 2s5-.9 5-2',
  'project-databases': 'M2.5 3.5h11v3h-11v-3zm0 4.5h11v3h-11V8zm0 4.5h11v1.5h-11v-1.5zM4.5 5h.01M4.5 9.5h.01',
  superset: 'M2.5 13.5h11M4.5 11V7.5M8 11V4.5M11.5 11V2.5',
  pgadmin: 'M3 3h10v10H3V3zm2.5 3.5L7.5 8l-2 1.5M8.5 9.5h2',
  dozzle: 'M3 4h10M3 7h7M3 10h10M3 13h5',
  vaultwarden: 'M8 1.8 13 4v4.2c0 3.1-2.1 5.4-5 6.3-2.9-.9-5-3.2-5-6.3V4l5-2.2zm0 4.7v3',
  pihole: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm-4.2 1.8 8.4 8.4',
  caddy: 'M2.5 5.5h11m-3-2.5 3 2.5-3 2.5M13.5 10.5h-11m3-2.5-3 2.5 3 2.5',
  'cloudflare-dns': 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM2.3 8h11.4M8 2c1.7 1.6 2.6 3.7 2.6 6S9.7 12.4 8 14c-1.7-1.6-2.6-3.7-2.6-6S6.3 3.6 8 2z',
  'cloudflare-tunnel': 'M4.5 11.5h7.5a2.5 2.5 0 0 0 .3-5A3.8 3.8 0 0 0 5 5.2 3 3 0 0 0 4.5 11.5z',
  tailscale: 'M4 4h2v2H4V4zm6 0h2v2h-2V4zM7 7h2v2H7V7zm-3 3h2v2H4v-2zm6 0h2v2h-2v-2zM6 5h4M5 6v4M11 6v4M6 11h4',
  'home-assistant': 'M2.5 7.5 8 2.5l5.5 5v6h-11v-6zm4 6v-4h3v4',
  zigbee: 'M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 0v5M5.2 5.2a4 4 0 0 1 5.6 0M3.2 3.2a6.8 6.8 0 0 1 9.6 0',
  valheim: 'M8 2 13 4.8v6.4L8 14l-5-2.8V4.8L8 2zm0 0v12M3 4.8 8 8l5-3.2',
  'mobile-app': 'M5 2h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2.5 9.5h1',
  homepage: 'M2 3.5h12v9H2v-9zm0 2.5h12M4.5 8.5 6 10l-1.5 1.5M7.5 11.5h2.5',
}

export const ICONS: Record<string, string> = ICON_PATHS

export const EDGE_STYLES: Record<ConnectionType, { stroke: string; dash?: string }> = {
  integration: { stroke: '#b6ff6c' },
  'data-flow': { stroke: '#55e6ff' },
  query: { stroke: '#2dd4bf' },
  persistence: { stroke: '#60a5fa' },
  storage: { stroke: '#a78bfa' },
  network: { stroke: '#fbbf24', dash: '6 4' },
  dns: { stroke: '#7dd3fc' },
  tunnel: { stroke: '#ff4fd8' },
  hosting: { stroke: '#8293a8' },
  hardware: { stroke: '#fb923c' },
  planned: { stroke: '#f472b6', dash: '5 4' },
}

// Arrows reflect direction for flow-type relationships. Shared storage, hosting
// and planned relationships are non-directional and get no arrow.
const ARROW_TYPES: ConnectionType[] = [
  'integration',
  'data-flow',
  'query',
  'persistence',
  'network',
  'dns',
  'tunnel',
  'hardware',
]

export function markersFor(conn: Connection): { markerStart?: EdgeMarkerType; markerEnd?: EdgeMarkerType } {
  if (!ARROW_TYPES.includes(conn.type)) return {}
  const marker: EdgeMarkerType = {
    type: MarkerType.ArrowClosed,
    color: EDGE_STYLES[conn.type].stroke,
    width: 18,
    height: 18,
  }
  const start = conn.direction === 'reverse' || conn.direction === 'bidirectional' ? marker : undefined
  const end = conn.direction === 'forward' || conn.direction === 'bidirectional' ? marker : undefined
  return { markerStart: start, markerEnd: end }
}

// Handle IDs used by SystemNode: left/right plus top/bottom for vertical edges.
const SOURCE_HANDLES = { right: 's-r', top: 's-t', bottom: 's-b' }
const TARGET_HANDLES = { left: 't-l', top: 't-t', bottom: 't-b' }

/**
 * Choose source/target handles so an edge leaves and enters nodes from the most
 * logical sides, based on the relative position of the two nodes. This spreads
 * edges around high-degree nodes instead of converging on one side.
 */
export function assignHandles(
  positions: Record<string, { x: number; y: number }>,
  source: string,
  target: string,
): { sourceHandle?: string; targetHandle?: string } {
  const s = positions[source]
  const t = positions[target]
  if (!s || !t) return {}
  const dx = t.x - s.x
  const dy = t.y - s.y
  if (Math.abs(dy) > Math.abs(dx) * 1.3) {
    if (dy < 0) return { sourceHandle: SOURCE_HANDLES.top, targetHandle: TARGET_HANDLES.bottom }
    return { sourceHandle: SOURCE_HANDLES.bottom, targetHandle: TARGET_HANDLES.top }
  }
  return { sourceHandle: SOURCE_HANDLES.right, targetHandle: TARGET_HANDLES.left }
}
