import { notFound, redirect } from "next/navigation"
import { getStoreBySubdomain, getStoreProducts, getStoreCategories, getFeaturedProducts } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHero } from "@/components/store/store-hero"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"

export const revalidate = 0

interface StorePageProps {
  params: Promise<{ subdomain: string }>
}

export default async function StorePage({ params }: StorePageProps) {
  const { subdomain } = await params

  if (subdomain.startsWith("preview-")) {
    redirect("/")
  }

  const store = await getStoreBySubdomain(subdomain)

  if (!store) {
    notFound()
  }

  const [products, categories, featuredProducts] = await Promise.all([
    getStoreProducts(store.id),
    getStoreCategories(store.id),
    getFeaturedProducts(store.id),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader store={store} categories={categories} />
      <main className="flex-1">
        <StoreHero store={store} />

        {featuredProducts.length > 0 && (
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
              </div>
              <ProductGrid products={featuredProducts} subdomain={subdomain} />
            </div>
          </section>
        )}

        <section id="productos" className="py-20 px-6 bg-neutral-50">
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Explorar</p>
              <h2 className="text-3xl font-light tracking-wide">Todos los Productos</h2>
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} subdomain={subdomain} />
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg font-light">Esta tienda aún no tiene productos.</p>
                <p className="text-sm text-neutral-400 mt-3">
                  El dueño puede agregar productos desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <StoreFooter store={store} />
    </div>
  )
}
