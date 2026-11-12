import { lazy, Suspense, useMemo } from 'react'
import type { OpenFile } from '../terminal/filesystem'
import { getKind } from '../terminal/markdown'
import MarkdownView from './MarkdownView'
import WhoamiProfile from './WhoamiProfile'
import CareerView from './CareerView'
import ExperienceView from './ExperienceView'
import SkillsView from './SkillsView'
import ResumeView from './ResumeView'
import HomelabDashboard from './HomelabDashboard'

const LabView = lazy(() => import('./LabView'))

interface EditorProps {
  files: OpenFile[]
  activePath: string | null
  onSelect: (path: string) => void
  onClose: (path: string) => void
  onOpen: (path: string) => void
}

export default function Editor({ files, activePath, onSelect, onClose, onOpen }: EditorProps) {
  const active = files.find((file) => file.path === activePath)

  const kind = useMemo(() => (active ? getKind(active.content) : null), [active])
  const isWhoami = kind === 'whoami'
  const isLab = kind === 'lab'
  const isCareer = kind === 'career'
  const isExperience = kind === 'experience'
  const isSkills = kind === 'skills'
  const isResume = kind === 'resume'
  const isDashboard = active ? active.renderAs === 'dashboard' : false
  const isMarkdown = active ? active.name.endsWith('.md') : false

  return (
    <section className="editor" aria-label="Editor">
      <div className="editor__tabs" role="tablist" aria-label="Open files">
        {files.map((file) => (
          <div
            key={file.path}
            role="tab"
            tabIndex={0}
            aria-selected={file.path === activePath}
            className={`editor__tab${file.path === activePath ? ' editor__tab--active' : ''}`}
            onClick={() => onSelect(file.path)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(file.path)
              }
            }}
          >
            <span className="editor__tab-name">{file.name}</span>
            <button
              type="button"
              className="editor__tab-close"
              aria-label={`Close ${file.name}`}
              onClick={(event) => {
                event.stopPropagation()
                onClose(file.path)
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="editor__body">
        {active ? (
          <>
            <div className="editor__path" aria-label="File path">
              {active.path}
            </div>
            {isWhoami ? (
              <WhoamiProfile content={active.content} path={active.path} />
            ) : isLab ? (
              <Suspense fallback={<div className="editor__empty">Loading the lab…</div>}>
                <LabView content={active.content} />
              </Suspense>
            ) : isCareer ? (
              <CareerView content={active.content} path={active.path} onOpen={onOpen} />
            ) : isExperience ? (
              <ExperienceView content={active.content} path={active.path} onOpen={onOpen} />
            ) : isSkills ? (
              <SkillsView content={active.content} path={active.path} onOpen={onOpen} />
            ) : isResume ? (
              <ResumeView onOpen={onOpen} />
            ) : isDashboard ? (
              <HomelabDashboard />
            ) : isMarkdown ? (
              <MarkdownView content={active.content} />
            ) : (
              <div className="editor__content" role="region" aria-label={`Content of ${active.name}`}>
                {active.content.split('\n').map((line, index) => (
                  <div className="editor__line" key={index}>
                    <span className="editor__lineno" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="editor__text">{line === '' ? '\u00a0' : line}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="editor__empty">No file open — pick one from the explorer.</div>
        )}
      </div>
    </section>
  )
}
