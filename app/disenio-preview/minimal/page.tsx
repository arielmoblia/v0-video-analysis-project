import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { MinimalPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Minimal — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para ver el diseño
// "Minimal", scrapeado de una demo real de Shopify (sa-minimal.myshopify.com).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Studio Blanco",
  template: "moda",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "colección primavera",
  banner_subtitle: "Piezas simples, hechas para durar",
  show_products_button: true,
  footer_subtitle: "Ropa y accesorios con diseño minimalista.",
}

const ACCENT_COLOR = "#ff7f00"

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Sombreros", slug: "sombreros" },
  { id: "c2", store_id: "preview", name: "Lentes", slug: "lentes" },
  { id: "c3", store_id: "preview", name: "Accesorios", slug: "accesorios" },
  { id: "c4", store_id: "preview", name: "Bolsos", slug: "bolsos" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Lentes de sol negros",
    slug: "lentes-de-sol-negros",
    description: null,
    price: 45000,
    compare_price: 55000,
    stock: 10,
    image_url: "/design-assets/sa-minimal/banner-1.jpg",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p2",
    name: "Sombrero de paja",
    slug: "sombrero-de-paja",
    description: null,
    price: 32000,
    compare_price: null,
    stock: 14,
    image_url: "/design-assets/sa-minimal/banner-4.jpg",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p3",
    name: "Bolso de cuero",
    slug: "bolso-de-cuero",
    description: null,
    price: 78000,
    compare_price: null,
    stock: 6,
    image_url: "/design-assets/sa-minimal/banner-3.jpg",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
  {
    id: "p4",
    name: "Mesa auxiliar de vidrio",
    slug: "mesa-auxiliar-de-vidrio",
    description: null,
    price: 120000,
    compare_price: 140000,
    stock: 4,
    image_url: "/design-assets/sa-minimal/banner-2.jpg",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
]

export default function DisenioPreviewMinimalPage() {
  return (
    <MinimalPreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
      accentColor={ACCENT_COLOR}
    />
  )
}
