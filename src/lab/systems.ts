// Structured data for the Personal AI Lab (about_me/now.md, `kind: lab`).
//
// Single source of truth. Nodes (SYSTEMS) and connections (CONNECTIONS) are
// defined separately; the graph, filters, and detail panels all derive from
// this model.
//
// Accuracy rules:
// - Only relationships that are explicitly documented belong here.
// - If a relationship cannot be justified, leave it out.
// - Never fabricate API calls, protocols, endpoints, hosting topology,
//   security properties, or bidirectional interactions.

export type SystemStatus = 'operational' | 'in-development'

export type Category = 'access' | 'ai' | 'data' | 'infra' | 'home' | 'other'

export const CATEGORY_LABELS: Record<Category, string> = {
  access: 'Access & Networking',
  ai: 'AI & Knowledge',
  data: 'Data & Workflows',
  infra: 'Infrastructure & Admin',
  home: 'Smart Home',
  other: 'Other Services & Projects',
}

export interface System {
  id: string
  name: string
  category: Category
  status: SystemStatus
  summary: string
  technologies: string[]
  /** Optional display line shown under the name in place of the category. */
  subtitle?: string
  notes?: string[]
}

// --- Connection model -------------------------------------------------------

export type ConnectionType =
  | 'integration'
  | 'data-flow'
  | 'query'
  | 'persistence'
  | 'storage'
  | 'network'
  | 'dns'
  | 'tunnel'
  | 'hosting'
  | 'hardware'
  | 'planned'

export type ConnectionStatus = 'operational' | 'in-development' | 'planned'

export type Direction = 'forward' | 'reverse' | 'bidirectional' | 'none'

export const CONNECTION_TYPE_ORDER: ConnectionType[] = [
  'integration',
  'data-flow',
  'query',
  'persistence',
  'storage',
  'network',
  'dns',
  'tunnel',
  'hosting',
  'hardware',
  'planned',
]

export const CONNECTION_TYPE_LABELS: Record<ConnectionType, string> = {
  integration: 'Integration',
  'data-flow': 'Data flow',
  query: 'Data query',
  persistence: 'Persistence',
  storage: 'Shared storage',
  network: 'Routing',
  dns: 'DNS',
  tunnel: 'Public tunnel',
  hosting: 'Hosting',
  hardware: 'Hardware',
  planned: 'Planned',
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  forward: 'forward',
  reverse: 'reverse',
  bidirectional: 'bidirectional',
  none: 'none',
}

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  operational: 'operational',
  'in-development': 'in development',
  planned: 'planned',
}

export interface Connection {
  id: string
  source: string
  target: string
  type: ConnectionType
  status: ConnectionStatus
  direction: Direction
  label: string
  description: string
  evidence?: string
}

export const SYSTEMS: System[] = [
  // --- AI & Knowledge ---
  {
    id: 'skippy',
    name: 'Skippy',
    category: 'ai',
    status: 'operational',
    subtitle: 'Personal AI Agent · Customized Hermes',
    summary: 'My personalized AI assistant — a customized version of Hermes, with its own personality, custom functions and infrastructure integrations.',
    technologies: [],
    notes: ['Runs in one Docker container.', 'Hermes is the underlying project, not a second agent.'],
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'ai',
    status: 'operational',
    summary: 'Knowledge vault interface — manages my shared vault.',
    technologies: ['Obsidian'],
    notes: ['Shares the /vaults volume with Skippy through the filesystem, not an Obsidian API.'],
  },
  {
    id: 'vaults',
    name: '/vaults',
    category: 'ai',
    status: 'operational',
    subtitle: 'shared volume',
    summary: 'The shared knowledge vault volume used by Skippy and Obsidian.',
    technologies: [],
    notes: ['A shared filesystem volume — not a vector store or retrieval pipeline.'],
  },

  // --- Data & Workflows ---
  {
    id: 'n8n',
    name: 'n8n',
    category: 'data',
    status: 'operational',
    summary: 'Workflow automation and data processing.',
    technologies: ['n8n'],
    notes: [
      'Keeps its own database in PostgreSQL for internal application data.',
      'Workflows write processed data into the project databases.',
      'Exposed publicly through Cloudflare Tunnel.',
    ],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'data',
    status: 'operational',
    summary: 'Central database container holding multiple databases.',
    technologies: ['PostgreSQL'],
    notes: ['Hosts application databases for services and the project databases.'],
  },
  {
    id: 'project-databases',
    name: 'Project databases',
    category: 'data',
    status: 'operational',
    summary: 'Project data stored in PostgreSQL, used for analytics.',
    technologies: [],
    notes: ['Distinct from the per-service application databases.'],
  },
  {
    id: 'superset',
    name: 'Superset',
    category: 'data',
    status: 'operational',
    summary: 'Analytics and visualisation of project data.',
    technologies: ['Apache Superset'],
    notes: [
      'Keeps its own database in PostgreSQL for internal metadata.',
      'Queries the project databases for analysis.',
    ],
  },

  // --- Infrastructure & Administration ---
  {
    id: 'pgadmin',
    name: 'PgAdmin',
    category: 'infra',
    status: 'operational',
    summary: 'Browser-based PostgreSQL administration interface.',
    technologies: ['PgAdmin'],
  },
  {
    id: 'dozzle',
    name: 'Dozzle',
    category: 'infra',
    status: 'operational',
    summary: 'Docker container logs and monitoring.',
    technologies: ['Dozzle'],
    notes: ['Reached via dozzle.mao-datascience.com through Caddy.'],
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    category: 'infra',
    status: 'operational',
    summary: 'Self-hosted password manager.',
    technologies: ['Vaultwarden'],
    notes: ['Uses its own database hosted in PostgreSQL.'],
  },
  {
    id: 'pihole',
    name: 'Pi-hole',
    category: 'infra',
    status: 'in-development',
    summary: 'DNS filtering service.',
    technologies: ['Pi-hole'],
    notes: ['In the process of being implemented.'],
  },

  // --- Access & Networking ---
  {
    id: 'caddy',
    name: 'Caddy',
    category: 'access',
    status: 'operational',
    summary: 'Reverse proxy and hostname-based routing for services.',
    technologies: ['Caddy'],
    notes: ['Routes requests to services by domain/hostname. Only confirmed routes are shown.'],
  },
  {
    id: 'cloudflare-dns',
    name: 'Cloudflare DNS',
    category: 'access',
    status: 'operational',
    summary: 'Resolves service domains to the server’s private Tailscale IP.',
    technologies: ['Cloudflare DNS'],
    notes: ['DNS resolution — not an HTTP proxy.'],
  },
  {
    id: 'cloudflare-tunnel',
    name: 'Cloudflare Tunnel',
    category: 'access',
    status: 'operational',
    summary: 'Public access path to n8n.',
    technologies: ['Cloudflared'],
    notes: ['Public access for n8n, and for the homepage once it is deployed.'],
  },
  {
    id: 'tailscale',
    name: 'Tailscale',
    category: 'access',
    status: 'operational',
    summary: 'Private network access to the server and its services.',
    technologies: ['Tailscale'],
    notes: ['Runs as a container; provides private access, not Docker-to-Docker routing.'],
  },

  // --- Smart Home ---
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    category: 'home',
    status: 'operational',
    summary: 'Home automation service running as a container.',
    technologies: ['Home Assistant'],
    notes: ['Uses the physical Zigbee receiver.'],
  },
  {
    id: 'zigbee',
    name: 'Zigbee receiver',
    category: 'home',
    status: 'operational',
    subtitle: 'physical hardware',
    summary: 'Physical Zigbee receiver on the server, used by Home Assistant.',
    technologies: ['Zigbee'],
    notes: ['Hardware, not a container.'],
  },

  // --- Other Services & Projects ---
  {
    id: 'valheim',
    name: 'Valheim server',
    category: 'other',
    status: 'operational',
    summary: 'Self-hosted game server for playing with friends.',
    technologies: ['Valheim'],
    notes: ['The most important service. Obviously.'],
  },
  {
    id: 'mobile-app',
    name: 'Mobile app',
    category: 'other',
    status: 'in-development',
    summary: 'Personal mobile app, intended to communicate with Skippy.',
    technologies: [],
    notes: ['In development — the Skippy connection is planned, not built.'],
  },
  {
    id: 'homepage',
    name: 'Personal homepage',
    category: 'other',
    status: 'in-development',
    summary: 'Personal homepage, in development.',
    technologies: [],
    notes: ['Role and integrations are still undecided.'],
  },
]

export const CONNECTIONS: Connection[] = [
  // Private access path: DNS → Tailscale → Caddy → service.
  {
    id: 'cloudflare-dns-tailscale',
    source: 'cloudflare-dns',
    target: 'tailscale',
    type: 'dns',
    status: 'operational',
    direction: 'forward',
    label: 'resolves to',
    description: 'Cloudflare DNS resolves service domains to the server’s private Tailscale IP.',
    evidence: "Config: domains resolve to the private Tailscale IP.",
  },
  {
    id: 'tailscale-caddy',
    source: 'tailscale',
    target: 'caddy',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'private access',
    description: 'Private requests reach Caddy over the Tailscale network.',
  },
  {
    id: 'caddy-dozzle',
    source: 'caddy',
    target: 'dozzle',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy routes dozzle.mao-datascience.com to Dozzle.',
    evidence: "Config: dozzle.mao-datascience.com is routed through Caddy.",
  },
  {
    id: 'caddy-obsidian',
    source: 'caddy',
    target: 'obsidian',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy routes the configured domain to Obsidian.',
  },
  {
    id: 'caddy-home-assistant',
    source: 'caddy',
    target: 'home-assistant',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy routes the configured domain to Home Assistant.',
  },
  {
    id: 'caddy-pgadmin',
    source: 'caddy',
    target: 'pgadmin',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy routes the configured domain to PgAdmin.',
  },
  {
    id: 'caddy-vaultwarden',
    source: 'caddy',
    target: 'vaultwarden',
    type: 'network',
    status: 'operational',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy routes the configured domain to Vaultwarden.',
  },
  {
    id: 'caddy-pihole',
    source: 'caddy',
    target: 'pihole',
    type: 'network',
    status: 'in-development',
    direction: 'forward',
    label: 'routes',
    description: 'Caddy will route the configured domain to Pi-hole once it is implemented.',
  },

  // Public access path.
  {
    id: 'cloudflare-tunnel-n8n',
    source: 'cloudflare-tunnel',
    target: 'n8n',
    type: 'tunnel',
    status: 'operational',
    direction: 'forward',
    label: 'public access',
    description: 'Cloudflare Tunnel provides the public access path to n8n.',
  },
  {
    id: 'cloudflare-tunnel-homepage',
    source: 'cloudflare-tunnel',
    target: 'homepage',
    type: 'tunnel',
    status: 'planned',
    direction: 'forward',
    label: 'public access',
    description: 'The homepage will be exposed publicly through Cloudflare Tunnel.',
  },

  // AI & Knowledge: shared /vaults volume.
  {
    id: 'skippy-vaults',
    source: 'skippy',
    target: 'vaults',
    type: 'storage',
    status: 'operational',
    direction: 'bidirectional',
    label: 'reads/writes',
    description: 'Skippy reads and writes the shared /vaults volume through the filesystem.',
  },
  {
    id: 'obsidian-vaults',
    source: 'obsidian',
    target: 'vaults',
    type: 'storage',
    status: 'operational',
    direction: 'bidirectional',
    label: 'uses',
    description: 'The Obsidian container uses the same /vaults volume.',
  },

  // Data & Workflows: PostgreSQL persistence, project data flow, analytics.
  {
    id: 'n8n-postgres',
    source: 'n8n',
    target: 'postgres',
    type: 'persistence',
    status: 'operational',
    direction: 'forward',
    label: 'app database',
    description: 'n8n stores its internal application data in its own PostgreSQL database.',
  },
  {
    id: 'n8n-project-databases',
    source: 'n8n',
    target: 'project-databases',
    type: 'data-flow',
    status: 'operational',
    direction: 'forward',
    label: 'writes',
    description: 'n8n workflows write processed data into the project databases.',
  },
  {
    id: 'superset-postgres',
    source: 'superset',
    target: 'postgres',
    type: 'persistence',
    status: 'operational',
    direction: 'forward',
    label: 'app database',
    description: 'Superset stores its internal metadata in its own PostgreSQL database.',
  },
  {
    id: 'superset-project-databases',
    source: 'superset',
    target: 'project-databases',
    type: 'query',
    status: 'operational',
    direction: 'forward',
    label: 'queries',
    description: 'Superset queries the project databases for analysis and visualisation.',
  },
  {
    id: 'vaultwarden-postgres',
    source: 'vaultwarden',
    target: 'postgres',
    type: 'persistence',
    status: 'operational',
    direction: 'forward',
    label: 'app database',
    description: 'Vaultwarden uses its own database hosted in PostgreSQL.',
  },
  {
    id: 'pgadmin-postgres',
    source: 'pgadmin',
    target: 'postgres',
    type: 'integration',
    status: 'operational',
    direction: 'forward',
    label: 'administers',
    description: 'PgAdmin provides the browser-based interface for managing PostgreSQL.',
  },
  {
    id: 'postgres-project-databases',
    source: 'postgres',
    target: 'project-databases',
    type: 'hosting',
    status: 'operational',
    direction: 'forward',
    label: 'hosts',
    description: 'PostgreSQL hosts the project databases.',
  },

  // Smart Home.
  {
    id: 'skippy-home-assistant',
    source: 'skippy',
    target: 'home-assistant',
    type: 'integration',
    status: 'operational',
    direction: 'forward',
    label: 'controls',
    description: 'Skippy can control Home Assistant through its configured integration.',
  },
  {
    id: 'zigbee-home-assistant',
    source: 'zigbee',
    target: 'home-assistant',
    type: 'hardware',
    status: 'operational',
    direction: 'forward',
    label: 'device',
    description: 'The physical Zigbee receiver is used by Home Assistant.',
  },

  // Planned.
  {
    id: 'mobile-app-skippy',
    source: 'mobile-app',
    target: 'skippy',
    type: 'planned',
    status: 'planned',
    direction: 'forward',
    label: 'will connect',
    description: 'The mobile app is intended to communicate with Skippy — not finished.',
    evidence: "Inventory: 'intended to communicate with Skippy'.",
  },
]
