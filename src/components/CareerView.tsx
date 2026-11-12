import { useEffect, useMemo, useRef } from 'react'
import { parseMarkdown } from '../terminal/markdown'
import { toTilde } from '../terminal/filesystem'
import { Inline } from './MarkdownView'
import Reveal from './career/Reveal'
import Constellation from './career/Constellation'
import {
  ROLE,
  DISCIPLINE_LABELS,
  PROJECTS,
  TIMELINE,
  EXPERIENCE_PATH,
  EXPLORE,
} from '../career/data'

interface CareerViewProps {
  content: string
  path: string
  onOpen: (path: string) => void
}

const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured)

const PROJECT_AREAS = [
  { label: 'projects/ai/', count: '4 case studies', target: '/home/mao/career/projects/ai' },
  { label: 'projects/data/', count: '2 case studies', target: '/home/mao/career/projects/data' },
  { label: 'projects/infrastructure/', count: '2 case studies', target: '/home/mao/career/projects/infrastructure' },
]

export default function CareerView({ content, path, onOpen }: CareerViewProps) {
  const parsed = useMemo(() => parseMarkdown(content), [content])
  const blocks = parsed.blocks

  const headings = blocks.filter((b) => b.type === 'heading')
  const headline = headings.filter((b) => b.level === 2)[0]
  const paragraphs = blocks.filter((b) => b.type === 'paragraph')
  const leadParagraph = paragraphs[0]
  const restParagraphs = paragraphs.slice(1)

  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.classList.add('career__hero--entered')
  }, [])

  return (
    <article className="career">
      {/* 1 — Hero */}
      <header className="career__hero" ref={heroRef}>
        <div className="career__hero-top">
          {headline && (
            <h1 className="career__headline">
              <Inline nodes={headline.children} />
            </h1>
          )}
          <div className="career__meta-pill">
            <span className="career__role">{ROLE}</span>
            <code className="career__path">{toTilde(path)}</code>
          </div>
        </div>

        <div className="career__hero-grid">
          <div className="career__hero-lead">
            {leadParagraph && (
              <p className="career__lead-p">
                <Inline nodes={leadParagraph.children} />
              </p>
            )}
            <div className="career__hero-actions">
              <button
                type="button"
                className="career__cta career__cta--primary"
                onClick={() => onOpen('/home/mao/career/profile.md')}
              >
                Open visual CV
              </button>
              <button
                type="button"
                className="career__cta"
                onClick={() => onOpen('/home/mao/career/projects/README.md')}
              >
                Browse all projects
              </button>
            </div>
          </div>

          <div className="career__intro">
            {restParagraphs.map((p, i) => (
              <p className="career__p" key={i}>
                <Inline nodes={p.children} />
              </p>
            ))}
          </div>
        </div>
      </header>

      {/* 2 — Technical landscape */}
      <section className="career__section" aria-labelledby="career-domains">
        <div className="career__section-head">
          <h2 className="career__h2" id="career-domains">
            Five disciplines wired as one loop.
          </h2>
          <p className="career__lede">
            Each layer feeds the next. Select any station in the schematic to see what it does and which projects rely on it.
          </p>
        </div>
        <Constellation onOpen={onOpen} />
      </section>

      {/* 3 — Selected work */}
      <section className="career__section" aria-labelledby="career-projects">
        <Reveal>
          <div className="career__section-head">
            <h2 className="career__h2" id="career-projects">
              Ideas are fun. Systems that stay up are better.
            </h2>
            <p className="career__lede">
              Two featured engineering case studies, plus the rest of the archive organized by domain.
            </p>
          </div>
          <div className="career__projects">
            {FEATURED_PROJECTS.map((project, idx) => (
              <article className="career__project" key={project.id}>
                <div className="career__project-top">
                  <span className="career__project-idx" aria-hidden="true">
                    0{idx + 1}
                  </span>
                  <h3 className="career__project-title">{project.title}</h3>
                </div>
                <p className="career__project-text">{project.summary}</p>
                <div className="career__project-foot">
                  <div className="career__project-disciplines">
                    {project.disciplines.map((d) => (
                      <span className="career__project-discipline" key={d} data-domain={d}>
                        {DISCIPLINE_LABELS[d]}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="career__project-link"
                    onClick={() => onOpen(project.target)}
                  >
                    Read case study
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="career__dirs" role="group" aria-label="Project directories">
            {PROJECT_AREAS.map((area) => (
              <button
                key={area.target}
                type="button"
                className="career__dir"
                onClick={() => onOpen(area.target)}
              >
                <code className="career__dir-name">{area.label}</code>
                <span className="career__dir-count">{area.count}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4 — Professional journey */}
      <section className="career__section" aria-labelledby="career-journey">
        <Reveal>
          <div className="career__section-head career__section-head--split">
            <div>
              <h2 className="career__h2" id="career-journey">
                How I got here.
              </h2>
              <p className="career__lede">
                A steady shift from analytical models to building the whole AI and infrastructure stack.
              </p>
            </div>
            <button
              type="button"
              className="career__project-link"
              onClick={() => onOpen(EXPERIENCE_PATH)}
            >
              Read full experience
            </button>
          </div>

          <ol className="career__timeline">
            {TIMELINE.map((entry) => (
              <li className="career__timeline-entry" key={entry.period}>
                <span className="career__timeline-period">{entry.period}</span>
                <span className="career__timeline-label">{entry.label}</span>
                <span className="career__timeline-desc">{entry.description}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 5 — Explore further */}
      <section className="career__section" aria-labelledby="career-explore">
        <Reveal>
          <div className="career__section-head">
            <h2 className="career__h2" id="career-explore">
              Directory index
            </h2>
            <p className="career__lede">
              Everything inside <code>~/career</code>, ready to open in the editor.
            </p>
          </div>
          <div className="career__index">
            {EXPLORE.map((item) => (
              <button
                type="button"
                key={item.target}
                className="career__index-row"
                onClick={() => onOpen(item.target)}
              >
                <code className="career__index-path">{toTilde(item.target)}</code>
                <span className="career__index-title">{item.label}</span>
                <span className="career__index-desc">{item.description}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </section>
    </article>
  )
}
