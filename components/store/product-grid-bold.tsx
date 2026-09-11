"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridBoldProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

const PRODUCT_FALLBACKS: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  ],
}

function getProductFallbackImage(subdomain: string, index: number): string {
  const images = PRODUCT_FALLBACKS[subdomain] || PRODUCT_FALLBACKS.default
  return images[index % images.length]
}

// Grilla "Bold": tarjetas bien redondeadas, cartel de oferta en pastilla
// rosa y botón verde, para un look joven y colorido.
export function ProductGridBold({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  accentColor = "#ec4899",
  accentColor2 = "#22c55e",
  disableNav = false,
}: ProductGridBoldProps) {
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
          <div key={product.id} className="bg-white rounded-3xl border-2 border-neutral-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
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
                <span className="absolute top-3 left-3 text-white text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: accentColor }}>
                  Oferta
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className="text-sm font-bold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-base font-extrabold" style={{ color: accentColor }}>{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-base font-extrabold" style={{ color: accentColor }}>{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-bold rounded-full text-white" style={{ backgroundColor: accentColor2 }}>
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-bold rounded-full text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accentColor2 }}
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
