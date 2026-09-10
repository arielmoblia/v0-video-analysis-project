import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getStoreBySubdomain, getStoreProducts, getStoreCategories, getFeaturedProducts } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { seoClean } from "@/lib/utils"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHero } from "@/components/store/store-hero"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreHeaderModern } from "@/components/store/store-header-modern"
import { StoreHeroModern } from "@/components/store/store-hero-modern"
import { CategoryShowcaseModern } from "@/components/store/category-showcase-modern"
import { ProductGridModern } from "@/components/store/product-grid-modern"

const MODERNO_ACCENT = "#e8590c"

export const revalidate = 0

interface StorePageProps {
  params: Promise<{ subdomain: string }>
}

// Texto genérico por rubro cuando la tienda no escribió su propio subtítulo de banner
const DEFAULT_BANNER_SUBTITLE = "Descubre nuestra colección exclusiva"
const rubroDescTemplates: Record<string, string> = {
  zapatos: "calzado",
  footwear: "calzado",
  ropa: "ropa y accesorios",
  clothing: "ropa y accesorios",
  perfumes: "perfumes originales",
  fragrances: "perfumes originales",
  cosmetics: "cosmética y maquillaje",
  electronicos: "tecnología y electrónica",
  electronics: "tecnología y electrónica",
  deportes: "artículos deportivos",
  fitness: "equipamiento fitness",
  crossfit: "equipamiento crossfit",
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { subdomain } = await params
  if (subdomain.startsWith("preview-")) return {}

  const store = await getStoreBySubdomain(subdomain)
  if (!store) return {}

  const storeName = seoClean(store.site_title || subdomain)
  const title = `${storeName} — Tienda online en Argentina`

  const rubro = rubroDescTemplates[store.template]
  const hasCustomSubtitle = store.banner_subtitle && store.banner_subtitle !== DEFAULT_BANNER_SUBTITLE
  const description = hasCustomSubtitle
    ? seoClean(`${storeName}: ${store.banner_subtitle}. Envíos a todo Argentina.`).slice(0, 155)
    : rubro
      ? `${storeName} — tienda online de ${rubro} en Argentina. Envíos a todo el país, pagá en cuotas.`
      : `${storeName} — tienda online en Argentina. Envíos a todo el país, pagá en cuotas. Creada con tol.ar.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(store.banner_image ? { images: [store.banner_image] } : {}),
    },
    alternates: {
      canonical: `https://tol.ar/tienda/${subdomain}`,
    },
  }
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

  const hasDolarPeso = await hasStoreFeature(store.id, 'dolar_peso')
  // La conversión por "dólar blue" es una feature paga pensada para tiendas
  // argentinas; para tiendas de Chile se ignora y se muestra el precio
  // cargado tal cual (en CLP), sin conversión.
  const exchangeRate = hasDolarPeso && store.country !== "CL" ? (store.dolar_valor || 0) : 0

  const [products, categories, featuredProducts, hasMayoristaMinorista] = await Promise.all([
    getStoreProducts(store.id),
    getStoreCategories(store.id),
    getFeaturedProducts(store.id),
    hasStoreFeature(store.id, 'mayorista_minorista'),
  ])

  // El temple "Moderno" solo reemplaza el index (header/hero/categorías/destacados).
  // Todo lo demás —producto, categoría, checkout, carrito— sigue siendo el
  // ecommerce estándar de tol.ar: los links de acá abajo van a esas mismas rutas.
  const activeTheme = store.plan_features?.active_theme

  if (activeTheme === "moderno") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeaderModern store={store} categories={categories} accentColor={MODERNO_ACCENT} />
        <main className="flex-1">
          <StoreHeroModern store={store} accentColor={MODERNO_ACCENT} />
          <CategoryShowcaseModern categories={categories} subdomain={subdomain} />

          {featuredProducts.length > 0 && (
            <section className="container mx-auto px-6 py-14">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
              <ProductGridModern
                products={featuredProducts}
                subdomain={subdomain}
                exchangeRate={exchangeRate}
                country={store.country}
                accentColor={MODERNO_ACCENT}
              />
            </section>
          )}

          <section id="productos" className="bg-neutral-50">
            <div className="container mx-auto px-6 py-14">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Todos los productos</h2>
              {products.length > 0 ? (
                <ProductGridModern
                  products={products}
                  subdomain={subdomain}
                  exchangeRate={exchangeRate}
                  country={store.country}
                  accentColor={MODERNO_ACCENT}
                />
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      <main className="flex-1">
        <StoreHero store={store} />

        {featuredProducts.length > 0 && (
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
              </div>
              <ProductGrid products={featuredProducts} subdomain={subdomain} exchangeRate={exchangeRate} country={store.country} />
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
              <ProductGrid products={products} subdomain={subdomain} exchangeRate={exchangeRate} country={store.country} />
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
