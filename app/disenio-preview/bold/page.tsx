import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { BoldPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Bold — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para que Ariel vea
// cómo quedaría el diseño de index "Bold", inspirado en tiendas juveniles
// de regalos personalizados (colores vibrantes, tarjetas redondeadas).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Rosa Manía",
  template: "accesorios",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Regalos con onda para cada ocasión",
  banner_subtitle: "Envío a todo el país en compras seleccionadas",
  show_products_button: true,
  footer_subtitle: "Accesorios y regalos personalizados con la mejor calidad y precio.",
}

const ACCENT_COLOR = "#ec4899"
const ACCENT_COLOR_2 = "#22c55e"

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Bijou", slug: "bijou" },
  { id: "c2", store_id: "preview", name: "Bolsos", slug: "bolsos" },
  { id: "c3", store_id: "preview", name: "Llaveros", slug: "llaveros" },
  { id: "c4", store_id: "preview", name: "Tazas", slug: "tazas" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Collar Iniciales Doradas",
    slug: "collar-iniciales-doradas",
    description: null,
    price: 15000,
    compare_price: 19000,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Bolso Tote Personalizado",
    slug: "bolso-tote-personalizado",
    description: null,
    price: 28000,
    compare_price: null,
    stock: 6,
    image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p3",
    name: "Llavero Monograma",
    slug: "llavero-monograma",
    description: null,
    price: 6500,
    compare_price: null,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p4",
    name: "Taza con Frase",
    slug: "taza-con-frase",
    description: null,
    price: 9500,
    compare_price: 12000,
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
]

export default function DisenioPreviewBoldPage() {
  return (
    <BoldPreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
      accentColor={ACCENT_COLOR}
      accentColor2={ACCENT_COLOR_2}
    />
  )
}
