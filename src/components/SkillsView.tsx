import { useMemo, useState } from 'react'
import { parseMarkdown, type BlockNode } from '../terminal/markdown'
import { toTilde } from '../terminal/filesystem'
import { Inline } from './MarkdownView'
import Reveal from './career/Reveal'
import { PROJECTS } from '../career/data'

interface SkillsViewProps {
  content: string
  path: string
  onOpen: (path: string) => void
}

interface CoreDomain {
  id: string
  code: string
  title: string
  shortLabel: string
  summary: string
  capabilities: string[]
  tools: string[]
  projectIds: string[]
}

interface StackCategory {
  id: string
  code: string
  title: string
  role: string
  items: string[]
}

const CORE_DOMAINS: CoreDomain[] = [
  {
    id: 'ai-ml',
    code: '01',
    title: 'Artificial Intelligence & Machine Learning',
    shortLabel: 'AI & ML',
    summary:
      'Designing and adapting AI solutions, from classical machine learning models to task-specific language models fine-tuned and packaged to run locally.',
    capabilities: [
      'Large Language Models (LLMs) & small-model fine-tuning',
      'Retrieval-Augmented Generation (RAG)',
      'Graph-based retrieval & knowledge systems',
      'Natural Language Processing (NLP)',
      'Model evaluation & benchmarking',
      'Applied research & experimentation',
    ],
    tools: ['Python', 'Qdrant', 'Graphiti', 'MLflow', 'Cognigy.AI', 'OpenCode'],
    projectIds: [
      'knowledge-navigation',
      'fine-tuned-incident-labeling',
      'pharma-faq-assistant',
      'ventilation-decision-support',
    ],
  },
  {
    id: 'agentic',
    code: '02',
    title: 'Agentic Systems & Automation',
    shortLabel: 'Agents & Workflows',
    summary:
      'Wiring workflows where AI agents, tools and backend services collaborate to execute real tasks and navigate internal knowledge instead of just chatting.',
    capabilities: [
      'Multi-agent architectures & task routing',
      'Agent orchestration & containerised runners',
      'Model Context Protocol (MCP) & tool use',
      'Knowledge retrieval pipelines',
      'AI-powered workflow automation',
      'Human-in-the-loop validation flows',
    ],
    tools: ['OpenCode', 'MCP', 'n8n', 'Qdrant', 'Graphiti', 'Python', 'Docker'],
    projectIds: ['agentic-factory', 'knowledge-navigation', 'pharma-faq-assistant'],
  },
  {
    id: 'data-eng',
    code: '03',
    title: 'Data Engineering',
    shortLabel: 'Data Engineering',
    summary:
      'Building the plumbing that collects, cleans, normalises and structures raw data so downstream models and teams can actually rely on it.',
    capabilities: [
      'ETL & automated data pipelines',
      'Multi-source data integration & normalisation',
      'Web scraping & structured extraction',
      'Relational database management',
      'SQL schema & data modelling',
      'Scheduled workflow orchestration',
    ],
    tools: ['Python', 'SQL', 'Apache Airflow', 'Web Scraping Tools', 'Qdrant', 'n8n'],
    projectIds: [
      'product-catalogue-data-platform',
      'knowledge-navigation',
      'fine-tuned-incident-labeling',
    ],
  },
  {
    id: 'data-science',
    code: '04',
    title: 'Data Science & Analytics',
    shortLabel: 'Data Science',
    summary:
      'Working with data to test hypotheses, train predictive models per zone or domain, and turn noisy measurements into clear operational decisions.',
    capabilities: [
      'Statistical analysis & hypothesis testing',
      'Exploratory data analysis',
      'Predictive modelling & time-series features',
      'Data visualisation & operational dashboards',
      'Business intelligence reporting',
      'Decision-support systems',
    ],
    tools: ['Python', 'SQL', 'Power BI', 'Grafana', 'Qlik', 'MLflow'],
    projectIds: ['ventilation-decision-support', 'product-catalogue-data-platform'],
  },
  {
    id: 'software',
    code: '05',
    title: 'Software Engineering',
    shortLabel: 'Software',
    summary:
      'Writing the backend services, typed APIs and glue code that connect models, databases and existing software without falling over.',
    capabilities: [
      'Backend service development',
      'REST API design & integration',
      'System architecture & service boundaries',
      'External tool & platform integration',
      'Automation & CLI scripting',
      'Containerised application delivery',
    ],
    tools: ['Python', 'Rust', 'JavaScript', 'FastAPI', 'SQL', 'Docker'],
    projectIds: [
      'knowledge-navigation',
      'agentic-factory',
      'product-catalogue-data-platform',
      'pharma-faq-assistant',
    ],
  },
  {
    id: 'infra',
    code: '06',
    title: 'Infrastructure & DevOps',
    shortLabel: 'Infrastructure',
    summary:
      'Deploying, automating and monitoring the Linux servers, containers, clusters and private networks that everything else runs on.',
    capabilities: [
      'Containerisation with Docker & Compose',
      'Kubernetes cluster deployment & validation',
      'Idempotent infrastructure automation (Ansible)',
      'Linux system administration',
      'Self-hosted & private AI infrastructure',
      'Observability, metrics & alerting stacks',
    ],
    tools: [
      'Linux',
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'Ansible',
      'Grafana',
      'Cloudflare',
      'OpenBao',
      'AWS',
      'Hetzner',
      'STACKIT',
    ],
    projectIds: [
      'server-monitoring',
      'cognigy-aws-deployment',
      'knowledge-navigation',
      'fine-tuned-incident-labeling',
    ],
  },
]

const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'languages',
    code: '01',
    title: 'Languages & Frameworks',
    role: 'Core implementation',
    items: ['Python', 'Rust', 'JavaScript', 'FastAPI', 'SQL'],
  },
  {
    id: 'ai-knowledge',
    code: '02',
    title: 'AI, ML & Knowledge Systems',
    role: 'Models, vectors & graphs',
    items: ['OpenCode', 'Qdrant', 'Graphiti', 'MLflow', 'Cognigy.AI'],
  },
  {
    id: 'data-analytics',
    code: '03',
    title: 'Data & Analytics',
    role: 'Pipelines & observability',
    items: ['Apache Airflow', 'Grafana', 'Power BI', 'Qlik'],
  },
  {
    id: 'automation',
    code: '04',
    title: 'Automation & Integration',
    role: 'Orchestration & protocols',
    items: ['n8n', 'MCP', 'Web Scraping Tools'],
  },
  {
    id: 'infra-ops',
    code: '05',
    title: 'Infrastructure & Operations',
    role: 'Runtime, config & security',
    items: ['Linux', 'Docker', 'Docker Compose', 'Kubernetes', 'Ansible', 'Cloudflare', 'OpenBao'],
  },
  {
    id: 'cloud',
    code: '06',
    title: 'Cloud & Hosting',
    role: 'Public & European cloud',
    items: ['AWS', 'Microsoft Azure', 'Hetzner', 'STACKIT'],
  },
]

const TOTAL_TOOLS = STACK_CATEGORIES.reduce((total, category) => total + category.items.length, 0)

const CERTIFICATIONS = [
  {
    code: '01',
    title: 'Cognigy.AI Certified Specialist',
    focus: 'Enterprise conversational AI architecture & delivery',
  },
  {
    code: '02',
    title: 'Cognigy.AI Developer Course',
    focus: 'Custom integrations, logic flows & backend connectors',
  },
  {
    code: '03',
    title: 'Cognigy.AI Conversation Design',
    focus: 'Dialogue structure, intent disambiguation & UX',
  },
  {
    code: '04',
    title: 'Cognigy.AI Foundation',
    focus: 'Core platform fundamentals & NLU pipelines',
  },
]

export default function SkillsView({ content, path, onOpen }: SkillsViewProps) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  const [activeDomainId, setActiveDomainId] = useState<string>('ai-ml')

  const h2s = parsed.blocks.filter(
    (b): b is Extract<BlockNode, { type: 'heading' }> => b.type === 'heading' && b.level === 2,
  )
  const heroHeadline = h2s[0]

  const introParagraphs = useMemo(() => {
    const out: Array<Extract<BlockNode, { type: 'paragraph' }>> = []
    let seenFirstH2 = false
    for (const b of parsed.blocks) {
      if (b.type === 'heading' && b.level === 2) {
        if (seenFirstH2) break
        seenFirstH2 = true
        continue
      }
      if (seenFirstH2 && b.type === 'hr') break
      if (seenFirstH2 && b.type === 'paragraph') {
        out.push(b)
      }
    }
    return out
  }, [parsed.blocks])

  const activeDomain = CORE_DOMAINS.find((d) => d.id === activeDomainId) ?? CORE_DOMAINS[0]
  const activeToolSet = useMemo(() => new Set(activeDomain.tools), [activeDomain])
  const domainProjects = useMemo(
    () => PROJECTS.filter((p) => activeDomain.projectIds.includes(p.id)),
    [activeDomain],
  )

  return (
    <article className="skills">
      {/* 1 — Split Hero & Stack Telemetry */}
      <header className="skills__header">
        <div className="skills__hero-main">
          {heroHeadline ? (
            <h1 className="skills__headline">
              <Inline nodes={heroHeadline.children} />
            </h1>
          ) : (
            <h1 className="skills__headline">Tools are just parts. The system is the point.</h1>
          )}

          {introParagraphs[0] && (
            <p className="skills__lead">
              <Inline nodes={introParagraphs[0].children} />
            </p>
          )}
          {introParagraphs.slice(1).map((p, i) => (
            <p className="skills__p" key={i}>
              <Inline nodes={p.children} />
            </p>
          ))}
        </div>

        <aside className="skills__dossier" aria-label="Skills overview">
          <dl className="skills__specs">
            <div className="skills__spec">
              <dt>Core areas</dt>
              <dd className="skills__spec-accent">6 connected disciplines</dd>
            </div>
            <div className="skills__spec">
              <dt>Primary code</dt>
              <dd>Python, Rust, SQL, FastAPI</dd>
            </div>
            <div className="skills__spec">
              <dt>Runtime</dt>
              <dd>Linux, Docker, Kubernetes, Ansible</dd>
            </div>
            <div className="skills__spec">
              <dt>Credentials</dt>
              <dd>4 Cognigy.AI certifications</dd>
            </div>
            <div className="skills__spec">
              <dt>Path</dt>
              <dd>
                <code>{toTilde(path)}</code>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      {/* 2 — Interactive 6-Domain Explorer & Capability Matrix */}
      <section className="skills__section" aria-labelledby="skills-domains-title">
        <div className="skills__section-head">
          <h2 className="skills__h2" id="skills-domains-title">
            Six core areas, wired together
          </h2>
          <p className="skills__lede">
            Select any discipline to inspect its capabilities, the tools it highlights in the stack below, and the projects where it runs.
          </p>
        </div>

        <div className="skills__explorer" role="region" aria-label="Core engineering areas">
          <div className="skills__explorer-bar">
            <span className="skills__explorer-tag">domains.matrix // 6 engineering layers</span>
            <span className="skills__explorer-hint">Click a domain to filter capabilities &amp; stack</span>
          </div>

          <div className="skills__tabs" role="tablist" aria-label="Core areas">
            {CORE_DOMAINS.map((domain) => {
              const isSelected = domain.id === activeDomain.id
              return (
                <button
                  key={domain.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`skills__tab${isSelected ? ' is-active' : ''}`}
                  onClick={() => setActiveDomainId(domain.id)}
                >
                  <span className="skills__tab-code">{domain.code}</span>
                  <span className="skills__tab-label">{domain.shortLabel}</span>
                </button>
              )
            })}
          </div>

          <div className="skills__detail" aria-live="polite">
            <div className="skills__detail-main">
              <div className="skills__detail-head">
                <h3 className="skills__detail-title">
                  {activeDomain.code} / {activeDomain.title}
                </h3>
              </div>
              <p className="skills__detail-summary">{activeDomain.summary}</p>

              <ol className="skills__caps-grid" aria-label={`${activeDomain.title} capabilities`}>
                {activeDomain.capabilities.map((cap, idx) => (
                  <li className="skills__cap-cell" key={cap}>
                    <span className="skills__cap-num" aria-hidden="true">
                      0{idx + 1}
                    </span>
                    <span className="skills__cap-text">{cap}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="skills__detail-side">
              <div className="skills__side-block">
                <h4 className="skills__side-heading">Primary tools in this layer</h4>
                <ul className="skills__tool-chips">
                  {activeDomain.tools.map((tool) => (
                    <li key={tool} className="skills__tool-chip">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="skills__side-block">
                <h4 className="skills__side-heading">
                  Applied in case studies ({domainProjects.length})
                </h4>
                <ul className="skills__project-list">
                  {domainProjects.map((project) => (
                    <li key={project.id}>
                      <button
                        type="button"
                        className="skills__project-btn"
                        onClick={() => onOpen(project.target)}
                      >
                        <span className="skills__project-name">{project.title}</span>
                        <span className="skills__project-open">Open</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Technology Stack Specification Ledger */}
      <section className="skills__section" aria-labelledby="skills-stack-title">
        <Reveal>
          <div className="skills__section-head skills__section-head--split">
            <div>
              <h2 className="skills__h2" id="skills-stack-title">
                Technology stack
              </h2>
              <p className="skills__lede">
                Languages, databases, orchestrators and infrastructure I use to build and run systems. Tools used in <strong>{activeDomain.shortLabel}</strong> are highlighted.
              </p>
            </div>
            <span className="skills__stack-count">
              {TOTAL_TOOLS} tools across {STACK_CATEGORIES.length} layers
            </span>
          </div>

          <div className="skills__ledger">
            {STACK_CATEGORIES.map((cat) => (
              <div className="skills__ledger-row" key={cat.id}>
                <div className="skills__ledger-meta">
                  <span className="skills__ledger-code">{cat.code}</span>
                  <div>
                    <h3 className="skills__ledger-title">{cat.title}</h3>
                    <p className="skills__ledger-role">{cat.role}</p>
                  </div>
                </div>

                <ul className="skills__ledger-items" aria-label={cat.title}>
                  {cat.items.map((item) => {
                    const isHighlighted = activeToolSet.has(item)
                    return (
                      <li
                        key={item}
                        className={`skills__stack-item${isHighlighted ? ' is-highlighted' : ''}`}
                      >
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4 — Certifications Matrix */}
      <section className="skills__section" aria-labelledby="skills-certs-title">
        <Reveal>
          <div className="skills__section-head skills__section-head--split">
            <div>
              <h2 className="skills__h2" id="skills-certs-title">
                Certifications
              </h2>
              <p className="skills__lede">
                Official Cognigy.AI credentials applied in enterprise conversational AI and AWS Kubernetes deployments.
              </p>
            </div>
            <div className="skills__cert-links">
              <button
                type="button"
                className="skills__cert-link"
                onClick={() => onOpen('/home/mao/career/projects/ai/pharma-faq-assistant.md')}
              >
                Pharma FAQ case study
              </button>
              <button
                type="button"
                className="skills__cert-link"
                onClick={() => onOpen('/home/mao/career/projects/infrastructure/cognigy-aws-deployment.md')}
              >
                Cognigy AWS case study
              </button>
            </div>
          </div>

          <ol className="skills__certs-grid">
            {CERTIFICATIONS.map((cert) => (
              <li className="skills__cert-cell" key={cert.code}>
                <span className="skills__cert-code">{cert.code}</span>
                <h3 className="skills__cert-name">{cert.title}</h3>
                <p className="skills__cert-focus">{cert.focus}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 5 — How I Work (Editorial Colophon + Cross-links) */}
      <section className="skills__section" aria-labelledby="skills-work-title">
        <Reveal>
          <div className="skills__closing">
            <div className="skills__closing-main">
              <h2 className="skills__h2" id="skills-work-title">
                How I work
              </h2>
              <p className="skills__lead">
                I approach engineering problems from a systems perspective.
              </p>
              <p className="skills__p">
                I like understanding how different components fit together, poking at technologies beyond their default settings, and combining them into something practical. My strongest contribution is usually at the seams between disciplines: connecting AI with software, data with infrastructure, and an initial experiment with a system that actually runs.
              </p>
            </div>

            <div className="skills__closing-nav">
              <h3 className="skills__closing-sub">See these tools in practice</h3>
              <div className="skills__closing-links">
                <div className="skills__nav-row">
                  <div className="skills__nav-info">
                    <span className="skills__nav-title">Selected Work</span>
                    <span className="skills__nav-desc">Eight engineering case studies showing the architecture behind each project.</span>
                    <code className="skills__nav-path">~/career/projects/README.md</code>
                  </div>
                  <button
                    type="button"
                    className="skills__nav-btn"
                    onClick={() => onOpen('/home/mao/career/projects/README.md')}
                  >
                    Open projects
                  </button>
                </div>

                <div className="skills__nav-row">
                  <div className="skills__nav-info">
                    <span className="skills__nav-title">Personal AI Lab</span>
                    <span className="skills__nav-desc">Interactive topology of the 20 self-hosted services I run at home.</span>
                    <code className="skills__nav-path">~/about_me/now.md</code>
                  </div>
                  <button
                    type="button"
                    className="skills__nav-btn"
                    onClick={() => onOpen('/home/mao/about_me/now.md')}
                  >
                    Open lab
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  )
}
