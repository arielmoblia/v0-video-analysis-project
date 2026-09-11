import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { ElegantePreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Elegante — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para que Ariel vea
// cómo quedaría el diseño de index "Elegante", inspirado en tiendas de
// relojería/accesorios premium (relojesenargentina.mitiendanube.com).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Relojes del Sur",
  template: "accesorios",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Precisión y estilo en cada segundo",
  banner_subtitle: "Envío gratis en compras superiores a $50.000",
  show_products_button: true,
  footer_subtitle: "Relojes de calidad para cada estilo de vida, con garantía y envíos a todo el país.",
}

const ACCENT_COLOR = "#f7791e"

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Hombre", slug: "hombre" },
  { id: "c2", store_id: "preview", name: "Mujer", slug: "mujer" },
  { id: "c3", store_id: "preview", name: "Smartwatch", slug: "smartwatch" },
  { id: "c4", store_id: "preview", name: "Digital", slug: "digital" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Reloj Acero Clásico",
    slug: "reloj-acero-clasico",
    description: null,
    price: 45000,
    compare_price: 58000,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Reloj Dama Dorado",
    slug: "reloj-dama-dorado",
    description: null,
    price: 38000,
    compare_price: null,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p3",
    name: "Smartwatch Deportivo",
    slug: "smartwatch-deportivo",
    description: null,
    price: 62000,
    compare_price: null,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p4",
    name: "Reloj Digital Resistente",
    slug: "reloj-digital-resistente",
    description: null,
    price: 25900,
    compare_price: 32000,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
]

export default function DisenioPreviewElegantePage() {
  return (
    <ElegantePreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
      accentColor={ACCENT_COLOR}
    />
  )
}
