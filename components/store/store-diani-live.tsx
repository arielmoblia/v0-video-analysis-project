"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderDiani } from "@/components/store/store-header-diani"
import { StoreHeroDianiEditable } from "@/components/store/store-hero-diani-editable"
import { ProductGridDiani } from "@/components/store/product-grid-diani"
import { StoreCarousels } from "@/components/store/store-carousels"
import { OfertaDestacadaSection } from "@/components/store/oferta-destacada-section"
import { StoreFooterDiani } from "@/components/store/store-footer-diani"
import { dianiBody } from "@/lib/fonts/diani"

interface StoreDianiLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  isOwner: boolean
}

// Temple "Minimalista" (diani): sacado de dianiswim.com (ver
// design-refs/diani-minimal/RESUMEN.md). A diferencia de "Minimal" (header en
// 2 filas, hero con overlay, grid asimétrico de categorías, footer oscuro),
// este es "editorial silencioso": header en 1 fila, hero sin overlay ni
// texto encima, cero vidriera de categorías con banners, footer blanco,
// cero color de acento — todo el color lo ponen las fotos de producto.
export function StoreDianiLive({
  store,
  categories,
  products,
  featuredProducts,
  subdomain,
  exchangeRate,
  isOwner,
}: StoreDianiLiveProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [savedBanner, setSavedBanner] = useState(banner)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const dirty = JSON.stringify(banner) !== JSON.stringify(savedBanner)
  const [editMode, setEditMode] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id, ...banner }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSavedBanner(banner)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <div className={`${dianiBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderDiani store={storeConEdicion} categories={categories} />
      <main className="flex-1">
        <StoreHeroDianiEditable
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
          whatsapp={store.social_whatsapp}
          instagram={store.social_instagram}
        />

        <OfertaDestacadaSection
          product={featuredProducts[0] || null}
          subdomain={subdomain}
          country={store.country}
        />

        <section id="productos" className="container mx-auto px-6 py-16">
          {products.length > 0 ? (
            <ProductGridDiani
              products={products}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">Esta tienda aún no tiene productos.</p>
              <p className="text-sm text-neutral-400 mt-3">
                El dueño puede agregar productos desde el panel de administración.
              </p>
            </div>
          )}
        </section>
      </main>
      <StoreFooterDiani store={storeConEdicion} categories={categories} subdomain={subdomain} />

      {isOwner && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg bg-[#111]"
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
