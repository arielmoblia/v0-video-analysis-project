"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderArtesano } from "@/components/store/store-header-artesano"
import { StoreHeroArtesanoEditable } from "@/components/store/store-hero-artesano-editable"
import { BrandStripArtesano } from "@/components/store/brand-strip-artesano"
import { CategoryShowcaseArtesanoEditable } from "@/components/store/category-showcase-artesano-editable"
import { ProductGridArtesano } from "@/components/store/product-grid-artesano"
import { BenefitsBannerArtesano } from "@/components/store/benefits-banner-artesano"
import { StoreFooterArtesano } from "@/components/store/store-footer-artesano"
import { artesanoBody, artesanoHeading } from "@/lib/fonts/artesano"

const STORAGE_KEY = "tol-disenio-preview-artesano-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-artesano-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
  accentColor2: string
}

// Vidriera de solo lectura: muestra el diseño "Artesano" con datos de ejemplo
// (o los guardados antes en localStorage) para que el cliente vea cómo queda
// el diseño elegido, sin poder editarlo desde acá. Mismo orden de secciones
// que store-artesano-live.tsx: hero → logos → categorías → destacados →
// beneficios → todos los productos → footer con categorías.
export function ArtesanoPreviewClient({ store, categories, products, accentColor, accentColor2 }: PreviewClientProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setBanner(JSON.parse(raw))
      const rawCats = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      if (rawCats) setCategoryImages(JSON.parse(rawCats))
    } catch {}
  }, [])

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <CartProvider country="AR">
      <div className={`${artesanoBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderArtesano store={storeConEdicion} categories={categories} accentColor={accentColor} accentColor2={accentColor2} disableNav />
        <main className="flex-1">
          <StoreHeroArtesanoEditable
            store={storeConEdicion}
            accentColor={accentColor}
            accentColor2={accentColor2}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <BrandStripArtesano />

          <CategoryShowcaseArtesanoEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            accentColor={accentColor}
            accentColor2={accentColor2}
            onChangeImage={() => {}}
          />

          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${artesanoHeading.className} text-2xl md:text-3xl text-[#3a2c22]`}>Productos destacados</h2>
              <div className="mx-auto mt-3 h-[2px] w-12" style={{ backgroundColor: accentColor }} />
            </div>
            <ProductGridArtesano
              products={products}
              subdomain={store.subdomain}
              accentColor={accentColor}
              accentColor2={accentColor2}
              country="AR"
              disableNav
            />
          </section>

          <BenefitsBannerArtesano accentColor={accentColor} accentColor2={accentColor2} />
        </main>
        <StoreFooterArtesano store={storeConEdicion} categories={categories} accentColor={accentColor} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
