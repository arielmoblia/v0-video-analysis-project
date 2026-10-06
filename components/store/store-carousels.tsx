"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/lib/store-context"

export interface CarouselTextCard {
  id: string
  title: string
  description?: string
  link?: string
  linkLabel?: string
}

export interface CarouselBlock {
  id: string
  type: "products" | "text" | "cta"
  title?: string
  // type "products": productos elegidos a mano, en este orden. Sin esto (o
  // vacío) cae al comportamiento viejo: destacados si hay, si no todos.
  productIds?: string[]
  // Cuántos productos se ven a la vez en escritorio (el resto se ve
  // deslizando con las flechas). Sin esto, 5 — el valor que ya tenía
  // hardcodeado el carrusel antes de que esto fuera configurable.
  visibleCount?: number
  // type "text": tarjetas con link propio. Sin esto (o vacío) cae al
  // marquee viejo de "phrases" para no romper tiendas ya configuradas.
  cards?: CarouselTextCard[]
  // legacy
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
          const cards = block.cards?.filter((c) => c.title)
          if (cards && cards.length > 0) {
            return <CardsCarousel key={block.id} title={block.title} cards={cards} />
          }
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
        let items = products
        if (block.productIds && block.productIds.length > 0) {
          const byId = new Map(products.map((p) => [p.id, p]))
          items = block.productIds.map((id) => byId.get(id)).filter((p): p is Product => !!p)
        } else {
          items = featuredProducts.length > 0 ? featuredProducts : products
        }
        if (items.length === 0) return null
        return (
          <ProductsCarousel
            key={block.id}
            title={block.title}
            products={items}
            subdomain={subdomain}
            exchangeRate={exchangeRate}
            country={country}
            visibleCount={block.visibleCount}
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

function CardsCarousel({ title, cards }: { title?: string; cards: CarouselTextCard[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

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
    <section className="py-14 px-6 bg-neutral-50">
      <div className="container mx-auto">
        {title && <h2 className="text-2xl md:text-3xl font-normal tracking-wide text-left mb-8">{title}</h2>}
        <Carousel opts={{ align: "start", loop: cards.length > 1 }} setApi={setApi} className="w-full px-4 md:px-10">
          <CarouselContent>
            {cards.map((card) => {
              const inner = (
                <div className="flex flex-col items-center text-center gap-3 px-4 py-2">
                  <h3 className="text-3xl md:text-4xl font-normal text-neutral-900">{card.title}</h3>
                  {card.description && (
                    <p className="text-base leading-snug text-neutral-900">{card.description}</p>
                  )}
                  {card.link && (
                    <span className="text-sm underline underline-offset-4 text-neutral-900 mt-1">
                      {card.linkLabel || "Ver más"}
                    </span>
                  )}
                </div>
              )
              return (
                <CarouselItem key={card.id} className="basis-full">
                  {card.link ? (
                    <a href={card.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
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

// Clases literales (no armadas por template string) para que Tailwind las
// detecte al escanear el código — un "lg:basis-1/" + n dinámico no se
// generaría nunca en el build.
const DESKTOP_BASIS_CLASS: Record<number, string> = {
  2: "lg:basis-1/2",
  3: "lg:basis-1/3",
  4: "lg:basis-1/4",
  5: "lg:basis-1/5",
  6: "lg:basis-1/6",
}

function ProductsCarousel({
  title,
  products,
  subdomain,
  exchangeRate,
  country,
  visibleCount,
}: {
  title?: string
  products: Product[]
  subdomain: string
  exchangeRate: number
  country?: string | null
  visibleCount?: number
}) {
  const desktopBasis = DESKTOP_BASIS_CLASS[visibleCount || 5] || DESKTOP_BASIS_CLASS[5]
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
                <CarouselItem key={product.id} className={`basis-1/2 md:basis-1/3 ${desktopBasis}`}>
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
                    <h3 className="text-sm tracking-wide text-center mb-2 group-hover:opacity-60 transition-opacity">
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
