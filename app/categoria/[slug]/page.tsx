import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories, getProductsByCategory } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { ProductGrid } from "@/components/store/product-grid"
import { PageTracker } from "@/components/store/page-tracker"

export const revalidate = 0

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headersList = await headers()
  const host = headersList.get("host") || ""

  if (!host.includes("tol.ar") || host === "tol.ar" || host.startsWith("www.")) {
    notFound()
  }

  const subdomain = host.split(".")[0]
  const store = await getStoreBySubdomain(subdomain)

  if (!store) {
    notFound()
  }

  const categories = await getStoreCategories(store.id)
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(store.id, category.id)

  return (
    <CartProvider>
      <PageTracker storeId={store.id} />
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader store={store} categories={categories} />
        <main className="flex-1">
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Categoría</p>
                <h1 className="text-3xl font-light tracking-wide">{category.name}</h1>
              </div>
              {products.length > 0 ? (
                <ProductGrid products={products} subdomain={subdomain} />
              ) : (
                <div className="text-center py-20">
                  <p className="text-neutral-500 text-lg font-light">No hay productos en esta categoría.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <StoreFooter store={store} />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}
