"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridBlinggProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

// Fotos reales de joyas sacadas de la demo scrapeada, usadas como fallback
// cuando el producto todavía no tiene foto propia cargada (igual mecanismo
// que "Elegante"/"Bold", con fotos reales en vez de stock de Unsplash).
const PRODUCT_FALLBACKS: Record<string, string[]> = {
  default: [
    "/design-assets/blingg-jewelry/bracelet-01-a-600x750.jpg",
    "/design-assets/blingg-jewelry/earrings-04-a-600x750.jpg",
    "/design-assets/blingg-jewelry/bracelet-01-b-600x750.jpg",
    "/design-assets/blingg-jewelry/earrings-05-a-600x750.jpg",
    "/design-assets/blingg-jewelry/earrings-06-a-600x750.jpg",
  ],
}

function getProductFallbackImage(subdomain: string, index: number): string {
  const images = PRODUCT_FALLBACKS[subdomain] || PRODUCT_FALLBACKS.default
  return images[index % images.length]
}

// Grilla de productos del temple "Blingg": tarjetas redondeadas y suaves,
// cartel de oferta en verde (acento real de la demo), precio en celeste.
export function ProductGridBlingg({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  accentColor = "#6EC1E4",
  accentColor2 = "#61CE70",
  disableNav = false,
}: ProductGridBlinggProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" role="list" aria-label="Catalogo de productos">
      {products.map((product, index) => {
        const productImage =
          product.image_url && product.image_url !== "/images/placeholders/placeholder.svg" && !product.image_url.includes("placeholder")
            ? product.image_url
            : getProductFallbackImage(subdomain, index)

        const onSale = product.compare_price && product.compare_price > product.price

        return (
          <div key={product.id} className="bg-white rounded-2xl border border-[#e5f2f8] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="aspect-square relative overflow-hidden bg-neutral-100">
              {disableNav ? (
                <Image
                  src={productImage || "/images/placeholders/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  quality={80}
                />
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <Image
                    src={productImage || "/images/placeholders/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    quality={80}
                  />
                </Link>
              )}
              {onSale && (
                <span
                  className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: accentColor2 }}
                >
                  Oferta
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className="text-sm font-semibold text-[#54595F] mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-[#54595F] mb-1 line-clamp-2">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-base font-bold" style={{ color: accentColor }}>{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-base font-bold" style={{ color: accentColor }}>{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-sm text-[#7A7A7A] line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-semibold rounded-full border" style={{ borderColor: accentColor, color: accentColor }}>
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-semibold rounded-full border transition-colors hover:text-white"
                      style={{ borderColor: accentColor, color: accentColor }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentColor }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                    >
                      Elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton product={product} className="rounded-full" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
