"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { EditableInline } from "./editable-inline"

interface CategoryShowcaseEleganteEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80",
  "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=80",
  "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=300&q=80",
]

// Variante circular de la vidriera de categorías, como en las tiendas de
// relojería/accesorios: cada categoría es un círculo con el nombre debajo.
export function CategoryShowcaseEleganteEditable({
  categories,
  images,
  editMode,
  accentColor = "#f7791e",
  onChangeImage,
  subdomain,
  texts = {},
  onChangeText = () => {},
}: CategoryShowcaseEleganteEditableProps) {
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
    <section className="container mx-auto px-6 py-12">
      <EditableInline
        as="h2"
        editMode={editMode}
        className="text-2xl font-bold text-neutral-900 mb-6 text-center"
        value={texts["categorias_title"] ?? "Categorías"}
        onChange={(v) => onChangeText("categorias_title", v)}
      />
      <div className="flex gap-6 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
        {categories.slice(0, 10).map((cat, index) => (
          <CategoryCircle
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

function CategoryCircle({
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

  const circle = (
    <div
      className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden"
      style={editMode ? { outline: hover ? `2px dashed ${accentColor}` : "2px dashed transparent", outlineOffset: "3px" } : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover" sizes="120px" />

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

  return (
    <div className="flex flex-col items-center gap-2 shrink-0 w-24 md:w-28">
      {href && !editMode ? (
        <Link href={href} className="group">
          {circle}
        </Link>
      ) : (
        circle
      )}
      <span className="text-xs font-medium text-neutral-700 text-center">{name}</span>
    </div>
  )
}
