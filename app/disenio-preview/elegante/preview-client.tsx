"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderElegante } from "@/components/store/store-header-elegante"
import { StoreHeroEleganteEditable } from "@/components/store/store-hero-elegante-editable"
import { CategoryShowcaseEleganteEditable } from "@/components/store/category-showcase-elegante-editable"
import { ProductGridElegante } from "@/components/store/product-grid-elegante"
import { StoreFooter } from "@/components/store/store-footer"

const STORAGE_KEY = "tol-disenio-preview-elegante-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-elegante-categorias"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
}

// Vidriera de solo lectura: muestra el diseño "Elegante" con datos de ejemplo
// (o los guardados antes en localStorage) para que el cliente vea cómo queda
// el diseño elegido, sin poder editarlo desde acá.
export function ElegantePreviewClient({ store, categories, products, accentColor }: PreviewClientProps) {
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
        <StoreHeaderElegante store={storeConEdicion} categories={categories} accentColor={accentColor} disableNav />
        <main className="flex-1">
          <StoreHeroEleganteEditable
            store={storeConEdicion}
            accentColor={accentColor}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />
          <CategoryShowcaseEleganteEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            accentColor={accentColor}
            onChangeImage={() => {}}
          />
          <section id="productos" className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridElegante products={products} subdomain={store.subdomain} accentColor={accentColor} country="AR" disableNav />
          </section>
        </main>
        <StoreFooter store={storeConEdicion} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
