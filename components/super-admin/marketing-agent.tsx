"use client"
import { useState } from "react"
import { YoutubeAgent } from "@/components/super-admin/youtube-agent"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react"

interface Sugerencia {
  titulo: string
  tipo: string
  motivo: string
  contenido: string
}

interface Contexto {
  tiendasNuevas7d: number
  tiendasInactivas30d: number
  visitasDesde: number
  red: string
}

const REDES = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
]

export function MarketingAgent() {
  const [redActiva, setRedActiva] = useState("facebook")
  const [brief, setBrief] = useState("")
  const [cargando, setCargando] = useState(false)
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])
  const [contexto, setContexto] = useState<Contexto | null>(null)
  const [aprobadas, setAprobadas] = useState<Set<number>>(new Set())
  const [descartadas, setDescartadas] = useState<Set<number>>(new Set())
  const [copiado, setCopiado] = useState<number | null>(null)
  const [error, setError] = useState("")

  const generar = async (red?: string) => {
    const redTarget = red || redActiva
    setCargando(true)
    setError("")
    setSugerencias([])
    setAprobadas(new Set())
    setDescartadas(new Set())
    try {
      const res = await fetch("/api/super-admin/marketing-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ red: redTarget, brief })
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setSugerencias(data.sugerencias || [])
      setContexto(data.contexto || null)
      setBrief("")
    } catch {
      setError("Error de conexión")
    } finally {
      setCargando(false)
    }
  }

  const copiar = async (texto: string, idx: number) => {
    await navigator.clipboard.writeText(texto)
    setCopiado(idx)
    setTimeout(() => setCopiado(null), 2000)
  }

  const switchRed = (red: string) => {
    setRedActiva(red)
    setSugerencias([])
    setContexto(null)
    setError("")
    setAprobadas(new Set())
    setDescartadas(new Set())
  }

  const pendientes = sugerencias.filter((_, i) => !aprobadas.has(i) && !descartadas.has(i)).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Agente de marketing</span>
          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">En línea</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={() => generar()} disabled={cargando}>
          {cargando ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
          {cargando ? "Generando..." : "Generar sugerencias"}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {REDES.map(r => (
          <button
            key={r.id}
            onClick={() => switchRed(r.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              redActiva === r.id
                ? "bg-background border-foreground/40 font-medium text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {redActiva === "youtube" ? <YoutubeAgent /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          {contexto && (
            <div className="rounded-lg border p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Datos leídos</p>
              <div className="flex justify-between text-xs py-1 border-b"><span className="text-muted-foreground">Tiendas nuevas (7d)</span><span className="font-medium text-green-600">+{contexto.tiendasNuevas7d}</span></div>
              <div className="flex justify-between text-xs py-1 border-b"><span className="text-muted-foreground">Tiendas inactivas</span><span className="font-medium text-amber-600">{contexto.tiendasInactivas30d}</span></div>
              <div className="flex justify-between text-xs py-1"><span className="text-muted-foreground">Visitas desde {redActiva}</span><span className="font-medium">{contexto.visitasDesde}</span></div>
            </div>
          )}
          {!contexto && !cargando && (
            <div className="rounded-lg border p-3 text-xs text-muted-foreground">
              Hacé clic en "Generar sugerencias" para que el agente lea los datos de Supabase y cree borradores para {REDES.find(r => r.id === redActiva)?.label}.
            </div>
          )}
          {cargando && (
            <div className="rounded-lg border p-3 text-xs text-muted-foreground animate-pulse">
              Leyendo datos de Supabase y consultando al agente...
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-3">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>
          )}

          {sugerencias.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Borradores generados</p>
              <span className="text-xs text-muted-foreground">{pendientes > 0 ? `${pendientes} pendiente${pendientes > 1 ? "s" : ""}` : "Todo revisado"}</span>
            </div>
          )}

          {sugerencias.map((sug, idx) => {
            const aprobada = aprobadas.has(idx)
            const descartada = descartadas.has(idx)
            return (
              <div key={idx} className={`rounded-lg border p-4 space-y-2 transition-opacity ${descartada ? "opacity-40" : ""} ${aprobada ? "border-green-300 bg-green-50/30" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{sug.tipo}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{sug.motivo}</span>
                </div>
                <p className="text-sm font-medium">{sug.titulo}</p>
                <div className="bg-muted rounded-md p-3 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {sug.contenido}
                </div>
                {!aprobada && !descartada && (
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs h-7 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => setAprobadas(prev => new Set(prev).add(idx))}>
                      Aprobar
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7"
                      onClick={() => copiar(sug.contenido, idx)}>
                      {copiado === idx ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copiado === idx ? "Copiado" : "Copiar"}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground"
                      onClick={() => setDescartadas(prev => new Set(prev).add(idx))}>
                      Descartar
                    </Button>
                  </div>
                )}
                {aprobada && <p className="text-xs text-green-600 font-medium">Aprobado — listo para publicar</p>}
                {descartada && <p className="text-xs text-muted-foreground">Descartado</p>}
              </div>
            )
          })}

          <div className="flex gap-2">
            <input
              value={brief}
              onChange={e => setBrief(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !cargando && generar()}
              placeholder={`Brief para ${REDES.find(r => r.id === redActiva)?.label}: "Generá un post para vendedoras de ropa de Mendoza"...`}
              className="flex-1 text-sm px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button size="sm" variant="outline" onClick={() => generar()} disabled={cargando}>
              {cargando ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Generar ↗"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">El agente cruza tu brief con datos reales de Supabase antes de generar</p>
        </div>
      </div>}
    </div>
  )
}
