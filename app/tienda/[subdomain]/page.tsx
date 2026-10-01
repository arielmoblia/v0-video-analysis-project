import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getStoreBySubdomain, getStoreProducts, getStoreCategories, getFeaturedProducts } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePages } from "@/lib/services/store-pages"
import { seoClean } from "@/lib/utils"
import { StoreDefaultLive } from "@/components/store/store-default-live"
import { StoreModernoLive } from "@/components/store/store-moderno-live"
import { StoreEleganteLive } from "@/components/store/store-elegante-live"
import { StoreBoldLive } from "@/components/store/store-bold-live"
import { StoreBlinggLive } from "@/components/store/store-blingg-live"
import { StoreArtesanoLive } from "@/components/store/store-artesano-live"
import { StoreLuxuryLive } from "@/components/store/store-luxury-live"
import { StoreMinimalLive } from "@/components/store/store-minimal-live"
import { StoreVintageLive } from "@/components/store/store-vintage-live"
import { StoreBasicoLive } from "@/components/store/store-basico-live"

const MODERNO_ACCENT = "#e8590c"
const ELEGANTE_ACCENT = "#f7791e"
const BOLD_ACCENT = "#ec4899"
const BOLD_ACCENT_2 = "#22c55e"
const BLINGG_ACCENT = "#6EC1E4"
const BLINGG_ACCENT_2 = "#61CE70"
const ARTESANO_ACCENT = "#C19A83"
const ARTESANO_ACCENT_2 = "#4A3427"
const LUXURY_ACCENT = "#ebb868"
const MINIMAL_ACCENT = "#ff7f00"
const VINTAGE_ACCENT = "#cc3833"

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

  const [products, categories, featuredProducts, hasMayoristaMinorista, hasBannerDeslizante, storePages] = await Promise.all([
    getStoreProducts(store.id),
    getStoreCategories(store.id),
    getFeaturedProducts(store.id),
    hasStoreFeature(store.id, 'mayorista_minorista'),
    hasStoreFeature(store.id, 'banner_deslizante'),
    getStorePages(store.id),
  ])

  // Los temples "Moderno" y "Elegante" solo reemplazan el index (header/hero/
  // categorías/destacados). Todo lo demás —producto, categoría, checkout,
  // carrito— sigue siendo el ecommerce estándar de tol.ar: los links de acá
  // abajo van a esas mismas rutas.
  const activeTheme = store.plan_features?.active_theme

  if (activeTheme === "moderno") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreModernoLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={MODERNO_ACCENT}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
        storePages={storePages}
      />
    )
  }

  if (activeTheme === "elegante") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreEleganteLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={ELEGANTE_ACCENT}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "bold") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreBoldLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={BOLD_ACCENT}
        accentColor2={BOLD_ACCENT_2}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "blingg") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreBlinggLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={BLINGG_ACCENT}
        accentColor2={BLINGG_ACCENT_2}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "artesano") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreArtesanoLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={ARTESANO_ACCENT}
        accentColor2={ARTESANO_ACCENT_2}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "luxury") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreLuxuryLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "minimal") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreMinimalLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        accentColor={MINIMAL_ACCENT}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "vintage") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
    const initialCategoryImages = store.plan_features?.category_images || {}

    return (
      <StoreVintageLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        initialCategoryImages={initialCategoryImages}
      />
    )
  }

  if (activeTheme === "basico") {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"

    return (
      <StoreBasicoLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        isOwner={isOwner}
        hasMayoristaMinorista={hasMayoristaMinorista}
      />
    )
  }

  {
    const cookieStore = await cookies()
    const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"

    return (
      <StoreDefaultLive
        store={store}
        categories={categories}
        products={products}
        featuredProducts={featuredProducts}
        subdomain={subdomain}
        exchangeRate={exchangeRate}
        hasMayoristaMinorista={hasMayoristaMinorista}
        hasBannerDeslizante={hasBannerDeslizante}
        isOwner={isOwner}
      />
    )
  }
}
