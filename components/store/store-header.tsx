"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderProps {
  store: Store
  categories: Category[]
}

export function StoreHeader({ store, categories }: StoreHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
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
    <>
      {store.top_bar_enabled !== false && (
        <div className="bg-black text-white text-center py-2.5 text-sm tracking-wide">
          {store.top_bar_text || "Envío gratis en compras mayores a $50.000"}
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
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

            <Link href={basePath || "/"} className="font-light text-2xl tracking-[0.2em] uppercase text-black">
              {store.site_title}
            </Link>

            <nav className="hidden md:flex items-center gap-8" aria-label="Navegacion principal de la tienda">
              <Link href={basePath || "/"} className="text-sm tracking-wide hover:opacity-60 transition-opacity">
                Inicio
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setProductsMenuOpen(true)}
                onMouseLeave={() => setProductsMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm tracking-wide hover:opacity-60 transition-opacity" aria-label="Ver categorias de productos" aria-expanded={productsMenuOpen}>
                  Productos
                  <ChevronDown className={`h-4 w-4 transition-transform ${productsMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {productsMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-md shadow-lg min-w-[200px] py-2 z-50">
                    <Link
                      href={basePath || "/"}
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    >
                      Todos los productos
                    </Link>
                    {categories.length > 0 && <div className="border-t border-neutral-100 my-2" />}
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`${basePath}/categoria/${cat.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} aria-label={searchOpen ? "Cerrar buscador" : "Buscar productos"} aria-expanded={searchOpen}>
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}>
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {searchOpen && (
            <div className="py-4 border-t">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full bg-neutral-50 border-none py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                autoFocus
              />
            </div>
          )}

          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t">
              <nav className="flex flex-col gap-4">
                <Link href={basePath || "/"} className="text-sm tracking-wide py-2">
                  Inicio
                </Link>
                <div className="border-t border-neutral-100 pt-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Productos</span>
                </div>
                <Link href={basePath || "/"} className="text-sm tracking-wide py-2 pl-2">
                  Todos los productos
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`${basePath}/categoria/${cat.slug}`}
                    className="text-sm tracking-wide py-2 pl-2"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
