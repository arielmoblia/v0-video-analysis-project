"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"
import { artesanoHeading } from "@/lib/fonts/artesano"

interface ProductGridArtesanoProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

const PRODUCT_FALLBACKS = [
  "/design-assets/furniture-shop/product-01-c.jpg",
  "/design-assets/furniture-shop/product-04-c.jpg",
  "/design-assets/furniture-shop/product-05-b.jpg",
  "/design-assets/furniture-shop/product-09-a.jpg",
  "/design-assets/furniture-shop/product-14-a.jpg",
  "/design-assets/furniture-shop/product-15-b.jpg",
]

function getProductFallbackImage(index: number): string {
  return PRODUCT_FALLBACKS[index % PRODUCT_FALLBACKS.length]
}

// Grilla "Artesano": tarjetas de esquinas rectas, borde fino color tierra,
// nombre en tipografía serif (Roboto Slab) y botón rectangular sólido, en vez
// de las tarjetas bien redondeadas de "Bold"/"Moderno".
export function ProductGridArtesano({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  accentColor = "#C19A83",
  accentColor2 = "#4A3427",
  disableNav = false,
}: ProductGridArtesanoProps) {
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
          <div key={product.id} className="bg-white border border-[#eee2d6] overflow-hidden flex flex-col hover:border-[#C19A83] transition-colors">
            <div className="aspect-square relative overflow-hidden bg-[#FAF6F1]">
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
                <span className="absolute top-3 left-3 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1" style={{ backgroundColor: accentColor2 }}>
                  Oferta
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className={`${artesanoHeading.className} text-sm text-[#3a2c22] mb-1 line-clamp-2`}>{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className={`${artesanoHeading.className} text-sm text-[#3a2c22] mb-1 line-clamp-2`}>{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-base font-bold" style={{ color: accentColor2 }}>{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-base font-bold" style={{ color: accentColor2 }}>{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-sm text-neutral-400 line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: accentColor }}>
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: accentColor }}
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
