"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { Category } from "@/lib/store-context"

interface CategoryShowcaseModernProps {
  categories: Category[]
  subdomain: string
  images?: Record<string, string>
  disableNav?: boolean
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=500&q=80",
]

export function CategoryShowcaseModern({ categories, subdomain, images, disableNav = false }: CategoryShowcaseModernProps) {
  const [basePath, setBasePath] = useState(`/tienda/${subdomain}`)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  if (categories.length === 0) return null

  return (
    <section className="container mx-auto px-6 py-14">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Categorías</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {categories.slice(0, 8).map((cat, index) => {
          const content = (
            <>
              <Image
                src={images?.[cat.slug] || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
                alt={cat.name}
                fill
                className={disableNav ? "object-cover" : "object-cover group-hover:scale-105 transition-transform duration-500"}
                sizes="(max-width: 768px) 160px, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white font-semibold">{cat.name}</span>
            </>
          )

          if (disableNav) {
            return (
              <div key={cat.id} className="relative shrink-0 w-40 md:w-auto aspect-square rounded-2xl overflow-hidden">
                {content}
              </div>
            )
          }

          return (
            <Link
              key={cat.id}
              href={`${basePath}/categoria/${cat.slug}`}
              className="group relative shrink-0 w-40 md:w-auto aspect-square rounded-2xl overflow-hidden"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
