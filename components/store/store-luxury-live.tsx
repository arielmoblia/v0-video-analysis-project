"use client"

import { useState } from "react"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderLuxury } from "@/components/store/store-header-luxury"
import { MarqueeStripLuxury } from "@/components/store/marquee-strip-luxury"
import { StoreHeroLuxuryEditable } from "@/components/store/store-hero-luxury-editable"
import { PromoBarLuxury } from "@/components/store/promo-bar-luxury"
import { CategoryShowcaseLuxuryEditable } from "@/components/store/category-showcase-luxury-editable"
import { ProductGridLuxury } from "@/components/store/product-grid-luxury"
import { BenefitsBannerLuxury } from "@/components/store/benefits-banner-luxury"
import { TestimonialsLuxury } from "@/components/store/testimonials-luxury"
import { StoreFooterLuxury } from "@/components/store/store-footer-luxury"
import { luxuryBody, luxuryHeading } from "@/lib/fonts/luxury"

interface StoreLuxuryLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  initialCategoryImages: Record<string, string>
}

// Temple "Luxury": sacado tal cual de la demo real belle-demo-2.myshopify.com
// (ver design-refs/belle-luxury/RESUMEN.md). Estructura propia: header negro
// → marquee de texto corrido → hero con overlay negro → barra de promoción
// → productos destacados → banner de categorías tipo masonry (una foto
// grande + dos chicas) → banner de beneficios → testimonios → todos los
// productos → footer negro con acento dorado. Es el único temple con
// marquee y con testimonios.
export function StoreLuxuryLive({
  store,
  categories,
  products,
  featuredProducts,
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreLuxuryLiveProps) {
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
    <div className={`${luxuryBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderLuxury store={storeConEdicion} categories={categories} />
      <main className="flex-1">
        <MarqueeStripLuxury text={store.site_title.toUpperCase()} />

        <StoreHeroLuxuryEditable
          store={storeConEdicion}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />

        <PromoBarLuxury
          text={templateTexts["promo_bar.text"] ?? undefined}
          editMode={editMode}
          onChangeText={(v) => handleChangeText("promo_bar.text", v)}
        />

        {featuredProducts.length > 0 && (
          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900`}>Destacados</h2>
            </div>
            <ProductGridLuxury
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
            />
          </section>
        )}

        <CategoryShowcaseLuxuryEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
          texts={templateTexts}
          onChangeText={handleChangeText}
        />

        <BenefitsBannerLuxury editMode={editMode} texts={templateTexts} onChangeText={handleChangeText} />

        <TestimonialsLuxury editMode={editMode} texts={templateTexts} onChangeText={handleChangeText} />

        <section id={featuredProducts.length > 0 ? undefined : "productos"} className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900`}>Todos los productos</h2>
            </div>
            {products.length > 0 ? (
              <ProductGridLuxury
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
          </div>
        </section>
      </main>
      <StoreFooterLuxury store={storeConEdicion} categories={categories} subdomain={subdomain} />

      {isOwner && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ backgroundColor: editMode ? "rgba(23,23,23,0.85)" : "#111111" }}
          >
            <Pencil size={14} /> {editMode ? "Editando diseño" : "Editar diseño"}
          </button>

          {editMode && dirty && !justSaved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "#ebb868" }}
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
