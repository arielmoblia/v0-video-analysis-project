"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface StoreHeroBoldEditableProps {
  store: Store
  accentColor?: string
  accentColor2?: string
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"

// Variante "Bold": banner partido con fondo de color vibrante a la izquierda
// (título grande + botón pastilla) y la foto a la derecha, en vez del banner
// oscuro a todo el ancho de "Elegante".
export function StoreHeroBoldEditable({
  store,
  accentColor = "#ec4899",
  accentColor2 = "#22c55e",
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroBoldEditableProps) {
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
    <section className="relative w-full grid md:grid-cols-2 min-h-[420px] overflow-hidden">
      <div
        className="flex flex-col items-start justify-center px-8 md:px-14 py-14 order-2 md:order-1"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor2})` }}
      >
        {editMode && editingTitle ? (
          <textarea
            autoFocus
            value={bannerTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingTitle(false) } }}
            rows={2}
            className="text-3xl md:text-5xl font-extrabold text-neutral-900 leading-[1.05] mb-4 w-full max-w-xl bg-white border-2 rounded-2xl p-3 outline-none"
            style={{ borderColor: "#ffffff" }}
          />
        ) : (
          <h1
            onClick={() => editMode && setEditingTitle(true)}
            className="text-3xl md:text-5xl font-extrabold text-white leading-[1.05] mb-4 max-w-xl text-balance"
            style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "10px" } : undefined}
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
            className="text-base text-neutral-900 mb-7 max-w-md w-full bg-white border-2 rounded-2xl p-3 outline-none"
            style={{ borderColor: "#ffffff" }}
          />
        ) : (
          <p
            onClick={() => editMode && setEditingSubtitle(true)}
            className="text-base md:text-lg text-white/90 mb-7 max-w-md font-medium"
            style={editMode ? { cursor: "text", outline: "2px dashed transparent", outlineOffset: "4px", borderRadius: "10px" } : undefined}
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
            className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide bg-white transition-transform hover:scale-[1.03]"
            style={{ color: accentColor }}
          >
            Ver productos
          </a>
        )}
      </div>

      <div
        className="relative order-1 md:order-2 aspect-[4/3] md:aspect-auto"
        onMouseEnter={() => setHoverImage(true)}
        onMouseLeave={() => setHoverImage(false)}
      >
        <Image src={bannerImage} alt={`Banner de ${store.site_title}`} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" quality={85} />

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
                className="absolute top-4 right-4 flex items-center justify-center gap-2 rounded-full text-white text-xs font-medium px-3 py-2 z-10"
                style={{ backgroundColor: accentColor }}
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <><ImagePlus size={14} /> Cambiar foto</>}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}
