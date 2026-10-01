"use client"
import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import type { CarouselBlock } from "@/components/store/store-carousels"

interface CarouselsManagerProps {
  storeId: string
  initialCarousels?: CarouselBlock[] | null
}

export function CarouselsManager({ storeId, initialCarousels }: CarouselsManagerProps) {
  const [carouselsConfig, setCarouselsConfig] = useState<CarouselBlock[]>(initialCarousels || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const hasProductsCarousel = carouselsConfig.some((c) => c.type === "products")
  const productsCarouselTitle = carouselsConfig.find((c) => c.type === "products")?.title || "Destacados"
  const textCarouselPhrases = (carouselsConfig.find((c) => c.type === "text")?.phrases || []).join("\n")

  const toggleProductsCarousel = (checked: boolean) => {
    setCarouselsConfig((prev) => {
      const rest = prev.filter((c) => c.type !== "products")
      return checked ? [...rest, { id: "products_default", type: "products" as const, title: productsCarouselTitle }] : rest
    })
  }

  const updateProductsCarouselTitle = (title: string) => {
    setCarouselsConfig((prev) => prev.map((c) => (c.type === "products" ? { ...c, title } : c)))
  }

  const updateTextCarousel = (raw: string) => {
    const phrases = raw
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 6)
    setCarouselsConfig((prev) => {
      const rest = prev.filter((c) => c.type !== "text")
      return phrases.length > 0 ? [...rest, { id: "text_default", type: "text" as const, phrases }] : rest
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, carousels: carouselsConfig }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Carruseles</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Una franja de productos destacados y una franja de texto con frases rotando, debajo del banner de tu portada. Activá las que quieras, son independientes.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <p className="font-medium text-sm text-slate-800">Carrusel de productos destacados</p>
        </div>
        <div className="p-5 space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasProductsCarousel}
              onChange={(e) => toggleProductsCarousel(e.target.checked)}
            />
            Mostrar este carrusel en mi tienda
          </label>
          {hasProductsCarousel && (
            <div>
              <label className="text-xs text-slate-500">Título de la franja</label>
              <input
                value={productsCarouselTitle}
                onChange={(e) => updateProductsCarouselTitle(e.target.value)}
                placeholder="Ej: Destacados"
                className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          )}
          <p className="text-xs text-slate-400">
            Muestra tus productos destacados si marcaste alguno, o tus productos en general si no marcaste ninguno.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <p className="font-medium text-sm text-slate-800">Carrusel de textos</p>
        </div>
        <div className="p-5 space-y-2">
          <label className="text-xs text-slate-500">Una frase por línea, van rotando (hasta 6)</label>
          <textarea
            value={textCarouselPhrases}
            onChange={(e) => updateTextCarousel(e.target.value)}
            placeholder={"Ej: Envíos a todo el país\nSeguinos en Instagram"}
            rows={5}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 text-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar
        </button>
        {saved && (
          <p className="text-sm text-green-700 flex items-center gap-1">
            <Check className="w-4 h-4" /> Guardado. Ya se ve en tu tienda.
          </p>
        )}
      </div>
    </div>
  )
}
