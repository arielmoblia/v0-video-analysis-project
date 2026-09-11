"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { vintageHeading } from "@/lib/fonts/vintage"

interface CategoryShowcaseVintageEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
}

// Único asset real scrapeado es la foto del ramo de flores del hero: se
// reutiliza como fallback (misma lógica que la grilla de productos), nunca
// se inventan fotos de stock.
const DEFAULT_IMAGE = "/design-assets/flower-vintage/hero-cover.png"

// Grilla de categorías con esquinas MUY redondeadas y fondo rosa pálido
// (#fff6f5), tal cual la paleta cálida real de la demo (floral.weblium.site,
// sección "Our flowers"). Distinto del mosaico en blanco y negro de Luxury y
// del grid asimétrico de Minimal.
export function CategoryShowcaseVintageEditable({
  categories,
  images,
  editMode,
  onChangeImage,
  subdomain,
}: CategoryShowcaseVintageEditableProps) {
  const [basePath, setBasePath] = useState(subdomain ? `/tienda/${subdomain}` : "")

  useEffect(() => {
    if (!subdomain) return
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [subdomain])

  if (categories.length === 0) return null

  const items = categories.slice(0, 3)

  return (
    <section className="bg-[#fff6f5] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632]`}>Nuestras flores</h2>
          <p className="mt-2 text-sm text-[#7c7669]">Cada arreglo hace el día de alguien más lindo</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((cat) => (
            <CategoryTile
              key={cat.id}
              slug={cat.slug}
              image={images[cat.slug] || DEFAULT_IMAGE}
              name={cat.name}
              editMode={editMode}
              onChangeImage={(url) => onChangeImage(cat.slug, url)}
              href={subdomain ? `${basePath}/categoria/${cat.slug}` : undefined}
            />
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
  onChangeImage,
  href,
}: {
  slug: string
  image: string
  name: string
  editMode: boolean
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
      className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl bg-white group shadow-sm"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#4a4632]/50 via-transparent to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className={`${vintageHeading.className} text-white text-xl`}>{name}</h3>
        <span className="mt-1 inline-block text-xs uppercase tracking-widest text-white/90 border-b border-white/70">
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
