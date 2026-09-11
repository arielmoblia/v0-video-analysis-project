import Image from "next/image"

// Franja de logos: sección nueva que no existe en ningún otro temple
// (Moderno/Elegante/Bold/Blingg no la tienen). Reproduce el carrusel de
// marcas de la demo real de mueblería (websitedemos.net/furniture-shop-04,
// sección justo debajo del hero). Son los 8 logos reales de la demo, en
// escala de grises como textura decorativa — no representan marcas de la
// tienda, es un recurso visual de "vidriera" tal como aparece en el original.
const LOGOS = [
  "/design-assets/furniture-shop/logos/logo-001.png",
  "/design-assets/furniture-shop/logos/logo-002.png",
  "/design-assets/furniture-shop/logos/logo-003.png",
  "/design-assets/furniture-shop/logos/logo-004.png",
  "/design-assets/furniture-shop/logos/logo-005.png",
  "/design-assets/furniture-shop/logos/logo-006.png",
  "/design-assets/furniture-shop/logos/logo-007.png",
  "/design-assets/furniture-shop/logos/logo-008.png",
]

export function BrandStripArtesano() {
  return (
    <section className="bg-white border-b border-[#eee2d6] py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LOGOS.map((src, i) => (
            <div key={src} className="relative w-24 h-10 opacity-50 grayscale" aria-hidden={i > 0}>
              <Image src={src} alt={i === 0 ? "Marcas" : ""} fill className="object-contain" sizes="96px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
