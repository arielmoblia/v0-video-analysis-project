"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import { blinggHeading } from "@/lib/fonts/blingg"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderBlinggProps {
  store: Store
  categories: Category[]
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

// Colores reales sacados de la demo de WordPress (Astra theme) de
// websitedemos.net/blingg-jewelry-store-04: gris oscuro secundario para la
// franja superior y el nav, celeste primario para el carrito.
const SECONDARY = "#54595F"

// Header inspirado en la demo real "Blingg Jewelry Store": franja superior
// gris oscura, logo centrado en tipografía Roboto Slab, nav en el mismo gris
// debajo (igual patrón que "Elegante"/"Bold", con la paleta real de Blingg).
export function StoreHeaderBlingg({
  store,
  categories,
  accentColor = "#6EC1E4",
  accentColor2 = "#61CE70",
  disableNav = false,
}: StoreHeaderBlinggProps) {
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
    <header className="sticky top-0 z-50">
      <div className="text-center text-[11px] tracking-wide py-1.5 px-4 text-white" style={{ backgroundColor: SECONDARY }}>
        {store.banner_subtitle || "Envío gratis en compras seleccionadas"}
      </div>

      <div className="bg-white border-b border-neutral-100">
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

            <div className="hidden sm:flex items-center border border-neutral-200 rounded-full px-4 py-2 gap-2 w-56">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                className="bg-transparent text-sm outline-none w-full placeholder:text-neutral-400"
              />
            </div>

            {disableNav ? (
              <span className={`${blinggHeading.className} font-bold text-2xl tracking-wide`} style={{ color: SECONDARY }}>
                {store.site_title}
              </span>
            ) : (
              <Link href={basePath || "/"} className={`${blinggHeading.className} font-bold text-2xl tracking-wide`} style={{ color: SECONDARY }}>
                {store.site_title}
              </Link>
            )}

            <Button
              size="icon"
              className="relative rounded-full"
              style={{ backgroundColor: accentColor }}
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  style={{ backgroundColor: accentColor2 }}
                >
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <nav
        className="hidden md:flex items-center justify-center gap-1 py-2 text-white"
        style={{ backgroundColor: SECONDARY }}
        aria-label="Categorias de la tienda"
      >
        {disableNav ? (
          <span className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide">Todo</span>
        ) : (
          <Link href={basePath || "/"} className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors hover:text-[#61CE70]">
            Todo
          </Link>
        )}
        {categories.slice(0, 6).map((cat) =>
          disableNav ? (
            <span key={cat.id} className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide">
              {cat.name}
            </span>
          ) : (
            <Link
              key={cat.id}
              href={`${basePath}/categoria/${cat.slug}`}
              className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors hover:text-[#61CE70]"
            >
              {cat.name}
            </Link>
          ),
        )}
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-neutral-100 bg-white">
          <nav className="flex flex-col gap-1 px-4">
            {disableNav ? (
              <span className="px-3 py-2 rounded-lg text-sm font-medium">Todo</span>
            ) : (
              <Link href={basePath || "/"} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100">
                Todo
              </Link>
            )}
            {categories.map((cat) =>
              disableNav ? (
                <span key={cat.id} className="px-3 py-2 rounded-lg text-sm font-medium">
                  {cat.name}
                </span>
              ) : (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100"
                >
                  {cat.name}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
