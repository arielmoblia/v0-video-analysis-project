"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
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

const STORAGE_KEY = "tol-disenio-preview-luxury-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-luxury-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
}

// Vidriera de solo lectura del diseño "Luxury", mismo patrón que
// ArtesanoPreviewClient/MinimalPreviewClient.
export function LuxuryPreviewClient({ store, categories, products }: PreviewClientProps) {
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
      <div className={`${luxuryBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderLuxury store={storeConEdicion} categories={categories} disableNav />
        <main className="flex-1">
          <MarqueeStripLuxury text={store.site_title.toUpperCase()} />

          <StoreHeroLuxuryEditable
            store={storeConEdicion}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <PromoBarLuxury />

          <section id="productos" className="container mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900`}>Destacados</h2>
            </div>
            <ProductGridLuxury products={products} subdomain={store.subdomain} country="AR" disableNav />
          </section>

          <CategoryShowcaseLuxuryEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            onChangeImage={() => {}}
          />

          <BenefitsBannerLuxury />

          <TestimonialsLuxury />
        </main>
        <StoreFooterLuxury store={storeConEdicion} categories={categories} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
