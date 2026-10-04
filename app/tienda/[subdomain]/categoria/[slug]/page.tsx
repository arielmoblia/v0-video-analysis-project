import { getStoreBySubdomain, getStoreCategories, getStoreProducts } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePages } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreFooterPink } from "@/components/store/store-footer-pink"
import { StoreClonedHeaderLive, StoreClonedFooterLive } from "@/components/store/store-cloned-chrome-live"
import { getClonedChrome } from "@/lib/cloned-chrome"
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

  const [categories, allProducts, hasMayoristaMinorista, storePages] = await Promise.all([
    getStoreCategories(store.id),
    getStoreProducts(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
    getStorePages(store.id),
  ])
  const headerStyle = store.plan_features?.header_style
  const clonedChrome = getClonedChrome(store)

  // Encontrar la categoría actual
  const currentCategory = categories.find((cat) => cat.slug === slug)

  if (!currentCategory) {
    redirect(`/tienda/${subdomain}`)
  }

  // Filtrar productos por categoría
  const products = allProducts.filter((product) => product.category_id === currentCategory.id)

  return (
    <div className="min-h-screen flex flex-col">
      {clonedChrome ? (
        <StoreClonedHeaderLive
          headerHtml={clonedChrome.headerHtml}
          footerHtml={clonedChrome.footerHtml}
          stylesheetHrefs={clonedChrome.stylesheetHrefs}
          inlineStyles={clonedChrome.inlineStyles}
        />
      ) : headerStyle === "pink" ? (
        <StoreHeaderPink store={store} categories={categories} storePages={storePages} />
      ) : (
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      )}

      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-light tracking-wide text-center mb-2">{currentCategory.name}</h1>
          <p className="text-neutral-500 text-center mb-12">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>

          {products.length > 0 ? (
            <ProductGrid products={products} subdomain={subdomain} country={store.country} />
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500">No hay productos en esta categoría</p>
            </div>
          )}
        </div>
      </main>

      {clonedChrome ? (
        <StoreClonedFooterLive footerHtml={clonedChrome.footerHtml} />
      ) : headerStyle === "pink" ? (
        <StoreFooterPink store={store} categories={categories} storePages={storePages} />
      ) : (
        <StoreFooter store={store} />
      )}
    </div>
  )
}
