"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridDianiProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  disableNav?: boolean
}

const PRODUCT_FALLBACKS = [
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80",
]

function getProductFallbackImage(index: number): string {
  return PRODUCT_FALLBACKS[index % PRODUCT_FALLBACKS.length]
}

// Grilla "Minimalista" (diani): 4 columnas, sin bordes ni sombras, cero
// color de acento (todo negro/#222), botón "agregar" como texto subrayado,
// igual a la vidriera de producto real de dianiswim.com.
export function ProductGridDiani({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  disableNav = false,
}: ProductGridDianiProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10" role="list" aria-label="Catalogo de productos">
      {products.map((product, index) => {
        const productImage =
          product.image_url && product.image_url !== "/images/placeholders/placeholder.svg" && !product.image_url.includes("placeholder")
            ? product.image_url
            : getProductFallbackImage(index)

        const onSale = product.compare_price && product.compare_price > product.price

        return (
          <div key={product.id} className="flex flex-col text-center group">
            <div className="aspect-square relative overflow-hidden bg-neutral-50">
              {disableNav ? (
                <Image
                  src={productImage || "/images/placeholders/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                  quality={80}
                />
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <Image
                    src={productImage || "/images/placeholders/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={80}
                  />
                </Link>
              )}
              {onSale && (
                <span className="absolute top-3 left-3 text-[10px] lowercase tracking-wide text-white bg-[#111] px-2 py-1">
                  sale
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col items-center flex-1">
              {disableNav ? (
                <h3 className="text-[13px] text-[#222] mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-[13px] text-[#222] mb-1 line-clamp-2 hover:opacity-60 transition-opacity">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center justify-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-[13px] font-medium text-[#121212]">{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-[13px] font-medium text-[#121212]">{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-xs text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="text-xs lowercase underline underline-offset-4 text-[#222]">elegir opción</span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="text-xs lowercase underline underline-offset-4 text-[#222] hover:opacity-60 transition-opacity"
                    >
                      elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton
                    product={product}
                    className="bg-transparent text-[#222] hover:bg-transparent underline underline-offset-4 shadow-none text-xs lowercase h-auto py-0"
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
