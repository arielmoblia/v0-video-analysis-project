"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { formatPrice } from "@/lib/currency"
import { useEffect, useState } from "react"

interface ProductGridVintageProps {
  products: Product[]
  subdomain: string
  exchangeRate?: number
  country?: string | null
  disableNav?: boolean
}

// Único asset real scrapeado (hero-cover.png) se reutiliza como fallback,
// igual que category-showcase-vintage-editable.
const FALLBACK_IMAGE = "/design-assets/flower-vintage/hero-cover.png"

function getProductFallbackImage(): string {
  return FALLBACK_IMAGE
}

// Grilla "Vintage": tarjetas con esquinas muy redondeadas y fondo rosa
// pálido (#fff6f5), precio y botón en terracota (#cc3833) — tal cual la
// paleta cálida real de la demo floral.weblium.site. Distinto de las
// tarjetas rectas de Luxury/Minimal.
export function ProductGridVintage({
  products,
  subdomain,
  exchangeRate = 0,
  country,
  disableNav = false,
}: ProductGridVintageProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list" aria-label="Catalogo de productos">
      {products.map((product) => {
        const productImage =
          product.image_url && product.image_url !== "/images/placeholders/placeholder.svg" && !product.image_url.includes("placeholder")
            ? product.image_url
            : getProductFallbackImage()

        const onSale = product.compare_price && product.compare_price > product.price

        return (
          <div key={product.id} className="flex flex-col group rounded-3xl overflow-hidden bg-[#fff6f5] shadow-sm">
            <div className="aspect-square relative overflow-hidden bg-[#ffddd9]">
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
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white bg-[#cc3833] px-2.5 py-1 rounded-full">
                  Oferta
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              {disableNav ? (
                <h3 className="text-sm text-[#4a4632] mb-1 line-clamp-2">{product.name}</h3>
              ) : (
                <Link href={`${basePath}/producto/${product.slug}`}>
                  <h3 className="text-sm text-[#4a4632] mb-1 line-clamp-2 hover:opacity-70 transition-opacity">{product.name}</h3>
                </Link>
              )}
              <div className="flex items-center gap-2 mb-3">
                {exchangeRate > 0 ? (
                  <span className="text-sm font-semibold text-[#cc3833]">{formatPrice(product.price * exchangeRate, country)}</span>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-[#cc3833]">{formatPrice(product.price, country)}</span>
                    {onSale && (
                      <span className="text-xs text-[#7c7669] line-through">{formatPrice(product.compare_price as number, country)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="mt-auto">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  disableNav ? (
                    <span className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#cc3833] rounded-full">
                      Elegir opción
                    </span>
                  ) : (
                    <Link
                      href={`${basePath}/producto/${product.slug}`}
                      className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#cc3833] hover:bg-[#b32e29] transition-colors rounded-full"
                    >
                      Elegir opción
                    </Link>
                  )
                ) : (
                  <AddToCartButton
                    product={product}
                    className="rounded-full bg-[#cc3833] hover:bg-[#b32e29] text-xs uppercase tracking-widest"
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
