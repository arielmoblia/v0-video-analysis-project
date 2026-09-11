import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { LuxuryPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Luxury — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para ver el diseño
// "Luxury", scrapeado de una demo real de Shopify (belle-demo-2.myshopify.com).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Maison Noir",
  template: "moda",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Timeless Appeal",
  banner_subtitle: "Piezas atemporales, hechas para durar",
  show_products_button: true,
  footer_subtitle: "Piezas seleccionadas con calidad y estilo.",
}

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Carteras", slug: "carteras" },
  { id: "c2", store_id: "preview", name: "Calzado", slug: "calzado" },
  { id: "c3", store_id: "preview", name: "Accesorios", slug: "accesorios" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Cartera de cuero negra",
    slug: "cartera-de-cuero-negra",
    description: null,
    price: 95000,
    compare_price: 120000,
    stock: 5,
    image_url: "/design-assets/belle-luxury/cat-1.jpg",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Botas de cuero",
    slug: "botas-de-cuero",
    description: null,
    price: 110000,
    compare_price: null,
    stock: 7,
    image_url: "/design-assets/belle-luxury/cat-2.jpg",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p3",
    name: "Zapatillas urbanas",
    slug: "zapatillas-urbanas",
    description: null,
    price: 88000,
    compare_price: null,
    stock: 9,
    image_url: "/design-assets/belle-luxury/cat-3.jpg",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p4",
    name: "Cinturón de cuero",
    slug: "cinturon-de-cuero",
    description: null,
    price: 42000,
    compare_price: 50000,
    stock: 12,
    image_url: "/design-assets/belle-luxury/hero-slide2.jpg",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
]

export default function DisenioPreviewLuxuryPage() {
  return (
    <LuxuryPreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
    />
  )
}
