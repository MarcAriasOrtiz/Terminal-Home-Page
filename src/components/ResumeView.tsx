import { useEffect, useState } from 'react'
import {
  CERTIFICATIONS,
  CONTACT_PATH,
  CV_PATH,
  DRIVING01,
  EARLIER_ROLES,
  EDUCATION,
  EXPERTISE,
  LANGUAGES,
  LINKEDIN,
  PROFILE,
  SECTIONS,
} from '../career/resume'
import Reveal from './career/Reveal'
import Confluence from './resume/Confluence'
import '../styles/resume.css'

interface ResumeViewProps {
  onOpen: (path: string) => void
}

export default function ResumeView({ onOpen }: ResumeViewProps) {
  const [current, setCurrent] = useState(SECTIONS[0].id)

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => node != null,
    )
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setCurrent(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4] },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function goTo(id: string) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  const leadProfile = PROFILE[0]
  const restProfile = PROFILE.slice(1)

  return (
    <article className="resume">
      <nav className="resume__nav" aria-label="CV sections">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`resume__nav-link${current === section.id ? ' is-current' : ''}`}
            aria-current={current === section.id ? 'true' : undefined}
            onClick={() => goTo(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <header className="resume__hero" id="resume-hero">
        <div className="resume__hero-top">
          <h1 className="resume__name">Marc Arias Ortiz</h1>
          <div className="resume__hero-meta">
            <span className="resume__role">AI R&amp;D Engineer / Cloud &amp; Infrastructure</span>
            <span className="resume__location">Barcelona, Spain</span>
          </div>
        </div>

        <div className="resume__hero-grid">
          <div className="resume__hero-lead">
            {leadProfile && <p className="resume__lead-p">{leadProfile}</p>}
            <div className="resume__actions">
              <a className="resume__action resume__action--primary" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <button type="button" className="resume__action" onClick={() => onOpen(CONTACT_PATH)}>
                Contact
              </button>
              <button type="button" className="resume__action" onClick={() => window.print()}>
                Save as PDF
              </button>
              <button type="button" className="resume__action resume__action--quiet" onClick={() => onOpen(CV_PATH)}>
                Written CV
              </button>
            </div>
          </div>

          <div className="resume__summary">
            {restProfile.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </header>

      <section className="resume__section" id="resume-landscape" aria-labelledby="resume-landscape-title">
        <Reveal>
          <div className="resume__section-head">
            <h2 className="resume__h2" id="resume-landscape-title">
              <span className="resume__index" aria-hidden="true">01</span>
              Five streams merging into one working system.
            </h2>
          </div>
          <Confluence />
        </Reveal>
      </section>

      <section className="resume__section" id="resume-experience" aria-labelledby="resume-experience-title">
        <Reveal>
          <div className="resume__section-head">
            <h2 className="resume__h2" id="resume-experience-title">
              <span className="resume__index" aria-hidden="true">02</span>
              Professional experience
            </h2>
          </div>
          <ol className="resume__timeline">
            <li className="resume__role-block resume__role-block--current">
              <div className="resume__role-meta">
                <span className="resume__period">{DRIVING01.period}</span>
                <span className="resume__place">{DRIVING01.place}</span>
              </div>
              <div className="resume__role-body">
                <div className="resume__role-head">
                  <h3 className="resume__company">{DRIVING01.company}</h3>
                  <span className="resume__title">{DRIVING01.title}</span>
                </div>
                <p className="resume__role-summary">{DRIVING01.summary}</p>
                <div className="resume__duties">
                  {DRIVING01.current.map((group) => (
                    <div className="resume__duty-group" key={group.title}>
                      <h4>{group.title}</h4>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="resume__earlier">
                  <h4>{DRIVING01.earlier.title}</h4>
                  <ul>
                    {DRIVING01.earlier.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {EARLIER_ROLES.map((role) => (
              <li className="resume__role-block" key={role.company}>
                <div className="resume__role-meta">
                  <span className="resume__period">{role.period}</span>
                  <span className="resume__place">{role.place}</span>
                </div>
                <div className="resume__role-body">
                  <div className="resume__role-head">
                    <h3 className="resume__company">{role.company}</h3>
                    <span className="resume__title">{role.title}</span>
                  </div>
                  <ul>
                    {role.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="resume__section" id="resume-expertise" aria-labelledby="resume-expertise-title">
        <Reveal>
          <div className="resume__section-head">
            <h2 className="resume__h2" id="resume-expertise-title">
              <span className="resume__index" aria-hidden="true">03</span>
              Technical expertise
            </h2>
          </div>
          <dl className="resume__expertise">
            {EXPERTISE.map((group) => (
              <div className="resume__expertise-row" key={group.title}>
                <dt className="resume__expertise-domain">{group.title}</dt>
                <dd className="resume__expertise-items">
                  <ul className="resume__tags">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="resume__section" id="resume-education" aria-labelledby="resume-education-title">
        <Reveal>
          <div className="resume__section-head">
            <h2 className="resume__h2" id="resume-education-title">
              <span className="resume__index" aria-hidden="true">04</span>
              Education, certifications &amp; languages
            </h2>
          </div>
          <div className="resume__split">
            <div className="resume__panel-col">
              <h3 className="resume__subhead">Education</h3>
              <ul className="resume__edu">
                {EDUCATION.map((item) => (
                  <li key={item.school}>
                    <span className="resume__edu-school">{item.school}</span>
                    <span className="resume__edu-credential">{item.credential}</span>
                    <span className="resume__period">{item.period}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="resume__panel-col">
              <h3 className="resume__subhead">Certifications</h3>
              <ul className="resume__certs">
                {CERTIFICATIONS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="resume__langs-block">
            <h3 className="resume__subhead">Languages</h3>
            <dl className="resume__langs">
              {LANGUAGES.map((language) => (
                <div className="resume__lang" key={language.name}>
                  <dt>{language.name}</dt>
                  <dd>{language.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section className="resume__section resume__close" id="resume-contact" aria-labelledby="resume-contact-title">
        <Reveal>
          <div className="resume__close-box">
            <div>
              <h2 className="resume__h2" id="resume-contact-title">
                <span className="resume__index" aria-hidden="true">05</span>
                Get in touch
              </h2>
              <p className="resume__lede">Based in Barcelona, Spain. Open to talking about AI systems, R&amp;D and infrastructure.</p>
            </div>
            <div className="resume__actions">
              <a className="resume__action resume__action--primary" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <button type="button" className="resume__action" onClick={() => onOpen(CONTACT_PATH)}>
                Contact on this site
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  )
}
