"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"
import type { Category } from "@/lib/store-context"
import { artesanoHeading } from "@/lib/fonts/artesano"

interface CategoryShowcaseArtesanoEditableProps {
  categories: Category[]
  images: Record<string, string>
  editMode: boolean
  accentColor?: string
  accentColor2?: string
  onChangeImage: (slug: string, url: string) => void
  subdomain?: string
}

const DEFAULT_IMAGES = [
  "/design-assets/furniture-shop/cat-1.jpg",
  "/design-assets/furniture-shop/cat-2.jpg",
  "/design-assets/furniture-shop/cat-3.jpg",
  "/design-assets/furniture-shop/cat-4.jpg",
]

// Categorías en tarjetas verticales (4:5) con el nombre en una franja sólida
// debajo de la foto, como "Shop by category" de la demo real. Distinto de
// las fichas cuadradas con anillo de color de "Bold" y de los círculos de
// "Elegante".
export function CategoryShowcaseArtesanoEditable({
  categories,
  images,
  editMode,
  accentColor = "#C19A83",
  accentColor2 = "#4A3427",
  onChangeImage,
  subdomain,
}: CategoryShowcaseArtesanoEditableProps) {
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
    <section className="bg-[#FAF6F1] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className={`${artesanoHeading.className} text-2xl md:text-3xl text-[#3a2c22]`}>Categorías</h2>
          <div className="mx-auto mt-3 h-[2px] w-12" style={{ backgroundColor: accentColor }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat, index) => (
            <CategoryTile
              key={cat.id}
              slug={cat.slug}
              image={images[cat.slug] || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
              name={cat.name}
              editMode={editMode}
              accentColor={accentColor}
              accentColor2={accentColor2}
              onChangeImage={(url) => onChangeImage(cat.slug, url)}
              href={subdomain ? `${basePath}/categoria/${cat.slug}` : undefined}
            />
          ))}
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
  accentColor,
  accentColor2,
  onChangeImage,
  href,
}: {
  slug: string
  image: string
  name: string
  editMode: boolean
  accentColor: string
  accentColor2: string
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
      className="relative w-full overflow-hidden bg-white border border-[#eee2d6] transition-shadow hover:shadow-md"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative w-full aspect-[4/5]">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 45vw, 260px" />

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
      <div className="py-3 px-3 text-center border-t-2" style={{ borderColor: accentColor }}>
        <span className={`${artesanoHeading.className} text-sm`} style={{ color: accentColor2 }}>{name}</span>
      </div>
    </div>
  )

  return href && !editMode ? (
    <Link href={href} className="group block">
      {tile}
    </Link>
  ) : (
    tile
  )
}
