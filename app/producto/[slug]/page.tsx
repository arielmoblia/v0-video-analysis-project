import type { Metadata } from "next"
import { headers, cookies } from "next/headers"
import { notFound } from "next/navigation"
import { seoClean, seoDesc } from "@/lib/utils"
import { getStoreBySubdomain, getProductBySlug, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { ProductSelector } from "@/components/store/product-selector"
import { ProductEditable } from "@/components/store/product-editable"
import { PageTracker } from "@/components/store/page-tracker"
import { formatPriceNumber } from "@/lib/currency"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const headersList = await headers()
  const host = headersList.get("host") || ""

  if (!host.includes("tol.ar") || host === "tol.ar" || host.startsWith("www.")) return {}

  const subdomain = host.split(".")[0]
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

  // Descripción: primer párrafo sustantivo de la DB (evita líneas de especificaciones técnicas)
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
    electronicos: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Stock y precio actualizados. Envío a todo Argentina, pagá en cuotas.`,
    electronics: `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Stock y precio actualizados. Envío a todo Argentina, pagá en cuotas.`,
  }
  const description = categoryDescTemplates[store.template]
    ?? descFromDb
    ?? `Comprá ${productNameClean} a $${priceFormatted} en ${storeName}. Stock disponible, precio actualizado. Envíos a todo Argentina.`

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
      canonical: `https://${subdomain}.tol.ar/producto/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headersList = await headers()
  const host = headersList.get("host") || ""

  // Si no es un subdominio, redirigir a 404
  if (!host.includes("tol.ar") || host === "tol.ar" || host.startsWith("www.")) {
    notFound()
  }

  const subdomain = host.split(".")[0]
  const store = await getStoreBySubdomain(subdomain)

  if (!store) {
    notFound()
  }

  const [product, categories, hasMultiImages, hasMayoristaMinorista] = await Promise.all([
    getProductBySlug(store.id, slug),
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "multi_images"),
    hasStoreFeature(store.id, "mayorista_minorista")
  ])

  if (!product) {
    notFound()
  }

  const cookieStore = await cookies()
  const isOwner = cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
  const canEditProduct = isOwner && ["moderno", "elegante", "bold"].includes(store.plan_features?.active_theme || "")

  // Categoria Google Merchant Center segun el template de la tienda
  const categoryMap: Record<string, string> = {
    zapatos: "Apparel & Accessories > Shoes",
    ropa: "Apparel & Accessories > Clothing",
    perfumes: "Health & Beauty > Fragrances",
    electronicos: "Electronics",
    base: "Business & Industrial",
  }
  const googleCategory = categoryMap[store.template] || "Business & Industrial"

  // Determinar disponibilidad segun stock
  const availability = product.stock === 0
    ? "https://schema.org/OutOfStock"
    : product.stock && product.stock < 5
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock"

  // Imagen del producto
  const productImage = product.image_url && !product.image_url.includes("placeholder")
    ? product.image_url
    : `https://${subdomain}.tol.ar/tol-logo.png`

  // JSON-LD Product para Google Merchant Center y buscadores generativos
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} disponible en ${store.site_title}`,
    image: productImage,
    url: `https://${subdomain}.tol.ar/producto/${product.slug}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: store.site_title || subdomain,
    },
    category: googleCategory,
    offers: {
      "@type": "Offer",
      url: `https://${subdomain}.tol.ar/producto/${product.slug}`,
      priceCurrency: "ARS",
      price: product.price,
      ...(product.compare_price && product.compare_price > product.price
        ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
        : {}),
      availability,
      seller: {
        "@type": "Organization",
        name: store.site_title || subdomain,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AR",
        },
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
    <CartProvider country={store.country}>
      <PageTracker storeId={store.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
        <main className="flex-1 py-12 px-6">
          <div className="container mx-auto max-w-6xl">
            {canEditProduct ? (
              <ProductEditable product={product} subdomain={subdomain} hasMultiImages={hasMultiImages} template={store.template} country={store.country} storeId={store.id} />
            ) : (
              <ProductSelector product={product} subdomain={subdomain} hasMultiImages={hasMultiImages} template={store.template} country={store.country} />
            )}
          </div>
        </main>
        <StoreFooter store={store} />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}
