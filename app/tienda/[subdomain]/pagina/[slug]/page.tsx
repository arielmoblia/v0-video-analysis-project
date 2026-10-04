import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePageBySlug, getStorePages } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreFooterPink } from "@/components/store/store-footer-pink"
import { StoreClonedHeaderLive, StoreClonedFooterLive } from "@/components/store/store-cloned-chrome-live"
import { getClonedChrome } from "@/lib/cloned-chrome"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string; slug: string }>
}

export default async function StoreOwnPage({ params }: PageProps) {
  const { subdomain, slug } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) notFound()

  const [page, categories, hasMayoristaMinorista, hasBotoneraCabecera] = await Promise.all([
    getStorePageBySlug(store.id, slug),
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
    hasStoreFeature(store.id, "botonera_cabecera"),
  ])

  // Sin la cosita activa, la página deja de ser accesible aunque siga
  // guardada (mismo criterio que el resto de las cositas pagas).
  if (!page || !hasBotoneraCabecera) notFound()

  const storePages = await getStorePages(store.id)
  const headerStyle = store.plan_features?.header_style
  const clonedChrome = getClonedChrome(store)

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
      <main className="flex-1 container mx-auto px-6 py-14 max-w-3xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">{page.title}</h1>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-neutral-700 leading-relaxed">
          {page.content || "Esta página todavía no tiene contenido."}
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
