"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { EditableInline } from "./editable-inline"

interface CategoryShowcaseBoldEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  accentColor2?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
]

const RING_COLORS = ["accent", "accent2"] as const

// Variante "Bold" de la vidriera de categorías: tarjetas cuadradas grandes,
// bordes redondeados gruesos que alternan entre los dos colores de acento,
// en vez de los círculos chicos de "Elegante".
export function CategoryShowcaseBoldEditable({
  categories,
  images,
  editMode,
  accentColor = "#ec4899",
  accentColor2 = "#22c55e",
  onChangeImage,
  subdomain,
  texts = {},
  onChangeText = () => {},
}: CategoryShowcaseBoldEditableProps) {
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
      <EditableInline
        as="h2"
        editMode={editMode}
        className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-6 text-center"
        value={texts["categorias_title"] ?? "Categorías"}
        onChange={(v) => onChangeText("categorias_title", v)}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.slice(0, 8).map((cat, index) => (
          <CategoryTile
            key={cat.id}
            slug={cat.slug}
            image={images[cat.slug] || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
            name={cat.name}
            editMode={editMode}
            ringColor={RING_COLORS[index % RING_COLORS.length] === "accent" ? accentColor : accentColor2}
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
  ringColor,
  onChangeImage,
  href,
}: {
  slug: string
  image: string
  name: string
  editMode: boolean
  ringColor: string
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
      className="relative w-full aspect-square rounded-3xl overflow-hidden border-4"
      style={{ borderColor: ringColor }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 45vw, 220px" />
      <div className="absolute inset-x-0 bottom-0 bg-black/50 py-2 px-3">
        <span className="text-white text-sm font-bold">{name}</span>
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
    <Link href={href} className="group">
      {tile}
    </Link>
  ) : (
    tile
  )
}
