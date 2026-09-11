"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"
import { luxuryHeading } from "@/lib/fonts/luxury"

interface StoreHeroLuxuryEditableProps {
  store: Store
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER = "/design-assets/belle-luxury/hero-slide1.jpg"

// Hero a pantalla completa, overlay negro, texto centrado en mayúsculas y
// UN solo botón sólido negro con borde blanco — tal cual el slideshow real
// ("TIMELESS APPEAL / SAVE UP TO 60%"). Distinto del hero con overlay tenue
// de Artesano y del hero con overlay fuerte de Minimal (que usa texto en
// minúsculas).
export function StoreHeroLuxuryEditable({
  store,
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroLuxuryEditableProps) {
  const [uploading, setUploading] = useState(false)
  const [hoverImage, setHoverImage] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bannerImage = store.banner_image || FALLBACK_BANNER
  const bannerTitle = store.banner_title || store.site_title
  const bannerSubtitle = store.banner_subtitle || "Piezas atemporales, hechas para durar"

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
      className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-black"
      onMouseEnter={() => setHoverImage(true)}
      onMouseLeave={() => setHoverImage(false)}
    >
      <Image
        src={bannerImage}
        alt={`Banner de ${store.site_title}`}
        fill
        className="object-cover opacity-80"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-4">Desde 2017</p>

        {editingTitle ? (
          <input
            autoFocus
            defaultValue={bannerTitle}
            onBlur={(e) => { onChangeTitle(e.target.value); setEditingTitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className={`${luxuryHeading.className} text-4xl md:text-6xl font-bold uppercase tracking-wide text-white bg-transparent border-b border-white text-center outline-none w-full`}
          />
        ) : (
          <h1
            className={`${luxuryHeading.className} text-4xl md:text-6xl font-bold uppercase tracking-wide text-white ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
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
            className="mt-5 text-sm md:text-base text-white/80 bg-transparent border-b border-white/50 text-center outline-none w-full"
          />
        ) : (
          <p
            className={`mt-5 text-sm md:text-base text-white/80 ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingSubtitle(true)}
          >
            {bannerSubtitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-70" />}
          </p>
        )}

        <a
          href="#productos"
          className="inline-block mt-8 px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-black bg-white hover:bg-[#ebb868] transition-colors"
        >
          Ver colección
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
                className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs text-black hover:bg-white"
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
