"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"
import { minimalHeading } from "@/lib/fonts/minimal"

interface StoreHeroMinimalEditableProps {
  store: Store
  accentColor?: string
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER = "/design-assets/sa-minimal/hero-home-bg.jpg"

// Hero a pantalla completa con overlay oscuro (rgba(0,0,0,0.7)) y texto en
// minúsculas, tal cual el slider real de la demo scrapeada. Distinto del
// hero con foto sin overlay de Artesano y del hero partido de Bold.
export function StoreHeroMinimalEditable({
  store,
  accentColor = "#ff7f00",
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroMinimalEditableProps) {
  const [uploading, setUploading] = useState(false)
  const [hoverImage, setHoverImage] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubtitle, setEditingSubtitle] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bannerImage = store.banner_image || FALLBACK_BANNER
  const bannerTitle = store.banner_title || store.site_title.toLowerCase()
  const bannerSubtitle = store.banner_subtitle || "Descubrí nuestra colección"

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
      className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
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
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={bannerTitle}
            onBlur={(e) => { onChangeTitle(e.target.value); setEditingTitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className={`${minimalHeading.className} text-4xl md:text-6xl font-light lowercase text-white bg-transparent border-b border-white text-center outline-none w-full`}
          />
        ) : (
          <h1
            className={`${minimalHeading.className} text-4xl md:text-6xl font-light lowercase text-white ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
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
            className={`mt-5 text-sm md:text-base text-white/80 tracking-wide ${editMode ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={() => editMode && setEditingSubtitle(true)}
          >
            {bannerSubtitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-70" />}
          </p>
        )}

        <a
          href="#productos"
          className="inline-block mt-8 px-8 py-3 text-xs uppercase tracking-[0.2em] text-white border border-white hover:bg-white transition-colors"
          style={{ ["--hover-color" as string]: accentColor }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#111" }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#fff" }}
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
