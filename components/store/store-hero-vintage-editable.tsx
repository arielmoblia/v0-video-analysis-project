"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"
import { vintageHeading, vintageScript } from "@/lib/fonts/vintage"

interface StoreHeroVintageEditableProps {
  store: Store
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER = "/design-assets/flower-vintage/hero-cover.png"

// Hero cálido con fondo crema de respaldo (#f6f1ed) y la foto real del ramo
// de flores scrapeada, eyebrow en la fuente CURSIVA (vintageScript) — rasgo
// distintivo único de este temple — título serif (vintageHeading) y botón
// CTA sólido en terracota (#cc3833). Tal cual el "Cover" real de
// floral.weblium.site.
export function StoreHeroVintageEditable({
  store,
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroVintageEditableProps) {
  const [uploading, setUploading] = useState(false)
  const [hoverImage, setHoverImage] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bannerImage = store.banner_image || FALLBACK_BANNER
  const bannerTitle = store.banner_title || "Flores para cada ocasión"
  const bannerSubtitle = store.banner_subtitle || "Arreglos florales frescos, elegidos con cariño."

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
      className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden bg-[#f6f1ed]"
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
      <div className="absolute inset-0 bg-[#f6f1ed]/30" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <p className={`${vintageScript.className} text-4xl md:text-5xl text-[#cc3833] mb-2`}>
          {store.site_title}
        </p>

        {editingTitle ? (
          <input
            autoFocus
            defaultValue={bannerTitle}
            onBlur={(e) => { onChangeTitle(e.target.value); setEditingTitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className={`${vintageHeading.className} text-3xl md:text-5xl text-[#4a4632] bg-transparent border-b border-[#4a4632] text-center outline-none w-full`}
          />
        ) : (
          <h1
            className={`${vintageHeading.className} text-3xl md:text-5xl text-[#4a4632] ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingTitle(true)}
          >
            {bannerTitle}
            {editMode && <Pencil className="inline-block ml-3 h-5 w-5 align-middle opacity-70" />}
          </h1>
        )}

        {editingSubtitle ? (
          <input
            autoFocus
            defaultValue={bannerSubtitle}
            onBlur={(e) => { onChangeSubtitle(e.target.value); setEditingSubtitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className="mt-5 text-sm md:text-base text-[#7c7669] bg-transparent border-b border-[#7c7669]/50 text-center outline-none w-full"
          />
        ) : (
          <p
            className={`mt-5 text-sm md:text-base text-[#7c7669] ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingSubtitle(true)}
          >
            {bannerSubtitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-70" />}
          </p>
        )}

        <a
          href="#productos"
          className="inline-block mt-8 px-9 py-3.5 text-xs uppercase tracking-[0.15em] font-semibold text-white bg-[#cc3833] hover:bg-[#b32e29] transition-colors rounded-full"
        >
          Ver más
        </a>

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
                className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs text-[#4a4632] hover:bg-white"
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
