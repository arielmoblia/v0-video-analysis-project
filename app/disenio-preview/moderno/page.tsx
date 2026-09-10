import type { Metadata } from "next"
import type { Store, Product, Category } from "@/lib/types"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { StoreHeaderModern } from "@/components/store/store-header-modern"
import { StoreHeroModern } from "@/components/store/store-hero-modern"
import { CategoryShowcaseModern } from "@/components/store/category-showcase-modern"
import { ProductGridModern } from "@/components/store/product-grid-modern"
import { StoreFooter } from "@/components/store/store-footer"

export const metadata: Metadata = {
  title: "Propuesta de diseño: Moderno — Vista previa",
  robots: { index: false, follow: false },
}

// Página de muestra (no conectada a ninguna tienda real) para que Ariel vea
// cómo quedaría un diseño de index alternativo, inspirado en storefront.saleor.io.
const MOCK_STORE: Store = {
  id: "preview",
  username: "preview",
  subdomain: "preview",
  site_title: "Aurora Deco",
  template: "ropa",
  status: "active",
  email: "preview@tol.ar",
  banner_title: "Diseñá tu espacio, viví mejor",
  banner_subtitle: "Muebles y decoración con envío a todo el país. Nuevas piezas cada semana.",
  show_products_button: true,
  footer_subtitle: "Tu destino para encontrar los mejores productos con estilo y calidad.",
}

const ACCENT_COLOR = "#e8590c"

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

export default function DisenioPreviewModernoPage() {
  return (
    <CartProvider country="AR">
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-neutral-900 text-white text-center text-xs py-2 px-4">
          Propuesta de diseño "Moderno" — vista previa con datos de ejemplo, inspirada en storefront.saleor.io. No es una tienda real.
        </div>
        <StoreHeaderModern store={MOCK_STORE} categories={MOCK_CATEGORIES} accentColor={ACCENT_COLOR} />
        <main className="flex-1">
          <StoreHeroModern store={MOCK_STORE} accentColor={ACCENT_COLOR} />
          <CategoryShowcaseModern categories={MOCK_CATEGORIES} subdomain={MOCK_STORE.subdomain} />
          <section id="productos" className="container mx-auto px-6 py-14">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Destacados</h2>
            <ProductGridModern products={MOCK_PRODUCTS} subdomain={MOCK_STORE.subdomain} accentColor={ACCENT_COLOR} country="AR" />
          </section>
        </main>
        <StoreFooter store={MOCK_STORE} />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
