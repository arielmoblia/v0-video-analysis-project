import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { BlinggPreviewClient } from "./preview-client"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Blingg — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para que Ariel vea
// cómo queda el diseño de index "Blingg", scrapeado de una demo real de
// joyería de WordPress (websitedemos.net/blingg-jewelry-store-04).
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Blingg Joyas",
  template: "joyeria",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "La nueva sensación en anillos",
  banner_subtitle: "Envío gratis en compras superiores a $50.000",
  show_products_button: true,
  footer_subtitle: "Joyas únicas hechas para durar, con garantía y envíos a todo el país.",
}

const ACCENT_COLOR = "#6EC1E4"
const ACCENT_COLOR_2 = "#61CE70"

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", store_id: "preview", name: "Anillos", slug: "anillos" },
  { id: "c2", store_id: "preview", name: "Collares", slug: "collares" },
  { id: "c3", store_id: "preview", name: "Aros", slug: "aros" },
  { id: "c4", store_id: "preview", name: "Pulseras", slug: "pulseras" },
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Anillo Oro Ondulado",
    slug: "anillo-oro-ondulado",
    description: null,
    price: 42000,
    compare_price: 54000,
    stock: 6,
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c1",
    sizes: null,
  },
  {
    id: "p2",
    name: "Collar Plata Fina",
    slug: "collar-plata-fina",
    description: null,
    price: 35000,
    compare_price: null,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c2",
    sizes: null,
  },
  {
    id: "p3",
    name: "Aros Citrino Dorados",
    slug: "aros-citrino-dorados",
    description: null,
    price: 28000,
    compare_price: null,
    stock: 14,
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c3",
    sizes: null,
  },
  {
    id: "p4",
    name: "Pulsera Cristal Rosa",
    slug: "pulsera-cristal-rosa",
    description: null,
    price: 31000,
    compare_price: 39000,
    stock: 9,
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    featured: true,
    active: true,
    category_id: "c4",
    sizes: null,
  },
]

export default function DisenioPreviewBlinggPage() {
  return (
    <BlinggPreviewClient
      store={MOCK_STORE}
      categories={MOCK_CATEGORIES}
      products={MOCK_PRODUCTS}
      accentColor={ACCENT_COLOR}
      accentColor2={ACCENT_COLOR_2}
    />
  )
}
