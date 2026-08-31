"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { GeoPreguntas } from "./geo-preguntas"
import { RefreshCw, Bot, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Resultado = {
  id: string
  pregunta_id: string
  ia: string
  respuesta: string
  menciona_tolar: boolean
  updated_at: string
  geo_preguntas?: { pregunta: string }
}

type Pregunta = {
  id: string
  pregunta: string
  activa: boolean
  orden: number
}

const IA_LABELS: Record<string, string> = {
  claude: "Claude",
  chatgpt: "ChatGPT",
  gemini: "Gemini"
}

export function GeoIaTab() {
  const { toast } = useToast()
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [escaneando, setEscaneando] = useState(false)
  const [ultimoScan, setUltimoScan] = useState<string | null>(null)

  // Cargar preguntas y resultados al montar
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const [rPreguntas, rResultados] = await Promise.all([
      fetch("/api/super-admin/geo-preguntas").then(r => r.json()),
      fetch("/api/super-admin/geo-scan").then(r => r.json())
    ])
    if (rPreguntas.success) setPreguntas(rPreguntas.data)
    if (rResultados.success) {
      setResultados(rResultados.data)
      if (rResultados.data.length > 0) {
        const mas_reciente = rResultados.data.reduce((a: Resultado, b: Resultado) =>
          new Date(a.updated_at) > new Date(b.updated_at) ? a : b
        )
        setUltimoScan(mas_reciente.updated_at)
      }
    }
  }

  const escanear = async () => {
    setEscaneando(true)
    try {
      const res = await fetch("/api/super-admin/geo-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      })
      const data = await res.json()
      if (data.success) {
        await cargarDatos()
        const menciones = data.resultados.filter((r: any) => r.menciona_tolar).length
        toast({
          title: menciones > 0 ? `¡tol.ar aparece ${menciones} veces! 🎉` : "Escaneo completado",
          description: menciones > 0
            ? `${menciones} de ${data.resultados.length} respuestas mencionan tol.ar`
            : `0 de ${data.resultados.length} respuestas mencionan tol.ar todavía`
        })
      }
    } catch {
      toast({ title: "Error al escanear", variant: "destructive" })
    } finally {
      setEscaneando(false)
    }
  }

  // Para una pregunta e IA, devuelve el resultado
  const getResultado = (pregunta_id: string, ia: string) =>
    resultados.find(r => r.pregunta_id === pregunta_id && r.ia === ia)

  // Totales para el resumen
  const totalPositivos = resultados.filter(r => r.menciona_tolar).length
  const totalResultados = resultados.length

  return (
    <div className="space-y-6">
      {/* Header con stats y botón escanear */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Visibilidad en IAs
              </CardTitle>
              <CardDescription>
                ¿Cuándo un argentino le pregunta a una IA sobre e-commerce, aparece tol.ar?
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {ultimoScan && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Último scan: {new Date(ultimoScan).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <Button onClick={escanear} disabled={escaneando} size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${escaneando ? "animate-spin" : ""}`} />
                {escaneando ? "Escaneando... (30s)" : "Escanear ahora"}
              </Button>
            </div>
          </div>
        </CardHeader>
        {totalResultados > 0 && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-slate-800">{totalPositivos}/{totalResultados}</div>
                <div className="text-sm text-slate-500">respuestas<br/>mencionan tol.ar</div>
              </div>
              <div className="flex gap-3">
                {["claude", "chatgpt", "gemini"].map(ia => {
                  const deEsta = resultados.filter(r => r.ia === ia)
                  const positivos = deEsta.filter(r => r.menciona_tolar).length
                  return (
                    <div key={ia} className="text-center">
                      <div className={`text-lg font-bold ${positivos > 0 ? "text-green-600" : "text-slate-400"}`}>
                        {positivos}/{deEsta.length}
                      </div>
                      <div className="text-xs text-slate-500">{IA_LABELS[ia]}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabla de resultados por pregunta */}
      {preguntas.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Header columnas */}
              <div className="grid grid-cols-[1fr_80px_80px_80px] items-center px-4 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pregunta</span>
                {["claude", "chatgpt", "gemini"].map(ia => (
                  <span key={ia} className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
                    {IA_LABELS[ia]}
                  </span>
                ))}
              </div>

              {preguntas.filter(p => p.activa).map((p, i) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1fr_80px_80px_80px] items-center px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-700 italic pr-4">"{p.pregunta}"</span>
                  {["claude", "chatgpt", "gemini"].map(ia => {
                    const r = getResultado(p.id, ia)
                    return (
                      <div key={ia} className="flex justify-center">
                        {!r ? (
                          <span className="text-slate-200 text-lg">—</span>
                        ) : r.menciona_tolar ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-300" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestión de preguntas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Preguntas monitoreadas
          </CardTitle>
          <CardDescription>
            Las preguntas que se usan para testear la visibilidad en cada IA
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-6">
          <GeoPreguntas />
        </CardContent>
      </Card>
    </div>
  )
}
