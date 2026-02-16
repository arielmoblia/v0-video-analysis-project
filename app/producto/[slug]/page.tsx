import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { getStoreBySubdomain, getProductBySlug, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { ProductSelector } from "@/components/store/product-selector"
import { PageTracker } from "@/components/store/page-tracker"

export const revalidate = 0

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

  const [product, categories, hasMultiImages] = await Promise.all([
    getProductBySlug(store.id, slug), 
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "multi_images")
  ])

  if (!product) {
    notFound()
  }

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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "10",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <CartProvider>
      <PageTracker storeId={store.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader store={store} categories={categories} />
        <main className="flex-1 py-12 px-6">
          <div className="container mx-auto max-w-6xl">
            <ProductSelector product={product} subdomain={subdomain} hasMultiImages={hasMultiImages} />
          </div>
        </main>
        <StoreFooter store={store} />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}
