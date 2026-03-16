import type { Store } from "@/lib/store-context"
import Image from "next/image"

interface StoreHeroProps {
  store: Store
}

// Imagenes de fallback por tipo de tienda
const FALLBACK_BANNERS: Record<string, string> = {
  zapatos: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80",
  ropa: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
  electronicos: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
  base: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&q=80",
  pruebas: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  template: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
  default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
}

export function StoreHero({ store }: StoreHeroProps) {
  // Usar imagen de la tienda, o fallback segun el subdomain, o default
  const subdomain = (store as any).subdomain || ""
  const fallbackBanner = FALLBACK_BANNERS[subdomain] || FALLBACK_BANNERS.default
  const bannerImage = store.banner_image && store.banner_image !== "/images/placeholders/placeholder.svg" 
    ? store.banner_image 
    : fallbackBanner
  
  const bannerTitle = store.banner_title || "Bienvenido a"
  const bannerSubtitle = store.banner_subtitle || "Descubrí nuestra colección exclusiva"

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Optimizado con next/image */}
      <Image
        src={bannerImage || "/images/placeholders/placeholder.svg"}
        alt={`Banner de ${store.site_title}`}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={85}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <p className="text-sm tracking-[0.3em] uppercase mb-4 font-light">{bannerTitle}</p>
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.1em] uppercase mb-6">{store.site_title}</h1>
        <p className="text-lg font-light tracking-wide max-w-xl mx-auto mb-8 opacity-90">{bannerSubtitle}</p>
        <a
          href="#productos"
          className="inline-block border border-white px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
        >
          Ver Productos
        </a>
      </div>
    </section>
  )
}
