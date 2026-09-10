"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridModernProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  disableNav?: boolean
}

const PRODUCT_FALLBACKS: Record<string, string[]> = {
  zapatos: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  ],
  ropa: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
  ],
}

function getProductFallbackImage(subdomain: string, index: number): string {
  const images = PRODUCT_FALLBACKS[subdomain] || PRODUCT_FALLBACKS.default
  return images[index % images.length]
}

export function ProductGridModern({ products, subdomain, exchangeRate = 0, country, accentColor = "#111827", disableNav = false }: ProductGridModernProps) {
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
          <div key={product.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden flex flex-col">
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
                  style={{ backgroundColor: accentColor }}
                >
                  Oferta
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-base font-bold text-neutral-900">{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-base font-bold text-neutral-900">{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 rounded-full text-xs font-semibold border border-neutral-900">
                      Elegir talle
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 rounded-full text-xs font-semibold border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Elegir talle
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
