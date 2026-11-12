---
name: whoami
description: Author and edit the about_me/whoami.md profile for mao.home — its Markdown frontmatter, custom directives, and the art-directed whoami renderer.
---

# whoami profile authoring

`content/about_me/whoami.md` is the single source of truth for Marc Arias Ortiz's
personal profile. It is **not** rendered as plain Markdown: the `WhoamiProfile`
component parses it and produces an art-directed, cyberpunk presentation.

## Where the pieces live

- Source: `content/about_me/whoami.md` — a real Markdown file, imported raw into
  the virtual filesystem by `src/terminal/filesystem.ts`.
- Parser: `src/terminal/markdown.ts` — frontmatter + block + inline → plain AST
  (no HTML). Markdown is treated as untrusted input.
- Renderer: `src/components/WhoamiProfile.tsx` — reads frontmatter + directives.
- Routing: `src/components/Editor.tsx` sends `kind: whoami` documents to
  `WhoamiProfile`; every other `.md` file uses the generic `MarkdownView`.

## Voice and content priorities

- First person, informal and approachable; technically competent without
  over-proving it. Specific about the work, not buzzwordy. No corporate/SaaS tone.
- Present Marc as a data scientist / biological systems engineer who has spent
  the last ~5 years moving toward practical AI engineering.
- Three complementary areas, in this order of emphasis:
  1. **LLM fine-tuning & local models** (the featured speciality) — small and
     medium models, quantisation, task-specific fine-tuning, evaluation, and
     packaging models to run locally.
  2. **AI agents & knowledge systems** — vector databases, knowledge graphs,
     retrieval pipelines, and turning gigabytes of information into useful,
     searchable systems (not just chatbots).
  3. **Infrastructure, systems & automation** — a genuine interest: end-to-end
     understanding, building and maintaining systems, automating repetitive
     work, and a hands-on, DIY approach ("not a black box").
- Dry, occasional humour. Preserve the personal section: Arch Linux, self-hosting
  on an old laptop, homelab, home automation, "nobody asked for" projects, being
  a dad, and the 24/7-uptime joke.
- Never invent metrics, clients, projects or results. Never imply fine-tuning
  guarantees an improvement or that every model needs quantisation. If a fact is
  missing, ask instead of assuming.

## Markdown structure

Frontmatter (flat `key: value` lines between `---`):

- `kind: whoami` — required; routes the document to the profile renderer.
- `name` — string.
- `role` — string.
- `tagline` — string.
- `labels` — comma-separated string, rendered as pills.

Body:

- The first paragraph is the intro, rendered inside the identity header.
- `## Heading` — an ordinary section heading.
- `### Heading` inside `:::featured` — the featured section title.
- `- item` — a bullet list. At the top level, lists are ignored by the profile
  renderer; use them only inside `:::featured` (capability grid) and `:::flow`
  (steps). Use paragraphs with `==highlights==` for ordinary sections.
- `> quote` — a note/blockquote (rendered muted, only inside `:::featured`).
- Inline: `**bold**`, `*italic*`, `` `code` ``, and `==highlight==` (accent highlight).

## Custom directives

Only these three are supported. Unknown directives are ignored.

- `:::featured` … `:::` — the highlighted speciality card. Contains an `###`
  title, paragraphs, a `- ` list (rendered as a 2-column capability grid) and an
  optional `>` note.
- `:::flow` … `:::` — a horizontal step diagram. Contains one `- ` list; each
  item becomes a numbered step.
- `:::personal` … `:::` — the personal section, visually distinct (magenta accent).

## Visual treatment

- Identity header: eyebrow path, name, role (green, uppercase), label pills,
  tagline, intro paragraph, status strip.
- `## Heading`: white heading with a green accent bar.
- `:::featured`: bordered card with a green/cyan gradient and restrained glow;
  title in green; capabilities in a 2-column grid.
- `:::flow`: numbered step cards joined by arrows (stacks vertically on mobile).
- `:::personal`: card with a magenta left border (the only magenta accent).
- `==highlight==` renders with a cyan background; `**bold**` renders white bold.

## Editing without breaking the design

- Keep `kind: whoami` and the documented frontmatter keys.
- Use only the supported block types and the three directives.
- Put ordinary sections under `## Heading` + paragraphs; put special layouts in
  `:::directive` blocks.
- Do not add raw HTML — the parser ignores it; content must stay Markdown.
- To add a new section: use a `## Heading` + paragraphs. To add a new visual
  treatment: extend `WhoamiProfile.tsx` (add a directive case) and document it here.

## Validation

After editing, run:

1. `npm run build` — type-checks and bundles.
2. In the browser: open `about_me/whoami.md` from the explorer (right sidebar)
   and confirm the profile renders with header, featured card, flow and personal
   sections. Confirm `cat ~/about_me/whoami.md` still prints the raw Markdown.
3. Confirm ordinary documents (e.g. `README.md`) still render, and the terminal /
   explorer navigation is unchanged.

Markdown is untrusted input: never use `dangerouslySetInnerHTML`; render through
the provided components only.
