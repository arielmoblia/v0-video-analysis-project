"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeroBasicoEditable } from "@/components/store/store-hero-basico-editable"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"
import { EditableInline } from "@/components/store/editable-inline"
import { StoreCarousels } from "@/components/store/store-carousels"

interface StoreBasicoLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  hasMayoristaMinorista: boolean
}

// Temple "Básico": el diseño clásico de siempre (StoreHeader/StoreHero/
// ProductGrid/StoreFooter), con el mismo mecanismo de edición en vivo que
// los demás temples (botón "Editar diseño", solo visible si isOwner).
export function StoreBasicoLive({
  store,
  categories,
  products,
  featuredProducts,
  subdomain,
  exchangeRate,
  isOwner,
  hasMayoristaMinorista,
}: StoreBasicoLiveProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [savedBanner, setSavedBanner] = useState(banner)
  const initialTemplateTexts = (store.plan_features?.template_texts as Record<string, string>) || {}
  const [templateTexts, setTemplateTexts] = useState<Record<string, string>>(initialTemplateTexts)
  const [savedTemplateTexts, setSavedTemplateTexts] = useState(initialTemplateTexts)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const dirty =
    JSON.stringify(banner) !== JSON.stringify(savedBanner) ||
    JSON.stringify(templateTexts) !== JSON.stringify(savedTemplateTexts)

  const handleChangeText = (key: string, value: string) => setTemplateTexts((t) => ({ ...t, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id, ...banner, template_texts: templateTexts }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSavedBanner(banner)
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
      <StoreHeader store={storeConEdicion} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      <main className="flex-1">
        <StoreHeroBasicoEditable
          store={storeConEdicion}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />

        <StoreCarousels
          carousels={store.plan_features?.carousels}
          products={products}
          featuredProducts={featuredProducts}
          subdomain={subdomain}
          exchangeRate={exchangeRate}
          country={store.country}
        />

        {featuredProducts.length > 0 && (
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <EditableInline
                  as="p"
                  editMode={editMode}
                  className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3"
                  value={templateTexts["destacados_eyebrow"] ?? "Lo mejor"}
                  onChange={(v) => handleChangeText("destacados_eyebrow", v)}
                />
                <EditableInline
                  as="h2"
                  editMode={editMode}
                  className="text-3xl font-light tracking-wide"
                  value={templateTexts["destacados_title"] ?? "Productos Destacados"}
                  onChange={(v) => handleChangeText("destacados_title", v)}
                />
              </div>
              <ProductGrid products={featuredProducts} subdomain={subdomain} exchangeRate={exchangeRate} country={store.country} />
            </div>
          </section>
        )}

        <section id="productos" className="py-20 px-6 bg-neutral-50">
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <EditableInline
                as="p"
                editMode={editMode}
                className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3"
                value={templateTexts["todos_eyebrow"] ?? "Explorar"}
                onChange={(v) => handleChangeText("todos_eyebrow", v)}
              />
              <EditableInline
                as="h2"
                editMode={editMode}
                className="text-3xl font-light tracking-wide"
                value={templateTexts["todos_title"] ?? "Todos los Productos"}
                onChange={(v) => handleChangeText("todos_title", v)}
              />
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} subdomain={subdomain} exchangeRate={exchangeRate} country={store.country} />
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
            style={{ backgroundColor: editMode ? "rgba(23,23,23,0.85)" : "#171717" }}
          >
            <Pencil size={14} /> {editMode ? "Editando diseño" : "Editar diseño"}
          </button>

          {editMode && dirty && !justSaved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 bg-neutral-900"
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
