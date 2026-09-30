"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/lib/store-context"

export interface CarouselBlock {
  id: string
  type: "products" | "text"
  title?: string
  phrases?: string[]
}

interface StoreCarouselsProps {
  carousels: CarouselBlock[] | undefined | null
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  country?: string | null
}

// Bloque de carruseles (feature vendible "carousels" + fallback del clonado de
// portada cuando el sitio de referencia no tiene banner clásico sino carruseles
// en su home, ej. pinkonlineoficial). El carrusel de productos siempre muestra
// LOS PRODUCTOS REALES de esta tienda (nunca los del sitio ajeno); el de texto
// muestra las frases reales que se encontraron al clonar, nunca inventadas.
export function StoreCarousels({ carousels, products, featuredProducts, subdomain, exchangeRate, country }: StoreCarouselsProps) {
  if (!carousels || carousels.length === 0) return null

  return (
    <>
      {carousels.map((block) => {
        if (block.type === "text") {
          const phrases = block.phrases?.filter(Boolean)
          if (!phrases || phrases.length === 0) return null
          return <TextCarousel key={block.id} phrases={phrases} />
        }
        const items = featuredProducts.length > 0 ? featuredProducts : products
        if (items.length === 0) return null
        return (
          <ProductsCarousel
            key={block.id}
            title={block.title}
            products={items}
            subdomain={subdomain}
            exchangeRate={exchangeRate}
            country={country}
          />
        )
      })}
    </>
  )
}

function TextCarousel({ phrases }: { phrases: string[] }) {
  const loopPhrases = phrases.length > 1 ? phrases : [phrases[0], phrases[0]]
  const track = [...loopPhrases, ...loopPhrases]
  return (
    <div className="bg-neutral-900 overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-[store-carousel-marquee_28s_linear_infinite]">
        {track.map((phrase, i) => (
          <span key={i} className="mx-8 text-sm font-medium uppercase tracking-widest text-white">
            {phrase}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes store-carousel-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

function ProductsCarousel({
  title,
  products,
  subdomain,
  exchangeRate,
  country,
}: {
  title?: string
  products: Product[]
  subdomain: string
  exchangeRate: number
  country?: string | null
}) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <section className="py-14 px-6">
      <div className="container mx-auto">
        {title && <h2 className="text-2xl font-light tracking-wide text-center mb-8">{title}</h2>}
        <Carousel opts={{ align: "start", loop: products.length > 3 }} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link href={`${basePath}/producto/${product.slug}`} className="group block">
                  <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 mb-3">
                    <Image
                      src={product.image_url || "/images/placeholders/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="text-sm tracking-wide text-center mb-1 group-hover:opacity-60 transition-opacity">
                    {product.name}
                  </h3>
                  <p className="text-sm text-center">
                    {exchangeRate > 0
                      ? formatPrice(product.price * exchangeRate, country)
                      : formatPrice(product.price, country)}
                  </p>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
