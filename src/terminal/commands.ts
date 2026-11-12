import {
  isDir,
  listDir,
  nodeAt,
  readFile,
  resolvePath,
} from './filesystem'

export interface CommandResult {
  kind: 'output' | 'error' | 'clear' | 'intro' | 'open'
  text: string
  cwd: string
  clear?: boolean
  intro?: boolean
  openPath?: string
}

const HELP = [
  'available commands:',
  '  whoami   who is behind this terminal',
  '  ls       list the current directory',
  '  cd       change directory   (cd <dir> | cd .. | cd ~)',
  '  cat      print a file       (cat <file>)',
  '  sh       open a shell file  (sh <file>)',
  '  clear    clear the terminal',
  '  intro    replay the welcome sequence',
  '  help     show this help',
  '',
  'the file tree on the right stays in sync with `cd`.',
].join('\n')

const WHOAMI = [
  'Marc Arias Ortiz.',
  '',
  'AI professional with a data science background (machine learning, NLP, AI R&D).',
  'Runs Arch Linux, self-hosts services, and tinkers with home automation and personal AI agents.',
  '',
  'The rest is still being written — try `ls` or `cat README.md`.',
].join('\n')

export function runCommand(input: string, cwd: string): CommandResult {
  const trimmed = input.trim()
  if (trimmed === '') return { kind: 'output', text: '', cwd }

  const [name = '', ...args] = trimmed.split(/\s+/)
  const arg = args.join(' ')

  switch (name) {
    case 'help':
      return { kind: 'output', text: HELP, cwd }

    case 'whoami':
      return { kind: 'output', text: WHOAMI, cwd }

    case 'clear':
      return { kind: 'output', text: '', cwd, clear: true }

    case 'intro':
      return { kind: 'output', text: '', cwd, intro: true }

    case 'ls': {
      const entries = listDir(cwd)
      if (!entries) return { kind: 'error', text: 'ls: not a directory', cwd }
      const text = [...entries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) =>
          entry.type === 'dir' ? `${entry.label ?? entry.name}/` : entry.label ?? entry.name,
        )
        .join('\n')
      return { kind: 'output', text, cwd }
    }

    case 'cd': {
      const target = resolvePath(cwd, arg)
      if (!isDir(target)) {
        return { kind: 'error', text: `cd: no such directory: ${arg || '(none)'}`, cwd }
      }
      return { kind: 'output', text: '', cwd: target }
    }

    case 'cat': {
      if (arg === '') return { kind: 'error', text: 'cat: usage — cat <file>', cwd }
      const target = resolvePath(cwd, arg)
      if (isDir(target)) {
        return { kind: 'error', text: `cat: ${arg} is a directory`, cwd }
      }
      const content = readFile(target)
      if (content == null) {
        return { kind: 'error', text: `cat: no such file: ${arg}`, cwd }
      }
      return { kind: 'output', text: content, cwd }
    }

    case 'sh': {
      if (arg === '') return { kind: 'error', text: 'sh: usage — sh <file>', cwd }
      const target = resolvePath(cwd, arg)
      if (isDir(target)) {
        return { kind: 'error', text: `sh: ${arg} is a directory`, cwd }
      }
      const content = readFile(target)
      if (content == null) {
        return { kind: 'error', text: `sh: no such file: ${arg}`, cwd }
      }
      const node = nodeAt(target)
      if (node?.type === 'file' && node.renderAs === 'dashboard') {
        return { kind: 'open', text: '', cwd, openPath: target }
      }
      return { kind: 'output', text: content, cwd }
    }

    default:
      return { kind: 'error', text: `${name}: command not found — try \`help\``, cwd }
  }
}
