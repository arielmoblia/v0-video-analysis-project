"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Campaign {
  id: string
  nombre: string
  canal: string
  utm_campaign: string
  estado: string
  created_at: string
}

interface ReferralItem {
  id: string
  count: number
  pct: number
}

const CANALES = ["youtube", "facebook", "whatsapp", "instagram", "promomail"]
const CANAL_LABELS: Record<string, string> = {
  youtube: "YouTube", facebook: "Facebook", whatsapp: "WhatsApp",
  instagram: "Instagram", promomail: "Promo Mail"
}
const CANAL_COLORS: Record<string, string> = {
  youtube: "#e24b4a", facebook: "#378add", whatsapp: "#22c55e",
  instagram: "#d4537e", promomail: "#7f77dd"
}

export function CampaniasTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [referral, setReferral] = useState<ReferralItem[]>([])
  const [canalActivo, setCanalActivo] = useState("youtube")
  const [showModal, setShowModal] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoCanal, setNuevoCanal] = useState("youtube")
  const [guardando, setGuardando] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)

  useEffect(() => {
    cargar()
    cargarReferral()
  }, [])

  const cargar = async () => {
    try {
      const res = await fetch("/api/super-admin/marketing-campaigns")
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch {}
  }

  const TODOS_LOS_CANALES = [
    "ia", "tiktok", "recomend", "google", "insta",
    "whatsapp", "facebook", "youtube", "promomail"
  ]

  const cargarReferral = async () => {
    try {
      const res = await fetch("/api/super-admin/referral-stats?days=30")
      const data = await res.json()
      const items = data.items || []
      // Completar con 0% los que no tienen respuestas
      const itemsFiltrados = items.filter((i: ReferralItem) => i.id !== "otro")
      const ids = itemsFiltrados.map((i: ReferralItem) => i.id)
      const completos = [...itemsFiltrados]
      for (const canal of TODOS_LOS_CANALES) {
        if (!ids.includes(canal)) {
          completos.push({ id: canal, count: 0, pct: 0 })
        }
      }
      // Ordenar por pct desc manteniendo el orden definido para los 0%
      completos.sort((a: ReferralItem, b: ReferralItem) => b.pct - a.pct)
      setReferral(completos)
    } catch {}
  }

  const crear = async () => {
    if (!nuevoNombre.trim()) return
    setGuardando(true)
    try {
      const res = await fetch("/api/super-admin/marketing-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "crear", datos: { nombre: nuevoNombre, canal: nuevoCanal } })
      })
      const data = await res.json()
      if (data.campaign) {
        setCampaigns(prev => [data.campaign, ...prev])
        setCanalActivo(nuevoCanal)
        setNuevoNombre("")
        setShowModal(false)
      }
    } catch {}
    setGuardando(false)
  }

  const repetir = async (id: string) => {
    try {
      const res = await fetch("/api/super-admin/marketing-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "repetir", datos: { id } })
      })
      const data = await res.json()
      if (data.campaign) {
        setCampaigns(prev => [data.campaign, ...prev])
        setCanalActivo(data.campaign.canal)
      }
    } catch {}
  }

  const cambiarEstado = async (id: string, estado: string) => {
    try {
      await fetch("/api/super-admin/marketing-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "estado", datos: { id, estado } })
      })
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
    } catch {}
  }

  const copiar = (utm: string, id: string) => {
    const url = `https://tol.ar/?utm_source=${campaigns.find(c=>c.id===id)?.canal}&utm_campaign=${utm}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
  }

  const getUtmUrl = (c: Campaign) =>
    `https://tol.ar/?utm_source=${c.canal}&utm_campaign=${c.utm_campaign}`

  const campanasFiltradas = campaigns.filter(c => c.canal === canalActivo)

  const top3 = [...referral].sort((a, b) => b.pct - a.pct).slice(0, 3)
  const resto = [...referral].sort((a, b) => b.pct - a.pct).slice(3)

  const podioColors: Record<number, { bg: string; border: string; text: string; sub: string }> = {
    0: { bg: "#eaf3de", border: "#c0dd97", text: "#3b6d11", sub: "#639922" },
    1: { bg: "#f1efe8", border: "#d3d1c7", text: "#5f5e5a", sub: "#888780" },
    2: { bg: "#e6f1fb", border: "#b5d4f4", text: "#185fa5", sub: "#378add" },
  }
  const podioEmoji = ["🥇", "🥈", "🥉"]

  const LABEL_MAP: Record<string, string> = {
    ia: "IA", otro: "TikTok", tiktok: "TikTok", recomend: "Referidos",
    google: "Google", insta: "Instagram", whatsapp: "WhatsApp",
    facebook: "Facebook", youtube: "YouTube", promomail: "Promo Mail"
  }

  return (
    <div className="space-y-4">

      {/* BLOQUE 1: DE DONDE VIENEN */}
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium mb-3">¿De dónde vienen las tiendas?</p>
        {referral.length === 0 ? (
          <p className="text-xs text-muted-foreground">Cargando datos...</p>
        ) : (
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:"8px",marginBottom:"16px"}}>
              {[...referral].sort((a, b) => b.pct - a.pct).map((item, i) => {
                const isTop = i < 3
                const colors = isTop ? podioColors[i] : { bg: "var(--color-background-secondary)", border: "var(--color-border-tertiary)", text: "var(--color-text-primary)", sub: "var(--color-text-secondary)" }
                return (
                  <div key={item.id} className="rounded-lg p-3 text-center border"
                    style={{ background: colors.bg, borderColor: colors.border }}>
                    {isTop && <div className="text-base mb-1">{podioEmoji[i]}</div>}
                    <div className="text-xs font-medium mb-1" style={{ color: colors.text }}>
                      {LABEL_MAP[item.id] || item.id}
                    </div>
                    <div className="text-xl font-medium" style={{ color: colors.text }}>{item.pct}%</div>
                  </div>
                )
              })}
            </div>
            <div className="space-y-1.5">
              {[...referral].sort((a, b) => b.pct - a.pct).map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-32 text-right shrink-0">
                    {LABEL_MAP[item.id] || item.id}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-background-secondary)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${Math.max(item.pct, 2)}%`, background: CANAL_COLORS[item.id] || "#888780" }}></div>
                  </div>
                  <span className="text-xs font-medium w-8 shrink-0">{item.pct}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* BLOQUE 2: CAMPAÑAS */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">Campañas</p>
          <Button size="sm" variant="outline" onClick={() => setShowModal(true)}>+ Nueva campaña</Button>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {CANALES.map(c => (
            <button key={c}
              onClick={() => setCanalActivo(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                canalActivo === c
                  ? "bg-background border-foreground/40 font-medium text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              {CANAL_LABELS[c]}
            </button>
          ))}
        </div>

        {campanasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground border rounded-lg border-dashed">
            Sin campañas de {CANAL_LABELS[canalActivo]} todavía — apretá + Nueva campaña
          </div>
        ) : (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Fecha</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nombre</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">UTM</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Tiendas</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Estado</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {campanasFiltradas.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                  </td>
                  <td className="py-2.5 px-2 font-medium">{c.nombre}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded max-w-[180px] truncate block">
                        {getUtmUrl(c)}
                      </code>
                      <button
                        onClick={() => copiar(c.utm_campaign, c.id)}
                        className="text-muted-foreground hover:text-foreground shrink-0">
                        {copiado === c.id ? "✓" : "📋"}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    {/* Tiendas que usaron este UTM — dato real */}
                    <span className="font-medium">—</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <select
                      className="text-xs border rounded px-1.5 py-0.5 bg-background"
                      value={c.estado}
                      onChange={e => cambiarEstado(c.id, e.target.value)}>
                      <option value="activa">Activa</option>
                      <option value="pausada">Pausada</option>
                      <option value="terminada">Terminada</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-2">
                    <button
                      onClick={() => repetir(c.id)}
                      className="text-xs px-2.5 py-1 rounded border border-border hover:bg-muted transition-colors whitespace-nowrap">
                      Repetir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL NUEVA CAMPAÑA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-background rounded-xl border p-6 w-80 space-y-4">
            <p className="text-sm font-medium">Nueva campaña</p>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Nombre</label>
              <input
                autoFocus
                className="w-full text-sm px-3 py-2 rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Ej: Short Navidad 2026"
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                onKeyDown={e => e.key === "Enter" && crear()}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Canal</label>
              <select
                className="w-full text-sm px-3 py-2 rounded border bg-background focus:outline-none"
                value={nuevoCanal}
                onChange={e => setNuevoCanal(e.target.value)}>
                {CANALES.map(c => <option key={c} value={c}>{CANAL_LABELS[c]}</option>)}
              </select>
            </div>
            {nuevoNombre && (
              <div className="bg-muted rounded p-2">
                <p className="text-xs text-muted-foreground mb-1">UTM generado:</p>
                <code className="text-xs break-all">
                  https://tol.ar/?utm_source={nuevoCanal}&utm_campaign={nuevoNombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                </code>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button size="sm" onClick={crear} disabled={guardando || !nuevoNombre.trim()}>
                {guardando ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
