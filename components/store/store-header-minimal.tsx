"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"
import { minimalHeading } from "@/lib/fonts/minimal"

interface StoreHeaderMinimalProps {
  store: Store
  categories: Category[]
  accentColor?: string
  disableNav?: boolean
}

// Header en 2 filas, tal cual la demo real (sa-minimal.myshopify.com): fila
// superior con buscador a la izquierda, logo centrado y cuenta+carrito a la
// derecha; fila inferior con el menú de navegación centrado sobre fondo
// blanco. Distinto del header de una sola fila de Artesano/Blingg/Bold.
export function StoreHeaderMinimal({ store, categories, accentColor = "#ff7f00", disableNav = false }: StoreHeaderMinimalProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [basePath, setBasePath] = useState(`/tienda/${store.subdomain}`)
  const { items, setCartOpen } = useCart()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden sm:flex items-center border-b border-neutral-200 px-1 py-1.5 gap-2 w-56">
            <Search className="h-4 w-4 text-neutral-400 shrink-0" />
            <input
              type="search"
              placeholder="Buscar en la tienda"
              aria-label="Buscar productos"
              className="bg-transparent text-sm outline-none w-full placeholder:text-neutral-400"
            />
          </div>

          {disableNav ? (
            store.logo_url ? (
              <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
            ) : (
              <span className={`${minimalHeading.className} text-2xl font-light tracking-[0.15em] text-neutral-900`}>
                {store.site_title.toLowerCase()}
              </span>
            )
          ) : (
            <Link href={basePath || "/"} className={`${minimalHeading.className} text-2xl font-light tracking-[0.15em] text-neutral-900`}>
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
              ) : (
                store.site_title.toLowerCase()
              )}
            </Link>
          )}

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-neutral-500 hover:text-neutral-900 transition-colors" aria-label="Mi cuenta">
              <span className="text-sm">Cuenta</span>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {!disableNav && (
        <div className="hidden md:block border-t border-neutral-100">
          <nav className="container mx-auto px-6 flex items-center justify-center gap-8 h-12" aria-label="Categorias de la tienda">
            <Link href={basePath || "/"} className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors">
              Inicio
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="text-xs uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {mobileMenuOpen && !disableNav && (
        <div className="md:hidden py-4 border-t border-neutral-100 bg-white">
          <nav className="flex flex-col gap-1 px-4">
            <Link href={basePath || "/"} className="px-3 py-2 text-xs uppercase tracking-widest hover:bg-neutral-50">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-3 py-2 text-xs uppercase tracking-widest hover:bg-neutral-50"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
