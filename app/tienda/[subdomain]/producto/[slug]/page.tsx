import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getStoreBySubdomain, getProductBySlug } from "@/lib/store-context"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { CartDrawer } from "@/components/store/cart-drawer"
import { ProductSelector } from "@/components/store/product-selector"

interface ProductPageProps {
  params: Promise<{ subdomain: string; slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { subdomain, slug } = await params

  const store = await getStoreBySubdomain(subdomain)
  if (!store) {
    notFound()
  }

  const product = await getProductBySlug(store.id, slug)
  if (!product) {
    notFound()
  }

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
      <StoreHeader store={store} categories={[]} />

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

          <ProductSelector product={product} subdomain={subdomain} />
        </div>
      </main>

      <StoreFooter store={store} />
      <CartDrawer />
    </div>
  )
}
