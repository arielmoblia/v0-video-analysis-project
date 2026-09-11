"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridMinimalProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  accentColor?: string
  disableNav?: boolean
}

const PRODUCT_FALLBACKS = [
  "/design-assets/sa-minimal/banner-1.jpg",
  "/design-assets/sa-minimal/banner-2.jpg",
  "/design-assets/sa-minimal/banner-3.jpg",
  "/design-assets/sa-minimal/banner-4.jpg",
]

function getProductFallbackImage(index: number): string {
  return PRODUCT_FALLBACKS[index % PRODUCT_FALLBACKS.length]
}

// Grilla "Minimal": sin bordes, sin fondo de color, texto centrado, botón de
// texto simple ("Agregar al carrito") en vez de un botón sólido — igual a la
// tarjeta "single-product" real de la demo. Distinto de las tarjetas con
// borde grueso de Artesano y las redondeadas de Bold/Moderno.
export function ProductGridMinimal({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  accentColor = "#ff7f00",
  disableNav = false,
}: ProductGridMinimalProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10" role="list" aria-label="Catalogo de productos">
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
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white px-2 py-1" style={{ backgroundColor: accentColor }}>
                  Sale
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col items-center flex-1">
              {disableNav ? (
                <h3 className="text-sm text-neutral-800 mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm text-neutral-800 mb-1 line-clamp-2 hover:opacity-70 transition-opacity">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center justify-center gap-2 mb-3">
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
                    <span className="text-xs uppercase tracking-widest" style={{ color: accentColor }}>
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                      style={{ color: accentColor }}
                    >
                      Elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton
                    product={product}
                    className="bg-transparent text-neutral-900 hover:bg-transparent underline underline-offset-4 shadow-none text-xs uppercase tracking-widest h-auto py-0"
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
