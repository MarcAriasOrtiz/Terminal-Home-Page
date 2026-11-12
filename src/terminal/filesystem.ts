import whoamiMarkdown from '../../content/about_me/whoami.md?raw'
import nowMarkdown from '../../content/about_me/now.md?raw'
import careerReadme from '../../content/career/README.md?raw'
import careerExperience from '../../content/career/experience/README.md?raw'
import careerProjects from '../../content/career/projects/README.md?raw'
import aiReadme from '../../content/career/projects/ai/README.md?raw'
import agenticFactory from '../../content/career/projects/ai/agentic-software-factory.md?raw'
import graphragAgent from '../../content/career/projects/ai/graphrag-knowledge-agent.md?raw'
import fineTunedLabeling from '../../content/career/projects/ai/fine-tuned-incident-labeling.md?raw'
import pharmaFaqAssistant from '../../content/career/projects/ai/pharma-faq-assistant.md?raw'
import dataReadme from '../../content/career/projects/data/README.md?raw'
import productCatalogue from '../../content/career/projects/data/product-catalogue-data-platform.md?raw'
import ventilationPilot from '../../content/career/projects/data/ventilation-decision-support-pilot.md?raw'
import infrastructureReadme from '../../content/career/projects/infrastructure/README.md?raw'
import serverMonitoring from '../../content/career/projects/infrastructure/server-monitoring-ansible.md?raw'
import cognigyDeployment from '../../content/career/projects/infrastructure/cognigy-aws-deployment.md?raw'
import careerSkills from '../../content/career/skills-certifications/README.md?raw'
import careerCv from '../../content/career/cv.md?raw'
import careerProfile from '../../content/career/profile.md?raw'

export const HOME = '/home/mao'
export const README_PATH = '/home/mao/README.md'
export const WHOAMI_PATH = '/home/mao/about_me/whoami.md'

export interface VFile {
  type: 'file'
  name: string
  /** Optional display name shown in navigation instead of `name`. */
  label?: string
  content: string
  /** When set, the Editor renders a dedicated component instead of markdown. */
  renderAs?: 'dashboard'
}

export interface VDir {
  type: 'dir'
  name: string
  /** Optional display name shown in navigation instead of `name`. */
  label?: string
  children: VNode[]
}

export type VNode = VFile | VDir

export interface OpenFile {
  path: string
  name: string
  content: string
  renderAs?: 'dashboard'
}

const README: VFile = {
  type: 'file',
  name: 'README.md',
  content: [
    '# mao.home',
    '',
    'Welcome to /home/mao — the personal homepage of Marc Arias Ortiz.',
    '',
    'Pick a file from the explorer on the right, or use the terminal below.',
    'Try `help` to see the available commands.',
  ].join('\n'),
}

export const ROOT: VDir = {
  type: 'dir',
  name: 'mao',
  children: [
    README,
    {
      type: 'dir',
      name: 'about_me',
      children: [
        {
          type: 'file',
          name: 'whoami.md',
          content: whoamiMarkdown,
        },
        {
          type: 'file',
          name: 'now.md',
          content: nowMarkdown,
        },
      ],
    },
    {
      type: 'dir',
      name: 'career',
      children: [
        {
          type: 'file',
          name: 'README.md',
          label: 'Overview',
          content: careerReadme,
        },
        {
          type: 'dir',
          name: 'experience',
          label: 'Experience',
          children: [
            {
              type: 'file',
              name: 'README.md',
              content: careerExperience,
            },
          ],
        },
        {
          type: 'dir',
          name: 'projects',
          label: 'Selected Work',
          children: [
            {
              type: 'file',
              name: 'README.md',
              content: careerProjects,
            },
            {
              type: 'dir',
              name: 'ai',
              label: 'AI',
              children: [
                { type: 'file', name: 'README.md', content: aiReadme },
                {
                  type: 'file',
                  name: 'graphrag-knowledge-agent.md',
                  label: 'GraphRAG Knowledge Agent',
                  content: graphragAgent,
                },
                {
                  type: 'file',
                  name: 'fine-tuned-incident-labeling.md',
                  label: 'Fine-tuned Incident Labeling',
                  content: fineTunedLabeling,
                },
                {
                  type: 'file',
                  name: 'agentic-software-factory.md',
                  label: 'Agentic Software Factory',
                  content: agenticFactory,
                },
                {
                  type: 'file',
                  name: 'pharma-faq-assistant.md',
                  label: 'Pharmaceutical FAQ Assistant',
                  content: pharmaFaqAssistant,
                },
              ],
            },
            {
              type: 'dir',
              name: 'data',
              label: 'Data',
              children: [
                { type: 'file', name: 'README.md', content: dataReadme },
                {
                  type: 'file',
                  name: 'product-catalogue-data-platform.md',
                  label: 'Product Catalogue Data Platform',
                  content: productCatalogue,
                },
                {
                  type: 'file',
                  name: 'ventilation-decision-support-pilot.md',
                  label: 'Ventilation Decision Support Pilot',
                  content: ventilationPilot,
                },
              ],
            },
            {
              type: 'dir',
              name: 'infrastructure',
              label: 'Infrastructure',
              children: [
                { type: 'file', name: 'README.md', content: infrastructureReadme },
                {
                  type: 'file',
                  name: 'server-monitoring-ansible.md',
                  label: 'Server Monitoring with Ansible',
                  content: serverMonitoring,
                },
                {
                  type: 'file',
                  name: 'cognigy-aws-deployment.md',
                  label: 'Cognigy Platform Deployment on AWS',
                  content: cognigyDeployment,
                },
              ],
            },
          ],
        },
        {
          type: 'dir',
          name: 'skills-certifications',
          label: 'Expertise',
          children: [
            {
              type: 'file',
              name: 'README.md',
              content: careerSkills,
            },
          ],
        },
        {
          type: 'file',
          name: 'cv.md',
          label: 'Resume',
          content: careerCv,
        },
        {
          type: 'file',
          name: 'profile.md',
          label: 'Profile',
          content: careerProfile,
        },
      ],
    },
    {
      type: 'dir',
      name: 'stack',
      children: [
        {
          type: 'file',
          name: 'tools.md',
          content: ['# Stack', '', 'Tools and technologies — coming soon.'].join('\n'),
        },
      ],
    },
    {
      type: 'dir',
      name: 'homelab',
      children: [
        {
          type: 'file',
          name: 'setup.md',
          content: ['# Homelab', '', 'Self-hosted services and hardware notes — coming soon.'].join('\n'),
        },
        {
          type: 'file',
          name: 'control.sh',
          renderAs: 'dashboard',
          content: [
            '#!/bin/sh',
            '# mao.home // homelab control dashboard',
            '#',
            '# Open the live telemetry view:',
            '#   $ sh control.sh',
            '#   (or click control.sh in the file explorer)',
            '',
            '# Streams container and host metrics from mao-msi.',
          ].join('\n'),
        },
      ],
    },
    {
      type: 'dir',
      name: 'smart-home',
      children: [
        {
          type: 'file',
          name: 'setup.md',
          content: ['# Smart home', '', 'Home automation — coming soon.'].join('\n'),
        },
      ],
    },
    {
      type: 'dir',
      name: 'contact',
      children: [
        {
          type: 'file',
          name: 'links.md',
          content: ['# Contact', '', 'Links and contact details — coming soon.'].join('\n'),
        },
      ],
    },
  ],
}

export function nodeAt(path: string): VNode | null {
  if (path === HOME) return ROOT
  if (!path.startsWith(HOME + '/')) return null
  let node: VNode = ROOT
  for (const segment of path.slice(HOME.length + 1).split('/')) {
    if (node.type !== 'dir') return null
    const child: VNode | undefined = node.children.find((c) => c.name === segment)
    if (!child) return null
    node = child
  }
  return node
}

export function isDir(path: string): boolean {
  const node = nodeAt(path)
  return node != null && node.type === 'dir'
}

export function listDir(path: string): VNode[] | null {
  const node = nodeAt(path)
  return node != null && node.type === 'dir' ? node.children : null
}

export function readFile(path: string): string | null {
  const node = nodeAt(path)
  return node != null && node.type === 'file' ? node.content : null
}

export function basename(path: string): string {
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

export function dirname(path: string): string {
  const idx = path.lastIndexOf('/')
  return idx <= 0 ? HOME : path.slice(0, idx)
}

/**
 * Resolve a user-supplied path (relative, absolute, `~`, `..`) against the
 * current directory. Paths are clamped to the virtual HOME; anything above it
 * resolves back to HOME. Never touches the real filesystem.
 */
export function resolvePath(cwd: string, arg: string): string {
  let target: string
  if (arg === '' || arg === '~') target = HOME
  else if (arg.startsWith('~')) target = HOME + arg.slice(1)
  else if (arg.startsWith('/')) target = arg
  else target = cwd + '/' + arg

  const parts: string[] = []
  for (const segment of target.split('/')) {
    if (segment === '' || segment === '.') continue
    if (segment === '..') parts.pop()
    else parts.push(segment)
  }

  const normalized = '/' + parts.join('/')
  if (normalized === HOME || normalized.startsWith(HOME + '/')) return normalized
  return HOME
}

export function toTilde(path: string): string {
  if (path === HOME) return '~'
  if (path.startsWith(HOME + '/')) return '~' + path.slice(HOME.length)
  return path
}
