import { useMemo, useState } from 'react'
import { parseMarkdown, type BlockNode } from '../terminal/markdown'
import { toTilde } from '../terminal/filesystem'
import { Inline } from './MarkdownView'
import Reveal from './career/Reveal'
import { PROJECTS } from '../career/data'

interface ExperienceViewProps {
  content: string
  path: string
  onOpen: (path: string) => void
}

interface EvolutionStage {
  id: string
  step: string
  title: string
  phase: string
  summary: string
  focus: string[]
  projectIds: string[]
}

const DRIVING01_STAGES: EvolutionStage[] = [
  {
    id: 'data-science',
    step: '01',
    title: 'Data Science',
    phase: 'Foundation',
    summary:
      'Built the analytical foundation: predictive models, ETL pipelines, relational database schemas and operational dashboards that turned raw company data into something teams could act on.',
    focus: ['Predictive modelling', 'SQL & ETL pipelines', 'Analytical dashboards'],
    projectIds: ['product-catalogue-data-platform', 'ventilation-decision-support'],
  },
  {
    id: 'nlp',
    step: '02',
    title: 'NLP Development',
    phase: 'Language & Dialogue',
    summary:
      'Built conversational AI and natural language solutions, particularly for pharmaceutical and enterprise clients, focusing on reliable intent detection and controlled access to company data.',
    focus: ['Conversational AI', 'Intent & question detection', 'Cognigy & Kubernetes'],
    projectIds: ['pharma-faq-assistant', 'cognigy-aws-deployment'],
  },
  {
    id: 'ml-leadership',
    step: '03',
    title: 'ML Leadership',
    phase: 'Direction & Delivery',
    summary:
      'Led machine learning and statistical initiatives end to end, combining hands-on model development with technical direction and helping the team move prototypes into production workflows.',
    focus: ['Technical direction', 'End-to-end ML delivery', 'System architecture'],
    projectIds: ['ventilation-decision-support', 'fine-tuned-incident-labeling'],
  },
  {
    id: 'ai-rd',
    step: '04',
    title: 'R&D / AI Engineering',
    phase: 'Current focus',
    summary:
      'Designing and building practical AI systems, private AI infrastructure and agentic workflows: fine-tuning small and medium language models, setting up GraphRAG retrieval, and deploying the containers and orchestration that keep them running.',
    focus: ['Small-model fine-tuning', 'GraphRAG & knowledge agents', 'Private AI infrastructure'],
    projectIds: [
      'knowledge-navigation',
      'fine-tuned-incident-labeling',
      'agentic-factory',
      'server-monitoring',
    ],
  },
]

const DRIVING01_AREAS = [
  'Applied AI, LLM fine-tuning & multi-agent systems',
  'Knowledge retrieval (RAG & GraphRAG)',
  'Machine learning & statistical modelling',
  'Data engineering, SQL & ETL pipelines',
  'Backend services & API integration',
  'Linux, Docker, Kubernetes & infrastructure automation',
]

const EARLIER_EXPERIENCE = [
  {
    id: 'vidacaixa',
    company: 'VidaCaixa',
    role: 'Database & Data Analysis Intern',
    period: 'May 2021 to July 2021',
    location: 'Barcelona, Spain',
    summary:
      'Worked on database management, schema migrations, statistical analysis and reporting dashboards. It was my first look at how large organisations manage data pipelines and analytical workflows day to day.',
    highlights: ['Database management & migrations', 'Statistical analysis', 'Reporting & data visualisation'],
  },
  {
    id: 'intercruises',
    company: 'Intercruises Shoreside & Port Services',
    role: 'Operations Coordinator',
    period: 'April 2016 to March 2020',
    location: 'Barcelona, Spain',
    summary:
      'Before moving into data and engineering, I spent four years coordinating port turnaround operations, passenger logistics and on-site teams under tight schedules. It had nothing to do with machine learning on paper, but it taught me how to stay calm when a live operation goes sideways, coordinate moving parts, and make practical decisions under pressure.',
    highlights: ['Turnaround logistics', 'Team supervision', 'Real-time operational planning'],
  },
]

export default function ExperienceView({ content, path, onOpen }: ExperienceViewProps) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  const [activeStageId, setActiveStageId] = useState<string>('ai-rd')

  const h2s = parsed.blocks.filter(
    (b): b is Extract<BlockNode, { type: 'heading' }> => b.type === 'heading' && b.level === 2,
  )
  const heroHeadline = h2s[0]

  // Grab the two intro paragraphs between the first h2 and the second h2
  const introParagraphs = useMemo(() => {
    const out: Array<Extract<BlockNode, { type: 'paragraph' }>> = []
    let seenFirstH2 = false
    for (const b of parsed.blocks) {
      if (b.type === 'heading' && b.level === 2) {
        if (seenFirstH2) break
        seenFirstH2 = true
        continue
      }
      if (seenFirstH2 && b.type === 'paragraph') {
        out.push(b)
      }
    }
    return out
  }, [parsed.blocks])

  const activeStage = DRIVING01_STAGES.find((s) => s.id === activeStageId) ?? DRIVING01_STAGES[3]
  const stageProjects = useMemo(
    () => PROJECTS.filter((p) => activeStage.projectIds.includes(p.id)),
    [activeStage],
  )

  return (
    <article className="exp">
      {/* 1 — Split Hero & Career Telemetry */}
      <header className="exp__header">
        <div className="exp__hero-main">
          {heroHeadline ? (
            <h1 className="exp__headline">
              <Inline nodes={heroHeadline.children} />
            </h1>
          ) : (
            <h1 className="exp__headline">From building single models to wiring the whole system.</h1>
          )}

          {introParagraphs[0] && (
            <p className="exp__lead">
              <Inline nodes={introParagraphs[0].children} />
            </p>
          )}
          {introParagraphs.slice(1).map((p, i) => (
            <p className="exp__p" key={i}>
              <Inline nodes={p.children} />
            </p>
          ))}
        </div>

        <aside className="exp__dossier" aria-label="Experience overview">
          <dl className="exp__specs">
            <div className="exp__spec">
              <dt>Current</dt>
              <dd className="exp__spec-accent">AI R&amp;D Engineer · Driving01</dd>
            </div>
            <div className="exp__spec">
              <dt>AI &amp; Data</dt>
              <dd>2021 to Present</dd>
            </div>
            <div className="exp__spec">
              <dt>Operations</dt>
              <dd>2016 to 2020</dd>
            </div>
            <div className="exp__spec">
              <dt>Location</dt>
              <dd>Barcelona, Spain</dd>
            </div>
            <div className="exp__spec">
              <dt>Path</dt>
              <dd>
                <code>{toTilde(path)}</code>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      {/* 2 — Featured Tenure: Driving01 & 4-Stage Role Progression */}
      <section className="exp__section" aria-labelledby="exp-driving01-title">
        <div className="exp__tenure-head">
          <div className="exp__tenure-title-group">
            <h2 className="exp__h2" id="exp-driving01-title">
              Driving01
            </h2>
            <p className="exp__tenure-role">Machine Learning, AI &amp; Systems R&amp;D</p>
          </div>
          <div className="exp__tenure-meta">
            <span className="exp__tenure-period">August 2021 to Present</span>
            <span className="exp__tenure-place">Barcelona, Spain</span>
          </div>
        </div>

        <p className="exp__tenure-intro">
          Most of my technical growth has happened at Driving01. Rather than staying in a single lane, my role evolved alongside the problems we needed to solve, starting with classical data science and analytics and expanding into full-stack AI engineering and private infrastructure.
        </p>

        {/* Interactive Progression Track */}
        <div className="exp__evolution" role="region" aria-label="Role evolution at Driving01">
          <div className="exp__track-bar">
            <span className="exp__track-title">role.progression // 4 stages inside Driving01</span>
            <span className="exp__track-hint">Select a stage to inspect matching case studies</span>
          </div>

          <div className="exp__stages" role="tablist" aria-label="Evolution stages at Driving01">
            {DRIVING01_STAGES.map((stage) => {
              const isSelected = stage.id === activeStage.id
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`exp__stage-btn${isSelected ? ' is-active' : ''}`}
                  onClick={() => setActiveStageId(stage.id)}
                >
                  <div className="exp__stage-top">
                    <span className="exp__stage-num">{stage.step}</span>
                    <span className="exp__stage-phase">{stage.phase}</span>
                  </div>
                  <span className="exp__stage-name">{stage.title}</span>
                </button>
              )
            })}
          </div>

          <div className="exp__stage-detail" aria-live="polite">
            <div className="exp__stage-main">
              <div className="exp__stage-head">
                <h3 className="exp__stage-heading">
                  {activeStage.step} / {activeStage.title}
                </h3>
                <code className="exp__stage-badge">{activeStage.phase}</code>
              </div>
              <p className="exp__stage-desc">{activeStage.summary}</p>
              <ul className="exp__stage-tags" aria-label="Stage focus areas">
                {activeStage.focus.map((tag) => (
                  <li key={tag} className="exp__stage-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="exp__stage-projects">
              <h4 className="exp__projects-title">
                Related case studies ({stageProjects.length})
              </h4>
              <ul className="exp__project-list">
                {stageProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      className="exp__project-btn"
                      onClick={() => onOpen(project.target)}
                    >
                      <span className="exp__project-name">{project.title}</span>
                      <span className="exp__project-action">Open case study</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* All 4 stages at a glance + Areas of work */}
        <div className="exp__matrix">
          <div className="exp__matrix-head">
            <h3 className="exp__matrix-title">Core areas of work at Driving01</h3>
          </div>
          <ul className="exp__areas">
            {DRIVING01_AREAS.map((area, idx) => (
              <li className="exp__area" key={area}>
                <span className="exp__area-num" aria-hidden="true">
                  0{idx + 1}
                </span>
                <span className="exp__area-text">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — Earlier Experience Ledger */}
      <section className="exp__section" aria-labelledby="exp-earlier-title">
        <Reveal>
          <div className="exp__section-head">
            <h2 className="exp__h2" id="exp-earlier-title">
              Earlier roles &amp; operational foundation
            </h2>
            <p className="exp__lede">
              First steps in enterprise data pipelines, preceded by four years coordinating live port operations.
            </p>
          </div>

          <ol className="exp__ledger">
            {EARLIER_EXPERIENCE.map((item) => (
              <li className="exp__ledger-row" key={item.id}>
                <div className="exp__ledger-meta">
                  <span className="exp__ledger-period">{item.period}</span>
                  <span className="exp__ledger-loc">{item.location}</span>
                </div>

                <div className="exp__ledger-body">
                  <div className="exp__ledger-head">
                    <h3 className="exp__ledger-company">{item.company}</h3>
                    <span className="exp__ledger-role">{item.role}</span>
                  </div>
                  <p className="exp__p">{item.summary}</p>
                  <ul className="exp__ledger-tags" aria-label={`${item.company} focus`}>
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 4 — Beyond the Job Titles (Editorial Colophon + Navigation) */}
      <section className="exp__section" aria-labelledby="exp-beyond-title">
        <Reveal>
          <div className="exp__closing">
            <div className="exp__closing-main">
              <h2 className="exp__h2" id="exp-beyond-title">
                Beyond the job titles
              </h2>
              <p className="exp__lead">
                My path has never stayed inside a single technical box.
              </p>
              <p className="exp__p">
                Moving between operations, data, machine learning, software and infrastructure shaped how I approach engineering today: understand the whole system first, figure out how the pieces talk to each other, and build something reliable enough that you do not have to babysit it.
              </p>
            </div>

            <div className="exp__closing-nav">
              <h3 className="exp__closing-sub">Continue exploring</h3>
              <div className="exp__closing-links">
                <div className="exp__nav-card">
                  <div className="exp__nav-info">
                    <span className="exp__nav-title">Selected Work</span>
                    <span className="exp__nav-desc">Eight engineering case studies across AI, data and infrastructure.</span>
                    <code className="exp__nav-path">~/career/projects/README.md</code>
                  </div>
                  <button
                    type="button"
                    className="exp__nav-btn"
                    onClick={() => onOpen('/home/mao/career/projects/README.md')}
                  >
                    Open projects
                  </button>
                </div>
                <div className="exp__nav-card">
                  <div className="exp__nav-info">
                    <span className="exp__nav-title">Visual Profile</span>
                    <span className="exp__nav-desc">Interactive CV with education, certifications and system confluence.</span>
                    <code className="exp__nav-path">~/career/profile.md</code>
                  </div>
                  <button
                    type="button"
                    className="exp__nav-btn"
                    onClick={() => onOpen('/home/mao/career/profile.md')}
                  >
                    Open profile
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
