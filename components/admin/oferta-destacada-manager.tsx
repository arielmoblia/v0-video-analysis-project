"use client"
import { useEffect, useState } from "react"
import { X, Loader2, Check } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { VideoTutorialButton } from "./video-tutorial-button"

interface ProductLite {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface OfertaDestacadaManagerProps {
  storeId: string
  country?: string | null
  initialProductIds?: string[]
}

const MAX_PRODUCTS = 1

export function OfertaDestacadaManager({ storeId, country, initialProductIds }: OfertaDestacadaManagerProps) {
  const [products, setProducts] = useState<ProductLite[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>(initialProductIds || [])
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) =>
        setProducts(
          (data.products || []).map((p: any) => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url }))
        )
      )
      .catch(() => {})
  }, [storeId])

  const byId = new Map(products.map((p) => [p.id, p]))
  const selected = selectedIds.map((id) => byId.get(id)).filter((p): p is ProductLite => !!p)

  const suggestions =
    search.trim().length > 0 && selectedIds.length < MAX_PRODUCTS
      ? products.filter((p) => !selectedIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
      : []

  const addProduct = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= MAX_PRODUCTS) return
    setSelectedIds((prev) => [...prev, id])
    setSearch("")
  }

  const removeProduct = (id: string) => {
    setSelectedIds((prev) => prev.filter((pid) => pid !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, oferta_destacada: selectedIds }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Oferta Destacada</h1>
          <VideoTutorialButton title="Cómo usar Oferta Destacada" />
        </div>
        <p className="text-xl text-muted-foreground mt-2">
          Elegí el producto que querés mostrar completo (galería de fotos, precio y botón de compra) en un lugar
          fijo del inicio de tu tienda.
        </p>
      </div>

      <div>
        <label className="text-xs text-slate-500">Producto elegido ({selected.length}/{MAX_PRODUCTS})</label>
        {selected.length === 0 ? (
          <p className="text-xs text-slate-400 italic mt-2">Todavía no elegiste ningún producto.</p>
        ) : (
          <div className="flex flex-wrap gap-3 mt-2">
            {selected.map((p) => (
              <div key={p.id} className="relative w-28">
                <button
                  onClick={() => removeProduct(p.id)}
                  className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 flex items-center justify-center shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Sin foto</div>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 truncate" title={p.name}>{p.name}</p>
                <p className="text-xs text-slate-500 font-medium">{formatPrice(p.price, country)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.length < MAX_PRODUCTS && (
        <div>
          <label className="text-xs text-slate-500">Buscar producto por nombre</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribí el nombre del producto..."
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          {suggestions.length > 0 && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-blue-50/30 divide-y divide-slate-100">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addProduct(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-blue-100/60"
                >
                  <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                    {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-slate-500">{formatPrice(p.price, country)}</span>
                </button>
              ))}
            </div>
          )}
          {search.trim().length > 0 && suggestions.length === 0 && (
            <p className="text-xs text-slate-400 italic mt-2">No hay productos que coincidan con la búsqueda.</p>
          )}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saving ? "Subiendo..." : saved ? "¡Subido!" : "Subir"}
      </button>
    </div>
  )
}
