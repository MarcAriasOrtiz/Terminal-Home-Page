// Visual CV content. Drawn from content/career/cv.md — do not add roles,
// dates, technologies or results that are not in that file.

export const LINKEDIN = 'https://www.linkedin.com/in/marc-arias-ortiz'
export const CONTACT_PATH = '/home/mao/contact/links.md'
export const CV_PATH = '/home/mao/career/cv.md'

export const PROFILE = [
  'AI R&D Engineer working at the intersection of artificial intelligence, software engineering and cloud infrastructure.',
  'My work focuses on researching, designing and implementing advanced AI systems, combining agentic architectures, LLM-based applications, automation and knowledge retrieval with the software and infrastructure required to run them.',
  'I work across the full engineering lifecycle, from exploring new technologies and designing system architectures to developing integrations, deploying services and building the infrastructure behind them.',
  'My background in Data Science, Machine Learning and software development provides a broad technical foundation for approaching complex engineering problems from a systems perspective.',
]

export interface River {
  id: string
  label: string
  sub: string
  summary: string
  /** Pipeline call shown in the run log. */
  fn: string
  /** Short capabilities taken from the CV's expertise groups and duty lines. */
  tags: string[]
  /** R,G,B accent of the stream. */
  color: string
}

// Five disciplines feeding the confluence diagram in section 01. Summaries come
// from the CV; tags are subsets of cv.md's Technical Expertise groups — nothing
// invented. Array order is the visual top-to-bottom order of the streams.
export const RIVERS: River[] = [
  {
    id: 'data',
    label: 'Data',
    sub: 'signals, structure, knowledge',
    summary: 'Pipelines, databases and analysis that collect, transform and make data usable.',
    fn: 'transform',
    tags: ['SQL', 'ETL', 'Data Pipelines', 'Predictive Modelling'],
    color: '85,230,255',
  },
  {
    id: 'ai',
    label: 'AI',
    sub: 'reasoning, models, agents',
    summary:
      'Research, design and implementation of AI systems: language models, agents, knowledge retrieval and automation.',
    fn: 'research',
    tags: ['LLMs', 'Agentic AI', 'Multi-Agent Systems', 'RAG', 'MCP'],
    color: '182,255,108',
  },
  {
    id: 'software',
    label: 'Software',
    sub: 'interfaces, systems, APIs',
    summary: 'Backend services, APIs and integrations that connect models, tools and data sources.',
    fn: 'integrate',
    tags: ['Python', 'Rust', 'FastAPI', 'API Design', 'System Integration'],
    color: '220,229,240',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    sub: 'compute, networks, runtime',
    summary:
      'Design, deployment and management of cloud and self-hosted infrastructure, with containers, Linux and automation.',
    fn: 'deploy',
    tags: ['Docker', 'Kubernetes', 'Linux', 'Ansible'],
    color: '126,182,255',
  },
  {
    id: 'auto',
    label: 'Automation',
    sub: 'orchestration, workflows',
    summary: 'Automation workflows and orchestration that connect services, tools and AI systems.',
    fn: 'orchestrate',
    tags: ['Automation', 'Orchestration', 'Workflows'],
    color: '198,232,122',
  },
]

// Caption for the confluence output — verbatim from cv.md (Driving01 duties).
export const CONFLUENCE_OUTPUT = 'Working system'
export const CONFLUENCE_CAPTION = 'Integration of infrastructure, software services and AI workloads.'

export interface DutyGroup {
  title: string
  items: string[]
}

export const DRIVING01 = {
  company: 'Driving01',
  title: 'AI R&D Engineer',
  period: 'August 2021 – Present',
  place: 'Barcelona, Spain',
  summary:
    'Working across Artificial Intelligence R&D, software engineering, cloud infrastructure and automation, with responsibilities progressively evolving from Data Science and Machine Learning towards advanced AI systems development.',
  current: [
    {
      title: 'AI Research & Development',
      items: [
        'Research, design and implementation of advanced AI solutions.',
        'Development of LLM-powered applications and agentic systems.',
        'Design of multi-agent architectures, orchestration workflows and tool integrations.',
        'Development of knowledge retrieval systems and AI-powered automation.',
      ],
    },
    {
      title: 'Cloud & Infrastructure Engineering',
      items: [
        'Design, deployment and management of cloud and self-hosted infrastructure.',
        'Development and deployment of containerized services and applications.',
        'Infrastructure automation and orchestration.',
        'Integration of infrastructure, software services and AI workloads.',
      ],
    },
    {
      title: 'Software Engineering & Integration',
      items: [
        'Backend development and API integration.',
        'Development of automation workflows and supporting services.',
        'Integration of AI models, external tools and data sources.',
      ],
    },
  ] satisfies DutyGroup[],
  earlier: {
    title: 'Earlier at Driving01: Machine Learning, NLP & Data Science',
    items: [
      'Technical direction and implementation of machine learning and advanced statistical initiatives.',
      'Development of conversational AI and chatbot solutions.',
      'Implementation of machine learning models, ETL processes and analytical solutions.',
      'Database management, data visualisation and application deployment.',
    ],
  },
}

export const EARLIER_ROLES = [
  {
    company: 'VidaCaixa',
    title: 'Data Analysis Intern',
    period: 'May 2021 – July 2021',
    place: 'Barcelona, Spain',
    items: [
      'Database management and migrations.',
      'Statistical analysis and data visualisation.',
      'Application of machine learning models.',
    ],
  },
  {
    company: 'Intercruises Shoreside & Port Services',
    title: 'Operations Coordinator',
    period: 'April 2016 – March 2020',
    place: 'Barcelona, Spain',
    items: [
      'Coordination of passenger embarkation and disembarkation operations.',
      'Transport logistics and staff supervision.',
      'Operational planning and decision-making in an international environment.',
    ],
  },
]

export const EXPERTISE = [
  {
    title: 'AI & R&D',
    items: [
      'LLMs',
      'Agentic AI',
      'Multi-Agent Systems',
      'Machine Learning',
      'NLP',
      'RAG',
      'Knowledge Retrieval',
      'MCP',
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    items: [
      'Cloud Infrastructure',
      'Self-hosted Systems',
      'Docker',
      'Kubernetes',
      'Linux',
      'Ansible',
      'Infrastructure Automation',
    ],
  },
  {
    title: 'Software Engineering',
    items: [
      'Python',
      'Rust',
      'JavaScript',
      'FastAPI',
      'Backend Development',
      'API Design',
      'System Integration',
      'Automation',
    ],
  },
  {
    title: 'Data Engineering & Analytics',
    items: [
      'SQL',
      'ETL',
      'Data Pipelines',
      'Statistical Analysis',
      'Predictive Modelling',
      'Power BI',
      'Grafana',
      'Qlik',
    ],
  },
]

export const EDUCATION = [
  {
    school: 'La Salle BCN',
    credential: "Master's Degree in Data Science",
    period: '2020–2021',
  },
  {
    school: 'Universitat Politècnica de Catalunya',
    credential: 'Degree in Biological Systems Engineering',
    period: '2011–2016',
  },
]

export const CERTIFICATIONS = [
  'Cognigy.AI Foundation Course',
  'Cognigy.AI Certified Specialist',
  'Cognigy.AI Developer Course',
  'Cognigy.AI Conversation Design Course',
]

export const LANGUAGES = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Catalan', level: 'Native' },
  { name: 'English', level: 'Professional Working Proficiency' },
]

export const SECTIONS = [
  { id: 'resume-hero', label: 'Profile' },
  { id: 'resume-landscape', label: 'Landscape' },
  { id: 'resume-experience', label: 'Experience' },
  { id: 'resume-expertise', label: 'Expertise' },
  { id: 'resume-education', label: 'Education' },
  { id: 'resume-contact', label: 'Contact' },
]
