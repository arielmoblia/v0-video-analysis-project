"use client"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { VideoTutorialButton } from "./video-tutorial-button"

interface ProductLite {
  id: string
  name: string
  price: number
  image_url: string | null
  featured?: boolean
}

interface ProductosDestacadosManagerProps {
  storeId: string
  country?: string | null
}

// Cosita gratis: usa la misma estrella de Productos ("destacar en el inicio"),
// pero acá se puede tildar varios de una, sin ir fila por fila en el listado
// general. Todo producto tildado entra a la grilla "Productos Destacados" del
// inicio de la tienda.
export function ProductosDestacadosManager({ storeId, country }: ProductosDestacadosManagerProps) {
  const [products, setProducts] = useState<ProductLite[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/products?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) =>
        setProducts(
          (data.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image_url: p.image_url,
            featured: p.featured,
          }))
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [storeId])

  const toggleFeatured = async (productId: string, featured: boolean) => {
    setSavingId(productId)
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, featured } : p)))
    try {
      await fetch("/api/admin/products/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, featured }),
      })
    } catch (error) {
      console.error("Error updating featured:", error)
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, featured: !featured } : p)))
    } finally {
      setSavingId(null)
    }
  }

  const featuredCount = products.filter((p) => p.featured).length

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Productos Destacados</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Gratis. Los productos que tildes acá aparecen en una grilla aparte en el inicio de tu tienda, debajo de
            las demás secciones.
          </p>
        </div>
        <VideoTutorialButton title="Cómo usar Productos Destacados" />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 italic">Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Todavía no tenés productos cargados.</p>
      ) : (
        <>
          <p className="text-xs text-amber-700 flex items-center gap-1 font-medium">
            <Star className="w-3 h-3 fill-amber-500" />
            {featuredCount === 0
              ? "Ningún producto tildado todavía"
              : `${featuredCount} producto${featuredCount === 1 ? "" : "s"} destacado${featuredCount === 1 ? "" : "s"}`}
          </p>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
            {products.map((product) => (
              <label
                key={product.id}
                className={`flex items-center gap-4 p-3 cursor-pointer transition-colors ${
                  product.featured ? "bg-amber-50" : "hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!product.featured}
                  disabled={savingId === product.id}
                  onChange={(e) => toggleFeatured(product.id, e.target.checked)}
                  className="w-5 h-5 accent-amber-500 shrink-0"
                />
                <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(product.price, country)}</p>
                </div>
                {product.featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />}
              </label>
            ))}
          </div>

          <p className="text-sm text-slate-500 italic">
            Sin ningún producto tildado, esta sección no aparece en tu portada.
          </p>
        </>
      )}
    </div>
  )
}
