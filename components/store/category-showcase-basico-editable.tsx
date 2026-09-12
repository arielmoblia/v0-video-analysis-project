"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { EditableInline } from "./editable-inline"

interface CategoryShowcaseBasicoEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// El temple "Básico" no viene de ninguna demo scrapeada (es el diseño
// clásico/genérico de tol.ar), así que el fallback de categoría usa el mismo
// placeholder genérico que ya usa el hero (store-hero-basico-editable.tsx),
// nunca una foto de stock de otro temple.
const DEFAULT_IMAGE = "/images/placeholders/placeholder.svg"

// Misma pinta clásica del resto del temple: tarjetas sin bordes redondeados,
// overlay negro/30, texto en mayúsculas. Con edición en vivo (imagen +
// título/subtítulo) igual mecanismo que los demás temples.
export function CategoryShowcaseBasicoEditable({
  categories,
  images,
  editMode,
  onChangeImage,
  subdomain,
  texts = {},
  onChangeText = () => {},
}: CategoryShowcaseBasicoEditableProps) {
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
    <section className="py-20 px-6 bg-neutral-50">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <EditableInline
            as="p"
            editMode={editMode}
            className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3"
            value={texts["categorias_eyebrow"] ?? "Explorá"}
            onChange={(v) => onChangeText("categorias_eyebrow", v)}
          />
          <EditableInline
            as="h2"
            editMode={editMode}
            className="text-3xl font-light tracking-wide"
            value={texts["categorias_title"] ?? "Categorías"}
            onChange={(v) => onChangeText("categorias_title", v)}
          />
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
      className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-white text-xl font-light tracking-wide uppercase">{name}</h3>
        <span className="mt-1 inline-block text-xs uppercase tracking-[0.2em] text-white/90 border-b border-white/70">
          Ver categoría
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
