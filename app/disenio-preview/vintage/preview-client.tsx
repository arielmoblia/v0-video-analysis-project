"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderVintage } from "@/components/store/store-header-vintage"
import { StoreHeroVintageEditable } from "@/components/store/store-hero-vintage-editable"
import { FeaturesVintage } from "@/components/store/features-vintage"
import { CategoryShowcaseVintageEditable } from "@/components/store/category-showcase-vintage-editable"
import { ProductGridVintage } from "@/components/store/product-grid-vintage"
import { TestimonialsVintage } from "@/components/store/testimonials-vintage"
import { StoreFooterVintage } from "@/components/store/store-footer-vintage"
import { vintageBody, vintageHeading } from "@/lib/fonts/vintage"

const STORAGE_KEY = "tol-disenio-preview-vintage-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-vintage-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
}

// Vidriera de solo lectura del diseño "Vintage", mismo patrón que
// LuxuryPreviewClient/MinimalPreviewClient.
export function VintagePreviewClient({ store, categories, products }: PreviewClientProps) {
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
      <div className={`${vintageBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderVintage store={storeConEdicion} categories={categories} disableNav />
        <main className="flex-1">
          <StoreHeroVintageEditable
            store={storeConEdicion}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <FeaturesVintage />

          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632]`}>Novedades</h2>
            </div>
            <ProductGridVintage products={products} subdomain={store.subdomain} country="AR" disableNav />
          </section>

          <CategoryShowcaseVintageEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            onChangeImage={() => {}}
          />

          <TestimonialsVintage />
        </main>
        <StoreFooterVintage store={storeConEdicion} categories={categories} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
