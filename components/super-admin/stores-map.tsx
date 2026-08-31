"use client"
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"

interface StoreData {
  id: string
  subdomain: string
  site_title: string
  plan: string
  email: string
  created_at: string
  last_admin_login_at?: string
  trial_expires_at?: string
  address?: string
  creator_ip?: string
}

interface StoreWithCoords extends StoreData {
  lat: number
  lng: number
  estado: "activa" | "inactiva"
  enUso: boolean
  sesiones: number
}

function getEstado(store: StoreData, sesiones: number): "activa" | "inactiva" {
  if (store.plan === "templates") return "inactiva"
  const now = new Date()
  // Activa = dueño entró en 7 días O clientes entraron
  if (sesiones > 0) return "activa"
  if (store.last_admin_login_at) {
    const diff = (now.getTime() - new Date(store.last_admin_login_at).getTime()) / (1000 * 60 * 60 * 24)
    if (diff <= 7) return "activa"
  }
  return "inactiva"
}

function getColor(estado: string, enUso: boolean) {
  if (estado === "activa" && enUso) return { fill: "#22c55e", border: "#16a34a" }   // verde: activa + en uso
  if (estado === "activa") return { fill: "#f59e0b", border: "#d97706" }             // amarillo: activa sin clientes
  return { fill: "#ef4444", border: "#dc2626" }                                      // rojo: inactiva
}

function defaultCoords(index: number): { lat: number; lng: number } {
  const base = [
    { lat: -34.61, lng: -58.41 }, { lat: -31.42, lng: -64.18 },
    { lat: -32.88, lng: -60.70 }, { lat: -34.92, lng: -57.95 },
    { lat: -26.83, lng: -65.20 }, { lat: -33.00, lng: -68.83 },
    { lat: -24.78, lng: -65.41 }, { lat: -38.00, lng: -57.55 },
    { lat: -43.30, lng: -65.10 }, { lat: -51.62, lng: -69.22 },
    { lat: -34.65, lng: -58.55 }, { lat: -31.52, lng: -64.28 },
    { lat: -32.78, lng: -60.60 }, { lat: -34.82, lng: -58.05 },
    { lat: -26.73, lng: -65.30 }, { lat: -33.10, lng: -68.73 },
    { lat: -24.88, lng: -65.31 }, { lat: -38.10, lng: -57.65 },
    { lat: -43.20, lng: -65.20 }, { lat: -51.52, lng: -69.12 },
  ]
  return base[index % base.length]
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(address + ", Argentina") + "&limit=1",
      { headers: { "User-Agent": "tolar-admin/1.0" } }
    )
    const data = await res.json()
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let savedCenter: [number, number] = [-38.5, -65]
let savedZoom: number = 4

function LeafletMap({ stores }: { stores: StoreWithCoords[] }) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const container = document.getElementById("stores-map-container")
    if (!container) return
    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null
      container.innerHTML = ""
    }
    const L = require("leaflet")
    const map = L.map("stores-map-container").setView(savedCenter, savedZoom)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap",
    }).addTo(map)

    stores.forEach((store) => {
      const c = getColor(store.estado, store.enUso)
      const marker = L.circleMarker([store.lat, store.lng], {
        radius: 8, fillColor: c.fill, fillOpacity: 0.9, color: c.border, weight: 2,
      }).addTo(map)

      const label = store.site_title || store.subdomain
      const url = store.subdomain + ".tol.ar"
      const estadoLabel = store.estado === "activa" ? (store.enUso ? "Activa · En uso" : "Activa") : "Inactiva"
      const bgColor = store.estado === "activa" ? (store.enUso ? "#dcfce7" : "#fef3c7") : "#fee2e2"
      const txtColor = store.estado === "activa" ? (store.enUso ? "#166534" : "#92400e") : "#991b1b"
      const lastLogin = store.last_admin_login_at ? new Date(store.last_admin_login_at).toLocaleDateString("es-AR") : "nunca"
      const ipCount = store.creator_ip ? stores.filter(s => s.creator_ip === store.creator_ip).length : 0
      const ipColor = ipCount > 1 ? "#dc2626" : "#64748b"
      const ipText = store.creator_ip ? store.creator_ip + (ipCount > 1 ? " (" + ipCount + " tiendas)" : "") : "sin IP"

      marker.bindPopup(
        "<div style='min-width:180px'>" +
        "<strong style='font-size:13px'>" + label + "</strong><br/>" +
        "<a href='https://" + url + "' target='_blank' style='color:#185FA5;font-size:11px'>" + url + "</a><br/>" +
        "<span style='font-size:10px;color:" + ipColor + ";font-weight:" + (ipCount > 1 ? "600" : "400") + "'>IP: " + ipText + "</span><br/>" +
        "<span style='font-size:10px;color:#64748b'>sesiones: " + store.sesiones + " | ultimo admin: " + lastLogin + "</span><br/><br/>" +
        "<span style='font-size:10px;background:" + bgColor + ";color:" + txtColor + ";padding:2px 7px;border-radius:8px'>" + estadoLabel + "</span>" +
        "</div>"
      )
    })

    return () => { savedCenter = map.getCenter(); savedZoom = map.getZoom(); map.remove() }
  }, [stores])

  return <div id="stores-map-container" style={{ height: 420, width: "100%", borderRadius: 8, zIndex: 0 }} />
}

export function StoresMap({ stores }: { stores: StoreData[] }) {
  const [ready, setReady] = useState(false)
  const [storesWithCoords, setStoresWithCoords] = useState<StoreWithCoords[]>([])
  const [filter, setFilter] = useState<"all" | "activa" | "inactiva" | "en-uso">("all")
  const [loading, setLoading] = useState(true)
  const [planFilter, setPlanFilter] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const noTemplates = stores.filter((s: any) => s.plan !== "templates")
    if (!noTemplates.length) { setLoading(false); setReady(true); return }

    let cancelled = false

    const offsetFor = (id: string) => {
      const idSum = id.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
      return { offsetLat: ((idSum % 20) - 10) * 0.03, offsetLng: ((idSum % 17) - 8) * 0.03 }
    }

    const resolve = async () => {
      // Traer visitas reales de clientes (page_views, excluyendo creator_ip)
      let sessionMap: Record<string, number> = {}
      try {
        const res = await fetch("/api/super-admin/stores-activity")
        const data = await res.json()
        sessionMap = data
      } catch {}

      // Cache de coordenadas en localStorage
      const CACHE_KEY = "tolar_map_coords_v1"
      const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 horas
      let coordsCache: Record<string, { lat: number; lng: number; ts: number }> = {}
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) coordsCache = JSON.parse(cached)
      } catch {}

      // Paso 1: mostrar el mapa YA, con lo que ya está en cache o una posición por defecto.
      // No esperamos a geolocalizar 577 tiendas una por una contra servicios externos.
      const pending: { store: StoreData; cacheKey: string }[] = []
      const results: StoreWithCoords[] = noTemplates.map((store: StoreData, i: number) => {
        const sesiones = sessionMap[store.id] || 0
        const estado = getEstado(store, sesiones)
        const cacheKey = store.address || store.creator_ip || store.id
        const cached = coordsCache[cacheKey]
        let coords = cached && Date.now() - cached.ts < CACHE_TTL ? { lat: cached.lat, lng: cached.lng } : null
        if (!coords) {
          coords = defaultCoords(i)
          if (store.address) pending.push({ store, cacheKey })
        }
        const { offsetLat, offsetLng } = offsetFor(store.id)
        return { ...store, lat: coords.lat + offsetLat, lng: coords.lng + offsetLng, estado, enUso: sesiones > 0, sesiones }
      })

      if (cancelled) return
      setStoresWithCoords(results)
      setLoading(false)
      setReady(true)

      // Paso 2: en segundo plano, afinar las tiendas con dirección real via Nominatim,
      // de a un pedido por segundo (su límite de uso) para no terminar bloqueados.
      let buffer: { id: string; lat: number; lng: number }[] = []
      const flush = () => {
        if (!buffer.length) return
        const updates = buffer
        buffer = []
        setStoresWithCoords((prev) => {
          const next = [...prev]
          for (const u of updates) {
            const pos = next.findIndex((s) => s.id === u.id)
            if (pos !== -1) next[pos] = { ...next[pos], lat: u.lat, lng: u.lng }
          }
          return next
        })
      }

      for (const { store, cacheKey } of pending) {
        if (cancelled) return
        const coords = await geocodeAddress(store.address!)
        if (coords) {
          coordsCache[cacheKey] = { lat: coords.lat, lng: coords.lng, ts: Date.now() }
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(coordsCache)) } catch {}
          const { offsetLat, offsetLng } = offsetFor(store.id)
          buffer.push({ id: store.id, lat: coords.lat + offsetLat, lng: coords.lng + offsetLng })
          if (buffer.length >= 5) flush()
        }
        await sleep(1100)
      }
      flush()
    }

    resolve()
    return () => { cancelled = true }
  }, [stores])

  const activaCount = storesWithCoords.filter(s => s.estado === "activa").length
  const inactivaCount = storesWithCoords.filter(s => s.estado === "inactiva").length
  const enUsoCount = storesWithCoords.filter(s => s.enUso).length
  const filtered = storesWithCoords.filter(s => {
    if (filter === "all") return true
    if (filter === "en-uso") return s.enUso
    return s.estado === filter
  })

  if (loading) {
    return (
      <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
        Cargando datos del mapa...
      </div>
    )
  }

  const PLANES = [
    { key: "gratis",     label: "Gratis",     color: "#22c55e", bg: "#f0fdf4" },
    { key: "cositas",    label: "Cositas",    color: "#f59e0b", bg: "#fffbeb" },
    { key: "socios",     label: "Socios",     color: "#6366f1", bg: "#eef2ff" },
    { key: "mayoristas", label: "Mayoristas", color: "#ec4899", bg: "#fdf2f8" },
    { key: "custom",     label: "Custom",     color: "#64748b", bg: "#f8fafc" },
  ]

  const planStats = PLANES.map(p => {
    const planStores = storesWithCoords.filter(s => {
      const plan = (s.plan || "gratis").toLowerCase()
      if (p.key === "gratis") return plan === "gratis" || plan === "free" || plan === "gratis"
      return plan === p.key
    })
    return {
      ...p,
      total: planStores.length,
      activas: planStores.filter(s => s.estado === "activa").length,
      inactivas: planStores.filter(s => s.estado === "inactiva").length,
      enUso: planStores.filter(s => s.enUso).length,
    }
  })

  const finalFiltered = planFilter
    ? filtered.filter(s => {
        const plan = (s.plan || "gratis").toLowerCase()
        if (planFilter === "gratis") return plan === "gratis" || plan === "free"
        return plan === planFilter
      })
    : filtered

  return (
    <div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* COLUMNA IZQUIERDA 50%: botones filtro + tabla de stats */}
        <div style={{ width: "50%" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setFilter("all")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "all" ? "#1e293b" : "transparent", color: filter === "all" ? "#fff" : "#64748b", borderColor: filter === "all" ? "#1e293b" : "#cbd5e1" }}>
              Todas ({storesWithCoords.length})
            </button>
            <button onClick={() => setFilter("activa")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "activa" ? "#d97706" : "transparent", color: filter === "activa" ? "#fff" : "#d97706", borderColor: filter === "activa" ? "#d97706" : "#fcd34d" }}>
              Activas ({activaCount})
            </button>
            <button onClick={() => setFilter("inactiva")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "inactiva" ? "#dc2626" : "transparent", color: filter === "inactiva" ? "#fff" : "#dc2626", borderColor: filter === "inactiva" ? "#dc2626" : "#fca5a5" }}>
              Inactivas ({inactivaCount})
            </button>
            <button onClick={() => setFilter("en-uso")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "en-uso" ? "#16a34a" : "transparent", color: filter === "en-uso" ? "#fff" : "#16a34a", borderColor: filter === "en-uso" ? "#16a34a" : "#86efac" }}>
              En uso ({enUsoCount})
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Plan</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#d97706", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Activas</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#dc2626", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Inactivas</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#16a34a", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>En uso</th>
                <th style={{ padding: "6px 10px", textAlign: "center", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>% activas</th>
              </tr>
            </thead>
            <tbody>
              {planStats.filter(p => p.total > 0).map(p => (
                <tr
                  key={p.key}
                  onClick={() => setPlanFilter(planFilter === p.key ? null : p.key)}
                  style={{ cursor: "pointer", background: planFilter === p.key ? p.bg : "transparent", transition: "background 0.15s" }}
                >
                  <td style={{ padding: "5px 10px", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 8, background: p.bg, color: p.color, fontWeight: 600, fontSize: 11 }}>{p.label}</span>
                  </td>
                  <td style={{ padding: "5px 10px", textAlign: "center", borderBottom: "1px solid #f1f5f9", color: "#d97706", fontWeight: 600 }}>{p.activas}</td>
                  <td style={{ padding: "5px 10px", textAlign: "center", borderBottom: "1px solid #f1f5f9", color: "#dc2626", fontWeight: 600 }}>{p.inactivas}</td>
                  <td style={{ padding: "5px 10px", textAlign: "center", borderBottom: "1px solid #f1f5f9", color: "#16a34a", fontWeight: 600 }}>{p.enUso}</td>
                  <td style={{ padding: "5px 10px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: p.total > 0 && (p.activas / p.total) > 0.3 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                      {p.total > 0 ? Math.round((p.activas / p.total) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Fila total */}
              <tr style={{ background: "#f8fafc", fontWeight: 700 }}>
                <td style={{ padding: "6px 10px", color: "#1e293b", fontSize: 12 }}>Total</td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#d97706" }}>{activaCount}</td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#dc2626" }}>{inactivaCount}</td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#16a34a" }}>{enUsoCount}</td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#64748b" }}>
                  {storesWithCoords.length > 0 ? Math.round((activaCount / storesWithCoords.length) * 100) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
          {planFilter && (
            <p style={{ fontSize: 11, color: "#6366f1", marginTop: 6, cursor: "pointer" }} onClick={() => setPlanFilter(null)}>
              ✕ Mostrando solo {PLANES.find(p => p.key === planFilter)?.label} — click para ver todas
            </p>
          )}
        </div>
        {/* COLUMNA DERECHA 50%: el mapa */}
        <div style={{ width: "50%" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "1.5px solid #16a34a" }} />activa + en uso
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", border: "1.5px solid #d97706" }} />activa
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #dc2626" }} />inactiva
            </div>
          </div>
          {ready && <LeafletMap stores={finalFiltered} />}
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
            Activa = movimiento en los últimos 7 días (dueño o clientes). En uso = clientes entrando ahora. Inactiva = 7+ días sin movimiento.
          </p>
        </div>
      </div>
    </div>
  )
}
