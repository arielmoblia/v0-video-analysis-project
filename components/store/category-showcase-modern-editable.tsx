"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { EditableText } from "@/components/editable-text"

interface CategoryShowcaseModernEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
  content?: Record<string, string>
  isAdmin?: boolean
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=500&q=80",
]

// Variante editable de CategoryShowcaseModern: mismo diseño, pero con lápiz
// sobre cada foto de categoría cuando editMode está activo. Igual que el banner,
// no guarda nada acá adentro, solo avisa el cambio al padre.
export function CategoryShowcaseModernEditable({
  categories,
  images,
  editMode,
  accentColor = "#111827",
  onChangeImage,
  subdomain,
  content = {},
  isAdmin = false,
}: CategoryShowcaseModernEditableProps) {
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
      <EditableText page="template-moderno" field="categorias_title" defaultValue={content.categorias_title || "Categorías"} isAdmin={isAdmin} tag="h2" className="text-2xl font-bold text-neutral-900 mb-6" accentColor={accentColor} endpoint="/api/store-page-content" extraBody={{ subdomain }} />
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {categories.slice(0, 8).map((cat, index) => (
          <CategoryTile
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

  const content = (
    <>
      <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 160px, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      <span className="absolute bottom-3 left-3 text-white font-semibold">{name}</span>

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
              className="absolute top-2 right-2 flex items-center justify-center gap-1 rounded-full text-white text-[10px] font-medium px-2 py-1.5 z-10"
              style={{ backgroundColor: accentColor }}
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <><ImagePlus size={12} /> Cambiar</>}
            </button>
          )}
        </>
      )}
    </>
  )

  const className = "relative shrink-0 w-40 md:w-auto aspect-square rounded-2xl overflow-hidden block"
  const style = editMode ? { outline: hover ? `2px dashed ${accentColor}` : "2px dashed transparent", outlineOffset: "3px" } : undefined
  const handlers = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) }

  if (href && !editMode) {
    return (
      <Link key={slug} href={href} className={`group ${className}`} style={style} {...handlers}>
        {content}
      </Link>
    )
  }

  return (
    <div key={slug} className={className} style={style} {...handlers}>
      {content}
    </div>
  )
}
