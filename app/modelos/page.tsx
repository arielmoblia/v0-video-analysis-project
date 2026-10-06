import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Modelos de diseño — Vista previa",
  robots: { index: false, follow: false },
}

const ESTILOS = [
  {
    slug: "basico",
    nombre: "Básico",
    descripcion: "Punto de partida simple y neutro, sirve de base para cualquier rubro.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    accent: "#111111",
  },
  {
    slug: "minimal",
    nombre: "Minimal",
    descripcion: "Fondo blanco, mucho espacio vacío, tipografía limpia. Scrapeado de una demo real de Shopify.",
    image: "/design-assets/sa-minimal/banner-1.jpg",
    accent: "#ff7f00",
  },
  {
    slug: "moderno",
    nombre: "Moderno",
    descripcion: "Diseño actual y prolijo, ideal para muebles y decoración.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    accent: "#e8590c",
  },
  {
    slug: "elegante",
    nombre: "Elegante",
    descripcion: "Sofisticado, con acento cálido, pensado para marcas premium accesibles.",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    accent: "#f7791e",
  },
  {
    slug: "luxury",
    nombre: "Luxury",
    descripcion: "Fondo oscuro con detalles dorados, para marcas de alta gama.",
    image: "/design-assets/belle-luxury/cat-1.jpg",
    accent: "#c9a24b",
  },
  {
    slug: "bold",
    nombre: "Bold",
    descripcion: "Colores vibrantes y llamativos, para marcas jóvenes y dinámicas.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    accent: "#ec4899",
  },
  {
    slug: "vintage",
    nombre: "Vintage",
    descripcion: "Estilo retro y floral, cálido y artesanal.",
    image: "/design-assets/flower-vintage/hero-cover.png",
    accent: "#9c6b4f",
  },
  {
    slug: "artesano",
    nombre: "Artesano",
    descripcion: "Cálido y natural, con texturas de madera, ideal para productos hechos a mano.",
    image: "/design-assets/furniture-shop/product-01-c.jpg",
    accent: "#C19A83",
  },
  {
    slug: "blingg",
    nombre: "Blingg",
    descripcion: "Colorido y juguetón, con acento celeste, pensado para joyería y accesorios.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    accent: "#6EC1E4",
  },
]

export default function ModelosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Modelos de diseño</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Todos los estilos visuales disponibles en una sola página, para comparar antes de elegir.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ESTILOS.map((estilo) => (
            <Link
              key={estilo.slug}
              href={`/disenio-preview/${estilo.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border-2 border-border transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={estilo.image}
                  alt={estilo.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="flex items-center gap-2 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium">
                    <ExternalLink className="h-4 w-4" />
                    Ver vista previa
                  </span>
                </div>
                <div
                  className="absolute top-3 left-3 h-4 w-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: estilo.accent }}
                  title={estilo.accent}
                />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold">{estilo.nombre}</h2>
                  <Badge variant="secondary" className="text-xs">/{estilo.slug}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{estilo.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
