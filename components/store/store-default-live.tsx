"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreHero } from "@/components/store/store-hero"
import { ImageSliderBanner } from "@/components/store/image-slider-banner"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreCarousels } from "@/components/store/store-carousels"
import { OfertaDestacadaSection } from "@/components/store/oferta-destacada-section"
import { MultiImageUpload } from "@/components/admin/multi-image-upload"
import type { StorePage } from "@/lib/services/store-pages"

interface StoreDefaultLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  hasMayoristaMinorista: boolean
  hasBannerDeslizante: boolean
  isOwner: boolean
  storePages?: StorePage[]
}

// Tema por defecto (tiendas clonadas tipo pink/pinkonlineoficial, sin un
// temple propio asignado). Antes esta página era 100% server-side sin forma
// de editar nada desde la tienda misma — para sacar o agregar fotos del
// banner deslizante había que ir al panel /admin → Plan Cositas. Este
// componente le suma el mismo mecanismo de "Editar diseño" que ya tienen
// los demás temples (moderno, básico, etc), pero solo para el banner
// deslizante, que es lo único editable hoy en este tema.
export function StoreDefaultLive({
  store,
  categories,
  products,
  featuredProducts,
  subdomain,
  exchangeRate,
  hasMayoristaMinorista,
  hasBannerDeslizante,
  isOwner,
  storePages = [],
}: StoreDefaultLiveProps) {
  const initialSliderImages = ((store.plan_features?.slider_images as { url: string }[]) || []).map((img) => img.url)
  const [sliderImages, setSliderImages] = useState<string[]>(initialSliderImages)
  const [savedSliderImages, setSavedSliderImages] = useState<string[]>(initialSliderImages)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const dirty = JSON.stringify(sliderImages) !== JSON.stringify(savedSliderImages)
  const carouselsOnly = !!store.plan_features?.custom_theme_request?.carousels_only
  const headerStyle = store.plan_features?.header_style

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id, slider_images: sliderImages.map((url) => ({ url })) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error || "No se pudo guardar")
        return
      }
      setSavedSliderImages(sliderImages)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {headerStyle === "pink" ? (
        <StoreHeaderPink store={store} categories={categories} storePages={storePages} />
      ) : (
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      )}
      <main className="flex-1">
        {hasBannerDeslizante && editMode ? (
          <div className="container mx-auto px-6 py-6 max-w-2xl">
            <p className="text-sm text-neutral-500 mb-3">Fotos del banner deslizante</p>
            <MultiImageUpload value={sliderImages} onChange={setSliderImages} maxImages={8} />
          </div>
        ) : hasBannerDeslizante && sliderImages.length > 1 ? (
          <ImageSliderBanner images={sliderImages.map((url) => ({ url }))} />
        ) : (
          !carouselsOnly && <StoreHero store={store} />
        )}

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
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
              </div>
              <ProductGrid products={featuredProducts} subdomain={subdomain} exchangeRate={exchangeRate} country={store.country} />
            </div>
          </section>
        )}

        <section id="productos" className="py-20 px-6 bg-neutral-50">
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Explorar</p>
              <h2 className="text-3xl font-light tracking-wide">Todos los Productos</h2>
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
      <StoreFooter store={store} />

      {isOwner && hasBannerDeslizante && (
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
