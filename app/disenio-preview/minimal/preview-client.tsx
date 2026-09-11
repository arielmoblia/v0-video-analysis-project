"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderMinimal } from "@/components/store/store-header-minimal"
import { StoreHeroMinimalEditable } from "@/components/store/store-hero-minimal-editable"
import { CategoryShowcaseMinimalEditable } from "@/components/store/category-showcase-minimal-editable"
import { ProductGridMinimal } from "@/components/store/product-grid-minimal"
import { StoreFooterMinimal } from "@/components/store/store-footer-minimal"
import { minimalBody } from "@/lib/fonts/minimal"

const STORAGE_KEY = "tol-disenio-preview-minimal-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-minimal-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
}

// Vidriera de solo lectura del diseño "Minimal", mismo patrón que
// ArtesanoPreviewClient/BlinggPreviewClient.
export function MinimalPreviewClient({ store, categories, products, accentColor }: PreviewClientProps) {
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
      <div className={`${minimalBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderMinimal store={storeConEdicion} categories={categories} accentColor={accentColor} disableNav />
        <main className="flex-1">
          <StoreHeroMinimalEditable
            store={storeConEdicion}
            accentColor={accentColor}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-light lowercase text-neutral-900">novedades</h2>
              <div className="mx-auto mt-3 h-px w-10" style={{ backgroundColor: accentColor }} />
            </div>
            <ProductGridMinimal
              products={products}
              subdomain={store.subdomain}
              accentColor={accentColor}
              country="AR"
              disableNav
            />
          </section>

          <CategoryShowcaseMinimalEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            accentColor={accentColor}
            onChangeImage={() => {}}
          />
        </main>
        <StoreFooterMinimal store={storeConEdicion} categories={categories} accentColor={accentColor} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
