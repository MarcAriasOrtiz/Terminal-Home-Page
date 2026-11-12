import { useHomelab } from './HomelabProvider'

/**
 * Homelab monitoring dashboard (`homelab/control.sh`).
 *
 * Rendered inside the Editor when the user opens `homelab/control.sh`
 * (via `sh control.sh` in the terminal or by clicking it in the sidebar).
 * Data is provided by HomelabProvider.
 */

function AreaChart({
  history,
  label,
  variant = 'cyan',
  chartHeight = 40,
}: {
  history: number[]
  label: string
  variant?: 'cyan' | 'green'
  chartHeight?: number
}) {
  if (!history || history.length < 2) return null
  const last = history[history.length - 1] ?? 0

  const points = history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * 100
      const y = 100 - Math.max(0, Math.min(100, v))
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const gradId = `hlab-grad-${variant}-${label.replace(/\s+/g, '-').toLowerCase()}`
  const areaPoints = `${points} 100,100 0,100`
  const strokeColor = variant === 'green' ? 'var(--c-green)' : 'var(--c-cyan)'

  return (
    <svg
      className="hlab-chart"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      height={chartHeight}
      role="img"
      aria-label={`${label} history, current ${last.toFixed(1)}%`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.24} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="100"
        cy={100 - Math.max(0, Math.min(100, last))}
        r={2.5}
        fill={strokeColor}
      />
    </svg>
  )
}

interface ContainerData {
  name: string
  id: string
  up: string
  cpu: number
  ram: number
  ramTotal: number
  disk: number
  diskTotal: number
  net: string
  cpuHistory: number[]
  ramHistory: number[]
}

function ServiceCard({ c }: { c: ContainerData }) {
  const ramPct = c.ramTotal > 0 ? Math.min(100, (c.ram / c.ramTotal) * 100) : 0

  return (
    <article className="hlab-card" aria-label={`Container ${c.name}`}>
      <header className="hlab-card__header">
        <div className="hlab-card__title-group">
          <span className="status-dot" aria-hidden="true" />
          <h3 className="hlab-card__name">{c.name}</h3>
        </div>
        <div className="hlab-card__meta">
          <code className="hlab-card__id">id: {c.id}</code>
          <span className="hlab-card__badge">up · {c.up}</span>
        </div>
      </header>

      <div className="hlab-card__body">
        <dl className="hlab-card__metrics">
          <div className="hlab-card__metric">
            <dt>CPU</dt>
            <dd>{c.cpu.toFixed(1)}%</dd>
          </div>
          <div className="hlab-card__metric">
            <dt>Memory</dt>
            <dd>
              {c.ram.toFixed(0)} MB
              {c.ramTotal > 0 ? ` (${ramPct.toFixed(0)}%)` : ''}
            </dd>
          </div>
          <div className="hlab-card__metric">
            <dt>Disk</dt>
            <dd>{c.disk.toFixed(1)} GB</dd>
          </div>
          <div className="hlab-card__metric">
            <dt>Net I/O</dt>
            <dd>{c.net}</dd>
          </div>
        </dl>

        <div className="hlab-card__charts">
          <div className="hlab-card__chart-row">
            <div className="hlab-card__chart-head">
              <span className="hlab-card__chart-label">CPU load</span>
              <span className="hlab-card__chart-val">{c.cpu.toFixed(1)}%</span>
            </div>
            <AreaChart
              history={c.cpuHistory}
              label={`${c.name} CPU`}
              variant="green"
              chartHeight={36}
            />
          </div>

          <div className="hlab-card__chart-row">
            <div className="hlab-card__chart-head">
              <span className="hlab-card__chart-label">RAM usage</span>
              <span className="hlab-card__chart-val">{c.ram.toFixed(0)} MB</span>
            </div>
            <AreaChart
              history={c.ramHistory}
              label={`${c.name} RAM`}
              variant="cyan"
              chartHeight={36}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function HomelabDashboard() {
  const { containers, system, lastUpdated, apiConnected, apiError } = useHomelab()

  const hostMetrics = [
    {
      key: 'cpu',
      label: 'CPU load',
      pct: Math.max(0, Math.min(100, system.cpu)),
      display: `${system.cpu.toFixed(1)}%`,
      sub: 'host compute',
    },
    {
      key: 'ram',
      label: 'Memory',
      pct: system.ramTotal > 0 ? Math.max(0, Math.min(100, (system.ramUsed / system.ramTotal) * 100)) : 0,
      display:
        system.ramTotal > 0
          ? `${system.ramUsed.toFixed(1)} / ${system.ramTotal.toFixed(0)} GB`
          : `${system.ramUsed.toFixed(1)} GB`,
      sub:
        system.ramTotal > 0
          ? `${((system.ramUsed / system.ramTotal) * 100).toFixed(0)}% allocated`
          : 'system memory',
    },
    {
      key: 'disk',
      label: 'Storage',
      pct: system.diskTotal > 0 ? Math.max(0, Math.min(100, (system.diskUsed / system.diskTotal) * 100)) : 0,
      display:
        system.diskTotal > 0
          ? `${system.diskUsed.toFixed(1)} / ${system.diskTotal.toFixed(0)} GB`
          : `${system.diskUsed.toFixed(1)} GB`,
      sub:
        system.diskTotal > 0
          ? `${((system.diskUsed / system.diskTotal) * 100).toFixed(0)}% mounted`
          : 'local volume',
    },
    {
      key: 'net',
      label: 'Network I/O',
      pct: Math.max(0, Math.min(100, (parseFloat(system.net || '0') / 10) * 100)),
      display: `${parseFloat(system.net || '0').toFixed(1)} MB/s`,
      sub: 'mao_msi bridge',
    },
  ]

  return (
    <article className="hlab" aria-label="Homelab control dashboard">
      {/* 1 — Split Header & Telemetry Status */}
      <header className="hlab__header">
        <div className="hlab__hero-main">
          <h1 className="hlab__title">Homelab Control</h1>
          <p className="hlab__tagline">
            Live container and host telemetry from the home server running my self-hosted stack.
          </p>
        </div>

        <aside className="hlab__dossier" aria-label="Host connection telemetry">
          <dl className="hlab__specs">
            <div className="hlab__spec">
              <dt>Host</dt>
              <dd>
                <code>mao-msi</code> (<code>mao_msi</code> network)
              </dd>
            </div>
            <div className="hlab__spec">
              <dt>Stream</dt>
              <dd className="hlab__stream-state">
                <span
                  className={`hlab__dot${apiConnected ? ' hlab__dot--live' : ' hlab__dot--standby'}`}
                  aria-hidden="true"
                />
                <span>{apiConnected ? 'Live API stream' : 'Standby / offline'}</span>
                {lastUpdated && <code className="hlab__timestamp">{lastUpdated}</code>}
              </dd>
            </div>
            <div className="hlab__spec">
              <dt>Containers</dt>
              <dd className="hlab__count">{containers.length} active</dd>
            </div>
          </dl>
        </aside>
      </header>

      {/* 2 — Host Resource Matrix */}
      <section className="hlab__section" aria-labelledby="hlab-host-heading">
        <div className="hlab__section-head">
          <h2 className="hlab__h2" id="hlab-host-heading">
            Host resources
          </h2>
          <code className="hlab__node-tag">node // mao-msi</code>
        </div>

        <div className="hlab__host-grid">
          {hostMetrics.map((m) => (
            <div
              key={m.key}
              className="hlab__host-cell"
              role="progressbar"
              aria-valuenow={Math.round(m.pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${m.label} ${m.display}`}
            >
              <div className="hlab__host-top">
                <span className="hlab__host-label">{m.label}</span>
                <span className="hlab__host-sub">{m.sub}</span>
              </div>
              <div className="hlab__host-value">{m.display}</div>
              <div className="hlab__bar-track">
                <div
                  className="hlab__bar-fill"
                  style={{ transform: `scaleX(${(m.pct / 100).toFixed(3)})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — Docker Container Services */}
      <section className="hlab__section" aria-labelledby="hlab-services-heading">
        <div className="hlab__section-head">
          <h2 className="hlab__h2" id="hlab-services-heading">
            Running containers
          </h2>
          <span className="hlab__section-meta">
            {containers.length > 0
              ? `${containers.length} services reporting`
              : 'Waiting for container stream'}
          </span>
        </div>

        {containers.length === 0 ? (
          <div className="hlab__empty" role="status">
            <div className="hlab__empty-main">
              <h3 className="hlab__empty-title">Telemetry stream on standby</h3>
              <p className="hlab__empty-desc">
                {apiConnected
                  ? 'Connected to the host endpoint, waiting for the first container sample to arrive.'
                  : 'The live Docker telemetry endpoint is currently unreachable from this session.'}
              </p>
              {apiError && (
                <p className="hlab__empty-reason">
                  Diagnostic: <code>{apiError}</code>
                </p>
              )}
            </div>
            <div className="hlab__empty-hint">
              <span className="hlab__empty-label">Tip</span>
              <p>
                To explore the static architecture and verified links between all 20 services (Skippy, n8n, Postgres, Caddy, Home Assistant and more), open <code>~/about_me/now.md</code>.
              </p>
            </div>
          </div>
        ) : (
          <div className="hlab__grid">
            {containers.map((c) => (
              <ServiceCard key={c.name} c={c} />
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
