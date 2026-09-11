"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderEleganteProps {
  store: Store
  categories: Category[]
  accentColor?: string
  disableNav?: boolean
}

const NAVY = "#151a4d"

// Header inspirado en tiendas de relojería premium: franja superior oscura,
// logo centrado, y una barra de navegación en el mismo tono debajo.
export function StoreHeaderElegante({ store, categories, accentColor = "#f7791e", disableNav = false }: StoreHeaderEleganteProps) {
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
      <div className="text-center text-[11px] tracking-wide py-1.5 px-4 text-white" style={{ backgroundColor: NAVY }}>
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
              <span className="font-bold text-2xl tracking-wide" style={{ color: NAVY }}>
                {store.site_title}
              </span>
            ) : (
              <Link href={basePath || "/"} className="font-bold text-2xl tracking-wide" style={{ color: NAVY }}>
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
                <span className="absolute -top-1 -right-1 bg-white text-neutral-900 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border border-neutral-200">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <nav
        className="hidden md:flex items-center justify-center gap-1 py-2 text-white"
        style={{ backgroundColor: NAVY }}
        aria-label="Categorias de la tienda"
      >
        {disableNav ? (
          <span className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide">Todo</span>
        ) : (
          <Link href={basePath || "/"} className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide hover:opacity-70 transition-opacity">
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
              className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide hover:opacity-70 transition-opacity"
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
