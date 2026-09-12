import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { BasicoPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Básico — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real): es el diseño
// clásico que ya trae toda tienda nueva de tol.ar antes de elegir un modelo.
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Aurora Deco",
  template: "ropa",
  status: "active",
  email: "preview@tol.ar",
  country: "AR",
  banner_title: "Bienvenido a Aurora Deco",
  banner_subtitle: "Los mejores productos, directo a tu casa.",
  show_products_button: true,
  footer_subtitle: "Tu destino para encontrar los mejores productos con estilo y calidad.",
}

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Living", slug: "living" },
  { id: "c2", store_id: "preview", name: "Cocina", slug: "cocina" },
  { id: "c3", store_id: "preview", name: "Dormitorio", slug: "dormitorio" },
  { id: "c4", store_id: "preview", name: "Iluminación", slug: "iluminacion" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Sillón Boucle Crema",
    slug: "sillon-boucle-crema",
    description: null,
    price: 185000,
    compare_price: 230000,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Mesa Ratona Roble",
    slug: "mesa-ratona-roble",
    description: null,
    price: 92000,
    compare_price: null,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p3",
    name: "Lámpara Colgante Ámbar",
    slug: "lampara-colgante-ambar",
    description: null,
    price: 34000,
    compare_price: null,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
  {
    id: "p4",
    name: "Juego de Vasos Vidrio Soplado",
    slug: "juego-vasos-vidrio",
    description: null,
    price: 18500,
    compare_price: 24000,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
]

export default function DisenioPreviewBasicoPage() {
  return <BasicoPreviewClient store={MOCK_STORE} categories={MOCK_CATEGORIES} products={MOCK_PRODUCTS} />
}
