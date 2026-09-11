import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { ArtesanoPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Artesano — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para que Ariel vea
// cómo queda el diseño de index "Artesano", scrapeado de una demo real de
// mueblería de WordPress (websitedemos.net/furniture-shop-04).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Casa Roble",
  template: "muebles",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Hasta 50% off en toda la colección",
  banner_subtitle: "Cientos de estilos disponibles para renovar tu casa",
  show_products_button: true,
  footer_subtitle: "Muebles y decoración con diseño y calidad para cada ambiente de tu casa.",
}

const ACCENT_COLOR = "#C19A83"
const ACCENT_COLOR_2 = "#4A3427"

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Dormitorio", slug: "dormitorio" },
  { id: "c2", store_id: "preview", name: "Decoración", slug: "decoracion" },
  { id: "c3", store_id: "preview", name: "Living", slug: "living" },
  { id: "c4", store_id: "preview", name: "Oficina", slug: "oficina" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Silla Roble Tapizada",
    slug: "silla-roble-tapizada",
    description: null,
    price: 85000,
    compare_price: 99000,
    stock: 8,
    image_url: "/design-assets/furniture-shop/product-01-c.jpg",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p2",
    name: "Lámpara de Pie Nórdica",
    slug: "lampara-de-pie-nordica",
    description: null,
    price: 62000,
    compare_price: null,
    stock: 12,
    image_url: "/design-assets/furniture-shop/product-04-c.jpg",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p3",
    name: "Mesa de Living Redonda",
    slug: "mesa-de-living-redonda",
    description: null,
    price: 120000,
    compare_price: null,
    stock: 5,
    image_url: "/design-assets/furniture-shop/product-05-b.jpg",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p4",
    name: "Escritorio Minimalista",
    slug: "escritorio-minimalista",
    description: null,
    price: 98000,
    compare_price: 115000,
    stock: 6,
    image_url: "/design-assets/furniture-shop/product-09-a.jpg",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
]

export default function DisenioPreviewArtesanoPage() {
  return (
    <ArtesanoPreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
      accentColor={ACCENT_COLOR}
      accentColor2={ACCENT_COLOR_2}
    />
  )
}
