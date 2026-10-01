import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePageBySlug } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string; slug: string }>
}

export default async function StoreOwnPage({ params }: PageProps) {
  const { subdomain, slug } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) notFound()

  const [page, categories, hasMayoristaMinorista] = await Promise.all([
    getStorePageBySlug(store.id, slug),
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
  ])

  if (!page) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      <main className="flex-1 container mx-auto px-6 py-14 max-w-3xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">{page.title}</h1>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-neutral-700 leading-relaxed">
          {page.content || "Esta página todavía no tiene contenido."}
        </div>
      </main>
      <StoreFooter store={store} />
    </div>
  )
}
