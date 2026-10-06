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

interface OfertaDestacadaManagerProps {
  storeId: string
  country?: string | null
  onGoToProducts?: () => void
  compact?: boolean
}

// Cosita gratis: no tiene selección propia. Muestra siempre el mismo
// producto marcado con la estrella ("destacar en el inicio") en Productos,
// para que no haya dos lugares distintos elegiendo qué aparece en el inicio.
// compact=true: embebido dentro del acordeón de "Tus cositas activas", sin
// repetir el título grande (ya lo muestra la fila del acordeón).
export function OfertaDestacadaManager({ storeId, country, onGoToProducts, compact }: OfertaDestacadaManagerProps) {
  const [products, setProducts] = useState<ProductLite[]>([])
  const [loading, setLoading] = useState(true)

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

  const featured = products.find((p) => p.featured) || null

  return (
    <div className="space-y-6 max-w-2xl">
      {!compact && (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Oferta Destacada</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Gratis. Muestra completo (galería de fotos, precio y botón de compra) en un lugar fijo del inicio de tu
              tienda el mismo producto que marques con la estrella en Productos.
            </p>
          </div>
          <VideoTutorialButton title="Cómo usar Oferta Destacada" />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 italic">Cargando...</p>
      ) : featured ? (
        <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {featured.image_url ? (
              <img src={featured.image_url} alt={featured.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Sin foto</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-amber-700 flex items-center gap-1 font-medium">
              <Star className="w-3 h-3 fill-amber-500" /> Producto destacado actual
            </p>
            <p className="text-sm font-medium text-slate-800">{featured.name}</p>
            <p className="text-xs text-slate-500">{formatPrice(featured.price, country)}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">
          Todavía no marcaste ningún producto con la estrella. Sin un producto marcado, esta sección no aparece en tu
          tienda.
        </p>
      )}

      <button
        onClick={onGoToProducts}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Star className="w-4 h-4" /> {featured ? "Cambiar el producto en Productos" : "Ir a Productos a elegir uno"}
      </button>
    </div>
  )
}
