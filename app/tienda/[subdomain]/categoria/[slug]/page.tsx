import { getStoreBySubdomain, getStoreCategories, getStoreProducts } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { ProductGrid } from "@/components/store/product-grid"
import { redirect } from "next/navigation"

export const revalidate = 0

interface CategoryPageProps {
  params: Promise<{ subdomain: string; slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { subdomain, slug } = await params

  const store = await getStoreBySubdomain(subdomain)
  if (!store) {
    redirect("/")
  }

  const categories = await getStoreCategories(store.id)
  const allProducts = await getStoreProducts(store.id)

  // Encontrar la categoría actual
  const currentCategory = categories.find((cat) => cat.slug === slug)

  if (!currentCategory) {
    redirect(`/tienda/${subdomain}`)
  }

  // Filtrar productos por categoría
  const products = allProducts.filter((product) => product.category_id === currentCategory.id)

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader store={store} categories={categories} />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-light tracking-wide text-center mb-2">{currentCategory.name}</h1>
          <p className="text-neutral-500 text-center mb-12">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>

          {products.length > 0 ? (
            <ProductGrid products={products} subdomain={subdomain} />
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500">No hay productos en esta categoría</p>
            </div>
          )}
        </div>
      </main>

      <StoreFooter store={store} />
    </div>
  )
}
