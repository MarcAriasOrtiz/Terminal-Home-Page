import { useCallback, useEffect, useState } from 'react'
import Editor from './components/Editor'
import FileExplorer from './components/FileExplorer'
import Terminal from './components/Terminal'
import {
  HOME,
  basename,
  dirname,
  isDir,
  nodeAt,
  readFile,
  type OpenFile,
  type VFile,
} from './terminal/filesystem'

const AUTO_HIDE_MS = 8000

function isWideViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
}

export default function App() {
  const [cwd, setCwd] = useState(HOME)
  const [files, setFiles] = useState<OpenFile[]>([])
  const [activePath, setActivePath] = useState<string | null>(null)
  const [explorerOpen, setExplorerOpen] = useState(isWideViewport)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [lastActivity, setLastActivity] = useState(0)

  const hasDocument = files.length > 0
  const bumpActivity = useCallback(() => setLastActivity(Date.now()), [])

  // Opening the first document moves into State B: hide the terminal.
  useEffect(() => {
    if (hasDocument) setTerminalOpen(false)
  }, [hasDocument])

  // Auto-hide the floating terminal after inactivity (documents only).
  useEffect(() => {
    if (!hasDocument || !terminalOpen || inputFocused) return
    const timeout = setTimeout(() => setTerminalOpen(false), AUTO_HIDE_MS)
    return () => clearTimeout(timeout)
  }, [hasDocument, terminalOpen, inputFocused, lastActivity])

  function openFile(path: string) {
    const content = readFile(path)
    if (content == null) return
    const node = nodeAt(path)
    const renderAs = node?.type === 'file' ? (node as VFile).renderAs : undefined
    setFiles((prev) =>
      prev.some((file) => file.path === path)
        ? prev
        : [...prev, { path, name: basename(path), content, renderAs }],
    )
    setActivePath(path)
  }

  function handleSelect(path: string) {
    if (isDir(path)) {
      setCwd(path)
    } else {
      openFile(path)
      setCwd(dirname(path))
    }
  }

  function closeFile(path: string) {
    const next = files.filter((file) => file.path !== path)
    setFiles(next)
    if (activePath === path) setActivePath(next[0]?.path ?? null)
  }

  return (
    <div className="workbench">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo">mao.home</span>
          <span className="topbar__version">v0.1.0</span>
        </div>
        <div className="topbar__controls">
          <button
            type="button"
            className={`topbar__toggle${explorerOpen ? ' topbar__toggle--active' : ''}`}
            aria-pressed={explorerOpen}
            onClick={() => setExplorerOpen((v) => !v)}
          >
            explorer
          </button>
          <span className="topbar__status" aria-hidden="true">
            <span className="status-dot" />
            online
          </span>
        </div>
      </header>

      <div className="workbench__main">
        <div className="main-area">
          {hasDocument && (
            <Editor
              files={files}
              activePath={activePath}
              onSelect={setActivePath}
              onClose={closeFile}
              onOpen={handleSelect}
            />
          )}
          <Terminal
            cwd={cwd}
            floating={hasDocument}
            open={hasDocument ? terminalOpen : true}
            onNavigate={setCwd}
            onClose={() => setTerminalOpen(false)}
            onOpenFile={openFile}
            onActivity={bumpActivity}
            onFocusChange={setInputFocused}
          />
          {hasDocument && !terminalOpen && (
            <button
              type="button"
              className="terminal-fab"
              onClick={() => setTerminalOpen(true)}
              aria-label="Open terminal"
            >
              <span className="terminal-fab__glyph" aria-hidden="true">
                &gt;_
              </span>
              terminal
            </button>
          )}
        </div>
        <FileExplorer
          cwd={cwd}
          open={explorerOpen}
          onSelect={handleSelect}
          onClose={() => setExplorerOpen(false)}
        />
      </div>
    </div>
  )
}
