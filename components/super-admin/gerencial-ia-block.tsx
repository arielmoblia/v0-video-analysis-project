"use client"
import { useEffect, useState } from "react"

interface Query { query: string; clicks: number; impressions: number; position: number }
interface GscData {
  ok: boolean
  totalClicks?: number
  totalImpressions?: number
  posicionMedia?: number
  topQueries?: Query[]
  error?: string
}

export function GerencialIABlock() {
  const [data, setData] = useState<GscData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/super-admin/gsc-real")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-slate-50 rounded-xl px-6 py-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Datos reales de Google Search Console</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800">últimos 28 días</span>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando datos de Google...</p>
      ) : !data?.ok ? (
        <p className="text-sm text-red-500">No se pudieron leer los datos: {data?.error}</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-slate-800">{data.totalClicks}</div>
              <div className="text-xs text-slate-500 mt-1">clics</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-slate-800">{data.totalImpressions?.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">impresiones</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-slate-800">{data.posicionMedia}</div>
              <div className="text-xs text-slate-500 mt-1">posición media</div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-100 text-xs font-medium text-slate-600">Búsquedas reales por las que te encuentran</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-slate-400">
                  <th className="text-left font-normal px-3 py-1.5">búsqueda</th>
                  <th className="text-center font-normal px-2 py-1.5">clics</th>
                  <th className="text-center font-normal px-2 py-1.5">impr.</th>
                  <th className="text-center font-normal px-2 py-1.5">posición</th>
                </tr>
              </thead>
              <tbody>
                {data.topQueries?.map((q, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-slate-700 text-xs">{q.query}</td>
                    <td className="text-center px-2 py-1.5 text-xs font-medium">{q.clicks}</td>
                    <td className="text-center px-2 py-1.5 text-xs text-slate-500">{q.impressions}</td>
                    <td className={`text-center px-2 py-1.5 text-xs font-medium ${q.position <= 10 ? "text-green-600" : q.position <= 20 ? "text-amber-500" : "text-red-500"}`}>{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Verde = primera página · Ámbar = segunda · Rojo = más abajo (casi nadie llega)</p>
        </>
      )}
    </div>
  )
}
