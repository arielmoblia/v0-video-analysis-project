import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { DianiPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Minimalista — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para ver el diseño
// "Minimalista" (id interno "diani"), sacado de dianiswim.com.
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "diani",
  template: "moda",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "colección verano",
  banner_subtitle: "Piezas simples, hechas para durar",
  show_products_button: true,
  footer_subtitle: "Ropa y accesorios con diseño editorial.",
}

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Tops", slug: "tops" },
  { id: "c2", store_id: "preview", name: "Bottoms", slug: "bottoms" },
  { id: "c3", store_id: "preview", name: "Vestidos", slug: "vestidos" },
  { id: "c4", store_id: "preview", name: "Accesorios", slug: "accesorios" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Top Rose - Shiny Silver",
    slug: "top-rose-shiny-silver",
    description: null,
    price: 45000,
    compare_price: null,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Vestido Lino Natural",
    slug: "vestido-lino-natural",
    description: null,
    price: 62000,
    compare_price: 72000,
    stock: 14,
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p3",
    name: "Bottom Clásico Negro",
    slug: "bottom-clasico-negro",
    description: null,
    price: 38000,
    compare_price: null,
    stock: 6,
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p4",
    name: "Pañuelo de Seda",
    slug: "panuelo-de-seda",
    description: null,
    price: 25000,
    compare_price: null,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
]

export default function DisenioPreviewDianiPage() {
  return (
    <DianiPreviewClient store={MOCK_STORE} categories={MOCK_CATEGORIES} products={MOCK_PRODUCTS} />
  )
}
