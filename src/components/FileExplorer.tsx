import { useEffect, useState } from 'react'
import { HOME, ROOT, dirname, type VNode } from '../terminal/filesystem'

interface FileExplorerProps {
  cwd: string
  open: boolean
  onSelect: (path: string) => void
  onClose: () => void
}

interface TreeNodeProps {
  node: VNode
  path: string
  depth: number
  cwd: string
  expanded: Set<string>
  onToggle: (path: string) => void
  onSelect: (path: string) => void
}

function TreeNode({ node, path, depth, cwd, expanded, onToggle, onSelect }: TreeNodeProps) {
  const isDirNode = node.type === 'dir'
  const isOpen = expanded.has(path)
  const isCurrent = cwd === path

  return (
    <div role="treeitem" aria-expanded={isDirNode ? isOpen : undefined}>
      <button
        type="button"
        className={`node${isCurrent ? ' node--current' : ''}`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => {
          if (isDirNode) onToggle(path)
          onSelect(path)
        }}
      >
        {isDirNode ? (
          <span className="node__chevron" aria-hidden="true">
            {isOpen ? '▾' : '▸'}
          </span>
        ) : (
          <span className="node__spacer" aria-hidden="true" />
        )}
        <span className={`node__name node__name--${node.type}`}>
          {node.label ?? node.name}
          {isDirNode ? '/' : ''}
        </span>
      </button>

      {node.type === 'dir' &&
        isOpen &&
        node.children.map((child) => (
          <TreeNode
            key={child.name}
            node={child}
            path={`${path}/${child.name}`}
            depth={depth + 1}
            cwd={cwd}
            expanded={expanded}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}

export default function FileExplorer({ cwd, open, onSelect, onClose }: FileExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([HOME]))

  // Keep the current directory's ancestors expanded so navigation stays visible.
  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev)
      let path = cwd
      while (path && path !== HOME) {
        next.add(path)
        path = dirname(path)
      }
      next.add(HOME)
      return next
    })
  }, [cwd])

  function toggle(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  return (
    <>
      <div
        className={`explorer__backdrop${open ? ' explorer__backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`explorer${open ? ' explorer--open' : ''}`}
        aria-label="File explorer"
        aria-hidden={!open}
      >
        <header className="explorer__header">
          <span className="explorer__title">explorer</span>
          <button
            type="button"
            className="explorer__close"
            aria-label="Close explorer"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="explorer__tree" role="tree" aria-label="Files">
          <TreeNode
            node={ROOT}
            path={HOME}
            depth={0}
            cwd={cwd}
            expanded={expanded}
            onToggle={toggle}
            onSelect={onSelect}
          />
        </div>
      </aside>
    </>
  )
}
