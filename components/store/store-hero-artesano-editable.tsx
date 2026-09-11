"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"
import { artesanoHeading } from "@/lib/fonts/artesano"

interface StoreHeroArtesanoEditableProps {
  store: Store
  accentColor?: string
  accentColor2?: string
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER = "/design-assets/furniture-shop/hero-01.jpg"

// Hero a pantalla completa con foto de fondo y texto superpuesto a la
// izquierda, tal cual la demo real de mueblería scrapeada (sección
// "Black Friday in july / Up to 50% off"). Distinto del hero partido de
// "Bold" y del banner angosto de "Moderno"/"Elegante".
export function StoreHeroArtesanoEditable({
  store,
  accentColor = "#C19A83",
  accentColor2 = "#4A3427",
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroArtesanoEditableProps) {
  const [uploading, setUploading] = useState(false)
  const [hoverImage, setHoverImage] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bannerImage = store.banner_image || FALLBACK_BANNER
  const bannerTitle = store.banner_title || `Bienvenido a ${store.site_title}`
  const bannerSubtitle = store.banner_subtitle || "Descubrí nuestra colección exclusiva"

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
      className="relative w-full min-h-[80vh] flex items-center overflow-hidden"
      onMouseEnter={() => setHoverImage(true)}
      onMouseLeave={() => setHoverImage(false)}
    >
      <Image
        src={bannerImage}
        alt={`Banner de ${store.site_title}`}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 container mx-auto px-8 md:px-16">
        <div className="max-w-lg">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-white/90 mb-4">
            Nueva colección
          </span>

          {editMode && editingTitle ? (
            <textarea
              autoFocus
              value={bannerTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingTitle(false) } }}
              rows={2}
              className={`${artesanoHeading.className} text-3xl md:text-5xl leading-[1.1] mb-4 w-full bg-white text-neutral-900 border-2 rounded-sm p-3 outline-none`}
              style={{ borderColor: accentColor }}
            />
          ) : (
            <h1
              onClick={() => editMode && setEditingTitle(true)}
              className={`${artesanoHeading.className} text-3xl md:text-5xl leading-[1.1] mb-4 text-white text-balance`}
              style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "6px" } : undefined}
              onMouseEnter={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed white" }}
              onMouseLeave={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed transparent" }}
            >
              {bannerTitle}
              {editMode && <Pencil size={16} className="inline-block ml-2 align-middle opacity-70" />}
            </h1>
          )}

          {editMode && editingSubtitle ? (
            <textarea
              autoFocus
              value={bannerSubtitle}
              onChange={(e) => onChangeSubtitle(e.target.value)}
              onBlur={() => setEditingSubtitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingSubtitle(false) } }}
              rows={2}
              className="text-base mb-8 w-full bg-white text-neutral-900 border-2 rounded-sm p-3 outline-none"
              style={{ borderColor: accentColor }}
            />
          ) : (
            <p
              onClick={() => editMode && setEditingSubtitle(true)}
              className="text-base md:text-lg text-white/90 mb-8"
              style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "6px" } : undefined}
              onMouseEnter={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed white" }}
              onMouseLeave={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed transparent" }}
            >
              {bannerSubtitle}
              {editMode && <Pencil size={14} className="inline-block ml-2 align-middle opacity-70" />}
            </p>
          )}

          {store.show_products_button !== false && (
            <a
              href="#productos"
              className="inline-flex items-center justify-center rounded-sm px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Ver productos
            </a>
          )}
        </div>
      </div>

      {editMode && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) subirImagen(f) }}
          />
          {(hoverImage || uploading) && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute top-4 right-4 flex items-center justify-center gap-2 rounded-sm text-white text-xs font-medium px-3 py-2 z-20"
              style={{ backgroundColor: accentColor2 }}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <><ImagePlus size={14} /> Cambiar foto</>}
            </button>
          )}
        </>
      )}
    </section>
  )
}
