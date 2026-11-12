import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface ContainerStat {
  name: string
  id: string
  up: string
  cpu: number        // percent 0-100
  ram: number        // MB used
  ramTotal: number   // MB total
  disk: number       // GB used
  diskTotal: number  // GB total
  net: string        // e.g. "1.2 MB/s"
  cpuHistory: number[]   // percent samples
  ramHistory: number[]   // percent-of-total samples
}

interface SystemStat {
  cpu: number      // percent
  ramUsed: number  // GB
  ramTotal: number // GB
  diskUsed: number // GB
  diskTotal: number // GB
  net: string      // e.g. "5.4 MB/s"
}

interface HomelabContextType {
  containers: ContainerStat[]
  system: SystemStat
  lastUpdated: string
  apiConnected: boolean
  apiError: string | null
}

const HomelabContext = createContext<HomelabContextType | null>(null)

export function useHomelab() {
  const ctx = useContext(HomelabContext)
  if (!ctx) throw new Error('useHomelab must be used within HomelabProvider')
  return ctx
}

const API_URL = import.meta.env.VITE_DOCKER_API_URL || ''
const FETCH_MS = 400   // peticiones a la API cada 0.4 s
const RENDER_MS = 1000 // pintado en pantalla cada 1 s
const HISTORY_LENGTH = 30

function seedHistory(base: number, variance: number): number[] {
  return Array.from({ length: HISTORY_LENGTH }, () =>
    Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance * 2))
  )
}

export function HomelabProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<ContainerStat[]>([])
  const [system, setSystem] = useState<SystemStat>({
    cpu: 0, ramUsed: 0, ramTotal: 0, diskUsed: 0, diskTotal: 0, net: '0',
  })
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [apiConnected, setApiConnected] = useState<boolean>(!!API_URL)
  const [apiError, setApiError] = useState<string | null>(null)

  // Últimos datos crudos de la API. fetchData los escribe; renderTick los lee.
  const latest = useRef<{ containers: ContainerStat[]; system: SystemStat } | null>(null)
  const fetchInProgress = useRef(false)

  useEffect(() => {
    let mounted = true
    let fetchTimer: ReturnType<typeof setInterval>
    let renderTimer: ReturnType<typeof setInterval>

    async function fetchData() {
      if (fetchInProgress.current) return
      fetchInProgress.current = true

      let data: { containers: ContainerStat[]; system: SystemStat } | null = null
      let ok = false

      if (API_URL) {
        try {
          const res = await fetch(API_URL, { signal: AbortSignal.timeout(8000) })
          const json = await res.json()
          data = {
            containers: json.containers ?? [],
            system: json.system ?? {},
          }
          ok = true
          setApiError(null)
        } catch (err) {
          setApiConnected(false)
          setApiError(err instanceof Error ? err.message : 'fetch failed')
          console.warn('[homelab] API fetch failed:', err)
        }
      } else {
        setApiError('VITE_DOCKER_API_URL no configurada')
        console.warn('[homelab] VITE_DOCKER_API_URL no configurada')
      }

      if (!data) {
        fetchInProgress.current = false
        return
      }

      // Normalize: ensure every container has history arrays for sparklines
      if (data.containers.length > 0) {
        data.containers = data.containers.map((c) => ({
          ...c,
          cpuHistory: Array.isArray(c.cpuHistory) ? c.cpuHistory : seedHistory(c.cpu, 2),
          ramHistory: Array.isArray(c.ramHistory)
            ? c.ramHistory
            : seedHistory((c.ram / Math.max(c.ramTotal, 1)) * 100, 8),
        }))
      }

      // Solo escribimos el ref. Nunca setState aquí — eso lo hace renderTick.
      latest.current = data

      if (mounted) {
        setApiConnected(ok && !!API_URL)
      }
      fetchInProgress.current = false
    }

    // Render tick: única fuente de re-render. Lee del ref cada RENDER_MS.
    function renderTick() {
      if (!mounted) return
      const data = latest.current
      if (!data) return
      setContainers(data.containers)
      setSystem(data.system)
      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    }

    fetchData()
    fetchTimer = setInterval(fetchData, FETCH_MS)
    renderTimer = setInterval(renderTick, RENDER_MS)

    return () => {
      mounted = false
      clearInterval(fetchTimer)
      clearInterval(renderTimer)
    }
  }, [])

  const value: HomelabContextType = {
    containers,
    system,
    lastUpdated,
    apiConnected,
    apiError,
  }

  return (
    <HomelabContext.Provider value={value}>
      {children}
    </HomelabContext.Provider>
  )
}
