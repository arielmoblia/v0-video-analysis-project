"use client"
import { useEffect, useState } from "react"

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  dailyViews: { date: string; views: number }[]
  topStores: { subdomain: string; title: string; views: number }[]
  topPages: { path: string; views: number }[]
}

interface PlatformData {
  totalStores: number
  newStoresThisMonth: number
  storesWithNoVisits: number
  planDistribution: Record<string, number>
}

export function StatsManager() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [platform, setPlatform] = useState<PlatformData | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/super-admin/analytics?days=${days}`).then(r => r.json()),
      fetch(`/api/super-admin/platform-stats`).then(r => r.json()),
    ]).then(([a, p]) => {
      setAnalytics(a)
      setPlatform(p)
      setLoading(false)
    })
  }, [days])

  const maxViews = Math.max(...(analytics?.dailyViews.map(d => d.views) || [1]))

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", color: "#1a1a1a" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>Analytics de la Plataforma</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: days === d ? "#1a1a1a" : "#f0f0f0",
              color: days === d ? "#fff" : "#666", fontWeight: 500
            }}>{d} días</button>
          ))}
        </div>
      </div>

      {/* SECCION 1: VISITAS A SUBDOMINIOS */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#444", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          📦 Visitas a tiendas (subdominios.tol.ar)
        </h2>

        {/* Tarjetas principales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "Visitas Totales", value: analytics?.totalViews ?? "—", sub: `Últimos ${days} días`, color: "#3b82f6" },
            { label: "Visitantes Únicos", value: analytics?.uniqueVisitors ?? "—", sub: `Últimos ${days} días`, color: "#10b981" },
            { label: "Promedio Diario", value: analytics ? Math.round(analytics.totalViews / days) : "—", sub: "Visitas por día", color: "#8b5cf6" },
            { label: "Tiendas Activas", value: analytics?.topStores.length ?? "—", sub: "Con visitas", color: "#f59e0b" },
          ].map((card, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: "0 0 8px", color: "#666", fontSize: "13px" }}>{card.label}</p>
              <p style={{ margin: "0 0 4px", fontSize: "32px", fontWeight: 700, color: loading ? "#ccc" : card.color }}>{loading ? "..." : card.value}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de barras */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: "14px" }}>Visitas por Día</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
            {loading ? <p style={{ color: "#ccc" }}>Cargando...</p> : analytics?.dailyViews.length === 0 ? <p style={{ color: "#999" }}>Sin datos aún</p> :
              analytics?.dailyViews.map((d, i) => (
                <div key={i} title={`${d.date}: ${d.views} visitas`} style={{
                  flex: 1, background: "#3b82f6", borderRadius: "4px 4px 0 0",
                  height: `${Math.max(4, (d.views / maxViews) * 100)}%`,
                  opacity: 0.8, cursor: "pointer", transition: "opacity 0.2s"
                }} />
              ))
            }
          </div>
        </div>

        {/* Top Tiendas + Páginas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: "14px" }}>Top Tiendas</p>
            {loading ? <p style={{ color: "#ccc" }}>...</p> : analytics?.topStores.length === 0 ? <p style={{ color: "#999", fontSize: "13px" }}>Sin datos aún</p> :
              analytics?.topStores.slice(0, 5).map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>{s.title}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#999" }}>{s.subdomain}.tol.ar</p>
                  </div>
                  <span style={{ fontWeight: 700, color: "#3b82f6" }}>{s.views}</span>
                </div>
              ))
            }
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: "14px" }}>Páginas Más Visitadas</p>
            {loading ? <p style={{ color: "#ccc" }}>...</p> : analytics?.topPages.length === 0 ? <p style={{ color: "#999", fontSize: "13px" }}>Sin datos aún</p> :
              analytics?.topPages.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: "13px", color: "#555" }}>{p.path}</span>
                  <span style={{ fontWeight: 700, color: "#3b82f6" }}>{p.views}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* SECCION 2: PLATAFORMA TOL.AR */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#444", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          🏗️ Estado de la Plataforma (tol.ar)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "Tiendas Totales", value: platform?.totalStores ?? "—", sub: "En la plataforma", color: "#1a1a1a" },
            { label: "Nuevas este mes", value: platform?.newStoresThisMonth ?? "—", sub: "Registros nuevos", color: "#10b981" },
            { label: "Sin visitas (30d)", value: platform?.storesWithNoVisits ?? "—", sub: "Posibles abandonadas", color: "#ef4444" },
            { label: "Plan más usado", value: platform ? Object.entries(platform.planDistribution).sort((a,b) => b[1]-a[1])[0]?.[0] ?? "—" : "—", sub: "Distribución de planes", color: "#8b5cf6" },
          ].map((card, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: "0 0 8px", color: "#666", fontSize: "13px" }}>{card.label}</p>
              <p style={{ margin: "0 0 4px", fontSize: "32px", fontWeight: 700, color: loading ? "#ccc" : card.color }}>{loading ? "..." : card.value}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECCION 3: PROXIMAMENTE (grises) */}
      <div>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#bbb", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          🔜 Próximamente
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[
            { label: "País / Ciudad", sub: "Origen de visitas" },
            { label: "Celular vs PC", sub: "Dispositivos" },
            { label: "Horarios pico", sub: "Tráfico por hora" },
            { label: "Smartlook", sub: "Grabaciones y mapas de calor" },
            { label: "Tasa de conversión", sub: "Visitas → Compras" },
            { label: "Visitas a tol.ar", sub: "Landing principal" },
            { label: "Ingresos por plan", sub: "MRR estimado" },
            { label: "Productos más vistos", sub: "Sin compra" },
          ].map((card, i) => (
            <div key={i} style={{ background: "#f9f9f9", border: "1px dashed #ddd", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: "0 0 8px", color: "#bbb", fontSize: "13px" }}>{card.label}</p>
              <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 700, color: "#ddd" }}>—</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#ccc" }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
