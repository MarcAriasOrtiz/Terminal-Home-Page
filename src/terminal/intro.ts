// Content for the first-visit intro shown in the terminal.
//
// Kept apart from the rendering component so the copy and banners can change
// without touching the animation logic.

import slantBanner from './banners/slant.txt?raw'
import smallBanner from './banners/small.txt?raw'

export interface Segment {
  text: string
  className: string
}

// Width of a log line, so the status column lines up.
const LOG_WIDTH = 36

function logLine(action: string, target: string): Segment[] {
  const dots = Math.max(3, LOG_WIDTH - action.length - target.length - 3)
  return [
    { text: `${action} `, className: 'intro__log-action' },
    { text: target, className: 'intro__log-target' },
    { text: ` ${'·'.repeat(dots)} `, className: 'intro__log-dots' },
    { text: 'ok', className: 'intro__log-status' },
  ]
}

export const INTRO_LOG: Segment[][] = [
  logLine('booting', 'mao.home'),
  logLine('mounting', '/home/mao'),
  logLine('loading', 'career/'),
  logLine('loading', 'projects/'),
  logLine('starting', 'terminal'),
]

export const INTRO_BANNER = {
  wide: slantBanner.trimEnd().split('\n'),
  narrow: smallBanner.trimEnd().split('\n'),
}

export const INTRO_WELCOME = 'Welcome to mao.home, the home page of an AI R&D engineer.'

export const INTRO_HINT = {
  wide: 'Start with `help` to see the commands, or open the explorer to browse the folders.',
  narrow: 'Start with `help` to see the commands, or open the sidebar to browse the folders.',
}

export const INTRO_SHORTCUTS = [
  { command: 'cd about_me', label: 'about_me', description: 'who I am and what I am working on' },
  { command: 'cd career', label: 'career', description: 'experience, projects and CV' },
  { command: 'cd contact', label: 'contact', description: 'how to reach me' },
]

// Milliseconds. The loading phase is slower on purpose; the welcome moves quickly.
export const INTRO_TIMING = {
  logChar: 18,
  logPause: 300,
  beforeBanner: 700,
  afterBanner: 450,
  welcomeChar: 5,
  hintChar: 9,
  textPause: 150,
}
