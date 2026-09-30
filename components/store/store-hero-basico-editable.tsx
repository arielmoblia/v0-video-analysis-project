"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface StoreHeroBasicoEditableProps {
  store: Store
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNERS: Record<string, string> = {
  zapatos: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80",
  ropa: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
  electronicos: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
  base: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&q=80",
  pruebas: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  template: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
  default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
}

// Misma pinta que StoreHero (clásico): overlay negro/30, texto centrado en
// mayúsculas. Con edición en vivo (pencil + subir foto) igual a los demás temples.
export function StoreHeroBasicoEditable({
  store,
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroBasicoEditableProps) {
  const [uploading, setUploading] = useState(false)
  const [hoverImage, setHoverImage] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const subdomain = (store as any).subdomain || ""
  const fallbackBanner = FALLBACK_BANNERS[subdomain] || FALLBACK_BANNERS.default
  const bannerImage =
    store.banner_image && store.banner_image !== "/images/placeholders/placeholder.svg"
      ? store.banner_image
      : fallbackBanner
  // null/undefined = nunca se configuró (tienda nueva, mostramos placeholder editable).
  // "" explícito = vino de un clon real sin ese texto en el sitio de origen — no inventamos nada.
  const bannerTitle = store.banner_title == null ? "Bienvenido a" : store.banner_title
  const bannerSubtitle = store.banner_subtitle == null ? "Descubrí nuestra colección exclusiva" : store.banner_subtitle

  const subirImagen = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "banner")
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

  return (
    <section
      className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setHoverImage(true)}
      onMouseLeave={() => setHoverImage(false)}
    >
      <Image
        src={bannerImage || "/images/placeholders/placeholder.svg"}
        alt={`Banner de ${store.site_title}`}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={bannerTitle}
            onBlur={(e) => { onChangeTitle(e.target.value); setEditingTitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className="text-sm tracking-[0.3em] uppercase mb-4 font-light bg-transparent border-b border-white text-center outline-none w-full"
          />
        ) : (
          <p
            className={`text-sm tracking-[0.3em] uppercase mb-4 font-light ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingTitle(true)}
          >
            {bannerTitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-70" />}
          </p>
        )}

        <h1 className="text-5xl md:text-7xl font-light tracking-[0.1em] uppercase mb-6">{store.site_title}</h1>

        {editingSubtitle ? (
          <input
            autoFocus
            defaultValue={bannerSubtitle}
            onBlur={(e) => { onChangeSubtitle(e.target.value); setEditingSubtitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className="text-lg font-light tracking-wide bg-transparent border-b border-white/50 text-center outline-none w-full opacity-90"
          />
        ) : (
          <p
            className={`text-lg font-light tracking-wide opacity-90 ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingSubtitle(true)}
          >
            {bannerSubtitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-70" />}
          </p>
        )}

        {store.show_products_button !== false && (
          <a
            href="#productos"
            className="inline-block border border-white px-10 py-4 mt-8 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Ver Productos
          </a>
        )}

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
            {(hoverImage || uploading) && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs text-white hover:bg-black/80"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                Cambiar foto
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}
