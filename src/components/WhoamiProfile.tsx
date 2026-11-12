import { useMemo } from 'react'
import { parseMarkdown, type BlockNode, type InlineNode } from '../terminal/markdown'
import { toTilde } from '../terminal/filesystem'
import { Inline } from './MarkdownView'

function inlineText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
        case 'code':
          return node.value
        case 'strong':
        case 'em':
        case 'mark':
        case 'link':
          return inlineText(node.children)
      }
    })
    .join('')
}

function Featured({ blocks }: { blocks: BlockNode[] }) {
  const title = blocks.find((b) => b.type === 'heading')
  const paragraphs = blocks.filter((b) => b.type === 'paragraph')
  const list = blocks.find((b) => b.type === 'list')
  const quote = blocks.find((b) => b.type === 'quote')

  return (
    <section className="profile__featured" aria-label="Core speciality">
      <div className="profile__featured-lead">
        <div className="profile__featured-main">
          {title && (
            <h2 className="profile__featured-title">
              <Inline nodes={title.children} />
            </h2>
          )}
          {paragraphs.map((p, i) => (
            <p className="profile__p" key={i}>
              <Inline nodes={p.children} />
            </p>
          ))}
        </div>
        {quote && (
          <blockquote className="profile__note">
            <p className="profile__note-text">
              <Inline nodes={quote.children} />
            </p>
          </blockquote>
        )}
      </div>

      {list && (
        <ol className="profile__caps">
          {list.items.map((item, i) => (
            <li className="profile__cap" key={i}>
              <span className="profile__cap-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="profile__cap-text">
                <Inline nodes={item} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function Flow({ blocks }: { blocks: BlockNode[] }) {
  const list = blocks.find((b) => b.type === 'list')
  if (!list) return null
  return (
    <section className="profile__flow-wrap" aria-label="Typical workflow">
      <ol className="profile__flow">
        {list.items.map((item, i) => (
          <li className="profile__flow-step" key={i}>
            <span className="profile__flow-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="profile__flow-label">{inlineText(item)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Personal({ blocks }: { blocks: BlockNode[] }) {
  const paragraphs = blocks.filter((b) => b.type === 'paragraph')
  return (
    <section className="profile__personal" aria-label="Off-hours and homelab">
      <div className="profile__personal-head">
        <h2 className="profile__personal-title">After hours</h2>
        <p className="profile__personal-sub">Homelab, Linux &amp; family uptime</p>
      </div>
      <div className="profile__personal-body">
        {paragraphs.map((p, i) => (
          <p className="profile__p" key={i}>
            <Inline nodes={p.children} />
          </p>
        ))}
      </div>
    </section>
  )
}

type SectionGroup =
  | { kind: 'row'; heading: BlockNode & { type: 'heading' }; paragraphs: Array<BlockNode & { type: 'paragraph' }> }
  | { kind: 'paragraph'; block: BlockNode & { type: 'paragraph' } }
  | { kind: 'directive'; block: BlockNode & { type: 'directive' } }

function groupBlocks(blocks: BlockNode[]): SectionGroup[] {
  const groups: SectionGroup[] = []
  let currentRow: { heading: BlockNode & { type: 'heading' }; paragraphs: Array<BlockNode & { type: 'paragraph' }> } | null = null

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (currentRow) groups.push({ kind: 'row', ...currentRow })
      currentRow = { heading: block, paragraphs: [] }
    } else if (block.type === 'paragraph') {
      if (currentRow) {
        currentRow.paragraphs.push(block)
      } else {
        groups.push({ kind: 'paragraph', block })
      }
    } else if (block.type === 'directive') {
      if (currentRow) {
        groups.push({ kind: 'row', ...currentRow })
        currentRow = null
      }
      groups.push({ kind: 'directive', block })
    }
  }
  if (currentRow) groups.push({ kind: 'row', ...currentRow })
  return groups
}

export default function WhoamiProfile({ content, path }: { content: string; path: string }) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  const fm = parsed.frontmatter
  const isWhoami = fm.kind === 'whoami'
  const labels = (fm.labels ?? '').split(',').map((s) => s.trim()).filter(Boolean)

  const first = parsed.blocks[0]
  const intro = first && first.type === 'paragraph' ? first : null
  const rest = useMemo(() => groupBlocks(intro ? parsed.blocks.slice(1) : parsed.blocks), [intro, parsed.blocks])

  return (
    <article className="profile">
      <header className="profile__header">
        <div className="profile__hero-main">
          {isWhoami ? (
            <>
              <h1 className="profile__name">{fm.name ?? 'Marc Arias Ortiz'}</h1>
              {fm.tagline && <p className="profile__tagline">{fm.tagline}</p>}
            </>
          ) : (
            <>
              <h1 className="profile__name">{fm.title ?? 'Now'}</h1>
              {fm.tagline && <p className="profile__tagline">{fm.tagline}</p>}
            </>
          )}
          {intro && (
            <p className="profile__intro">
              <Inline nodes={intro.children} />
            </p>
          )}
        </div>

        <aside className="profile__dossier" aria-label="Profile telemetry">
          <dl className="profile__specs">
            <div className="profile__spec">
              <dt>Role</dt>
              <dd className="profile__spec-accent">{fm.role ?? 'Applied AI engineer'}</dd>
            </div>
            <div className="profile__spec">
              <dt>Path</dt>
              <dd>
                <code>{toTilde(path)}</code>
              </dd>
            </div>
            <div className="profile__spec">
              <dt>Status</dt>
              <dd className="profile__spec-status">
                <span className="status-dot" aria-hidden="true" />
                Active · Barcelona
              </dd>
            </div>
            {labels.length > 0 && (
              <div className="profile__spec profile__spec--stack">
                <dt>Core areas</dt>
                <dd>
                  <ul className="profile__labels" aria-label="Core areas">
                    {labels.map((label) => (
                      <li className="profile__label" key={label}>
                        {label}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </header>

      <div className="profile__body">
        {rest.map((group, i) => {
          if (group.kind === 'row') {
            return (
              <section className="profile__row" key={i}>
                <div className="profile__row-head">
                  <h2 className="profile__h2">
                    <Inline nodes={group.heading.children} />
                  </h2>
                </div>
                <div className="profile__row-content">
                  {group.paragraphs.map((p, j) => (
                    <p className="profile__p" key={j}>
                      <Inline nodes={p.children} />
                    </p>
                  ))}
                </div>
              </section>
            )
          }
          if (group.kind === 'paragraph') {
            return (
              <p className="profile__p" key={i}>
                <Inline nodes={group.block.children} />
              </p>
            )
          }
          if (group.kind === 'directive') {
            const { block } = group
            if (block.name === 'featured') return <Featured key={i} blocks={block.blocks} />
            if (block.name === 'flow') return <Flow key={i} blocks={block.blocks} />
            if (block.name === 'personal') return <Personal key={i} blocks={block.blocks} />
          }
          return null
        })}
      </div>
    </article>
  )
}
