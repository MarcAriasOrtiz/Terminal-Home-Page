<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>control.sh — TAVERAS//SOLUTIONS</title>
  <style>
    /* =====================================================================
       TAVERAS//SOLUTIONS — homelab control dashboard
       Retro-futuristic terminal UI. Single file (HTML + CSS).
       Colours (exact): bg #0a0f14 | accents #00ffff / #0088cc
       Font: monospace stack, local fallbacks only (no external service).
       ===================================================================== */
    :root {
      --bg: #0a0f14;
      --panel: rgba(18, 26, 35, 0.55);
      --border: #0088cc;
      --cyan: #00ffff;
      --cyan-blue: #0088cc;
      --green: #00ff41;
      --muted: #5f7a8f;
      --text: #dce5f0;

      --mono: "Fira Code", "Courier New", Courier, monospace;

      --radius: 6px;
      --glow: 0 0 14px rgba(0, 255, 255, 0.22), 0 0 28px rgba(0, 136, 204, 0.12);
      --glow-cyan: 0 0 10px rgba(0, 255, 255, 0.35);
      --glow-green: 0 0 10px rgba(0, 255, 65, 0.55);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      height: 100%;
    }

    body {
      height: 100vh;
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--mono);
      font-size: 14px;
      line-height: 1.45;
      letter-spacing: 0.02em;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    /* Subtle terminal grid overlay */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      z-index: 0;
    }

    .dashboard {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ===== Top Header ===== */
    .header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 18px 22px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--glow);
      flex-wrap: wrap;
    }

    .brand {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      white-space: nowrap;
    }

    .server {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: right;
      min-width: 170px;
    }

    .server .row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      align-items: baseline;
    }

    .server .label {
      color: var(--cyan-blue);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .server .value {
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      font-size: 13px;
    }

    /* ===== Section title ===== */
    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      border-bottom: 1px solid var(--border);
      padding-bottom: 7px;
    }

    /* ===== Services grid (CSS Grid, 2 x 3) ===== */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .card {
      position: relative;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: rgba(12, 18, 26, 0.6);
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--glow);
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .card:hover {
      border-color: var(--cyan);
      box-shadow: var(--glow), 0 0 24px rgba(0, 255, 255, 0.10);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }

    .icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: var(--glow-cyan);
      flex-shrink: 0;
      position: relative;
    }

    .icon::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      border: 1px solid rgba(0, 136, 204, 0.45);
    }

    .name {
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--green);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      white-space: nowrap;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: var(--glow-green);
      flex-shrink: 0;
    }

    .status--up .dot {
      animation: pulse 2.6s ease-in-out infinite;
    }

    .card-body {
      flex: 1;
      padding: 14px;
      /* Two columns of technical data */
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px 18px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      font-size: 12.5px;
    }

    .metric .k {
      color: var(--muted);
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .metric .v {
      color: var(--text);
      font-variant-numeric: tabular-nums;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      padding: 10px 14px;
      border-top: 1px solid var(--border);
      font-size: 11.5px;
      color: var(--muted);
    }

    .card-footer .id {
      color: var(--cyan-blue);
    }

    .card-footer .up {
      color: var(--cyan-blue);
      font-weight: 800;
      letter-spacing: 0.06em;
    }

    /* ===== Bottom SYSTEM panel ===== */
    .system {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--panel);
      padding: 18px 22px;
      box-shadow: var(--glow);
    }

    .metric-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .metric-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-row .label {
      width: 52px;
      color: var(--cyan-blue);
      font-size: 12.5px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      flex-shrink: 0;
    }

    /* Segmented retro-style progress bar */
    .bar {
      flex: 1;
      height: 18px;
      border: 1px solid var(--border);
      background: #070f18;
      border-radius: 4px;
      padding: 2px;
      display: flex;
      gap: 2px;
      overflow: hidden;
    }

    .seg {
      flex: 1;
      border: 1px solid rgba(0, 136, 204, 0.22);
      background: transparent;
    }

    .seg.filled {
      background: var(--cyan);
      border-color: var(--cyan);
      box-shadow: var(--glow-cyan);
    }

    .metric-row .value {
      width: 48px;
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-align: right;
      flex-shrink: 0;
    }

    /* ===== Responsive ===== */
    @media (max-width: 700px) {
      .dashboard {
        padding: 14px;
        gap: 12px;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
        padding: 14px 16px;
      }

      .brand {
        font-size: 22px;
        text-align: center;
      }

      .server {
        align-items: center;
        text-align: center;
      }

      .server .row {
        justify-content: center;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .card-body {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .metric-row {
        gap: 10px;
      }

      .metric-row .label {
        width: 40px;
        font-size: 11px;
      }

      .metric-row .value {
        width: 40px;
        font-size: 11px;
      }
    }

    /* Reduced motion — disable animations/transitions */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        box-shadow: var(--glow-green);
      }
      50% {
        opacity: 0.75;
        box-shadow: 0 0 16px rgba(0, 255, 65, 0.9);
      }
    }
  </style>
</head>
<body>
  <div class="dashboard" role="application" aria-label="TAVERAS//SOLUTIONS homelab control dashboard">

    <!-- Top Header -->
    <header class="header">
      <div class="brand">TAVERAS//SOLUTIONS</div>
      <div class="server">
        <div class="row"><span class="label">HOST</span><span class="value">taveras-core-01</span></div>
        <div class="row"><span class="label">IP</span><span class="value">10.0.4.88</span></div>
      </div>
    </header>

    <!-- Central SERVICES section — 2 column x 3 row grid of Docker containers -->
    <section class="section services" aria-labelledby="svc-title">
      <h2 class="section-title" id="svc-title">SERVICES</h2>
      <div class="grid" role="grid" aria-label="Docker containers">

        <!-- Card 1: Nginx -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">Nginx</span>
            <div class="status status--up" aria-label="Nginx status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">0.5 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">120 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">2 GB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">1.2 MB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: a1b2c3d4</span>
            <span class="up">up 5 days</span>
          </div>
        </article>

        <!-- Card 2: Postgres -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">Postgres</span>
            <div class="status status--up" aria-label="Postgres status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">2.1 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">512 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">18 GB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">45 KB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: 8f3e7a21</span>
            <span class="up">up 12 days</span>
          </div>
        </article>

        <!-- Card 3: Redis -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">Redis</span>
            <div class="status status--up" aria-label="Redis status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">0.2 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">88 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">512 MB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">12 KB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: d4c9b811</span>
            <span class="up">up 20 days</span>
          </div>
        </article>

        <!-- Card 4: App API -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">App API</span>
            <div class="status status--up" aria-label="App API status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">14.3 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">780 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">4 GB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">3.4 MB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: 9e2f4a6c</span>
            <span class="up">up 3 days</span>
          </div>
        </article>

        <!-- Card 5: Worker -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">Worker</span>
            <div class="status status--up" aria-label="Worker status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">6.8 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">340 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">1 GB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">800 KB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: b7a1e3d9</span>
            <span class="up">up 7 days</span>
          </div>
        </article>

        <!-- Card 6: DB Proxy -->
        <article class="card" role="gridcell">
          <div class="card-header">
            <span class="icon" aria-hidden="true"></span>
            <span class="name">DB Proxy</span>
            <div class="status status--up" aria-label="DB Proxy status UP"><span class="dot" aria-hidden="true"></span> UP</div>
          </div>
          <div class="card-body">
            <div class="metric"><span class="k">cpu</span><span class="v">1.0 %</span></div>
            <div class="metric"><span class="k">ram</span><span class="v">160 MB</span></div>
            <div class="metric"><span class="k">disk</span><span class="v">1 GB</span></div>
            <div class="metric"><span class="k">net</span><span class="v">2.1 MB/s</span></div>
          </div>
          <div class="card-footer">
            <span class="id">id: 4c6d8f2a</span>
            <span class="up">up 15 days</span>
          </div>
        </article>

      </div>
    </section>

    <!-- Bottom SYSTEM section — full width panel with segmented progress bars -->
    <section class="section system" aria-labelledby="sys-title">
      <h2 class="section-title" id="sys-title">SYSTEM</h2>
      <div class="metric-list">
        <div class="metric-row">
          <span class="label">cpu</span>
          <div class="bar" role="progressbar" aria-valuenow="34" aria-valuemin="0" aria-valuemax="100" aria-label="CPU usage 34%">
            <span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span>
            <span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span>
          </div>
          <span class="value">34 %</span>
        </div>

        <div class="metric-row">
          <span class="label">ram</span>
          <div class="bar" role="progressbar" aria-valuenow="61" aria-valuemin="0" aria-valuemax="100" aria-label="RAM usage 61%">
            <span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span>
            <span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span>
          </div>
          <span class="value">61 %</span>
        </div>

        <div class="metric-row">
          <span class="label">disk</span>
          <div class="bar" role="progressbar" aria-valuenow="52" aria-valuemin="0" aria-valuemax="100" aria-label="Disk usage 52%">
            <span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span>
            <span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span>
          </div>
          <span class="value">52 %</span>
        </div>

        <div class="metric-row">
          <span class="label">net</span>
          <div class="bar" role="progressbar" aria-valuenow="28" aria-valuemin="0" aria-valuemax="100" aria-label="Network usage 28%">
            <span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span><span class="seg filled"></span>
            <span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span>
          </div>
          <span class="value">28 %</span>
        </div>
      </div>
    </section>

  </div>
</body>
</html>
