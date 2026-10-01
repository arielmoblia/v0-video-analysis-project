"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface SliderImage {
  url: string
  alt?: string
}

interface ImageSliderBannerProps {
  images: SliderImage[]
  autoPlayMs?: number
}

// Banner deslizante genérico (foto cambia sola + flechas + puntitos), pensado
// para tiendas clonadas desde un sitio de referencia que usa slider en vez de
// un banner fijo (caso real: pink/pinkonlineoficial). Las imágenes siempre
// vienen de afuera (fotos reales de la propia tienda, nunca inventadas) via
// store.plan_features.slider_images — reutilizable por cualquier tema/tienda.
export function ImageSliderBanner({ images, autoPlayMs = 5000 }: ImageSliderBannerProps) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length < 2 || autoPlayMs <= 0) return
    const timer = setInterval(next, autoPlayMs)
    return () => clearInterval(timer)
  }, [images.length, autoPlayMs, next])

  if (images.length === 0) return null

  return (
    <section className="relative h-[60vh] min-h-[380px] max-h-[600px] overflow-hidden bg-neutral-100">
      {images.map((img, i) => (
        <div
          key={img.url + i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
        >
          <Image
            src={img.url}
            alt={img.alt || ""}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-800" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-neutral-800" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === index ? "#ffffff" : "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
