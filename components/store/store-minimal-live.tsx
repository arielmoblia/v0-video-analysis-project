"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderMinimal } from "@/components/store/store-header-minimal"
import { StoreHeroMinimalEditable } from "@/components/store/store-hero-minimal-editable"
import { CategoryShowcaseMinimalEditable } from "@/components/store/category-showcase-minimal-editable"
import { ProductGridMinimal } from "@/components/store/product-grid-minimal"
import { StoreCarousels } from "@/components/store/store-carousels"
import { OfertaDestacadaSection } from "@/components/store/oferta-destacada-section"
import { StoreFooterMinimal } from "@/components/store/store-footer-minimal"
import { minimalBody } from "@/lib/fonts/minimal"

interface StoreMinimalLiveProps {
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

// Temple "Minimal": sacado tal cual de la demo real sa-minimal.myshopify.com
// (ver design-refs/sa-minimal/RESUMEN.md). Estructura propia: header en 2
// filas, hero con overlay oscuro, productos destacados con tarjetas sin
// bordes, grid de categorías ASIMÉTRICO (4/8/8/4, la seña distintiva de este
// temple), todos los productos, footer gris oscuro. Mismo mecanismo de
// edición en vivo que los demás temples.
export function StoreMinimalLive({
  store,
  categories,
  products,
  featuredProducts,
  accentColor,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreMinimalLiveProps) {
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
    <div className={`${minimalBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderMinimal store={storeConEdicion} categories={categories} accentColor={accentColor} />
      <main className="flex-1">
        <StoreHeroMinimalEditable
          store={storeConEdicion}
          accentColor={accentColor}
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

        {featuredProducts.length > 0 && (
          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-light lowercase text-neutral-900">novedades</h2>
              <div className="mx-auto mt-3 h-px w-10" style={{ backgroundColor: accentColor }} />
            </div>
            <ProductGridMinimal
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
              accentColor={accentColor}
            />
          </section>
        )}

        <CategoryShowcaseMinimalEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          accentColor={accentColor}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
        />

        <section id={featuredProducts.length > 0 ? undefined : "productos"} className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-light lowercase text-neutral-900">todos los productos</h2>
              <div className="mx-auto mt-3 h-px w-10" style={{ backgroundColor: accentColor }} />
            </div>
            {products.length > 0 ? (
              <ProductGridMinimal
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
      <StoreFooterMinimal store={storeConEdicion} categories={categories} subdomain={subdomain} accentColor={accentColor} />

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
