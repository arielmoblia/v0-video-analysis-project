"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Check, Loader2 } from "lucide-react"
import { ProductSelector } from "@/components/store/product-selector"

interface SizeWithStock {
  size: string
  stock: number
  price?: number
  exchangeRate?: number
}

interface Product {
  id: string
  name: string
  description?: string
  price: number
  compare_price?: number
  image_url?: string
  images?: string[]
  sizes?: SizeWithStock[]
  stock?: number
}

interface ProductEditableProps {
  product: Product
  storeId: string
  subdomain?: string
  hasMultiImages?: boolean
  exchangeRate?: number
  template?: string
  country?: string | null
  accentColor?: string
}

// Mismo mecanismo que el editor del index (store-moderno-live.tsx): este
// componente es el único dueño del estado editable y del guardado; ProductSelector
// solo muestra los campos y avisa cambios. Se ve solo si canEdit=true en la página.
export function ProductEditable({
  product,
  storeId,
  subdomain,
  hasMultiImages,
  exchangeRate,
  template,
  country,
  accentColor = "#e8590c",
}: ProductEditableProps) {
  const initialEdited = {
    name: product.name,
    description: product.description || "",
    price: product.price,
    image_url: product.image_url || "",
  }
  const [edited, setEdited] = useState(initialEdited)
  const [saved, setSaved] = useState(initialEdited)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const router = useRouter()

  const dirty = JSON.stringify(edited) !== JSON.stringify(saved)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, storeId, ...edited }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSaved(edited)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
      // Cambiar el nombre regenera el slug (misma lógica que ya usa el panel de
      // productos) — si cambió, hay que llevar al dueño a la URL nueva o el
      // link que está viendo se vuelve un 404 apenas recargue.
      const pathParts = window.location.pathname.split("/")
      if (data.product?.slug && data.product.slug !== pathParts[pathParts.length - 1]) {
        pathParts[pathParts.length - 1] = data.product.slug
        router.replace(pathParts.join("/"))
      }
    } finally {
      setSaving(false)
    }
  }

  const productConEdicion: Product = { ...product, ...edited }

  return (
    <div>
      <div className="bg-neutral-900 text-white text-center text-xs py-2 px-4 mb-6 -mx-6 rounded-lg">
        Solo vos ves esto: sos el dueño de la tienda.
      </div>

      <ProductSelector
        product={productConEdicion}
        subdomain={subdomain}
        hasMultiImages={hasMultiImages}
        exchangeRate={exchangeRate}
        template={template}
        country={country}
        accentColor={accentColor}
        editMode={editMode}
        edited={edited}
        onChangeName={(value) => setEdited((e) => ({ ...e, name: value }))}
        onChangeDescription={(value) => setEdited((e) => ({ ...e, description: value }))}
        onChangePrice={(value) => setEdited((e) => ({ ...e, price: value }))}
        onChangeImage={(url) => setEdited((e) => ({ ...e, image_url: url }))}
      />

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setEditMode((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: editMode ? "rgba(23,23,23,0.85)" : accentColor }}
        >
          <Pencil size={14} /> {editMode ? "Editando producto" : "Editar producto"}
        </button>

        {editMode && dirty && !justSaved && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        )}

        {justSaved && (
          <div className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-emerald-600 shadow-lg">
            <Check size={16} /> Guardado
          </div>
        )}
      </div>
      {saveError && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-red-600 shadow-lg">
          {saveError}
        </div>
      )}
    </div>
  )
}
