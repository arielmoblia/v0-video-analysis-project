"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Check, Loader2 } from "lucide-react"
import type { Store, Product, Category } from "@/lib/store-context"
import { StoreHeaderBlingg } from "@/components/store/store-header-blingg"
import { StoreHeroBlinggEditable } from "@/components/store/store-hero-blingg-editable"
import { CategoryShowcaseBlinggEditable } from "@/components/store/category-showcase-blingg-editable"
import { ProductGridBlingg } from "@/components/store/product-grid-blingg"
import { StoreCarousels } from "@/components/store/store-carousels"
import { OfertaDestacadaSection } from "@/components/store/oferta-destacada-section"
import { StoreFooter } from "@/components/store/store-footer"
import { EditableInline } from "@/components/store/editable-inline"
import { blinggBody, blinggHeading } from "@/lib/fonts/blingg"

interface StoreBlinggLiveProps {
  store: Store
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
  accentColor: string
  accentColor2?: string
  subdomain: string
  exchangeRate: number
  isOwner: boolean
  initialCategoryImages: Record<string, string>
}

// Íconos reales de la demo scrapeada (sección "Free Shipping / Secure
// Payments / Order Tracking / Big Discounts" de la página real). El texto de
// cada badge es editable (texts["trust_badges.<key>"]).
const TRUST_BADGES = [
  { icon: "/design-assets/blingg-jewelry/icon-01.png", key: "envio", label: "Envío gratis" },
  { icon: "/design-assets/blingg-jewelry/icon-02.png", key: "pagos", label: "Pagos seguros" },
  { icon: "/design-assets/blingg-jewelry/icon-03.png", key: "seguimiento", label: "Seguimiento de pedido" },
  { icon: "/design-assets/blingg-jewelry/icon-04.png", key: "descuentos", label: "Grandes descuentos" },
]

// Temple "Blingg" para tiendas de joyería: paleta real celeste/gris/verde y
// tipografía real (Roboto Slab + Roboto) sacadas de la demo de WordPress
// websitedemos.net/blingg-jewelry-store-04. Mismo mecanismo de edición en
// vivo que "Moderno"/"Elegante"/"Bold": productos y categorías son los de
// verdad, y "Guardar" pega contra la base de datos.
export function StoreBlinggLive({
  store,
  categories,
  products,
  featuredProducts,
  accentColor,
  accentColor2 = "#61CE70",
  subdomain,
  exchangeRate,
  isOwner,
  initialCategoryImages,
}: StoreBlinggLiveProps) {
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
    <div className={`${blinggBody.className} min-h-screen flex flex-col bg-white`}>
      <StoreHeaderBlingg store={storeConEdicion} categories={categories} accentColor={accentColor} accentColor2={accentColor2} />
      <main className="flex-1">
        <StoreHeroBlinggEditable
          store={storeConEdicion}
          accentColor={accentColor}
          accentColor2={accentColor2}
          editMode={editMode}
          onChangeImage={(url) => setBanner((b) => ({ ...b, banner_image: url }))}
          onChangeTitle={(value) => setBanner((b) => ({ ...b, banner_title: value }))}
          onChangeSubtitle={(value) => setBanner((b) => ({ ...b, banner_subtitle: value }))}
        />

        <section className="border-y border-[#e5f2f8] bg-[#FAFDFE]">
          <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.key} className="flex flex-col items-center gap-2 text-center">
                <Image src={badge.icon} alt="" width={40} height={30} className="opacity-80" />
                <EditableInline
                  as="span"
                  editMode={editMode}
                  className="text-xs font-medium text-[#7A7A7A] text-center"
                  value={templateTexts[`trust_badges.${badge.key}`] ?? badge.label}
                  onChange={(v) => handleChangeText(`trust_badges.${badge.key}`, v)}
                />
              </div>
            ))}
          </div>
        </section>

        <CategoryShowcaseBlinggEditable
          categories={categories}
          images={categoryImages}
          editMode={editMode}
          accentColor={accentColor}
          subdomain={subdomain}
          onChangeImage={(slug, url) => setCategoryImages((c) => ({ ...c, [slug]: url }))}
          texts={templateTexts}
          onChangeText={handleChangeText}
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
          <section className="container mx-auto px-6 py-14">
            <h2 className={`${blinggHeading.className} text-2xl font-bold text-[#54595F] mb-6`}>Destacados</h2>
            <ProductGridBlingg
              products={featuredProducts}
              subdomain={subdomain}
              exchangeRate={exchangeRate}
              country={store.country}
              accentColor={accentColor}
              accentColor2={accentColor2}
            />
          </section>
        )}

        <section id="productos" className="bg-[#FAFDFE]">
          <div className="container mx-auto px-6 py-14">
            <h2 className={`${blinggHeading.className} text-2xl font-bold text-[#54595F] mb-6`}>Todos los productos</h2>
            {products.length > 0 ? (
              <ProductGridBlingg
                products={products}
                subdomain={subdomain}
                exchangeRate={exchangeRate}
                country={store.country}
                accentColor={accentColor}
                accentColor2={accentColor2}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-[#7A7A7A] text-lg font-light">Esta tienda aún no tiene productos.</p>
                <p className="text-sm text-[#7A7A7A]/70 mt-3">
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
