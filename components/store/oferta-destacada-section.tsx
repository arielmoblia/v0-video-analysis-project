"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/currency"
import { AddToCartButton } from "@/components/store/add-to-cart-button"

interface OfertaDestacadaSectionProps {
  product: Product | null
  subdomain: string
  country?: string | null
}

// Cosita gratis: muestra el producto marcado con la estrella ("destacar en
// el inicio") en Productos, completo (galería, precio, botón de compra) en
// un bloque fijo de la portada. Sin producto marcado no se renderiza nada.
export function OfertaDestacadaSection({ product, subdomain, country }: OfertaDestacadaSectionProps) {
  const [activeImage, setActiveImage] = useState(0)

  if (!product) return null

  const images = ((product.images && product.images.length > 0 ? product.images : [product.image_url]).filter(
    Boolean
  ) as string[])
  if (images.length === 0) images.push("/placeholder.svg")
  const hasDiscount = !!(product.compare_price && product.compare_price > product.price)
  const productUrl = `/tienda/${subdomain}/producto/${product.slug}`

  return (
    <section className="py-16 px-6 bg-neutral-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Oferta Destacada</p>
        </div>
        <div className="max-w-4xl mx-auto flex flex-wrap gap-10 items-start">
          <div className="flex gap-3 flex-1 min-w-[280px]">
            {images.length > 1 && (
              <div className="flex flex-col gap-2 shrink-0">
                {images.slice(0, 5).map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 ${
                      i === activeImage ? "border-neutral-900" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <Link
              href={productUrl}
              className="relative flex-1 aspect-square bg-white rounded-lg overflow-hidden border border-neutral-200 block"
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {Math.round((1 - product.price / (product.compare_price as number)) * 100)}% OFF
                </span>
              )}
            </Link>
          </div>

          <div className="flex-1 min-w-[280px]">
            <Link href={productUrl} className="text-2xl font-light tracking-wide hover:underline">
              {product.name}
            </Link>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-semibold">{formatPrice(product.price, country)}</span>
              {hasDiscount && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.compare_price as number, country)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="text-sm text-neutral-600 mt-4 leading-relaxed line-clamp-4">
                {product.description.replace(/<[^>]+>/g, " ")}
              </p>
            )}
            <div className="mt-6 max-w-xs">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
