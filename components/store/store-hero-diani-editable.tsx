"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import type { Store } from "@/lib/store-context"

interface StoreHeroDianiEditableProps {
  store: Store
  editMode: boolean
  onChangeImage: (url: string) => void
  onChangeTitle: (value: string) => void
  onChangeSubtitle: (value: string) => void
}

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1600&q=80"

// Hero "Minimalista" (diani): foto a pantalla completa SIN overlay y SIN
// texto superpuesto, tal cual dianiswim.com. El título/subtítulo editables
// van debajo de la foto, chicos y centrados, no tapando la imagen.
export function StoreHeroDianiEditable({
  store,
  editMode,
  onChangeImage,
  onChangeTitle,
  onChangeSubtitle,
}: StoreHeroDianiEditableProps) {
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
    <section>
      <div
        className="relative w-full h-[80vh] overflow-hidden bg-neutral-50"
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
                className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 px-4 py-2 text-xs text-white hover:bg-black/80"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                Cambiar foto
              </button>
            )}
          </>
        )}
      </div>

      <div className="text-center px-6 py-10 max-w-xl mx-auto">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={bannerTitle}
            onBlur={(e) => { onChangeTitle(e.target.value); setEditingTitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className="text-lg md:text-xl lowercase text-[#222] bg-transparent border-b border-neutral-300 text-center outline-none w-full"
          />
        ) : (
          <h1
            className={`text-lg md:text-xl lowercase text-[#222] ${editMode ? "cursor-pointer hover:opacity-70" : ""}`}
            onClick={() => editMode && setEditingTitle(true)}
          >
            {bannerTitle}
            {editMode && <Pencil className="inline-block ml-2 h-4 w-4 align-middle opacity-50" />}
          </h1>
        )}

        {editingSubtitle ? (
          <input
            autoFocus
            defaultValue={bannerSubtitle}
            onBlur={(e) => { onChangeSubtitle(e.target.value); setEditingSubtitle(false) }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
            className="mt-2 text-sm text-neutral-500 bg-transparent border-b border-neutral-300 text-center outline-none w-full"
          />
        ) : (
          <p
            className={`mt-2 text-sm text-neutral-500 ${editMode ? "cursor-pointer hover:opacity-70" : ""}`}
            onClick={() => editMode && setEditingSubtitle(true)}
          >
            {bannerSubtitle}
            {editMode && <Pencil className="inline-block ml-2 h-3.5 w-3.5 align-middle opacity-50" />}
          </p>
        )}
      </div>
    </section>
  )
}
