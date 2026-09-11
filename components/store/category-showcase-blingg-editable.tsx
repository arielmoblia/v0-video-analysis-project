"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import { blinggHeading } from "@/lib/fonts/blingg"
import type { Category } from "@/lib/store-context"

interface CategoryShowcaseBlinggEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
}

// Fotos reales de joyas sacadas de la demo scrapeada (no fotos inventadas),
// usadas como fallback hasta que la tienda cargue su propia foto de categoría.
const DEFAULT_IMAGES = [
  "/design-assets/blingg-jewelry/bracelet-01-a-400x500.jpg",
  "/design-assets/blingg-jewelry/earrings-04-a-400x500.jpg",
  "/design-assets/blingg-jewelry/bracelet-01-b-400x500.jpg",
  "/design-assets/blingg-jewelry/earrings-05-a-400x500.jpg",
]

// Vidriera de categorías del temple "Blingg": tarjetas rectangulares con
// esquinas redondeadas (a diferencia de los círculos de "Elegante"), como en
// las secciones "shop by category" típicas de tiendas de joyería.
export function CategoryShowcaseBlinggEditable({
  categories,
  images,
  editMode,
  accentColor = "#6EC1E4",
  onChangeImage,
  subdomain,
}: CategoryShowcaseBlinggEditableProps) {
  const [basePath, setBasePath] = useState(subdomain ? `/tienda/${subdomain}` : "")

  useEffect(() => {
    if (!subdomain) return
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [subdomain])

  if (categories.length === 0) return null

  return (
    <section className="container mx-auto px-6 py-14">
      <h2 className={`${blinggHeading.className} text-2xl font-bold text-[#54595F] mb-6 text-center`}>Categorías</h2>
      <div className="flex gap-5 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
        {categories.slice(0, 10).map((cat, index) => (
          <CategoryCard
            key={cat.id}
            slug={cat.slug}
            image={images[cat.slug] || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
            name={cat.name}
            editMode={editMode}
            accentColor={accentColor}
            onChangeImage={(url) => onChangeImage(cat.slug, url)}
            href={subdomain ? `${basePath}/categoria/${cat.slug}` : undefined}
          />
        ))}
      </div>
    </section>
  )
}

function CategoryCard({
  slug,
  image,
  name,
  editMode,
  accentColor,
  onChangeImage,
  href,
}: {
  slug: string
  image: string
  name: string
  editMode: boolean
  accentColor: string
  onChangeImage: (url: string) => void
  href?: string
}) {
  const [hover, setHover] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const subirImagen = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "category")
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok || !data.url) {
        alert(data.error || "No se pudo subir la imagen")
        return
      }
      onChangeImage(data.url)
    } finally {
      setUploading(false)
    }
  }

  const card = (
    <div
      className="relative shrink-0 w-32 h-40 md:w-40 md:h-48 rounded-2xl overflow-hidden bg-neutral-100"
      style={editMode ? { outline: hover ? `2px dashed ${accentColor}` : "2px dashed transparent", outlineOffset: "3px" } : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover" sizes="180px" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-2">
        <span className="text-xs font-semibold text-white text-center block">{name}</span>
      </div>

      {editMode && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) subirImagen(f)
            }}
          />
          {(hover || uploading) && (
            <button
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click() }}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-10"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            </button>
          )}
        </>
      )}
    </div>
  )

  return href && !editMode ? (
    <Link href={href} className="group shrink-0">
      {card}
    </Link>
  ) : (
    card
  )
}
