"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"

interface CategoryShowcaseMinimalEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
}

const DEFAULT_IMAGES = [
  "/design-assets/sa-minimal/banner-1.jpg",
  "/design-assets/sa-minimal/banner-2.jpg",
  "/design-assets/sa-minimal/banner-3.jpg",
  "/design-assets/sa-minimal/banner-4.jpg",
]

// Grid asimétrico (proporción 4/8/8/4 en dos filas, con texto superpuesto
// sobre la foto) tal cual la sección "banner-area" real de la demo
// scrapeada. Es la seña de identidad estructural de "Minimal": ningún otro
// temple tiene un grid de categorías desparejo — todos usan tarjetas o
// círculos del mismo tamaño.
export function CategoryShowcaseMinimalEditable({
  categories,
  images,
  editMode,
  accentColor = "#ff7f00",
  onChangeImage,
  subdomain,
}: CategoryShowcaseMinimalEditableProps) {
  const [basePath, setBasePath] = useState(subdomain ? `/tienda/${subdomain}` : "")

  useEffect(() => {
    if (!subdomain) return
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [subdomain])

  if (categories.length === 0) return null

  const spans = ["md:col-span-4", "md:col-span-8", "md:col-span-8", "md:col-span-4"]
  const items = categories.slice(0, 4)

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((cat, index) => (
            <div key={cat.id} className={spans[index % spans.length]}>
              <CategoryTile
                slug={cat.slug}
                image={images[cat.slug] || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
                name={cat.name}
                editMode={editMode}
                accentColor={accentColor}
                onChangeImage={(url) => onChangeImage(cat.slug, url)}
                href={subdomain ? `${basePath}/categoria/${cat.slug}` : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryTile({
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

  const tile = (
    <div
      className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h3 className="text-white text-xl md:text-2xl font-light">{name}</h3>
        <span className="mt-1 text-xs uppercase tracking-widest text-white/80" style={{ color: accentColor }}>
          Ver colección
        </span>
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
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            </button>
          )}
        </>
      )}
    </div>
  )

  return href && !editMode ? (
    <Link href={href} className="block">
      {tile}
    </Link>
  ) : (
    tile
  )
}
