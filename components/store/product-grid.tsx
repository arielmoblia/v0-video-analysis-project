"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/store-context"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { useEffect, useState } from "react"

interface ProductGridProps {
  products: Product[]
  subdomain: string
}

// Imagenes de fallback para productos por categoria
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
  perfumes: [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80",
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
  ],
  electronicos: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
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

export function ProductGrid({ products, subdomain }: ProductGridProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  const hasSizes = (product: Product) => {
    return product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14" role="list" aria-label="Catalogo de productos">
      {products.map((product, index) => {
        // Usar imagen del producto o fallback segun subdomain
        const productImage = product.image_url && 
          product.image_url !== "/placeholder.svg" && 
          !product.image_url.includes("placeholder")
            ? product.image_url 
            : getProductFallbackImage(subdomain, index)
        
        return (
        <div key={product.id} className="group">
          <Link href={`${basePath}/producto/${product.slug}`}>
            <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 mb-4">
              <Image
                src={productImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                quality={80}
              />
              {product.compare_price && product.compare_price > product.price && (
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-wider px-3 py-1.5 uppercase">
                  Oferta
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {hasSizes(product) ? (
                  <Link
                    href={`${basePath}/producto/${product.slug}`}
                    className="block w-full py-3 text-xs tracking-[0.2em] uppercase bg-black/80 text-white hover:bg-black text-center transition-all duration-300"
                  >
                    Seleccionar talla
                  </Link>
                ) : (
                  <AddToCartButton product={product} variant="overlay" />
                )}
              </div>
            </div>
          </Link>

          <div className="text-center">
            <Link href={`${basePath}/producto/${product.slug}`}>
              <h3 className="text-sm tracking-wide mb-2 hover:opacity-60 transition-opacity">{product.name}</h3>
            </Link>
            <div className="flex items-center justify-center gap-3">
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-neutral-400 line-through">${product.compare_price.toLocaleString()}</span>
              )}
              <span
                className={`text-sm ${product.compare_price && product.compare_price > product.price ? "text-red-600" : ""}`}
              >
                ${product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}
