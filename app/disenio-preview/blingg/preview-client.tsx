"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderBlingg } from "@/components/store/store-header-blingg"
import { StoreHeroBlinggEditable } from "@/components/store/store-hero-blingg-editable"
import { CategoryShowcaseBlinggEditable } from "@/components/store/category-showcase-blingg-editable"
import { ProductGridBlingg } from "@/components/store/product-grid-blingg"
import { StoreFooter } from "@/components/store/store-footer"
import { blinggBody, blinggHeading } from "@/lib/fonts/blingg"

const STORAGE_KEY = "tol-disenio-preview-blingg-banner"
const CATEGORIES_STORAGE_KEY = "tol-disenio-preview-blingg-categorias"

const TRUST_BADGES = [
  { icon: "/design-assets/blingg-jewelry/icon-01.png", label: "Envío gratis" },
  { icon: "/design-assets/blingg-jewelry/icon-02.png", label: "Pagos seguros" },
  { icon: "/design-assets/blingg-jewelry/icon-03.png", label: "Seguimiento de pedido" },
  { icon: "/design-assets/blingg-jewelry/icon-04.png", label: "Grandes descuentos" },
]

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
  accentColor: string
  accentColor2: string
}

// Vidriera de solo lectura: muestra el diseño "Blingg" con datos de ejemplo
// (o los guardados antes en localStorage) para que el cliente vea cómo queda
// el diseño elegido, sin poder editarlo desde acá.
export function BlinggPreviewClient({ store, categories, products, accentColor, accentColor2 }: PreviewClientProps) {
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
      <div className={`${blinggBody.className} min-h-screen flex flex-col bg-white`}>
        <StoreHeaderBlingg store={storeConEdicion} categories={categories} accentColor={accentColor} accentColor2={accentColor2} disableNav />
        <main className="flex-1">
          <StoreHeroBlinggEditable
            store={storeConEdicion}
            accentColor={accentColor}
            accentColor2={accentColor2}
            editMode={false}
            onChangeImage={() => {}}
            onChangeTitle={() => {}}
            onChangeSubtitle={() => {}}
          />

          <section className="border-y border-[#e5f2f8] bg-[#FAFDFE]">
            <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                  <Image src={badge.icon} alt="" width={40} height={30} className="opacity-80" />
                  <span className="text-xs font-medium text-[#7A7A7A]">{badge.label}</span>
                </div>
              ))}
            </div>
          </section>

          <CategoryShowcaseBlinggEditable
            categories={categories}
            images={categoryImages}
            editMode={false}
            accentColor={accentColor}
            onChangeImage={() => {}}
          />
          <section id="productos" className="container mx-auto px-6 py-14">
            <h2 className={`${blinggHeading.className} text-2xl font-bold text-[#54595F] mb-6`}>Destacados</h2>
            <ProductGridBlingg
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
