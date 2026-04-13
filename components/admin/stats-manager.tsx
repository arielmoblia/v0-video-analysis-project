
"use client"
import { useState, useEffect } from "react"

interface StatsManagerProps {
  storeId: string
  onActivate?: () => void
  isUnlocked?: boolean
}

const DEMO_DATA = {
  7:  { visitas: 312,  unicos: 241,  pedidos: 6,  conv: 1.9,
        dv: "+5% vs período anterior",  du: "+3% vs período anterior",  dp: "+1 vs período anterior",  dc: "+0.1 vs período anterior",
        dcls: "up", dpcls: "up", ddcls: "up", dccls: "up",
        bars: [22,18,35,41,28,52,48], labels: ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"] },
  30: { visitas: 1284, unicos: 876,  pedidos: 23, conv: 1.8,
        dv: "+12% vs período anterior", du: "+8% vs período anterior",  dp: "+3 vs período anterior",  dc: "-0.2 vs período anterior",
        dcls: "up", dpcls: "up", ddcls: "up", dccls: "down",
        bars: [30,25,40,55,38,70,62,45,50,30,28,60,75,80,55,45,38,42,65,58,72,68,50,45,40,55,62,70,80,75], labels: null },
  90: { visitas: 3910, unicos: 2340, pedidos: 71, conv: 1.8,
        dv: "+22% vs período anterior", du: "+18% vs período anterior", dp: "+14 vs período anterior", dc: "+0.3 vs período anterior",
        dcls: "up", dpcls: "up", ddcls: "up", dccls: "up",
        bars: [20,25,30,35,40,45,38,42,50,55,60,58,65,70,68,72,75,80,78,82,85,80,75,70,65,62,60,58,55,52,50,48,45,42,40,38,42,45,50,55,60,65,70,75,80,85,90,88,85,82,80,78,75,72,70,68,65,62,60,58], labels: null },
}

const DEMO_PRODUCTS = [
  { name: "Remera básica blanca", pct: 100, views: 247 },
  { name: "Jean tiro alto azul",  pct: 78,  views: 193 },
  { name: "Campera impermeable",  pct: 52,  views: 129 },
  { name: "Calza deportiva",      pct: 31,  views: 77  },
  { name: "Musculosa negra",      pct: 18,  views: 44  },
]

const DEMO_HORAS = [
  { hora: "09hs", count: 30 }, { hora: "11hs", count: 55 },
  { hora: "13hs", count: 70 }, { hora: "15hs", count: 85 },
  { hora: "17hs", count: 90 }, { hora: "19hs", count: 75 },
  { hora: "21hs", count: 45 },
]

const DEMO_DISPOSITIVOS = [
  { name: "Celular",      pct: 68, color: "#378ADD" },
  { name: "Computadora",  pct: 27, color: "#5DCAA5" },
  { name: "Tablet",       pct:  5, color: "#B4B2A9" },
]

export function StatsManager({ storeId, onActivate, isUnlocked = false }: StatsManagerProps) {
  const [period, setPeriod] = useState<7 | 30 | 90>(30)
  const [realData, setRealData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isUnlocked) return
    setLoading(true)
    fetch(`/api/admin/store-stats?storeId=${storeId}&days=${period}`)
      .then(r => r.json())
      .then(d => { setRealData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isUnlocked, storeId, period])

  const demo = DEMO_DATA[period]

  // Datos a mostrar: reales o demo
  const visitas   = isUnlocked ? (realData?.visitas?.val   ?? 0) : demo.visitas
  const unicos    = isUnlocked ? (realData?.unicos?.val    ?? 0) : demo.unicos
  const pedidos   = isUnlocked ? (realData?.pedidos?.val   ?? 0) : demo.pedidos
  const conv      = isUnlocked ? (realData?.conversion?.val ?? 0) : demo.conv
  const dv        = isUnlocked ? (realData?.visitas?.delta?.txt   ?? "") : demo.dv
  const du        = isUnlocked ? (realData?.unicos?.delta?.txt    ?? "") : demo.du
  const dp        = isUnlocked ? (realData?.pedidos?.delta?.txt   ?? "") : demo.dp
  const dc        = isUnlocked ? (realData?.conversion?.delta?.txt ?? "") : demo.dc
  const dvcls     = isUnlocked ? (realData?.visitas?.delta?.cls   ?? "neutral") : demo.dcls
  const ducls     = isUnlocked ? (realData?.unicos?.delta?.cls    ?? "neutral") : demo.dpcls
  const dpcls     = isUnlocked ? (realData?.pedidos?.delta?.cls   ?? "neutral") : demo.ddcls
  const dccls     = isUnlocked ? (realData?.conversion?.delta?.cls ?? "neutral") : demo.dccls

  const bars      = isUnlocked ? (realData?.dailyViews?.map((d: any) => d.count) ?? []) : demo.bars
  const barLabels = isUnlocked
    ? (realData?.dailyViews?.map((_: any, i: number, arr: any[]) => {
        const diff = arr.length - 1 - i
        return diff === 0 ? "Hoy" : diff % Math.ceil(arr.length / 7) === 0 ? `-${diff}d` : ""
      }) ?? [])
    : (demo.labels ?? demo.bars.map((_: any, i: number, arr: any[]) => {
        const diff = arr.length - 1 - i
        return diff === 0 ? "Hoy" : diff % Math.ceil(arr.length / 7) === 0 ? `-${diff}d` : ""
      }))

  const horasPico    = isUnlocked ? (realData?.horasPico    ?? []) : DEMO_HORAS
  const dispositivos = isUnlocked ? (realData?.dispositivos?.map((d: any) => ({
    ...d,
    color: d.name === "Celular" ? "#378ADD" : d.name === "Computadora" ? "#5DCAA5" : "#B4B2A9"
  })) ?? []) : DEMO_DISPOSITIVOS
  const topProductos = isUnlocked ? (realData?.topProductos ?? []) : DEMO_PRODUCTS.map(p => ({ name: p.name, views: p.views, pct: p.pct }))

  const maxBar  = Math.max(...bars, 1)
  const maxHora = Math.max(...horasPico.map((h: any) => h.count), 1)
  const deltaColor = (cls: string) => cls === "up" ? "#3B6D11" : cls === "down" ? "#A32D2D" : "#888"

  return (
    <div style={{ position: "relative" }}>

      {/* OVERLAY — solo si NO está desbloqueado */}
      {!isUnlocked && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(3px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
          borderRadius: "12px",
        }}>
          <div style={{ fontSize: "32px" }}>📊</div>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
            Las estadísticas son parte del Plan Cositas
          </p>
          <p style={{ fontSize: "13px", color: "#666", margin: 0, textAlign: "center", maxWidth: "280px" }}>
            Activá esta función para ver datos reales de tu tienda
          </p>
          <button onClick={onActivate} style={{
            marginTop: "8px", padding: "12px 32px",
            background: "#f97316", color: "#fff",
            border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: 600, cursor: "pointer",
          }}>
            ACTIVAR ESTADÍSTICAS
          </button>
        </div>
      )}

      {/* CONTENIDO */}
      <div style={{ padding: "24px", fontFamily: "sans-serif", color: "#1a1a1a" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, margin: 0 }}>
            Estadísticas de tu tienda
            {isUnlocked && loading && <span style={{ fontSize: "13px", fontWeight: 400, color: "#999", marginLeft: "12px" }}>cargando...</span>}
          </h2>
          <div style={{ display: "flex", gap: "6px" }}>
            {([7, 30, 90] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "5px 14px", borderRadius: "8px", cursor: "pointer",
                border: "1px solid #e5e7eb",
                background: period === p ? "#185FA5" : "#fff",
                color: period === p ? "#fff" : "#666",
                fontSize: "12px", fontWeight: 500,
              }}>{p} días</button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "Visitas totales",              val: visitas.toLocaleString("es-AR"), delta: dv,  cls: dvcls },
            { label: "Visitantes únicos",             val: unicos.toLocaleString("es-AR"),  delta: du,  cls: ducls },
            { label: "Pedidos",                       val: pedidos.toString(),               delta: dp,  cls: dpcls },
            { label: "De cada 100 visitas, compran",  val: Number(conv).toFixed(1),          delta: dc,  cls: dccls },
          ].map(c => (
            <div key={c.label} style={{ background: "#f9fafb", borderRadius: "8px", padding: "14px 16px" }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{c.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 600 }}>{c.val}</div>
              {c.delta && <div style={{ fontSize: "11px", marginTop: "4px", color: deltaColor(c.cls) }}>{c.delta}</div>}
            </div>
          ))}
        </div>

        {/* GRÁFICO BARRAS */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>Visitas por día</div>
          {bars.length === 0 ? (
            <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: "13px" }}>Sin datos en este período</div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "80px", marginBottom: "6px" }}>
                {bars.map((v: number, i: number) => (
                  <div key={i} style={{
                    flex: 1, height: `${Math.round(v / maxBar * 100)}%`,
                    background: i === bars.length - 1 ? "#378ADD" : "#B5D4F4",
                    borderRadius: "3px 3px 0 0", minHeight: v > 0 ? "2px" : "0",
                  }} title={`${v} visitas`} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {barLabels.filter(Boolean).map((l: string, i: number) => (
                  <span key={i} style={{ fontSize: "10px", color: "#aaa" }}>{l}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* DOS COLUMNAS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          {/* PRODUCTOS */}
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>Productos más vistos</div>
            {topProductos.length === 0 ? (
              <div style={{ color: "#bbb", fontSize: "13px" }}>Sin datos todavía</div>
            ) : topProductos.map((p: any) => (
              <div key={p.name} style={{ paddingBottom: "10px", marginBottom: "10px", borderBottom: "0.5px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{p.name}</span>
                  <span style={{ color: "#999" }}>{p.views} vistas</span>
                </div>
                <div style={{ height: "4px", background: "#f0f0f0", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: `${p.pct}%`, background: "#185FA5", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* DISPOSITIVOS + HORARIOS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>Dispositivos</div>
              {dispositivos.map((dev: any) => (
                <div key={dev.name} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", width: "90px" }}>{dev.name}</span>
                  <div style={{ flex: 1, height: "6px", background: "#f0f0f0", borderRadius: "3px" }}>
                    <div style={{ width: `${dev.pct}%`, height: "100%", background: dev.color, borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, width: "30px", textAlign: "right" }}>{dev.pct}%</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>Horario pico</div>
              {horasPico.length === 0 ? (
                <div style={{ color: "#bbb", fontSize: "13px" }}>Sin datos todavía</div>
              ) : horasPico.map((h: any) => (
                <div key={h.hora} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#999", width: "36px", textAlign: "right" }}>{h.hora}</span>
                  <div style={{ height: "14px", width: `${Math.round(h.count / maxHora * 85)}%`, background: h.count === maxHora ? "#378ADD" : "#B5D4F4", borderRadius: "2px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nota demo */}
        {!isUnlocked && (
          <p style={{ textAlign: "center", fontSize: "12px", color: "#bbb", marginTop: "16px" }}>
            * Datos de ejemplo — activá para ver los datos reales de tu tienda
          </p>
        )}
      </div>
    </div>
  )
}
