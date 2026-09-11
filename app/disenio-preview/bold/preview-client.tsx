"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderBold } from "@/components/store/store-header-bold"
import { StoreHeroBoldEditable } from "@/components/store/store-hero-bold-editable"
import { CategoryShowcaseBoldEditable } from "@/components/store/category-showcase-bold-editable"
import { ProductGridBold } from "@/components/store/product-grid-bold"
import { StoreFooter } from "@/components/store/store-footer"

const STORAGE_KEY = "tol-disenio-preview-bold-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-bold-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
  accentColor2: string
}

// Vidriera de solo lectura: muestra el diseño "Bold" con datos de ejemplo
// (o los guardados antes en localStorage) para que el cliente vea cómo queda
// el diseño elegido, sin poder editarlo desde acá.
export function BoldPreviewClient({ store, categories, products, accentColor, accentColor2 }: PreviewClientProps) {
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
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeaderBold store={storeConEdicion} categories={categories} accentColor={accentColor} accentColor2={accentColor2} disableNav />
        <main className="flex-1">
          <StoreHeroBoldEditable
            store={storeConEdicion}
            accentColor={accentColor}
            accentColor2={accentColor2}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />
          <CategoryShowcaseBoldEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            accentColor={accentColor}
            accentColor2={accentColor2}
            onChangeImage={() => {}}
          />
          <section id="productos" className="container mx-auto px-6 py-14">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridBold
              products={products}
              subdomain={store.subdomain}
              accentColor={accentColor}
              accentColor2={accentColor2}
              country="AR"
              disableNav
            />
          </section>
        </main>
        <StoreFooter store={storeConEdicion} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
