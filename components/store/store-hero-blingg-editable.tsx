"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import { blinggHeading } from "@/lib/fonts/blingg"
import type { Store } from "@/lib/store-context"

interface StoreHeroBlinggEditableProps {
  store: Store
  accentColor?: string
  accentColor2?: string
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

// Foto real de la demo (bracelet-01-a) como fallback cuando la tienda todavía
// no cargó su propia foto de banner.
const FALLBACK_BANNER = "/design-assets/blingg-jewelry/bracelet-01-a-819x1024.jpg"

// Variante editable del hero "Blingg": grilla partida con foto a la derecha,
// como el hero real de la demo ("New collection / The new ring sensation /
// Shop Now"), con la paleta celeste/gris/verde real en vez de inventada.
export function StoreHeroBlinggEditable({
  store,
  accentColor = "#6EC1E4",
  accentColor2 = "#61CE70",
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroBlinggEditableProps) {
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
    <section className="bg-[#F2F9FC]">
      <div className="container mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p
            className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5 text-white"
            style={{ backgroundColor: accentColor2 }}
          >
            Nueva colección
          </p>

          {editMode && editingTitle ? (
            <textarea
              autoFocus
              value={bannerTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingTitle(false) } }}
              rows={3}
              className={`${blinggHeading.className} text-4xl md:text-6xl font-bold text-[#54595F] leading-[1.05] mb-5 w-full bg-white border-2 rounded-lg p-2 outline-none`}
              style={{ borderColor: accentColor }}
            />
          ) : (
            <h1
              onClick={() => editMode && setEditingTitle(true)}
              className={`${blinggHeading.className} text-4xl md:text-6xl font-bold text-[#54595F] leading-[1.05] mb-5 text-balance`}
              style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "6px" } : undefined}
              onMouseEnter={(e) => { if (editMode) e.currentTarget.style.outline = `2px dashed ${accentColor}` }}
              onMouseLeave={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed transparent" }}
            >
              {bannerTitle}
              {editMode && <Pencil size={16} className="inline-block ml-2 align-middle opacity-50" />}
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
              className="text-lg text-[#7A7A7A] mb-8 max-w-md w-full bg-white border-2 rounded-lg p-2 outline-none"
              style={{ borderColor: accentColor }}
            />
          ) : (
            <p
              onClick={() => editMode && setEditingSubtitle(true)}
              className="text-lg text-[#7A7A7A] mb-8 max-w-md"
              style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "6px" } : undefined}
              onMouseEnter={(e) => { if (editMode) e.currentTarget.style.outline = `2px dashed ${accentColor}` }}
              onMouseLeave={(e) => { if (editMode) e.currentTarget.style.outline = "2px dashed transparent" }}
            >
              {bannerSubtitle}
              {editMode && <Pencil size={14} className="inline-block ml-2 align-middle opacity-50" />}
            </p>
          )}

          {store.show_products_button !== false && (
            <a
              href="#productos"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: accentColor }}
            >
              Ver productos
            </a>
          )}
        </div>

        <div
          className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white"
          onMouseEnter={() => setHoverImage(true)}
          onMouseLeave={() => setHoverImage(false)}
          style={editMode ? { outline: hoverImage ? `2px dashed ${accentColor}` : "2px dashed transparent", outlineOffset: "3px" } : undefined}
        >
          <Image
            src={bannerImage}
            alt={`Banner de ${store.site_title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
          />
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
                  className="absolute top-3 right-3 flex items-center justify-center gap-2 rounded-full text-white text-xs font-medium px-3 py-2 z-10"
                  style={{ backgroundColor: accentColor }}
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <><ImagePlus size={14} /> Cambiar foto</>}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
