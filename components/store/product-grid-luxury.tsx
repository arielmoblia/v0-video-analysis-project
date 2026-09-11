"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridLuxuryProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  disableNav?: boolean
}

const PRODUCT_FALLBACKS = [
  "/design-assets/belle-luxury/cat-1.jpg",
  "/design-assets/belle-luxury/cat-2.jpg",
  "/design-assets/belle-luxury/cat-3.jpg",
]

function getProductFallbackImage(index: number): string {
  return PRODUCT_FALLBACKS[index % PRODUCT_FALLBACKS.length]
}

// Grilla "Luxury": tarjetas sin sombra ni borde, botón sólido negro a todo
// el ancho (no píldora, no borde de color), etiqueta "SALE" en mayúsculas
// pequeña — igual a la demo real de moda.
export function ProductGridLuxury({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  disableNav = false,
}: ProductGridLuxuryProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list" aria-label="Catalogo de productos">
      {products.map((product, index) => {
        const productImage =
          product.image_url && product.image_url !== "/images/placeholders/placeholder.svg" && !product.image_url.includes("placeholder")
            ? product.image_url
            : getProductFallbackImage(index)

        const onSale = product.compare_price && product.compare_price > product.price

        return (
          <div key={product.id} className="flex flex-col group">
            <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100">
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
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    quality={80}
                  />
                </Link>
              )}
              {onSale && (
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white bg-[#111111] px-2 py-1">
                  Sale
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className="text-sm text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm text-neutral-900 mb-1 line-clamp-2 hover:opacity-70 transition-opacity">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-sm font-semibold text-neutral-900">{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-neutral-900">{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-xs text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#111111]">
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#111111] hover:bg-black transition-colors"
                    >
                      Elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton
                    product={product}
                    className="rounded-none bg-[#111111] hover:bg-black text-xs uppercase tracking-widest"
                  />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
