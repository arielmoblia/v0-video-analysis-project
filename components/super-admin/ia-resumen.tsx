"use client"
import { useState, useEffect } from "react"

const IA_STATIC = [
  { nombre: "ChatGPT", popular: "#1 más usado", estado: "Urgente", estadoColor: "bg-red-100 text-red-700", bars: [{ name: "Tiendanube", pct: 75, color: "#E24B4A" }, { name: "Empretienda", pct: 20, color: "#EF9F27" }, { name: "tol.ar", pct: 5, color: "#1D9E75" }] },
  { nombre: "Gemini", popular: "#2 más usado", estado: "Urgente", estadoColor: "bg-red-100 text-red-700", bars: [{ name: "Tiendanube", pct: 80, color: "#E24B4A" }, { name: "Empretienda", pct: 18, color: "#EF9F27" }, { name: "tol.ar", pct: 2, color: "#1D9E75" }] },
  { nombre: "Perplexity", popular: "#3 más usado", estado: "Mejorando", estadoColor: "bg-amber-100 text-amber-700", bars: [{ name: "Tiendanube", pct: 50, color: "#E24B4A" }, { name: "tol.ar", pct: 30, color: "#1D9E75" }, { name: "Empretienda", pct: 20, color: "#EF9F27" }] },
  { nombre: "Claude", popular: "#4 más usado", estado: "Mejor canal", estadoColor: "bg-green-100 text-green-700", bars: [{ name: "tol.ar", pct: 45, color: "#1D9E75" }, { name: "Tiendanube", pct: 40, color: "#E24B4A" }, { name: "Empretienda", pct: 15, color: "#EF9F27" }] },
]

type PeriodoKey = "semana" | "mes" | "anio"

export function IaResumen() {
  const [entraron, setEntraron] = useState<Record<string, number>>({})
  const [periodo, setPeriodo] = useState<PeriodoKey>("mes")
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch(`/api/super-admin/geo-tracker?periodo=${periodo}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const map: Record<string, number> = {}
          d.data.forEach((item: { nombre: string; entraron: number }) => {
            map[item.nombre] = item.entraron
          })
          setEntraron(map)
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [periodo])

  const periodos: { key: PeriodoKey; label: string }[] = [
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mes" },
    { key: "anio", label: "Año" },
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        {periodos.map(p => (
          <button key={p.key} onClick={() => setPeriodo(p.key)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${periodo === p.key ? "bg-slate-800 text-white border-slate-800" : "border-slate-200 text-slate-500 hover:border-slate-400"}`}>
            {p.label}
          </button>
        ))}
        {cargando && <span className="text-xs text-slate-400 ml-2">Actualizando...</span>}
      </div>
      {IA_STATIC.map(ia => (
        <div key={ia.nombre} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{ia.nombre}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-400">{ia.popular}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${ia.estadoColor}`}>{ia.estado}</span>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold text-green-600">
                {ia.nombre in entraron ? entraron[ia.nombre] : "..."}
              </div>
              <div className="text-[10px] text-slate-400">entraron a tol.ar</div>
            </div>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            {ia.bars.map(b => (
              <div key={b.name} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-20 flex-shrink-0">{b.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                  <div className="h-1.5 rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
                <span className="text-xs font-medium w-8 text-right" style={{ color: b.color }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
