"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderModern } from "@/components/store/store-header-modern"
import { StoreHeroModernEditable } from "@/components/store/store-hero-modern-editable"
import { CategoryShowcaseModernEditable } from "@/components/store/category-showcase-modern-editable"
import { ProductGridModern } from "@/components/store/product-grid-modern"
import { StoreFooter } from "@/components/store/store-footer"

interface StoreModernoLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  accentColor: string
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  initialCategoryImages: Record<string, string>
}

// Temple "Moderno" para tiendas reales: mismo diseño del preview, pero los
// productos/categorías son los de verdad y "Guardar" pega contra la base
// (no localStorage). El botón "Editar diseño" solo se ve si isOwner (cookie
// admin_{subdomain}), así ningún visitante ve controles de edición.
export function StoreModernoLive({
  store,
  categories,
  products,
  featuredProducts,
  accentColor,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreModernoLiveProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [savedBanner, setSavedBanner] = useState(banner)
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(initialCategoryImages)
  const [savedCategoryImages, setSavedCategoryImages] = useState(initialCategoryImages)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const dirty =
    JSON.stringify(banner) !== JSON.stringify(savedBanner) ||
    JSON.stringify(categoryImages) !== JSON.stringify(savedCategoryImages)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id, ...banner, category_images: categoryImages }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSavedBanner(banner)
      setSavedCategoryImages(categoryImages)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {isOwner && (
        <div className="bg-neutral-900 text-white text-center text-xs py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
          <span>Solo vos ves esto: sos el dueño de la tienda.</span>
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: editMode ? accentColor : "rgba(255,255,255,0.15)" }}
          >
            <Pencil size={12} /> {editMode ? "Editando diseño" : "Editar diseño"}
          </button>
        </div>
      )}
      <StoreHeaderModern store={storeConEdicion} categories={categories} accentColor={accentColor} />
      <main className="flex-1">
        <StoreHeroModernEditable
          store={storeConEdicion}
          accentColor={accentColor}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />
        <CategoryShowcaseModernEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          accentColor={accentColor}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
        />

        {featuredProducts.length > 0 && (
          <section className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridModern
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
              accentColor={accentColor}
            />
          </section>
        )}

        <section id="productos" className="bg-neutral-50">
          <div className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Todos los productos</h2>
            {products.length > 0 ? (
              <ProductGridModern
                products={products}
                subdomain={subdomain}
                exchangeRate={exchangeRate}
                country={store.country}
                accentColor={accentColor}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg font-light">Esta tienda aún no tiene productos.</p>
                <p className="text-sm text-neutral-400 mt-3">
                  El dueño puede agregar productos desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <StoreFooter store={storeConEdicion} />

      {editMode && dirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      )}
      {justSaved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-emerald-600 shadow-lg">
          <Check size={16} /> Guardado
        </div>
      )}
      {saveError && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-red-600 shadow-lg">
          {saveError}
        </div>
      )}
    </div>
  )
}
