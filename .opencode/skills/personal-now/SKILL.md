---
name: personal-now
description: Author and maintain about_me/now.md — Marc's personal AI lab: the interactive system graph, verified relationships, and the systems data it renders from.
---

# personal-now

`content/about_me/now.md` documents what Marc is building and tinkering with
right now. It is a living page, not a static bio.

## When to use this skill

Use it to create or update `now.md` when Marc's current projects, experiments,
or self-hosted setup change. For identity and career background, use the
`whoami` skill; for general voice guidance, see `personal-portfolio-writing`.

## Purpose and scope

- One scannable page about current personal projects and technical interests,
  organised around connected themes — not one section per tool.
- Main projects: Skippy (personal AI) and the personal data pipeline.
- Ecosystem context: persistent knowledge, home automation, homelab/networking.
- Leave room for future dedicated project pages; keep descriptions concise.

## Voice and style

Reuse `personal-portfolio-writing` for the voice. In short:

- English, informal, direct, curious, technically competent.
- A little dry humour is welcome; do not force it.
- No corporate marketing language, exaggerated claims, or meaningless buzzwords.
- Prefer concrete descriptions over adjectives.

## Facts to represent

Background: applied AI engineer; data science + biological systems engineering;
machine learning, NLP, R&D; ~5 years toward practical AI systems.

Interests: LLM fine-tuning and task-specific adaptation; smaller models,
quantisation and local inference; AI agents and multi-agent systems; vector
databases, retrieval and knowledge bases; workflow automation and data
pipelines; Linux, self-hosting, networking, infrastructure and observability.

### Systems (confirmed — see `src/lab/systems.ts`)

The graph models the real environment as individual services, grouped into six
categories:

- **Access & Networking** — Cloudflare DNS (resolves domains to the Tailscale
  IP), Tailscale (private access), Caddy (reverse proxy / hostname routing), and
  Cloudflare Tunnel (the single public path to n8n).
- **AI & Knowledge** — Skippy (a single agent: Marc's customized Hermes — there
  is no separate Hermes), Obsidian, and the shared `/vaults` volume.
- **Data & Workflows** — n8n, PostgreSQL (one container, multiple databases),
  Project databases, and Superset.
- **Infrastructure & Admin** — PgAdmin, Dozzle, Vaultwarden, Pi-hole.
- **Smart Home** — Home Assistant and the physical Zigbee receiver (hardware).
- **Other Services & Projects** — Valheim server, the mobile app (in
  development), and the personal homepage (in development).

Only the mobile app and the homepage are `in-development`; everything else is
`operational`. Keep this current by editing `src/lab/systems.ts`.

## Accuracy rules

- Distinguish working systems, work in progress, experiments, and future plans.
- Describe planned capabilities as plans, not completed functionality.
- Never invent implementation details, benchmarks, outcomes, timelines, dates,
  or progress percentages.
- Describe architecture functionally; do not guess topology, security, auth,
  TLS, DNS, or exposure rules.
- Never include credentials, private IPs, sensitive hostnames, or tokens.
- Do not duplicate `whoami.md` (identity/background) — focus on the "now".
- Ask Marc when a missing detail materially affects accuracy; otherwise use a
  more general but accurate statement.

## Markdown and rendering

`now.md` uses `kind: lab` frontmatter and is rendered by
`src/components/LabView.tsx` — an interactive system graph plus a details panel —
not the `whoami` renderer and not the generic `MarkdownView`.

- Frontmatter: `kind: lab`, `title`, `tagline`.
- The first paragraph is the intro, shown in the header.
- The systems and edges are data-driven from `src/lab/systems.ts` (below).

## Graph data and relationships

Systems and connections live in `src/lab/systems.ts` (typed `SYSTEMS` and
`CONNECTIONS` arrays). Nodes and connections are defined separately, and the
graph, filters, and detail panels all derive from this one model.

- Each `System` has `id`, `name`, `category`, `status` (`operational` |
  `in-development`), `summary`, `technologies`, and optional `notes`.
- Each `Connection` has `id`, `source`, `target`, `type`, `status`, `direction`,
  `label`, `description`, and optional `evidence`.

### Connection types (exact)

- `integration` — an app/agent/service invokes another system's capabilities
  (e.g. Skippy controlling Home Assistant, PgAdmin administering PostgreSQL).
- `data-flow` — processed data written into a destination (e.g. n8n → project DBs).
- `query` — a consumer reading data for analysis (e.g. Superset → project DBs).
- `persistence` — a service's application database hosted in PostgreSQL.
- `storage` — shared filesystem access (e.g. `/vaults`).
- `network` — reverse-proxy / private access routing.
- `dns` — domain resolution (not an HTTP proxy).
- `tunnel` — public Cloudflare Tunnel access.
- `hosting` — a logical host containing a resource (e.g. PostgreSQL hosting the
  project databases).
- `hardware` — a physical device used by a service (e.g. the Zigbee receiver).
- `planned` — a proposed future relationship (never operational).

### Direction

`forward` (source→target), `reverse`, `bidirectional`, or `none`. Arrows reflect
direction on flow-type edges (`integration`, `data-flow`, `query`, `persistence`,
`network`, `dns`, `tunnel`, `hardware`). `storage`, `hosting`, and `planned`
edges have no arrow.

Relationship rules:

- Only add a connection when it is explicitly documented; otherwise leave it out.
- Never infer an integration, data dependency, public endpoint, or bidirectional
  interaction just because two systems could work together.
- There is a single Skippy agent (customized Hermes) — never add a separate
  Hermes node or a Skippy↔Hermes edge.
- Model `/vaults` as a shared volume (`storage`), not an API or vector store.
- Distinguish PostgreSQL application databases from the project databases.
- Connect Caddy only to services with confirmed routing; leave others unlinked.
- Mark proposed relationships `type: 'planned'` (status `planned`).
- Keep `evidence` as a short reference to the confirming fact.

## Validation

1. `npm run build`.
2. In the browser: expand `about_me/` in the explorer and open `now.md`; confirm
   the graph renders, node selection updates the details panel, and
   `cat ~/about_me/now.md` prints the raw Markdown.
3. Confirm every edge is backed by evidence, no relationship is inferred, the
   page is scannable, and there is no duplication with `whoami.md` or sensitive
   infrastructure detail.
