"use client"

import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHero } from "@/components/store/store-hero"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"

interface PreviewClientProps {
  store: Store
  categories: Category[]
  products: Product[]
}

// Vidriera de solo lectura: muestra el diseño "Básico" (el que ya trae toda
// tienda nueva) con datos de ejemplo, sin poder editarlo desde acá.
export function BasicoPreviewClient({ store, categories, products }: PreviewClientProps) {
  return (
    <CartProvider country="AR">
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={false} />
        <main className="flex-1">
          <StoreHero store={store} />

          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
              </div>
              <ProductGrid products={products} subdomain={store.subdomain} exchangeRate={0} country={store.country} />
            </div>
          </section>
        </main>
        <StoreFooter store={store} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
