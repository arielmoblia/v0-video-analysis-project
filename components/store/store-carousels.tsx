"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/lib/store-context"

export interface CarouselBlock {
  id: string
  type: "products" | "text" | "cta"
  title?: string
  phrases?: string[]
  ctaText?: string
  ctaKind?: "whatsapp" | "instagram"
}

interface StoreCarouselsProps {
  carousels: CarouselBlock[] | undefined | null
  products: Product[]
  featuredProducts: Product[]
  subdomain: string
  exchangeRate: number
  country?: string | null
  whatsapp?: string | null
  instagram?: string | null
}

// Bloque de carruseles (feature vendible "carousels" + fallback del clonado de
// portada cuando el sitio de referencia no tiene banner clásico sino carruseles
// en su home, ej. pinkonlineoficial). El carrusel de productos siempre muestra
// LOS PRODUCTOS REALES de esta tienda (nunca los del sitio ajeno); el de texto
// muestra las frases reales que se encontraron al clonar, nunca inventadas; el
// bloque "cta" muestra el texto real encontrado pero SIEMPRE con el whatsapp/
// instagram de ESTA tienda (nunca el del sitio clonado) — si esta tienda no
// cargó ninguno, se muestra el texto sin link en vez de inventar un contacto.
export function StoreCarousels({ carousels, products, featuredProducts, subdomain, exchangeRate, country, whatsapp, instagram }: StoreCarouselsProps) {
  if (!carousels || carousels.length === 0) return null

  return (
    <>
      {carousels.map((block) => {
        if (block.type === "text") {
          const phrases = block.phrases?.filter(Boolean)
          if (!phrases || phrases.length === 0) return null
          return <TextCarousel key={block.id} phrases={phrases} />
        }
        if (block.type === "cta") {
          if (!block.ctaText) return null
          const linkUrl =
            block.ctaKind === "whatsapp" && whatsapp
              ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
              : block.ctaKind === "instagram" && instagram
                ? instagram
                : null
          return <CtaBanner key={block.id} text={block.ctaText} linkUrl={linkUrl} />
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

function CtaBanner({ text, linkUrl }: { text: string; linkUrl: string | null }) {
  const content = <p className="text-sm md:text-base text-center text-neutral-700 px-6">{text}</p>
  return (
    <section className="py-8 bg-neutral-50">
      <div className="container mx-auto flex justify-center">
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </section>
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
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  useEffect(() => {
    if (!api) return
    setSnapCount(api.scrollSnapList().length)
    setSelectedIndex(api.selectedScrollSnap())
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section className="py-14 px-6">
      <div className="container mx-auto">
        {title && <h2 className="text-2xl md:text-3xl font-normal tracking-wide text-left mb-8">{title}</h2>}
        <Carousel opts={{ align: "start", loop: products.length > 3, slidesToScroll: "auto" }} setApi={setApi} className="w-full px-8 md:px-10">
          <CarouselContent>
            {products.map((product) => {
              const hasDiscount = !!product.compare_price && product.compare_price > product.price && exchangeRate === 0
              return (
                <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
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
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {hasDiscount && (
                        <span className="text-sm text-neutral-400 line-through">
                          {formatPrice(product.compare_price as number, country)}
                        </span>
                      )}
                      <span className="text-sm font-medium">
                        {exchangeRate > 0
                          ? formatPrice(product.price * exchangeRate, country)
                          : formatPrice(product.price, country)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-pink-600 font-medium">
                          {Math.round((1 - product.price / (product.compare_price as number)) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex md:left-0 border-none shadow-none bg-transparent hover:bg-transparent text-neutral-900 [&_svg]:size-6" />
          <CarouselNext className="hidden md:flex md:right-0 border-none shadow-none bg-transparent hover:bg-transparent text-neutral-900 [&_svg]:size-6" />
        </Carousel>
        {snapCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir a la página ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`rounded-full transition-all ${
                  i === selectedIndex ? "w-2 h-2 bg-neutral-900" : "w-2 h-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
