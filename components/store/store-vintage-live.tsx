"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderVintage } from "@/components/store/store-header-vintage"
import { StoreHeroVintageEditable } from "@/components/store/store-hero-vintage-editable"
import { FeaturesVintage } from "@/components/store/features-vintage"
import { CategoryShowcaseVintageEditable } from "@/components/store/category-showcase-vintage-editable"
import { ProductGridVintage } from "@/components/store/product-grid-vintage"
import { TestimonialsVintage } from "@/components/store/testimonials-vintage"
import { StoreFooterVintage } from "@/components/store/store-footer-vintage"
import { vintageBody, vintageHeading } from "@/lib/fonts/vintage"

interface StoreVintageLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  initialCategoryImages: Record<string, string>
}

// Temple "Vintage": sacado tal cual de la demo real floral.weblium.site (ver
// design-refs/flower-vintage/RESUMEN.md). Estructura propia: header sobre
// crema → hero con foto real y eyebrow CURSIVO (único temple con fuente
// script) → franja de features con íconos → destacados → categorías con
// esquinas muy redondeadas sobre rosa pálido → testimonios en texto → todos
// los productos → footer oliva oscuro. Sin Gallery ni Instagram strip (no
// hay más fotos reales scrapeadas que el hero). Mismo mecanismo de edición
// en vivo que los demás temples.
export function StoreVintageLive({
  store,
  categories,
  products,
  featuredProducts,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreVintageLiveProps) {
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
    <div className={`${vintageBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderVintage store={storeConEdicion} categories={categories} />
      <main className="flex-1">
        <StoreHeroVintageEditable
          store={storeConEdicion}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />

        <FeaturesVintage editMode={editMode} texts={templateTexts} onChangeText={handleChangeText} />

        {featuredProducts.length > 0 && (
          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632]`}>Novedades</h2>
            </div>
            <ProductGridVintage
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
            />
          </section>
        )}

        <CategoryShowcaseVintageEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
        />

        <TestimonialsVintage editMode={editMode} texts={templateTexts} onChangeText={handleChangeText} />

        <section id={featuredProducts.length > 0 ? undefined : "productos"} className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632]`}>Todos los productos</h2>
            </div>
            {products.length > 0 ? (
              <ProductGridVintage
                products={products}
                subdomain={subdomain}
                exchangeRate={exchangeRate}
                country={store.country}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-[#7c7669] text-lg">Esta tienda aún no tiene productos.</p>
                <p className="text-sm text-[#7c7669]/70 mt-3">
                  El dueño puede agregar productos desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <StoreFooterVintage store={storeConEdicion} categories={categories} subdomain={subdomain} />

      {isOwner && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ backgroundColor: editMode ? "rgba(74,70,50,0.85)" : "#4a4632" }}
          >
            <Pencil size={14} /> {editMode ? "Editando diseño" : "Editar diseño"}
          </button>

          {editMode && dirty && !justSaved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "#cc3833" }}
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
