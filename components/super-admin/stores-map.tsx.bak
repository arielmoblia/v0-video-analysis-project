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
  estado: "en-uso" | "activa" | "abandonada"
  sesiones: number
}

function getEstado(store: StoreData, sesiones: number): "en-uso" | "activa" | "abandonada" {
  if (store.plan === "templates") return "abandonada"
  const now = new Date()
  if (store.trial_expires_at && new Date(store.trial_expires_at) < now) return "abandonada"
  if (sesiones > 0) return "en-uso"
  if (store.last_admin_login_at) {
    const diff = (now.getTime() - new Date(store.last_admin_login_at).getTime()) / (1000 * 60 * 60 * 24)
    if (diff <= 30) return "activa"
  }
  return "abandonada"
}

function getColor(estado: string) {
  if (estado === "en-uso") return { fill: "#22c55e", border: "#16a34a" }
  if (estado === "activa") return { fill: "#f59e0b", border: "#d97706" }
  return { fill: "#ef4444", border: "#dc2626" }
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

async function geolocateIP(ip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch("https://ip-api.com/json/" + ip + "?fields=lat,lon,status")
    const data = await res.json()
    if (data.status === "success") return { lat: data.lat, lng: data.lon }
  } catch {}
  return null
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
      const c = getColor(store.estado)
      const marker = L.circleMarker([store.lat, store.lng], {
        radius: 8, fillColor: c.fill, fillOpacity: 0.9, color: c.border, weight: 2,
      }).addTo(map)

      const label = store.site_title || store.subdomain
      const url = store.subdomain + ".tol.ar"
      const estadoLabel = store.estado === "en-uso" ? "En uso" : store.estado === "activa" ? "Activa" : "Abandonada"
      const bgColor = store.estado === "en-uso" ? "#dcfce7" : store.estado === "activa" ? "#fef3c7" : "#fee2e2"
      const txtColor = store.estado === "en-uso" ? "#166534" : store.estado === "activa" ? "#92400e" : "#991b1b"
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
  const [filter, setFilter] = useState<"all" | "en-uso" | "activa" | "abandonada">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const noTemplates = stores.filter((s: any) => s.plan !== "templates")
    if (!noTemplates.length) { setLoading(false); setReady(true); return }

    const resolve = async () => {
      // Traer sesiones de Smartcheck
      let sessionMap: Record<string, number> = {}
      try {
        const res = await fetch("https://smartcheck.tol.ar/api/projects")
        const data = await res.json()
        data.forEach((p: any) => {
          const sub = p.project_id.replace(".tol.ar", "")
          sessionMap[sub] = p.count
        })
      } catch {}

      // Cache de coordenadas en localStorage
      const CACHE_KEY = "tolar_map_coords_v1"
      const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 horas
      let coordsCache: Record<string, { lat: number; lng: number; ts: number }> = {}
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) coordsCache = JSON.parse(cached)
      } catch {}

      const results: StoreWithCoords[] = []
      for (let i = 0; i < noTemplates.length; i++) {
        const store = noTemplates[i]
        const sesiones = sessionMap[store.subdomain] || 0
        const estado = getEstado(store, sesiones)
        let coords = null

        // Verificar cache
        const cacheKey = store.address || store.creator_ip || store.id
        const cached = coordsCache[cacheKey]
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          coords = { lat: cached.lat, lng: cached.lng }
        } else {
          if (store.address) coords = await geocodeAddress(store.address)
          if (!coords && store.creator_ip) coords = await geolocateIP(store.creator_ip)
          if (!coords) coords = defaultCoords(i)
          // Guardar en cache
          if (cacheKey) {
            coordsCache[cacheKey] = { lat: coords.lat, lng: coords.lng, ts: Date.now() }
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(coordsCache)) } catch {}
          }
        }

        // Offset fijo basado en id para evitar superposicion
        const idSum = store.id.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
        const offsetLat = ((idSum % 20) - 10) * 0.03
        const offsetLng = ((idSum % 17) - 8) * 0.03
        results.push({ ...store, lat: coords.lat + offsetLat, lng: coords.lng + offsetLng, estado, sesiones })
      }
      setStoresWithCoords(results)
      setLoading(false)
      setReady(true)
    }

    resolve()
  }, [stores])

  const enUsoCount = storesWithCoords.filter(s => s.estado === "en-uso").length
  const activaCount = storesWithCoords.filter(s => s.estado === "activa").length
  const abandonadaCount = storesWithCoords.filter(s => s.estado === "abandonada").length
  const filtered = storesWithCoords.filter(s => filter === "all" ? true : s.estado === filter)

  if (loading) {
    return (
      <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
        Cargando datos del mapa...
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "all" ? "#1e293b" : "transparent", color: filter === "all" ? "#fff" : "#64748b", borderColor: filter === "all" ? "#1e293b" : "#cbd5e1" }}>
          Todas ({storesWithCoords.length})
        </button>
        <button onClick={() => setFilter("en-uso")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "en-uso" ? "#16a34a" : "transparent", color: filter === "en-uso" ? "#fff" : "#16a34a", borderColor: filter === "en-uso" ? "#16a34a" : "#86efac" }}>
          En uso ({enUsoCount})
        </button>
        <button onClick={() => setFilter("activa")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "activa" ? "#d97706" : "transparent", color: filter === "activa" ? "#fff" : "#d97706", borderColor: filter === "activa" ? "#d97706" : "#fcd34d" }}>
          Activas ({activaCount})
        </button>
        <button onClick={() => setFilter("abandonada")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "abandonada" ? "#dc2626" : "transparent", color: filter === "abandonada" ? "#fff" : "#dc2626", borderColor: filter === "abandonada" ? "#dc2626" : "#fca5a5" }}>
          Abandonadas ({abandonadaCount})
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "1.5px solid #16a34a" }} />en uso
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", border: "1.5px solid #d97706" }} />activa
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #dc2626" }} />abandonada
          </div>
        </div>
      </div>
      {ready && <LeafletMap stores={filtered} />}
      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
        En uso = visitas de clientes (Smartcheck). Activa = dueño entro al admin. Abandonada = trial vencido.
      </p>
    </div>
  )
}
