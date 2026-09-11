"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderArtesano } from "@/components/store/store-header-artesano"
import { StoreHeroArtesanoEditable } from "@/components/store/store-hero-artesano-editable"
import { BrandStripArtesano } from "@/components/store/brand-strip-artesano"
import { CategoryShowcaseArtesanoEditable } from "@/components/store/category-showcase-artesano-editable"
import { ProductGridArtesano } from "@/components/store/product-grid-artesano"
import { BenefitsBannerArtesano } from "@/components/store/benefits-banner-artesano"
import { StoreFooterArtesano } from "@/components/store/store-footer-artesano"
import { artesanoBody, artesanoHeading } from "@/lib/fonts/artesano"

interface StoreArtesanoLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  accentColor: string
  accentColor2: string
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  initialCategoryImages: Record<string, string>
}

// Temple "Artesano" para muebles y deco: sacado tal cual de la demo real
// websitedemos.net/furniture-shop-04 (ver design-refs/furniture-shop/RESUMEN.md).
// A diferencia de "Bold" (que quedó con la misma estructura hero+categorías+
// grilla que "Moderno"/"Elegante"), acá el ORDEN de secciones es distinto:
// hero grande → franja de logos → categorías en tarjetas → productos
// destacados → banner de beneficios → todos los productos → footer con
// categorías. Mismo mecanismo de edición en vivo: productos y categorías
// reales, "Guardar" pega contra la base de datos.
export function StoreArtesanoLive({
  store,
  categories,
  products,
  featuredProducts,
  accentColor,
  accentColor2,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreArtesanoLiveProps) {
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
    <div className={`${artesanoBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderArtesano store={storeConEdicion} categories={categories} accentColor={accentColor} accentColor2={accentColor2} />
      <main className="flex-1">
        <StoreHeroArtesanoEditable
          store={storeConEdicion}
          accentColor={accentColor}
          accentColor2={accentColor2}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />

        <BrandStripArtesano />

        <CategoryShowcaseArtesanoEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          accentColor={accentColor}
          accentColor2={accentColor2}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
        />

        {featuredProducts.length > 0 && (
          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${artesanoHeading.className} text-2xl md:text-3xl text-[#3a2c22]`}>Productos destacados</h2>
              <div className="mx-auto mt-3 h-[2px] w-12" style={{ backgroundColor: accentColor }} />
            </div>
            <ProductGridArtesano
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
              accentColor={accentColor}
              accentColor2={accentColor2}
            />
          </section>
        )}

        <BenefitsBannerArtesano accentColor={accentColor} accentColor2={accentColor2} />

        <section id={featuredProducts.length > 0 ? undefined : "productos"} className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${artesanoHeading.className} text-2xl md:text-3xl text-[#3a2c22]`}>Todos los productos</h2>
              <div className="mx-auto mt-3 h-[2px] w-12" style={{ backgroundColor: accentColor }} />
            </div>
            {products.length > 0 ? (
              <ProductGridArtesano
                products={products}
                subdomain={subdomain}
                exchangeRate={exchangeRate}
                country={store.country}
                accentColor={accentColor}
                accentColor2={accentColor2}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-[#6b5c4f] text-lg font-light">Esta tienda aún no tiene productos.</p>
                <p className="text-sm text-[#6b5c4f]/70 mt-3">
                  El dueño puede agregar productos desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <StoreFooterArtesano store={storeConEdicion} categories={categories} subdomain={subdomain} accentColor={accentColor} />

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
              style={{ backgroundColor: accentColor2 }}
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
