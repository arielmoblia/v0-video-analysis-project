"use client"
import React, { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

interface Analytics {
  visitasArgentina: number
  unicosArgentina: number
  nuevasTiendas: number
  conversionRate: number
  inactivas: number
  sinProductos: number
  mrr: number
  topStores: { subdomain: string; title: string; views: number }[]
  devices: { mobile: number; desktop: number }
  topPages: { path: string; views: number }[]
  conversionPorDia: { fecha: string; visitas: number; unicos: number; registros: number; pct: number }[]
}

interface Referral {
  total: number
  items: { id: string; count: number; pct: number }[]
}

const REFERRAL_LABELS: Record<string, string> = {
  insta: "Instagram", recomend: "Me recomendaron", ia: "AI",
  face: "Facebook", whatsapp: "WhatsApp", google: "Google",
  youtube: "YouTube", otro: "Otro"
}

export function AnalyticsDashboard() {
  const [data, setData]       = useState<Analytics | null>(null)
  const [referral, setReferral] = useState<Referral | null>(null)
  const [days, setDays]       = useState(7)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch("/api/super-admin/analytics?days=" + days).then(r => r.json()),
      fetch("/api/super-admin/referral-stats?days=" + days).then(r => r.json()),
    ]).then(([a, ref]) => { setData(a); setReferral(ref); setLoading(false) })
  }

  useEffect(() => { fetchData() }, [days])

  const val = (v: any, color: string, suffix = "") => (
    <p style={{ margin:"0 0 2px", fontSize:"28px", fontWeight:600, color: loading ? "#ccc" : color }}>
      {loading ? "..." : v}{suffix}
    </p>
  )

  const totalDevice = (data?.devices.mobile || 0) + (data?.devices.desktop || 0)
  const mobilePct = totalDevice > 0 ? Math.round((data?.devices.mobile || 0) / totalDevice * 100) : 0

  const bestDay = data?.conversionPorDia?.length
    ? data.conversionPorDia.reduce((a, b) => b.pct > a.pct ? b : a)
    : null

  return (
    <div style={{ padding:"24px", color:"#1a1a1a", fontFamily:"sans-serif" }}>

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
        <h1 style={{ margin:0, fontSize:"20px", fontWeight:700 }}>Estadísticas de la Plataforma</h1>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding:"6px 14px", borderRadius:"8px", border:"1px solid #e5e7eb",
              background: days === d ? "#1a1a1a" : "#fff",
              color: days === d ? "#fff" : "#666", cursor:"pointer", fontSize:"13px"
            }}>{d} días</button>
          ))}
          <button onClick={fetchData} style={{ padding:"6px 10px", borderRadius:"8px", border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer" }}>
            <RefreshCw style={{ width:"14px", height:"14px" }} />
          </button>
        </div>
      </div>

      {/* SECCION 1 — COMO NOS CONOCIERON */}
      <div style={{ marginBottom:"32px" }}>
        <p style={{ fontSize:"12px", fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 14px" }}>¿Cómo nos conocieron?</p>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px" }}>
          <div style={{ display:"flex", gap:"24px", marginBottom:"20px" }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"22px", fontWeight:600, margin:0 }}>{referral?.total ?? "—"}</p>
              <p style={{ fontSize:"11px", color:"#888", margin:0 }}>respuestas</p>
            </div>
            {referral?.items?.[0] && (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:"16px", fontWeight:600, margin:0 }}>{REFERRAL_LABELS[referral.items[0].id] ?? referral.items[0].id}</p>
                <p style={{ fontSize:"11px", color:"#888", margin:0 }}>fuente líder</p>
              </div>
            )}
            {referral?.items?.find(i => i.id === "ia") && (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:"16px", fontWeight:600, margin:0, color:"#8b5cf6" }}>{referral.items.find(i => i.id === "ia")!.pct}%</p>
                <p style={{ fontSize:"11px", color:"#888", margin:0 }}>vía AI 🤖</p>
              </div>
            )}
            {referral?.items?.find(i => i.id === "recomend") && (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:"16px", fontWeight:600, margin:0, color:"#10b981" }}>{referral.items.find(i => i.id === "recomend")!.pct}%</p>
                <p style={{ fontSize:"11px", color:"#888", margin:0 }}>recomendación</p>
              </div>
            )}
            {referral?.items?.find(i => i.id === "google") && (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:"16px", fontWeight:600, margin:0, color:"#3b82f6" }}>{referral.items.find(i => i.id === "google")!.pct}%</p>
                <p style={{ fontSize:"11px", color:"#888", margin:0 }}>Google</p>
              </div>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {["insta","recomend","ia","face","whatsapp","google","youtube","otro"].map(id => {
              const item = referral?.items?.find(i => i.id === id)
              const pct = item?.pct ?? 0
              const maxCount = referral?.items?.[0]?.count ?? 1
              const barW = item ? Math.round(item.count / maxCount * 100) : 0
              return (
                <div key={id} style={{ display:"grid", gridTemplateColumns:"140px 1fr 40px", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"13px", color:"#1a1a1a", textAlign:"right" }}>{REFERRAL_LABELS[id]}</span>
                  <div style={{ background:"#f3f4f6", borderRadius:"99px", height:"8px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width: barW + "%", background:"#1a1a1a", borderRadius:"99px", transition:"width 0.3s" }} />
                  </div>
                  <span style={{ fontSize:"12px", color:"#888" }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* SECCION 2 — 7 KPIs */}
      <div style={{ marginBottom:"32px" }}>
        <p style={{ fontSize:"12px", fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 14px" }}>Métricas Clave</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:"12px" }}>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Visitas Argentina</p>
            {val(data?.visitasArgentina ?? "—", "#1a1a1a")}
            <div style={{ height:"2px", background:"#1a1a1a", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>entradas totales</p>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Visitantes Únicos</p>
            {val(data?.unicosArgentina ?? "—", "#1a1a1a")}
            <div style={{ height:"2px", background:"#8b5cf6", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>IPs distintas</p>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Tiendas Nuevas</p>
            {val(data?.nuevasTiendas ?? "—", "#1a1a1a")}
            <div style={{ height:"2px", background:"#10b981", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>en el período</p>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Conversión</p>
            {val((data?.conversionRate ?? "—") + (data ? "%" : ""), "#f59e0b")}
            <div style={{ height:"2px", background:"#f59e0b", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>visitas → registros</p>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Inactivas +7D</p>
            {val(data?.inactivas ?? "—", "#ef4444")}
            <div style={{ height:"2px", background:"#ef4444", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>sin actividad</p>
            <a href="/admin?tab=tiendas" style={{ display:"inline-block", marginTop:"8px", fontSize:"11px", color:"#64748b", textDecoration:"none", border:"1px solid #e2e8f0", borderRadius:"6px", padding:"3px 8px" }}>Reactivar →</a>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Sin Productos</p>
            {val(data?.sinProductos ?? "—", "#1a1a1a")}
            <div style={{ height:"2px", background:"#1a1a1a", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>tiendas vacías</p>
            <a href="/admin?tab=tiendas" style={{ display:"inline-block", marginTop:"8px", fontSize:"11px", color:"#64748b", textDecoration:"none", border:"1px solid #e2e8f0", borderRadius:"6px", padding:"3px 8px" }}>Ver lista →</a>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>MRR</p>
            {val("$" + (data?.mrr ?? 0), "#10b981")}
            <div style={{ height:"2px", background:"#10b981", width:"32px", margin:"4px 0 4px" }} />
            <p style={{ margin:0, fontSize:"11px", color:"#999" }}>USD recurrentes</p>
            <a href="/admin?tab=planes" style={{ display:"inline-block", marginTop:"8px", fontSize:"11px", color:"#64748b", textDecoration:"none", border:"1px solid #e2e8f0", borderRadius:"6px", padding:"3px 8px" }}>Crecer →</a>
          </div>

        </div>
      </div>

      {/* SECCION 3 — 3 COLUMNAS */}
      <div style={{ marginBottom:"32px" }}>
        <p style={{ fontSize:"12px", fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 14px" }}>Actividad de Tiendas</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px" }}>

          {/* Top tiendas */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px" }}>
            <p style={{ margin:"0 0 14px", fontWeight:600, fontSize:"14px" }}>Top tiendas</p>
            {loading ? <p style={{ color:"#ccc" }}>Cargando...</p> :
             !data?.topStores?.length ? <p style={{ color:"#999", fontSize:"13px" }}>Sin datos aún</p> :
             data.topStores.map((s, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f5f5f5" }}>
                <div>
                  <a href={"https://" + s.subdomain + ".tol.ar"} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:"13px", fontWeight:500, color:"#1d4ed8", textDecoration:"none" }}>{s.title}</a>
                  <p style={{ margin:0, fontSize:"11px", color:"#999" }}>{s.subdomain}.tol.ar</p>
                </div>
                <span style={{ fontWeight:700, color:"#1a1a1a", fontSize:"14px" }}>{s.views}</span>
              </div>
            ))}
          </div>

          {/* Celular vs PC */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px" }}>
            <p style={{ margin:"0 0 14px", fontWeight:600, fontSize:"14px" }}>Celular vs PC</p>
            {loading ? <p style={{ color:"#ccc" }}>Cargando...</p> : (
              <div>
                <div style={{ marginBottom:"16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                    <span style={{ fontSize:"13px", color:"#1a1a1a" }}>Celular</span>
                    <span style={{ fontWeight:700, fontSize:"14px" }}>{data?.devices.mobile ?? 0}</span>
                  </div>
                  <div style={{ height:"8px", background:"#f3f4f6", borderRadius:"99px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width: mobilePct + "%", background:"#1a1a1a", borderRadius:"99px" }} />
                  </div>
                </div>
                <div style={{ marginBottom:"16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                    <span style={{ fontSize:"13px", color:"#1a1a1a" }}>PC</span>
                    <span style={{ fontWeight:700, fontSize:"14px" }}>{data?.devices.desktop ?? 0}</span>
                  </div>
                  <div style={{ height:"8px", background:"#f3f4f6", borderRadius:"99px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width: (100 - mobilePct) + "%", background:"#8b5cf6", borderRadius:"99px" }} />
                  </div>
                </div>
                <p style={{ margin:0, fontSize:"12px", color:"#888" }}>
                  {mobilePct}% mobile — {mobilePct > 60 ? "el diseño mobile es crítico" : "buen balance"}
                </p>
              </div>
            )}
          </div>

          {/* Páginas más visitadas */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px" }}>
            <p style={{ margin:"0 0 14px", fontWeight:600, fontSize:"14px" }}>Páginas más visitadas</p>
            {loading ? <p style={{ color:"#ccc" }}>Cargando...</p> :
             !data?.topPages?.length ? <p style={{ color:"#999", fontSize:"13px" }}>Sin datos aún</p> :
             data.topPages.map((p, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f5f5f5" }}>
                <span style={{ fontSize:"13px", color:"#555" }}>{p.path}</span>
                <span style={{ fontWeight:700, color:"#1a1a1a" }}>{p.views}</span>
              </div>
            ))}
            <p style={{ margin:"12px 0 0", fontSize:"11px", color:"#bbb" }}>/admin excluído — solo tráfico real</p>
          </div>

        </div>
      </div>

      {/* SECCION 4 — TABLA CONVERSION */}
      <div>
        <p style={{ fontSize:"12px", fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 14px" }}>Conversión por Día — Solo Argentina</p>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #e5e7eb" }}>
                  <th style={{ textAlign:"left", padding:"8px 0", fontWeight:500, color:"#888", fontSize:"12px" }}>Fecha</th>
                  <th style={{ textAlign:"right", padding:"8px 16px", fontWeight:500, color:"#1a1a1a", fontSize:"12px" }}>Visitas</th>
                  <th style={{ textAlign:"right", padding:"8px 16px", fontWeight:500, color:"#8b5cf6", fontSize:"12px" }}>Únicos</th>
                  <th style={{ textAlign:"right", padding:"8px 16px", fontWeight:500, color:"#10b981", fontSize:"12px" }}>Registros</th>
                  <th style={{ textAlign:"right", padding:"8px 0", fontWeight:500, color:"#888", fontSize:"12px" }}>Conv.</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding:"16px 0", color:"#ccc", textAlign:"center" }}>Cargando...</td></tr>
                ) : !data?.conversionPorDia?.length ? (
                  <tr><td colSpan={5} style={{ padding:"16px 0", color:"#999", textAlign:"center" }}>Sin datos</td></tr>
                ) : data.conversionPorDia.map((row, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #f5f5f5" }}>
                    <td style={{ padding:"10px 0", color:"#1a1a1a", fontWeight:500 }}>{row.fecha}</td>
                    <td style={{ padding:"10px 16px", textAlign:"right", color:"#1a1a1a" }}>{row.visitas}</td>
                    <td style={{ padding:"10px 16px", textAlign:"right", color:"#8b5cf6" }}>{row.unicos}</td>
                    <td style={{ padding:"10px 16px", textAlign:"right", color:"#10b981" }}>{row.registros}</td>
                    <td style={{ padding:"10px 0", textAlign:"right" }}>
                      <span style={{
                        fontSize:"12px", padding:"2px 10px", borderRadius:"6px", fontWeight:600,
                        background: row.pct > 0 ? "#ecfdf5" : "#f9fafb",
                        color: row.pct > 0 ? "#059669" : "#9ca3af"
                      }}>{row.pct}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && data?.conversionPorDia?.length ? (
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"12px", marginTop:"8px", borderTop:"1px solid #f5f5f5", fontSize:"12px", color:"#888" }}>
              <span>Promedio: {data.conversionRate}% · Mejor día: {bestDay?.fecha} ({bestDay?.pct}%)</span>
              <span>IP Ariel excluida · solo Argentina</span>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  )
}
