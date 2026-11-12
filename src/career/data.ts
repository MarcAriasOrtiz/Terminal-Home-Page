// Structured content for the career landing page (kind: career).
//
// Single source of truth for the sections rendered by CareerView, mirroring how
// src/lab/systems.ts holds the data behind the Personal AI Lab. The prose intro
// (headline + paragraphs) lives in content/career/README.md.
//
// Accuracy rules:
// - "AI R&D Engineer" is an orientative positioning, not an official job title.
// - Projects are conceptual, public-facing descriptions. No company names,
//   metrics, models, scale, or production claims.

export const ROLE = 'AI R&D Engineer'

// Short display names for the disciplines, used in the project teasers and as
// the headings of the grouped project list.
export const DISCIPLINE_LABELS: Record<string, string> = {
  data: 'Data',
  ai: 'AI & Models',
  software: 'Software',
  automation: 'Automation',
  infra: 'Infrastructure',
}

export interface DisciplineDetail {
  id: string
  code: string
  label: string
  stage: string
  roleInSystem: string
  handoff: string
  examples: string[]
}

export const DISCIPLINE_DETAILS: DisciplineDetail[] = [
  {
    id: 'data',
    code: '01',
    label: 'Data',
    stage: 'ingest & structure',
    roleInSystem:
      'Turning raw, inconsistent sources (documents, sensors, scraped catalogues, logs) into clean tables, vectors and graphs that downstream services can actually trust.',
    handoff: 'Raw inputs → structured stores, embeddings & knowledge graphs',
    examples: ['ETL & normalization pipelines', 'Vector & graph indexing', 'Sensor & analytical SQL stores'],
  },
  {
    id: 'ai',
    code: '02',
    label: 'AI & Models',
    stage: 'adapt & retrieve',
    roleInSystem:
      'Picking or fine-tuning the right model for the job, wiring retrieval over company knowledge, and designing agents that call tools instead of guessing.',
    handoff: 'Structured context → task-specific inference & grounded answers',
    examples: ['Small-model fine-tuning & quantisation', 'GraphRAG & hybrid retrieval', 'Multi-agent tool use'],
  },
  {
    id: 'software',
    code: '03',
    label: 'Software',
    stage: 'expose & integrate',
    roleInSystem:
      'Wrapping models and pipelines in clean backend services, APIs and interfaces so teams and existing software can use them without friction.',
    handoff: 'Model capabilities → typed APIs, backends & service integrations',
    examples: ['Python & Rust backend services', 'FastAPI & internal APIs', 'Guardrails & validation layers'],
  },
  {
    id: 'automation',
    code: '04',
    label: 'Automation',
    stage: 'orchestrate & trigger',
    roleInSystem:
      'Connecting the moving parts so recurring jobs (retraining a model, syncing a project board, provisioning a node) happen reliably without someone babysitting a script.',
    handoff: 'Isolated services to scheduled pipelines & event-driven workflows',
    examples: ['Weekly retraining loops', 'Containerised task runners', 'Ansible & workflow orchestration'],
  },
  {
    id: 'infra',
    code: '05',
    label: 'Infrastructure',
    stage: 'deploy & observe',
    roleInSystem:
      'Running the whole stack on Linux, Docker, Kubernetes or self-hosted hardware, with monitoring and network routing so it stays up in the real world.',
    handoff: 'Application containers → reproducible runtime & observability',
    examples: ['Linux, Docker & Kubernetes', 'Private & on-prem AI hosting', 'Prometheus & Grafana monitoring'],
  },
]

export interface Project {
  id: string
  title: string
  summary: string
  disciplines: string[]
  /** Featured projects are shown as cards on the landing page. */
  featured: boolean
  target: string
}

export interface ExploreItem {
  label: string
  description: string
  target: string
}

export interface TimelineEntry {
  period: string
  label: string
  description: string
}

export const PROJECTS: Project[] = [
  {
    id: 'knowledge-navigation',
    title: 'GraphRAG Knowledge Agent',
    summary:
      'A self-hosted agent that lets an engineering department search and ask questions across tens of gigabytes of heterogeneous documentation.',
    disciplines: ['data', 'ai', 'software', 'infra'],
    featured: true,
    target: '/home/mao/career/projects/ai/graphrag-knowledge-agent.md',
  },
  {
    id: 'fine-tuned-incident-labeling',
    title: 'Fine-tuned incident labeling',
    summary:
      'A fine-tuning pipeline that teaches a small language model to label free-text incidents with 51 internal labels, retrained weekly.',
    disciplines: ['ai', 'data', 'software', 'infra'],
    featured: true,
    target: '/home/mao/career/projects/ai/fine-tuned-incident-labeling.md',
  },
  {
    id: 'agentic-factory',
    title: 'An agentic software factory',
    summary:
      'An orchestrator that reads project-board tasks and hands each one to a specialised agent in a container, with the team validating the output.',
    disciplines: ['ai', 'software', 'automation'],
    featured: false,
    target: '/home/mao/career/projects/ai/agentic-software-factory.md',
  },
  {
    id: 'ventilation-decision-support',
    title: 'Ventilation Decision Support Pilot',
    summary:
      'A pilot that combines building sensor data, weather observations and per-zone machine learning models to recommend ventilation periods.',
    disciplines: ['ai', 'data', 'software', 'infra'],
    featured: false,
    target: '/home/mao/career/projects/data/ventilation-decision-support-pilot.md',
  },
  {
    id: 'pharma-faq-assistant',
    title: 'Pharmaceutical FAQ Assistant',
    summary:
      'A multilingual conversational assistant for a pharmaceutical company, built on Cognigy, with improved question detection and controlled access to company data.',
    disciplines: ['ai', 'software'],
    featured: false,
    target: '/home/mao/career/projects/ai/pharma-faq-assistant.md',
  },
  {
    id: 'product-catalogue-data-platform',
    title: 'Product Catalogue Data Platform',
    summary:
      'A data platform that collects product data from dozens of websites into one structure, then cleans, normalises and links it for search.',
    disciplines: ['data', 'software', 'automation', 'infra'],
    featured: false,
    target: '/home/mao/career/projects/data/product-catalogue-data-platform.md',
  },
  {
    id: 'server-monitoring',
    title: 'Server Monitoring with Ansible',
    summary:
      'A monitoring stack for around fifteen servers, with Prometheus, Grafana and an idempotent Ansible role that brings new servers under monitoring.',
    disciplines: ['infra', 'automation', 'software'],
    featured: false,
    target: '/home/mao/career/projects/infrastructure/server-monitoring-ansible.md',
  },
  {
    id: 'cognigy-aws-deployment',
    title: 'Cognigy Platform Deployment on AWS',
    summary:
      'The deployment and validation of the Cognigy platform on Kubernetes in AWS for a major airline.',
    disciplines: ['infra', 'software'],
    featured: false,
    target: '/home/mao/career/projects/infrastructure/cognigy-aws-deployment.md',
  },
]

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2021',
    label: 'Data Science & Analytics',
    description: 'Started out building analytical pipelines, statistical models and database tooling.',
  },
  {
    period: '2022',
    label: 'NLP & Machine Learning',
    description: 'Moved into natural language processing, conversational systems and leading ML implementation.',
  },
  {
    period: 'Recent years',
    label: 'Applied AI & Systems R&D',
    description:
      'Focused on private AI infrastructure, small-model fine-tuning, agentic workflows and knowledge retrieval wired into real operations.',
  },
]

export const EXPERIENCE_PATH = '/home/mao/career/experience/README.md'

export const EXPLORE: ExploreItem[] = [
  { label: 'Experience', description: 'Where I have worked and how my responsibilities evolved.', target: '/home/mao/career/experience/README.md' },
  { label: 'Selected Work', description: 'Eight engineering case studies across AI, data and infrastructure.', target: '/home/mao/career/projects/README.md' },
  { label: 'Expertise', description: 'The tools, languages and certifications I work with.', target: '/home/mao/career/skills-certifications/README.md' },
  { label: 'Written CV', description: 'The plain-text markdown version of my resume.', target: '/home/mao/career/cv.md' },
  { label: 'Visual Profile', description: 'An interactive view of my CV and system confluence.', target: '/home/mao/career/profile.md' },
]
