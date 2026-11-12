// Lightweight, dependency-free Markdown parser for mao.home.
//
// Markdown is treated as untrusted input: this parser produces a plain AST of
// strings and structure, never HTML. Rendering is done by React, which escapes
// all text by default. There is no path from Markdown to raw HTML/JS execution.

export interface Frontmatter {
  [key: string]: string
}

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'code'; value: string }
  | { type: 'mark'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] }

export type BlockNode =
  | { type: 'heading'; level: number; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'list'; items: InlineNode[][] }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'code'; lang: string; value: string }
  | { type: 'hr' }
  | { type: 'directive'; name: string; blocks: BlockNode[] }

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  blocks: BlockNode[]
}

// Inline tokens, in precedence order. `==text==` is a custom highlight directive.
// Links are limited to http(s) URLs.
const INLINE_SOURCE =
  '(`[^`]+`)|(\\*\\*[^*]+\\*\\*)|(==[^=]+==)|(\\*[^*]+\\*)|(\\[[^\\]]+\\]\\(https?:\\/\\/[^)\\s]+\\))'

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  const re = new RegExp(INLINE_SOURCE, 'g')
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push({ type: 'text', value: text.slice(last, m.index) })
    if (m[1]) nodes.push({ type: 'code', value: m[1].slice(1, -1) })
    else if (m[2]) nodes.push({ type: 'strong', children: parseInline(m[2].slice(2, -2)) })
    else if (m[3]) nodes.push({ type: 'mark', children: parseInline(m[3].slice(2, -2)) })
    else if (m[4]) nodes.push({ type: 'em', children: parseInline(m[4].slice(1, -1)) })
    else if (m[5]) {
      const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(m[5])
      if (link) nodes.push({ type: 'link', href: link[2], children: parseInline(link[1]) })
    }
    last = re.lastIndex
  }
  if (last < text.length) nodes.push({ type: 'text', value: text.slice(last) })
  return nodes
}

function isBlockStart(line: string): boolean {
  const t = line.trim()
  return (
    /^#{1,6}\s/.test(t) ||
    /^[-*]\s/.test(t) ||
    /^>\s?/.test(t) ||
    /^:::\w+\s*$/.test(t) ||
    t.startsWith('```') ||
    /^(-{3,}|\*{3,})$/.test(t)
  )
}

function parseBlocks(lines: string[]): BlockNode[] {
  const blocks: BlockNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }

    const directive = /^:::(\w+)\s*$/.exec(line.trim())
    if (directive) {
      const inner: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        inner.push(lines[i])
        i++
      }
      i++ // skip the closing ':::'
      blocks.push({ type: 'directive', name: directive[1], blocks: parseBlocks(inner) })
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, children: parseInline(heading[2]) })
      i++
      continue
    }

    const listItem = /^[-*]\s+(.*)$/.exec(line)
    if (listItem) {
      const items: InlineNode[][] = []
      while (i < lines.length) {
        const m = /^[-*]\s+(.*)$/.exec(lines[i])
        if (!m) break
        items.push(parseInline(m[1]))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    const quote = /^>\s?(.*)$/.exec(line)
    if (quote) {
      const quoteLines: string[] = []
      while (i < lines.length) {
        const m = /^>\s?(.*)$/.exec(lines[i])
        if (!m) break
        quoteLines.push(m[1])
        i++
      }
      blocks.push({ type: 'quote', children: parseInline(quoteLines.join(' ')) })
      continue
    }

    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push({ type: 'code', lang, value: code.join('\n') })
      continue
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    const paragraph: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      paragraph.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', children: parseInline(paragraph.join(' ')) })
  }
  return blocks
}

export function parseMarkdown(source: string): ParsedMarkdown {
  let body = source.replace(/^\uFEFF/, '')
  const frontmatter: Frontmatter = {}

  if (body.startsWith('---\n')) {
    const end = body.indexOf('\n---', 4)
    if (end !== -1) {
      const text = body.slice(4, end)
      body = body.slice(end + 4)
      for (const raw of text.split('\n')) {
        const idx = raw.indexOf(':')
        if (idx > 0) {
          const key = raw.slice(0, idx).trim()
          const value = raw.slice(idx + 1).trim()
          if (key) frontmatter[key] = value
        }
      }
    }
  }

  return { frontmatter, blocks: parseBlocks(body.split('\n')) }
}

/** Return the `kind` value from a document's frontmatter, or null. */
export function getKind(content: string): string | null {
  const m = /^---\s*\n([\s\S]*?)\n---/.exec(content)
  if (!m) return null
  const kind = /^kind:\s*(\S+)\s*$/m.exec(m[1])
  return kind ? kind[1] : null
}
