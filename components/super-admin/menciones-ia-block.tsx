"use client"

import { useEffect, useState } from "react"

interface RespuestaIA {
  ia: string
  respuesta: string
}

interface MencionesData {
  tableReady: boolean
  tolar: { hoy: number; semana: number; mes: number }
  tiendanube: { hoy: number; semana: number; mes: number }
  ultimaActualizacion?: string | null
  respuestasTolar?: RespuestaIA[]
  respuestasTiendanube?: RespuestaIA[]
}

const IA_LABELS: Record<string, string> = { claude: "Claude", chatgpt: "ChatGPT", gemini: "Gemini" }
const IA_COLORS: Record<string, string> = {
  claude: "text-purple-700 bg-purple-50",
  chatgpt: "text-green-700 bg-green-50",
  gemini: "text-blue-700 bg-blue-50",
}

function calcTendencia(semana: number, mes: number): "up" | "down" | "flat" {
  if (mes === 0 && semana === 0) return "flat"
  if (mes === 0) return "up"
  const weeklyRate = semana / 7
  const monthlyRate = mes / 30
  const ratio = monthlyRate > 0 ? weeklyRate / monthlyRate : 0
  if (ratio > 1.15) return "up"
  if (ratio < 0.85) return "down"
  return "flat"
}

function TendenciaArrow({ semana, mes, good }: { semana: number; mes: number; good: boolean }) {
  const t = calcTendencia(semana, mes)
  if (t === "up") return <span className={`text-base font-bold leading-none ${good ? "text-green-600" : "text-red-500"}`}>↑</span>
  if (t === "down") return <span className={`text-base font-bold leading-none ${good ? "text-red-500" : "text-green-600"}`}>↓</span>
  return <span className="text-base font-bold leading-none text-slate-400">→</span>
}

function CeldaMetrica({ value, max, total, barColor, loading }: {
  value: number; max: number; total: number; barColor: string; loading: boolean
}) {
  if (loading) return <span className="text-slate-300 text-xs">—</span>
  const barPct = max > 0 ? Math.round(value / max * 100) : 0
  const sharePct = total > 0 ? Math.round(value / total * 100) : 0
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
      <div className="text-sm font-bold text-slate-800 leading-none">
        {value}
        {total > 0 && <span className="text-[11px] font-normal text-slate-400 ml-1">({sharePct}%)</span>}
      </div>
      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${barPct}%` }} />
      </div>
    </div>
  )
}

function RespuestasExpandidas({ respuestas, brand }: { respuestas?: RespuestaIA[]; brand: string }) {
  if (!respuestas?.length) {
    return (
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 italic">
        Sin respuestas que mencionen {brand} — corré el análisis primero.
      </div>
    )
  }
  return (
    <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Lo que dicen las IAs sobre {brand}:</p>
      {respuestas.map(r => (
        <div key={r.ia} className="space-y-1">
          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${IA_COLORS[r.ia] || "text-slate-600 bg-slate-100"}`}>
            {IA_LABELS[r.ia] || r.ia}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-lg px-3 py-2">
            {r.respuesta.length > 350 ? r.respuesta.slice(0, 350) + "…" : r.respuesta}
          </p>
        </div>
      ))}
    </div>
  )
}

function formatTimestamp(ts: string | null | undefined): string | null {
  if (!ts) return null
  try {
    return new Date(ts).toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    })
  } catch { return ts }
}

export function MencionesIABlock({ onRefresh }: { onRefresh?: number }) {
  const [data, setData] = useState<MencionesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandTolar, setExpandTolar] = useState(false)
  const [expandTiendanube, setExpandTiendanube] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/admin/menciones-ia")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [onRefresh])

  const brecha = () => {
    if (!data?.tableReady) return null
    const t = data.tiendanube.mes
    const p = data.tolar.mes
    if (t === 0 && p === 0) return "Sin datos este mes — corré el análisis"
    if (p === 0 && t > 0) return `Brecha infinita — tol.ar no figura, Tiendanube sí`
    if (t === 0 && p > 0) return "¡tol.ar aparece y Tiendanube no este mes!"
    const ratio = Math.round(t / p)
    return ratio > 1
      ? `Tiendanube aparece ${ratio}× más que tol.ar este mes`
      : "tol.ar está alcanzando a la competencia"
  }

  const tn = data?.tiendanube ?? { hoy: 0, semana: 0, mes: 0 }
  const tl = data?.tolar ?? { hoy: 0, semana: 0, mes: 0 }
  const maxHoy = Math.max(tn.hoy, tl.hoy, 1)
  const maxSemana = Math.max(tn.semana, tl.semana, 1)
  const maxMes = Math.max(tn.mes, tl.mes, 1)
  const totalHoy = tn.hoy + tl.hoy
  const totalSemana = tn.semana + tl.semana
  const totalMes = tn.mes + tl.mes

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menciones en resultados de IA</p>
        {data?.ultimaActualizacion && (
          <span className="text-[11px] text-slate-400">
            🕐 Última medición: {formatTimestamp(data.ultimaActualizacion)}
          </span>
        )}
      </div>

      {/* Tabla */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-[11px] text-slate-400 font-normal py-2 pl-5 w-[26%]"></th>
            <th className="text-center text-[11px] text-slate-400 font-normal py-2">hoy</th>
            <th className="text-center text-[11px] text-slate-400 font-normal py-2">semana</th>
            <th className="text-center text-[11px] text-slate-400 font-normal py-2 w-12">tend.</th>
            <th className="text-center text-[11px] text-slate-400 font-normal py-2">mes</th>
            <th className="text-right text-[11px] text-slate-400 font-normal py-2 pr-4 w-[90px]"></th>
          </tr>
        </thead>
        <tbody>

          {/* Tiendanube */}
          <tr className="border-b border-slate-100">
            <td className="py-3 pl-5 text-slate-600 text-xs font-medium">Tiendanube</td>
            <td className="text-center py-3">
              <CeldaMetrica value={tn.hoy} max={maxHoy} total={totalHoy} barColor="bg-red-400" loading={loading} />
            </td>
            <td className="text-center py-3">
              <CeldaMetrica value={tn.semana} max={maxSemana} total={totalSemana} barColor="bg-red-400" loading={loading} />
            </td>
            <td className="text-center py-3">
              {!loading && data && <TendenciaArrow semana={tn.semana} mes={tn.mes} good={false} />}
            </td>
            <td className="text-center py-3">
              <CeldaMetrica value={tn.mes} max={maxMes} total={totalMes} barColor="bg-red-400" loading={loading} />
            </td>
            <td className="text-right py-3 pr-4">
              <button
                onClick={() => setExpandTiendanube(v => !v)}
                className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center gap-1 ml-auto"
              >
                {expandTiendanube ? "▲" : "▼"} ver IAs
              </button>
            </td>
          </tr>
          {expandTiendanube && (
            <tr className="border-b border-slate-100">
              <td colSpan={6} className="p-0">
                <RespuestasExpandidas respuestas={data?.respuestasTiendanube} brand="Tiendanube" />
              </td>
            </tr>
          )}

          {/* tol.ar */}
          <tr className="bg-green-50/40">
            <td className="py-3 pl-5">
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">tol.ar ✦</span>
            </td>
            <td className="text-center py-3">
              <CeldaMetrica value={tl.hoy} max={maxHoy} total={totalHoy} barColor="bg-green-500" loading={loading} />
            </td>
            <td className="text-center py-3">
              <CeldaMetrica value={tl.semana} max={maxSemana} total={totalSemana} barColor="bg-green-500" loading={loading} />
            </td>
            <td className="text-center py-3">
              {!loading && data && <TendenciaArrow semana={tl.semana} mes={tl.mes} good={true} />}
            </td>
            <td className="text-center py-3">
              <CeldaMetrica value={tl.mes} max={maxMes} total={totalMes} barColor="bg-green-500" loading={loading} />
            </td>
            <td className="text-right py-3 pr-4">
              <button
                onClick={() => setExpandTolar(v => !v)}
                className="text-[11px] px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-1 ml-auto"
              >
                {expandTolar ? "▲" : "▼"} ver IAs
              </button>
            </td>
          </tr>
          {expandTolar && (
            <tr>
              <td colSpan={6} className="p-0">
                <RespuestasExpandidas respuestas={data?.respuestasTolar} brand="tol.ar" />
              </td>
            </tr>
          )}

        </tbody>
      </table>

      {/* Footer */}
      {!loading && data && !data.tableReady && (
        <p className="text-center text-xs text-amber-600 bg-amber-50 px-5 py-3">
          Tabla no creada aún — ejecutá el SQL en Supabase Dashboard para activar el historial
        </p>
      )}
      {!loading && data?.tableReady && (
        <p className="text-center text-xs text-slate-400 px-5 py-3 border-t border-slate-100 bg-slate-50">
          {brecha()} · Mirá la barra de tol.ar — tiene que crecer
        </p>
      )}
    </div>
  )
}
