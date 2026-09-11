import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { VintagePreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Vintage — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para ver el diseño
// "Vintage", scrapeado de una demo real de florería (floral.weblium.site).
// Único asset real disponible es hero-cover.png, así que se reutiliza
// también como foto de producto de ejemplo en vez de inventar fotos.
const HERO_IMAGE = "/design-assets/flower-vintage/hero-cover.png"

const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Sami's Flowers",
  template: "florería",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Flores para cada ocasión",
  banner_subtitle: "Arreglos florales frescos, elegidos con cariño.",
  show_products_button: true,
  footer_subtitle: "Arreglos florales frescos, elegidos con cariño.",
}

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Ramos", slug: "ramos" },
  { id: "c2", store_id: "preview", name: "Plantas", slug: "plantas" },
  { id: "c3", store_id: "preview", name: "Regalos", slug: "regalos" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Ramo de rosas rojas",
    slug: "ramo-de-rosas-rojas",
    description: null,
    price: 18500,
    compare_price: 22000,
    stock: 8,
    image_url: HERO_IMAGE,
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Arreglo primaveral",
    slug: "arreglo-primaveral",
    description: null,
    price: 21000,
    compare_price: null,
    stock: 6,
    image_url: HERO_IMAGE,
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p3",
    name: "Planta suculenta",
    slug: "planta-suculenta",
    description: null,
    price: 9800,
    compare_price: null,
    stock: 15,
    image_url: HERO_IMAGE,
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p4",
    name: "Caja de bombones + flores",
    slug: "caja-de-bombones-flores",
    description: null,
    price: 26500,
    compare_price: 30000,
    stock: 4,
    image_url: HERO_IMAGE,
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
]

export default function DisenioPreviewVintagePage() {
  return (
    <VintagePreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
    />
  )
}
