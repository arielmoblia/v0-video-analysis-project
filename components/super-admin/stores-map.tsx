"use client"
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"

interface StoreData {
  id: string
  subdomain: string
  site_title: string
  status: string
  plan: string
  email: string
  created_at: string
}

interface StoreWithCoords extends StoreData {
  lat: number
  lng: number
  byIp: boolean
}

function defaultCoords(index: number): { lat: number; lng: number } {
  const base = [
    { lat: -34.61, lng: -58.41 },
    { lat: -31.42, lng: -64.18 },
    { lat: -32.88, lng: -60.70 },
    { lat: -34.92, lng: -57.95 },
    { lat: -26.83, lng: -65.20 },
    { lat: -33.00, lng: -68.83 },
    { lat: -24.78, lng: -65.41 },
    { lat: -38.00, lng: -57.55 },
    { lat: -43.30, lng: -65.10 },
    { lat: -51.62, lng: -69.22 },
    { lat: -34.65, lng: -58.55 },
    { lat: -31.52, lng: -64.28 },
    { lat: -32.78, lng: -60.60 },
    { lat: -34.82, lng: -58.05 },
    { lat: -26.73, lng: -65.30 },
    { lat: -33.10, lng: -68.73 },
    { lat: -24.88, lng: -65.31 },
    { lat: -38.10, lng: -57.65 },
    { lat: -43.20, lng: -65.20 },
    { lat: -51.52, lng: -69.12 },
  ]
  return base[index % base.length]
}

function LeafletMap({ stores }: { stores: StoreWithCoords[] }) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const L = require("leaflet")
    const existing = document.getElementById("stores-map-container")
    if (!existing) return

    if ((existing as any)._leaflet_id) return

    const map = L.map("stores-map-container").setView([-38.5, -65], 4)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap",
    }).addTo(map)

    stores.forEach((store) => {
      const color = store.status === "active" ? "#22c55e" : "#ef4444"
      const border = store.status === "active" ? "#16a34a" : "#dc2626"

      const marker = L.circleMarker([store.lat, store.lng], {
        radius: 8,
        fillColor: color,
        fillOpacity: 0.9,
        color: border,
        weight: 2,
      }).addTo(map)

      const label = store.site_title || store.subdomain
      const url = store.subdomain + ".tol.ar"
      const statusText = store.status === "active" ? "Activa" : "Inactiva"
      const ipText = store.byIp ? "<br/><small>ubicado por IP</small>" : ""

      marker.bindPopup(
        "<div style='min-width:160px'>" +
        "<strong style='font-size:13px'>" + label + "</strong><br/>" +
        "<a href='https://" + url + "' target='_blank' style='color:#185FA5;font-size:11px'>" + url + "</a><br/>" +
        "<span style='font-size:11px;color:#64748b'>" + store.email + "</span><br/>" +
        "<span style='font-size:10px;background:" + (store.status === "active" ? "#dcfce7" : "#fee2e2") + ";color:" + (store.status === "active" ? "#166534" : "#991b1b") + ";padding:1px 6px;border-radius:8px'>" + statusText + "</span>" +
        ipText +
        "</div>"
      )
    })
  }, [stores])

  return (
    <div
      key={stores.map(s=>s.id).join(",")}
      id="stores-map-container"
      style={{ height: 420, width: "100%", borderRadius: 8, zIndex: 0 }}
    />
  )
}

function isActive(store: any): boolean {
  if (store.plan === "templates") return false
  if (!store.trial_expires_at) return true
  return new Date(store.trial_expires_at) >= new Date()
}

export function StoresMap({ stores }: { stores: StoreData[] }) {
  const [ready, setReady] = useState(false)
  const [storesWithCoords, setStoresWithCoords] = useState<StoreWithCoords[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    if (typeof window === "undefined") return
    const filtered = stores.filter((s: any) => s.plan !== 'templates')
    const result = filtered.map((store: any, i: number) => ({
      ...store,
      status: isActive(store) ? "active" : "inactive",
      ...defaultCoords(i),
      byIp: true,
    }))
    setStoresWithCoords(result)
    setReady(true)
  }, [stores])

  const activeCount = storesWithCoords.filter((s) => s.status === "active").length
  const inactiveCount = storesWithCoords.filter((s) => s.status === "inactive").length
  const filtered = storesWithCoords.filter((s) => {
    if (filter === "active") return s.status === "active"
    if (filter === "inactive") return s.status === "inactive"
    return true
  })

  if (!ready) {
    return (
      <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
        Cargando mapa...
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "all" ? "#1e293b" : "transparent", color: filter === "all" ? "#fff" : "#64748b", borderColor: filter === "all" ? "#1e293b" : "#cbd5e1" }}>
          Todas ({storesWithCoords.length})
        </button>
        <button onClick={() => setFilter("active")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "active" ? "#16a34a" : "transparent", color: filter === "active" ? "#fff" : "#16a34a", borderColor: filter === "active" ? "#16a34a" : "#86efac" }}>
          Activas ({activeCount})
        </button>
        <button onClick={() => setFilter("inactive")} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid", cursor: "pointer", background: filter === "inactive" ? "#dc2626" : "transparent", color: filter === "inactive" ? "#fff" : "#dc2626", borderColor: filter === "inactive" ? "#dc2626" : "#fca5a5" }}>
          Inactivas ({inactiveCount})
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "1.5px solid #16a34a" }} />
            Activa
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #dc2626" }} />
            Inactiva
          </div>
        </div>
      </div>
      <LeafletMap stores={filtered} />
      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
        Posicion aproximada hasta que la tienda cargue su direccion.
      </p>
    </div>
  )
}
