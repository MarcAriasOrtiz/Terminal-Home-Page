import { Fragment, useMemo } from 'react'
import type { ReactNode } from 'react'
import { parseMarkdown, type BlockNode, type InlineNode } from '../terminal/markdown'

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

/** Renders inline Markdown nodes. Exported for reuse by the profile renderer. */
export function Inline({ nodes }: { nodes: InlineNode[] }): ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return <Fragment key={i}>{node.value}</Fragment>
      case 'code':
        return (
          <code className="md-code" key={i}>
            {node.value}
          </code>
        )
      case 'strong':
        return (
          <strong className="md-strong" key={i}>
            <Inline nodes={node.children} />
          </strong>
        )
      case 'em':
        return (
          <em className="md-em" key={i}>
            <Inline nodes={node.children} />
          </em>
        )
      case 'mark':
        return (
          <mark className="md-mark" key={i}>
            <Inline nodes={node.children} />
          </mark>
        )
      case 'link':
        return (
          <a className="md-link" href={node.href} target="_blank" rel="noopener noreferrer" key={i}>
            <Inline nodes={node.children} />
          </a>
        )
    }
  })
}

function Block({ block }: { block: BlockNode }) {
  switch (block.type) {
    case 'heading': {
      const level = Math.min(Math.max(block.level, 1), 6)
      const Tag = HEADING_TAGS[level - 1]
      return (
        <Tag className={`md-heading md-heading--${level}`}>
          <Inline nodes={block.children} />
        </Tag>
      )
    }
    case 'paragraph':
      return (
        <p className="md-p">
          <Inline nodes={block.children} />
        </p>
      )
    case 'list':
      return (
        <ul className="md-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline nodes={item} />
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="md-quote">
          <Inline nodes={block.children} />
        </blockquote>
      )
    case 'code':
      return (
        <pre className="md-pre">
          <code>{block.value}</code>
        </pre>
      )
    case 'hr':
      return <hr className="md-hr" />
    case 'directive':
      return (
        <div className={`md-directive md-directive--${block.name}`}>
          {block.blocks.map((child, i) => (
            <Block key={i} block={child} />
          ))}
        </div>
      )
  }
}

/** Generic styled Markdown view for ordinary documents. */
export default function MarkdownView({ content }: { content: string }) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  return (
    <div className="md">
      {parsed.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
