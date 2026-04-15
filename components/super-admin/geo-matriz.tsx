"use client"
import { GeoPreguntas } from "./geo-preguntas"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

type Pregunta = { id: string; pregunta: string; activa: boolean }
type Resultado = { ia: string; menciona_tolar: boolean }
type MatrizRow = { pregunta: Pregunta; resultados: Record<string, boolean | null> }

const IAS = ["gemini", "claude", "chatgpt", "perplexity"]
const IA_LABELS: Record<string, string> = {
  gemini: "Gemini",
  claude: "Claude",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity"
}

export function GeoMatriz() {
  const { toast } = useToast()
  const [matriz, setMatriz] = useState<MatrizRow[]>([])
  const [corriendo, setCorriendo] = useState(false)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null)
  const [mostrarEditor, setMostrarEditor] = useState(false)

  const cargarDatos = async () => {
    const [pregRes, resRes] = await Promise.all([
      fetch("/api/super-admin/geo-preguntas").then(r => r.json()),
      fetch("/api/super-admin/geo-resultados").then(r => r.json())
    ])
    if (!pregRes.success) return
    const preguntas: Pregunta[] = pregRes.data.filter((p: Pregunta) => p.activa)
    const resultados: Resultado[] = resRes.success ? resRes.data : []

    const rows: MatrizRow[] = preguntas.map(p => {
      const res: Record<string, boolean | null> = {}
      for (const ia of IAS) {
        const r = resultados.find((r: any) => r.pregunta_id === p.id && r.ia === ia)
        res[ia] = r ? r.menciona_tolar : null
      }
      return { pregunta: p, resultados: res }
    })
    setMatriz(rows)
  }

  useEffect(() => { cargarDatos() }, [])

  const correr = async () => {
    setCorriendo(true)
    try {
      const pregRes = await fetch("/api/super-admin/geo-preguntas").then(r => r.json())
      const preguntas = pregRes.data?.filter((p: Pregunta) => p.activa) || []
      const res = await fetch("/api/super-admin/geo-consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preguntas })
      })
      const data = await res.json()
      if (data.success) {
        setUltimaActualizacion(new Date().toLocaleTimeString("es-AR"))
        await cargarDatos()
        toast({ title: "Análisis completado" })
      }
    } catch {
      toast({ title: "Error al correr análisis", variant: "destructive" })
    } finally {
      setCorriendo(false)
    }
  }

  const apariciones = matriz.reduce((acc, row) => {
    for (const ia of IAS) {
      if (row.resultados[ia] === true) acc++
    }
    return acc
  }, 0)
  const total = matriz.length * IAS.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-3xl font-semibold">{apariciones}</span>
            <span className="text-lg text-slate-400"> / {total}</span>
          </div>
          <div className="text-xs text-slate-500">apariciones totales</div>
        </div>
        <div className="text-right">
          <Button size="sm" variant="outline" onClick={correr} disabled={corriendo} className="flex items-center gap-2">
            <RefreshCw className={`w-3 h-3 ${corriendo ? "animate-spin" : ""}`} />
            {corriendo ? "Analizando..." : "Correr ahora"}
          </Button>
          {ultimaActualizacion && <div className="text-xs text-slate-400 mt-1">Última corrida: {ultimaActualizacion}</div>}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-end mb-2">
        <button onClick={() => setMostrarEditor(!mostrarEditor)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
          <Settings className="w-3 h-3" />
          {mostrarEditor ? "Ocultar editor" : "Editar preguntas"}
        </button>
      </div>
      {mostrarEditor && (
        <div className="mb-4">
          <GeoPreguntas />
        </div>
      )}
      <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 w-1/2">Pregunta</th>
              {IAS.map(ia => (
                <th key={ia} className="text-center px-3 py-2.5 text-xs font-medium text-slate-500">{IA_LABELS[ia]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.map((row, i) => (
              <tr key={row.pregunta.id} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2.5 text-xs text-slate-600 italic">"{row.pregunta.pregunta}"</td>
                {IAS.map(ia => (
                  <td key={ia} className="text-center px-3 py-2.5">
                    {row.resultados[ia] === null ? (
                      <span className="text-xs text-slate-300">—</span>
                    ) : row.resultados[ia] ? (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">Aparece</span>
                    ) : (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600">No aparece</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {matriz.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-sm text-slate-400">Cargando preguntas...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
