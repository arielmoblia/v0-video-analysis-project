"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderElegante } from "@/components/store/store-header-elegante"
import { StoreHeroEleganteEditable } from "@/components/store/store-hero-elegante-editable"
import { CategoryShowcaseEleganteEditable } from "@/components/store/category-showcase-elegante-editable"
import { ProductGridElegante } from "@/components/store/product-grid-elegante"
import { StoreFooter } from "@/components/store/store-footer"

interface StoreEleganteLiveProps {
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

// Temple "Elegante" para tiendas reales: inspirado en tiendas de relojería
// premium (franja superior oscura, categorías circulares, hero a todo el
// ancho). Mismo mecanismo de edición en vivo que "Moderno": los productos y
// categorías son los de verdad, y "Guardar" pega contra la base de datos.
export function StoreEleganteLive({
  store,
  categories,
  products,
  featuredProducts,
  accentColor,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreEleganteLiveProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [savedBanner, setSavedBanner] = useState(banner)
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(initialCategoryImages)
  const [savedCategoryImages, setSavedCategoryImages] = useState(initialCategoryImages)
  const initialTemplateTexts = (store.plan_features?.template_texts as Record<string, string>) || {}
  const [templateTexts, setTemplateTexts] = useState<Record<string, string>>(initialTemplateTexts)
  const [savedTemplateTexts, setSavedTemplateTexts] = useState(initialTemplateTexts)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const dirty =
    JSON.stringify(banner) !== JSON.stringify(savedBanner) ||
    JSON.stringify(categoryImages) !== JSON.stringify(savedCategoryImages) ||
    JSON.stringify(templateTexts) !== JSON.stringify(savedTemplateTexts)

  const handleChangeText = (key: string, value: string) => setTemplateTexts((t) => ({ ...t, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id, ...banner, category_images: categoryImages, template_texts: templateTexts }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSavedBanner(banner)
      setSavedCategoryImages(categoryImages)
      setSavedTemplateTexts(templateTexts)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeaderElegante store={storeConEdicion} categories={categories} accentColor={accentColor} />
      <main className="flex-1">
        <StoreHeroEleganteEditable
          store={storeConEdicion}
          accentColor={accentColor}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />
        <CategoryShowcaseEleganteEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          accentColor={accentColor}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
          texts={templateTexts}
          onChangeText={handleChangeText}
        />

        {featuredProducts.length > 0 && (
          <section className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridElegante
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
              <ProductGridElegante
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

      {isOwner && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ backgroundColor: editMode ? "rgba(23,23,23,0.85)" : accentColor }}
          >
            <Pencil size={14} /> {editMode ? "Editando diseño" : "Editar diseño"}
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
      )}
      {saveError && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-red-600 shadow-lg">
          {saveError}
        </div>
      )}
    </div>
  )
}
