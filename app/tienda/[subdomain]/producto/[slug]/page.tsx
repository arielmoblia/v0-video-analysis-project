import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { seoClean, seoDesc } from "@/lib/utils"
import { getStoreBySubdomain, getProductBySlug } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStoreCategories } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { ProductSelector } from "@/components/store/product-selector"
import { formatPriceNumber } from "@/lib/currency"

interface ProductPageProps {
  params: Promise<{ subdomain: string; slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { subdomain, slug } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) return {}
  const product = await getProductBySlug(store.id, slug)
  if (!product) return {}

  const storeName = store.site_title || subdomain
  const priceFormatted = formatPriceNumber(product.price, store.country)

  // Título: producto primero para keyword match; prefix de categoría para perfumes; sin emojis
  const titleSuffix = ` | ${storeName}`
  const maxNameLen = 60 - titleSuffix.length
  const rawNameForTitle = (store.template === "perfumes" || store.template === "fragrances") && !product.name.toLowerCase().startsWith("perfume")
    ? `Perfume ${product.name}`
    : product.name
  const cleanNameForTitle = seoClean(rawNameForTitle)
  const productNameForTitle = cleanNameForTitle.length > maxNameLen
    ? cleanNameForTitle.slice(0, Math.max(maxNameLen - 3, 20)).replace(/\s+\S*$/, '') + "..."
    : cleanNameForTitle
  const title = `${productNameForTitle}${titleSuffix}`

  // Descripción: preferir descripción real de la DB (única por producto) para diferenciación SEO
  const descFromDb = product.description ? seoDesc(product.description) : null
  // Fallback con keywords de categoría según template de la tienda
  const productNameClean = seoClean(product.name)
  const categoryDescTemplates: Record<string, string> = {
    zapatos: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Elegí tu talle, pagá en cuotas y recibilo en todo Argentina.`,
    footwear: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Elegí tu talle, pagá en cuotas y recibilo en todo Argentina.`,
    ropa: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Seleccioná tu talle, stock disponible. Envíos a todo el país.`,
    clothing: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Seleccioná tu talle, stock disponible. Envíos a todo el país.`,
    perfumes: `Comprá ${productNameClean} a $${priceFormatted}. Perfume 100% original con envío a todo Argentina. Precio actualizado en ${storeName}.`,
    fragrances: `Comprá ${productNameClean} a $${priceFormatted}. Perfume 100% original con envío a todo Argentina. Precio actualizado en ${storeName}.`,
    cosmetics: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Cosmética original con envío a todo Argentina. Precio actualizado.`,
    electronicos: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Precio y stock actualizados. Envíos a todo el país, pagá en cuotas con tarjeta.`,
    electronics: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Precio y stock actualizados. Envíos a todo el país, pagá en cuotas con tarjeta.`,
    deportes: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Artículo deportivo con envío a todo el país. Pagá en cuotas, stock disponible.`,
    fitness: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Equipamiento fitness con envío a todo el país. Stock disponible, pagá en cuotas.`,
    crossfit: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Equipamiento crossfit con envío a todo el país. Stock disponible, pagá en cuotas.`,
  }
  // DB primero (descripción única por producto); si cabe en 155 chars, agregar precio e intent comercial
  const priceTag = ` — $${priceFormatted} en ${storeName}.`
  const descEnriched = descFromDb
    ? ((descFromDb + priceTag).length <= 155 ? descFromDb + priceTag : descFromDb)
    : null
  const description = descEnriched
    ?? categoryDescTemplates[store.template]
    ?? `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Precio actualizado, stock disponible. Envíos a todo el país con pago en cuotas.`

  const image = product.image_url && !product.image_url.includes("placeholder")
    ? product.image_url
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    alternates: {
      canonical: `https://tol.ar/tienda/${subdomain}/producto/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { subdomain, slug } = await params

  const store = await getStoreBySubdomain(subdomain)
  if (!store) {
    notFound()
  }

  const [product, hasMultiImages, hasDolarPeso, hasMayoristaMinorista] = await Promise.all([
    getProductBySlug(store.id, slug),
    hasStoreFeature(store.id, "multi_images"),
    hasStoreFeature(store.id, 'dolar_peso'),
    hasStoreFeature(store.id, 'mayorista_minorista'),
  ])

  if (!product) {
    notFound()
  }

  // La conversión por "dólar blue" es una feature paga pensada para tiendas
  // argentinas (dolar_valor lo carga el dueño con la cotización blue AR/USD).
  // Para tiendas de Chile no tiene sentido esa conversión, así que se ignora
  // y se muestra el precio de la tienda tal cual está cargado (en CLP).
  const exchangeRate = hasDolarPeso && store.country !== "CL" ? (store.dolar_valor || 0) : 0

  const cookieStore = await cookies()
  const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
  const canEditProduct = isOwner && store.plan_features?.active_theme === "moderno"

  // JSON-LD Product schema automatico
  const categoryMap: Record<string, string> = {
    zapatos: "Apparel & Accessories > Shoes",
    ropa: "Apparel & Accessories > Clothing",
    perfumes: "Health & Beauty > Fragrances",
    electronicos: "Electronics",
    base: "Business & Industrial",
  }
  const productImage = product.image_url && !product.image_url.includes("placeholder")
    ? product.image_url
    : `https://${subdomain}.tol.ar/tol-logo.png`

  const availability = product.stock === 0
    ? "https://schema.org/OutOfStock"
    : product.stock && product.stock < 5
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock"

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} disponible en ${store.site_title}`,
    image: productImage,
    url: `https://${subdomain}.tol.ar/producto/${product.slug}`,
    sku: product.id,
    brand: { "@type": "Brand", name: store.site_title || subdomain },
    category: categoryMap[store.template] || "Business & Industrial",
    offers: {
      "@type": "Offer",
      url: `https://${subdomain}.tol.ar/producto/${product.slug}`,
      priceCurrency: "ARS",
      price: product.price,
      ...(product.compare_price && product.compare_price > product.price
        ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
        : {}),
      availability,
      seller: { "@type": "Organization", name: store.site_title || subdomain },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "AR" },
      },
    },
    ...(product.sizes && product.sizes.length > 0
      ? {
          additionalProperty: product.sizes.map((size: string) => ({
            "@type": "PropertyValue",
            name: "Talle",
            value: size,
          })),
        }
      : {}),
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <StoreHeader store={store} categories={[]} hasMayoristaMinorista={hasMayoristaMinorista} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href={`/tienda/${subdomain}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>

          <ProductSelector product={product} subdomain={subdomain} hasMultiImages={hasMultiImages} exchangeRate={exchangeRate} template={store.template} country={store.country} canEdit={canEditProduct} storeId={store.id} />
        </div>
      </main>

      <StoreFooter store={store} />
    </div>
  )
}
