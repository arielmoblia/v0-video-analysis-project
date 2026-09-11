"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { luxuryHeading } from "@/lib/fonts/luxury"

interface CategoryShowcaseLuxuryEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
}

const DEFAULT_IMAGES = [
  "/design-assets/belle-luxury/cat-1.jpg",
  "/design-assets/belle-luxury/cat-2.jpg",
  "/design-assets/belle-luxury/cat-3.jpg",
]

// Banner tipo "masonry" (una foto grande a la izquierda + dos chicas
// apiladas a la derecha), tal cual la sección "masonry_banner" real de la
// demo. Es la seña de identidad estructural de "Luxury": ningún otro temple
// tiene un mosaico irregular de fotos grandes en blanco y negro.
export function CategoryShowcaseLuxuryEditable({
  categories,
  images,
  editMode,
  onChangeImage,
  subdomain,
}: CategoryShowcaseLuxuryEditableProps) {
  const [basePath, setBasePath] = useState(subdomain ? `/tienda/${subdomain}` : "")

  useEffect(() => {
    if (!subdomain) return
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [subdomain])

  if (categories.length === 0) return null

  const items = categories.slice(0, 3)

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900`}>Colecciones</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[520px]">
          {items[0] && (
            <div className="h-[260px] md:h-full">
              <CategoryTile
                slug={items[0].slug}
                image={images[items[0].slug] || DEFAULT_IMAGES[0]}
                name={items[0].name}
                editMode={editMode}
                onChangeImage={(url) => onChangeImage(items[0].slug, url)}
                href={subdomain ? `${basePath}/categoria/${items[0].slug}` : undefined}
              />
            </div>
          )}
          <div className="grid grid-rows-2 gap-4">
            {items.slice(1, 3).map((cat, i) => (
              <div key={cat.id} className="h-[254px] md:h-full">
                <CategoryTile
                  slug={cat.slug}
                  image={images[cat.slug] || DEFAULT_IMAGES[(i + 1) % DEFAULT_IMAGES.length]}
                  name={cat.name}
                  editMode={editMode}
                  onChangeImage={(url) => onChangeImage(cat.slug, url)}
                  href={subdomain ? `${basePath}/categoria/${cat.slug}` : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryTile({
  slug,
  image,
  name,
  editMode,
  onChangeImage,
  href,
}: {
  slug: string
  image: string
  name: string
  editMode: boolean
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
      className="relative w-full h-full overflow-hidden bg-neutral-100 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image src={image} alt={name} fill className="object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-6 left-6">
        <h3 className="text-white text-xl uppercase tracking-widest font-semibold">{name}</h3>
        <span className="mt-1 inline-block text-xs uppercase tracking-widest text-white/80 border-b border-white/60">Comprar ahora</span>
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
    <Link href={href} className="block h-full">
      {tile}
    </Link>
  ) : (
    tile
  )
}
