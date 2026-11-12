import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'
import { parseMarkdown } from '../terminal/markdown'
import { Inline } from './MarkdownView'
import {
  CATEGORY_LABELS,
  CONNECTION_STATUS_LABELS,
  CONNECTION_TYPE_LABELS,
  CONNECTION_TYPE_ORDER,
  CONNECTIONS,
  DIRECTION_LABELS,
  SYSTEMS,
  type Category,
  type Connection,
  type System,
  type SystemStatus,
} from '../lab/systems'
import { assignHandles, ICONS, markersFor } from '../lab/graph'
import { computeLayout, type NodeDimensions } from '../lab/layout'
import SystemNode, { type SystemNodeData } from './lab/SystemNode'
import ClusterNode, { type ClusterNodeData } from './lab/ClusterNode'
import ConnectionEdge, { type ConnectionEdgeData } from './lab/ConnectionEdge'

const STATUS_LABELS: Record<SystemStatus, string> = {
  operational: 'operational',
  'in-development': 'in development',
}

const CATEGORIES: Category[] = ['ai', 'data', 'access', 'infra', 'home', 'other']

const nodeTypes = { system: SystemNode, cluster: ClusterNode }
const edgeTypes = { connection: ConnectionEdge }

type LabNode = Node<SystemNodeData> | Node<ClusterNodeData>
type LabEdge = Edge<ConnectionEdgeData>

function systemById(id: string): System | undefined {
  return SYSTEMS.find((s) => s.id === id)
}

function connectionById(id: string): Connection | undefined {
  return CONNECTIONS.find((c) => c.id === id)
}

function SystemPanel({ system, onSelectConnection }: { system: System; onSelectConnection: (id: string) => void }) {
  const connections = CONNECTIONS.filter((c) => c.source === system.id || c.target === system.id)
  return (
    <div className="lab-panel">
      <header className="lab-panel__header">
        <div className="lab-panel__title-group">
          <h2 className="lab-panel__name">{system.name}</h2>
          <p className="lab-panel__category">{CATEGORY_LABELS[system.category]}</p>
        </div>
        <span className={`lab-status lab-status--${system.status}`}>{STATUS_LABELS[system.status]}</span>
      </header>

      <p className="lab-panel__summary">{system.summary}</p>

      {system.technologies.length > 0 && (
        <section className="lab-panel__section" aria-label="Stack">
          <h3 className="lab-panel__label">Stack</h3>
          <div className="lab-panel__chips">
            {system.technologies.map((tech) => (
              <span className="lab-panel__chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {connections.length > 0 && (
        <section className="lab-panel__section" aria-label="Verified connections">
          <h3 className="lab-panel__label">Connections ({connections.length})</h3>
          <ul className="lab-panel__rels">
            {connections.map((conn) => {
              const out = conn.source === system.id
              const otherId = out ? conn.target : conn.source
              const other = systemById(otherId)
              return (
                <li key={conn.id}>
                  <button
                    type="button"
                    className={`lab-panel__rel lab-panel__rel--${conn.type}`}
                    onClick={() => onSelectConnection(conn.id)}
                  >
                    <span className="lab-panel__rel-dir" aria-hidden="true">
                      {out ? 'out' : 'in'}
                    </span>
                    <span className="lab-panel__rel-name">{other?.name ?? otherId}</span>
                    <span className="lab-panel__rel-kind">
                      {CONNECTION_TYPE_LABELS[conn.type]}: {conn.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {system.notes && system.notes.length > 0 && (
        <section className="lab-panel__section" aria-label="Notes">
          <h3 className="lab-panel__label">Notes</h3>
          <ul className="lab-panel__notes">
            {system.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function ConnectionPanel({ connection, onBack }: { connection: Connection; onBack: () => void }) {
  const source = systemById(connection.source)
  const target = systemById(connection.target)
  return (
    <div className="lab-panel lab-panel--connection">
      <header className="lab-panel__header">
        <div className="lab-panel__title-group">
          <h2 className="lab-panel__name lab-panel__name--conn">
            {source?.name ?? connection.source}
            <span className="lab-panel__conn-arrow" aria-hidden="true">
              {connection.direction === 'bidirectional' ? ' ⇄ ' : ' → '}
            </span>
            {target?.name ?? connection.target}
          </h2>
          <p className="lab-panel__category">Verified relationship</p>
        </div>
        <span className={`lab-conn-type lab-conn-type--${connection.type}`}>
          {CONNECTION_TYPE_LABELS[connection.type]}
        </span>
      </header>

      <dl className="lab-panel__conn-meta">
        <div>
          <dt>Status</dt>
          <dd>{CONNECTION_STATUS_LABELS[connection.status]}</dd>
        </div>
        <div>
          <dt>Direction</dt>
          <dd>{DIRECTION_LABELS[connection.direction]}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{connection.label}</dd>
        </div>
      </dl>

      <p className="lab-panel__summary">{connection.description}</p>

      {connection.evidence && (
        <section className="lab-panel__section" aria-label="Source evidence">
          <h3 className="lab-panel__label">Confirmed by</h3>
          <p className="lab-panel__evidence">{connection.evidence}</p>
        </section>
      )}

      <button type="button" className="lab-panel__clear" onClick={onBack}>
        Return to system
      </button>
    </div>
  )
}

// Runs the ELK layout once React Flow has measured the nodes. It lives inside
// <ReactFlowProvider> so it can use useNodesInitialized.
function LabLayoutController({
  nodes,
  setNodes,
  setEdges,
  rfRef,
}: {
  nodes: LabNode[]
  setNodes: Dispatch<SetStateAction<LabNode[]>>
  setEdges: Dispatch<SetStateAction<LabEdge[]>>
  rfRef: MutableRefObject<ReactFlowInstance<LabNode, LabEdge> | null>
}) {
  const nodesInitialized = useNodesInitialized()
  const laidOutRef = useRef(false)

  useEffect(() => {
    if (!nodesInitialized || laidOutRef.current) return
    laidOutRef.current = true
    const dimensions: Record<string, NodeDimensions> = {}
    for (const n of nodes) {
      if (n.type === 'system' && n.measured?.width && n.measured?.height) {
        dimensions[n.id] = { width: n.measured.width, height: n.measured.height }
      }
    }
    computeLayout(dimensions).then((result) => {
      setNodes((ns) => {
        const clusterNodes: LabNode[] = result.clusters.map((c) => ({
          id: `cluster-${c.category}`,
          type: 'cluster',
          position: { x: c.x, y: c.y },
          data: { label: CATEGORY_LABELS[c.category], category: c.category, width: c.width, height: c.height },
          draggable: false,
          selectable: false,
          connectable: false,
          zIndex: -1,
        }))
        const systemNodes = ns
          .filter((n) => n.type === 'system')
          .map((n) => ({ ...n, position: result.positions[n.id] ?? n.position }))
        return [...clusterNodes, ...systemNodes]
      })
      setEdges((es) =>
        es.map((e) => {
          const handles = assignHandles(result.positions, e.source, e.target)
          return { ...e, sourceHandle: handles.sourceHandle, targetHandle: handles.targetHandle }
        }),
      )
      requestAnimationFrame(() => rfRef.current?.fitView({ padding: 0.25, maxZoom: 1 }))
    })
  }, [nodesInitialized, nodes, setNodes, setEdges, rfRef])

  return null
}

export default function LabView({ content }: { content: string }) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  const fm = parsed.frontmatter
  const intro = parsed.blocks[0] && parsed.blocks[0].type === 'paragraph' ? parsed.blocks[0] : null

  const [nodes, setNodes, onNodesChange] = useNodesState<LabNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<LabEdge>([])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  const rfRef = useRef<ReactFlowInstance<LabNode, LabEdge> | null>(null)

  const selectedConn = selectedConnId ? connectionById(selectedConnId) : null
  const selectedNode = selectedNodeId ? systemById(selectedNodeId) : null

  const operationalCount = useMemo(() => SYSTEMS.filter((s) => s.status === 'operational').length, [])
  const inDevCount = useMemo(() => SYSTEMS.filter((s) => s.status === 'in-development').length, [])

  // Focus set for edge emphasis when a node, connection, or cluster filter is active.
  const focusConnIds = useMemo(() => {
    const set = new Set<string>()
    if (selectedConn) {
      set.add(selectedConn.id)
    } else if (selectedNode) {
      for (const c of CONNECTIONS) {
        if (c.source === selectedNode.id || c.target === selectedNode.id) set.add(c.id)
      }
    } else if (activeCategory) {
      const catIds = new Set(SYSTEMS.filter((s) => s.category === activeCategory).map((s) => s.id))
      for (const c of CONNECTIONS) {
        if (catIds.has(c.source) || catIds.has(c.target)) set.add(c.id)
      }
    }
    return set
  }, [selectedConn, selectedNode, activeCategory])

  const hasFocus = focusConnIds.size > 0

  // Build the graph with placeholder positions so React Flow can measure nodes.
  useEffect(() => {
    setNodes(
      SYSTEMS.map((s, i) => ({
        id: s.id,
        type: 'system',
        position: { x: (i % 5) * 220, y: Math.floor(i / 5) * 100 },
        data: { system: s, icon: ICONS[s.id] ?? '' },
      })),
    )
    setEdges(
      CONNECTIONS.map((c) => ({
        id: c.id,
        source: c.source,
        target: c.target,
        type: 'connection',
        data: { connection: c },
        ...markersFor(c),
      })),
    )
    setSelectedNodeId('skippy')
    setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === 'skippy' })))
  }, [setNodes, setEdges])

  const selectNode = useCallback(
    (id: string) => {
      setSelectedNodeId(id)
      setSelectedConnId(null)
      setActiveCategory(null)
      setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === id })))
      setEdges((es) => es.map((e) => ({ ...e, selected: false })))
    },
    [setNodes, setEdges],
  )

  const selectConnection = useCallback(
    (id: string) => {
      const conn = connectionById(id)
      setSelectedConnId(id)
      setSelectedNodeId(conn?.source ?? null)
      setActiveCategory(null)
      setEdges((es) => es.map((e) => ({ ...e, selected: e.id === id })))
      setNodes((ns) => ns.map((n) => ({ ...n, selected: false })))
    },
    [setNodes, setEdges],
  )

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedConnId(null)
    setNodes((ns) => ns.map((n) => ({ ...n, selected: false })))
    setEdges((es) => es.map((e) => ({ ...e, selected: false })))
  }, [setNodes, setEdges])

  const toggleCategory = useCallback(
    (cat: Category) => {
      setSelectedConnId(null)
      setSelectedNodeId(null)
      setNodes((ns) => ns.map((n) => ({ ...n, selected: false })))
      setEdges((es) => es.map((e) => ({ ...e, selected: false })))
      setActiveCategory((prev) => (prev === cat ? null : cat))
    },
    [setNodes, setEdges],
  )

  const onSelectionChange = useCallback(
    ({ nodes: ns, edges: es }: { nodes: LabNode[]; edges: LabEdge[] }) => {
      const selNode = ns.find((n) => n.selected && n.type === 'system')
      const selEdge = es.find((e) => e.selected)
      if (selEdge) {
        setSelectedConnId(selEdge.id)
        setSelectedNodeId(connectionById(selEdge.id)?.source ?? null)
      } else if (selNode) {
        setSelectedConnId(null)
        setSelectedNodeId(selNode.id)
      } else {
        setSelectedNodeId(null)
        setSelectedConnId(null)
      }
    },
    [],
  )

  const backToSystem = useCallback(() => {
    setSelectedConnId(null)
    setEdges((es) => es.map((e) => ({ ...e, selected: false })))
    setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === selectedNodeId })))
  }, [setNodes, setEdges, selectedNodeId])

  // Edges get an emphasis class based on the current selection.
  const displayEdges = useMemo(() => {
    return edges.map((e) => {
      const active = focusConnIds.has(e.id)
      const dimmed = hasFocus && !active
      return {
        ...e,
        className: `lab-edge${active ? ' lab-edge--active' : ''}${dimmed ? ' lab-edge--dimmed' : ''}`,
      }
    })
  }, [edges, focusConnIds, hasFocus])

  function handleResetLayout() {
    const dimensions: Record<string, NodeDimensions> = {}
    for (const n of nodes) {
      if (n.type === 'system' && n.measured?.width && n.measured?.height) {
        dimensions[n.id] = { width: n.measured.width, height: n.measured.height }
      }
    }
    computeLayout(dimensions).then((result) => {
      setNodes((ns) =>
        ns.map((n) => {
          if (n.type === 'system') return { ...n, position: result.positions[n.id] ?? n.position }
          if (n.type === 'cluster') {
            const cluster = result.clusters.find((c) => `cluster-${c.category}` === n.id)
            if (cluster) return { ...n, position: { x: cluster.x, y: cluster.y } }
          }
          return n
        }),
      )
      setEdges((es) =>
        es.map((e) => {
          const handles = assignHandles(result.positions, e.source, e.target)
          return { ...e, sourceHandle: handles.sourceHandle, targetHandle: handles.targetHandle }
        }),
      )
      requestAnimationFrame(() => rfRef.current?.fitView({ padding: 0.25, maxZoom: 1 }))
    })
  }

  return (
    <article className="lab">
      <header className="lab__header">
        <div className="lab__header-main">
          <h1 className="lab__title">{fm.title ?? 'Personal AI Lab'}</h1>
          {fm.tagline && <p className="lab__tagline">{fm.tagline}</p>}
          {intro && (
            <p className="lab__intro">
              <Inline nodes={intro.children} />
            </p>
          )}
        </div>

        <dl className="lab__stats" aria-label="Lab topology counts">
          <div className="lab__stat">
            <dt>Active nodes</dt>
            <dd>{operationalCount}</dd>
          </div>
          <div className="lab__stat">
            <dt>In build</dt>
            <dd>{inDevCount}</dd>
          </div>
          <div className="lab__stat">
            <dt>Clusters</dt>
            <dd>{CATEGORIES.length}</dd>
          </div>
          <div className="lab__stat">
            <dt>Links</dt>
            <dd>{CONNECTIONS.length}</dd>
          </div>
        </dl>
      </header>

      <div className="lab__toolbar">
        <div className="lab__filters" role="group" aria-label="Highlight cluster">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`lab__filter${activeCategory === cat ? ' is-active' : ''}`}
              aria-pressed={activeCategory === cat}
              onClick={() => toggleCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="lab__actions">
          <button type="button" className="lab-action" onClick={() => rfRef.current?.fitView({ padding: 0.2, maxZoom: 1 })}>
            Fit view
          </button>
          <button type="button" className="lab-action" onClick={handleResetLayout}>
            Reset layout
          </button>
        </div>
      </div>

      <div className="lab__legend" aria-label="Connection types">
        {CONNECTION_TYPE_ORDER.map((type) => (
          <span className="lab__legend-item" key={type}>
            <span className={`lab__swatch lab__swatch--${type}`} aria-hidden="true" />
            {CONNECTION_TYPE_LABELS[type]}
          </span>
        ))}
      </div>

      <div className="lab__explorer">
        <div className="lab__graph">
          <ReactFlowProvider>
            <LabLayoutController nodes={nodes} setNodes={setNodes} setEdges={setEdges} rfRef={rfRef} />
            <ReactFlow<LabNode, LabEdge>
              nodes={nodes}
              edges={displayEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onInit={(rf) => {
                rfRef.current = rf
              }}
              onSelectionChange={onSelectionChange}
              onNodeClick={(_e, node) => selectNode(node.id)}
              onEdgeClick={(_e, edge) => selectConnection(edge.id)}
              onPaneClick={clearSelection}
              nodesConnectable={false}
              minZoom={0.2}
              maxZoom={2}
              fitView
              fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="rgba(130,147,168,0.18)" />
              <Controls position="bottom-right" showInteractive={false} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        <div className="lab__details">
          {selectedConn ? (
            <ConnectionPanel connection={selectedConn} onBack={backToSystem} />
          ) : selectedNode ? (
            <SystemPanel system={selectedNode} onSelectConnection={selectConnection} />
          ) : (
            <div className="lab-panel lab-panel--empty">
              Select any node or link on the schematic to inspect its stack, role, and verified connections.
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
