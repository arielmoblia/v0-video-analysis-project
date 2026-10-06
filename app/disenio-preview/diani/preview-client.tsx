"use client"

import { useEffect, useState } from "react"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderDiani } from "@/components/store/store-header-diani"
import { StoreHeroDianiEditable } from "@/components/store/store-hero-diani-editable"
import { ProductGridDiani } from "@/components/store/product-grid-diani"
import { StoreFooterDiani } from "@/components/store/store-footer-diani"
import { dianiBody } from "@/lib/fonts/diani"

const STORAGE_KEY = "tol-disenio-preview-diani-banner"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
}

// Vidriera de solo lectura del diseño "Minimalista", mismo patrón que
// MinimalPreviewClient/ArtesanoPreviewClient.
export function DianiPreviewClient({ store, categories, products }: PreviewClientProps) {
  const [banner, setBanner] = useState({
    banner_image: store.banner_image || "",
    banner_title: store.banner_title || "",
    banner_subtitle: store.banner_subtitle || "",
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setBanner(JSON.parse(raw))
    } catch {}
  }, [])

  const storeConEdicion: Store = { ...store, ...banner }

  return (
    <CartProvider country="AR">
      <div className={`${dianiBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderDiani store={storeConEdicion} categories={categories} disableNav />
        <main className="flex-1">
          <StoreHeroDianiEditable
            store={storeConEdicion}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <section id="productos" className="container mx-auto px-6 py-16">
            <ProductGridDiani products={products} subdomain={store.subdomain} country="AR" disableNav />
          </section>
        </main>
        <StoreFooterDiani store={storeConEdicion} categories={categories} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
