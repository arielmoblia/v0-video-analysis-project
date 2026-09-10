import type { Store } from "@/lib/store-context"
import Image from "next/image"

interface StoreHeroModernProps {
  store: Store
  accentColor?: string
}

const FALLBACK_BANNERS: Record<string, string> = {
  zapatos: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  ropa: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
  electronicos: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
}

export function StoreHeroModern({ store, accentColor = "#111827" }: StoreHeroModernProps) {
  const subdomain = (store as any).subdomain || ""
  const fallbackBanner = FALLBACK_BANNERS[subdomain] || FALLBACK_BANNERS.default
  const bannerImage =
    store.banner_image && store.banner_image !== "/images/placeholders/placeholder.svg"
      ? store.banner_image
      : fallbackBanner

  const bannerTitle = store.banner_title || `Bienvenido a ${store.site_title}`
  const bannerSubtitle = store.banner_subtitle || "Descubrí nuestra colección exclusiva"

  return (
    <section className="bg-neutral-50">
      <div className="container mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p
            className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-5"
            style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
          >
            Nueva colección
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-[1.05] mb-5 text-balance">
            {bannerTitle}
          </h1>
          <p className="text-lg text-neutral-500 mb-8 max-w-md">{bannerSubtitle}</p>
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

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
          <Image
            src={bannerImage || "/images/placeholders/placeholder.svg"}
            alt={`Banner de ${store.site_title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
          />
        </div>
      </div>
    </section>
  )
}
