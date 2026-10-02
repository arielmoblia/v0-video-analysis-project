import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePages } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreFooter } from "@/components/store/store-footer"
import { CuentaClient } from "@/components/store/cuenta-client"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string }>
}

export default async function CuentaPage({ params }: PageProps) {
  const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) notFound()

  const [categories, hasMayoristaMinorista, hasCustomerAccounts, storePages] = await Promise.all([
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
    hasStoreFeature(store.id, "customer_accounts"),
    getStorePages(store.id),
  ])

  if (!hasCustomerAccounts) notFound()

  const headerStyle = store.plan_features?.header_style

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {headerStyle === "pink" ? (
        <StoreHeaderPink store={store} categories={categories} storePages={storePages} />
      ) : (
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      )}
      <main className="flex-1 container mx-auto px-6 py-14 max-w-xl">
        <CuentaClient subdomain={subdomain} storeName={store.site_title} country={store.country} />
      </main>
      <StoreFooter store={store} />
    </div>
  )
}
