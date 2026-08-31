"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface DolarManagerProps {
  storeId: string
}

const TIPOS = [
  { key: "blue", label: "Blue ★", short: "Blue", desc: "El dólar informal, el más usado para fijar precios en negocios reales. Refleja la realidad económica del argentino común.", default: true },
  { key: "bolsa", label: "Bolsa (MEP)", short: "Bolsa (MEP)", desc: "Se opera a través de la bolsa comprando y vendiendo bonos. Es legal y muy usado por empresas." },
  { key: "ccl", label: "CCL", short: "CCL", desc: "Similar al MEP pero la operación involucra bonos en el exterior. Suele ser un poco más caro." },
  { key: "cripto", label: "Cripto (USDT)", short: "Cripto (USDT)", desc: "Referencia del dólar estable en exchanges cripto como Binance o Ripio." },
  { key: "mayorista", label: "Mayorista", short: "Mayorista", desc: "Lo usan bancos y grandes empresas. Siempre más bajo que el blue. No accesible al público general." },
  { key: "oficial", label: "Oficial", short: "Oficial", desc: "El del Banco Nación, regulado por el gobierno. El más bajo de todos, con límites de compra." },
]

const CASA_MAP: Record<string, string> = {
  blue: "blue", bolsa: "bolsa", ccl: "contadoconliqui",
  cripto: "cripto", mayorista: "mayorista", oficial: "oficial"
}

export function DolarManager({ storeId }: DolarManagerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState("blue")
  const [dolares, setDolares] = useState<any[]>([])
  const [updatedAt, setUpdatedAt] = useState("")

  useEffect(() => {
    fetch(`/api/admin/dolar?storeId=${storeId}`)
      .then(r => r.json())
      .then(data => {
        setSelected(data.tipo || "blue")
        setDolares(data.dolares || [])
        setUpdatedAt(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }))
        setLoading(false)
      })
  }, [storeId])

  const getValor = (key: string) => {
    const d = dolares.find((x: any) => x.casa === CASA_MAP[key])
    if (!d) return null
    return Math.round((d.compra + d.venta) / 2)
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/dolar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, tipo: selected, valor: getValor(selected) })
    })
    setSaving(false)
    if (res.ok) {
      toast({ title: "Guardado", description: `Usarás el dólar ${TIPOS.find(t => t.key === selected)?.short}` })
    } else {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  )

  const valorSelected = getValor(selected)

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dólar / Peso</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Cargá tus precios en dólares y tus clientes los verán en pesos argentinos automáticamente.
        </p>
        <p className="text-sm text-slate-400 mt-1">Actualizado hoy {updatedAt} hs · dolarapi.com</p>
      </div>

      {/* LAYOUT DOS COLUMNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* IZQUIERDA — selector */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Elegí con qué dólar trabajar</p>
          {TIPOS.map(t => {
            const valor = getValor(t.key)
            const isSelected = selected === t.key
            return (
              <div
                key={t.key}
                onClick={() => setSelected(t.key)}
                className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer transition-all border-2 ${
                  isSelected ? "bg-blue-50 border-blue-500" : "bg-slate-50 border-transparent hover:border-slate-200"
                }`}
              >
                <p className={`font-medium text-sm ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{t.label}</p>
                <p className={`text-2xl font-semibold ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                  {valor ? `$${valor.toLocaleString("es-AR")}` : "—"}
                </p>
              </div>
            )
          })}
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Usando <strong>{TIPOS.find(t => t.key === selected)?.short}</strong> — $1 USD = <strong>${(valorSelected || 0).toLocaleString("es-AR")} ARS</strong> hoy
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar selección
          </button>
        </div>

        {/* DERECHA — info */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <p className="font-semibold text-slate-800">¿Qué es cada uno?</p>
          <div className="space-y-3">
            {TIPOS.map(t => (
              <div key={t.key} className="text-sm">
                <span className="font-semibold text-slate-800">{t.short}</span>
                <span className="text-slate-500"> — {t.desc}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 mt-4">
            <p className="font-semibold text-slate-800 text-sm mb-1">¿Cuál usar en tu tienda?</p>
            <p className="text-sm text-slate-600">
              El <strong>Blue</strong> es la recomendación. Si ponés tu producto en $10 USD al Blue, tu cliente paga lo que realmente vale en el mercado real argentino.
            </p>
          </div>
          <p className="text-xs text-slate-400 text-right">Fuente: dolarapi.com · actualizado diariamente</p>
        </div>

      </div>
    </div>
  )
}
