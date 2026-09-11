"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridEleganteProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  disableNav?: boolean
}

const PRODUCT_FALLBACKS: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",
  ],
}

function getProductFallbackImage(subdomain: string, index: number): string {
  const images = PRODUCT_FALLBACKS[subdomain] || PRODUCT_FALLBACKS.default
  return images[index % images.length]
}

// Grilla de productos del temple "Elegante": tarjetas con esquinas rectas,
// borde fino y cartel de oferta naranja, como las tiendas de relojería.
export function ProductGridElegante({ products, subdomain, exchangeRate = 0, country, accentColor = "#f7791e", disableNav = false }: ProductGridEleganteProps) {
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
          <div key={product.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
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
                  className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1"
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
                  <span className="text-base font-bold" style={{ color: "#151a4d" }}>{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-base font-bold" style={{ color: "#151a4d" }}>{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-semibold border border-neutral-900">
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-semibold border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton product={product} className="rounded-none" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
