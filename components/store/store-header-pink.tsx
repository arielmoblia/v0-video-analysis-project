"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, ChevronDown, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/components/store/cart-provider"
import { formatPrice } from "@/lib/currency"
import type { Store, Category } from "@/lib/store-context"

function useCustomerName(subdomain: string) {
  const [name, setName] = useState<string | null>(null)
  useEffect(() => {
    fetch(`/api/customer/me?subdomain=${subdomain}`)
      .then((r) => r.json())
      .then((data) => setName(data.customer?.name?.split(" ")[0] || null))
      .catch(() => {})
  }, [subdomain])
  return name
}

interface StoreHeaderPinkProps {
  store: Store
  categories: Category[]
}

// Cabecera "Pink": calco del header real de pinkonlineoficial.com.ar
// (logo en dos líneas, buscador grande siempre visible, cuenta y carrito
// con ícono circular rosa). Reutilizable: cualquier tienda puede sumarla
// más adelante, no quedó atada solo a Pink.
export function StoreHeaderPink({ store, categories }: StoreHeaderPinkProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [basePath, setBasePath] = useState(`/tienda/${store.subdomain}`)
  const { items, total, setCartOpen } = useCart()
  const customerName = useCustomerName(store.subdomain)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const [logoFirstWord, ...logoRest] = (store.site_title || "Tienda").trim().split(/\s+/)
  const logoSecondLine = logoRest.join(" ")

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
          <div className="flex items-center gap-6 h-24">
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href={basePath || "/"} className="shrink-0 leading-[0.85] font-black uppercase tracking-tight text-black">
              <span className="block text-xl">{logoFirstWord}</span>
              {logoSecondLine && <span className="block text-xl">{logoSecondLine}</span>}
            </Link>

            <div className="flex-1 hidden sm:block max-w-2xl">
              <div className="flex items-stretch border border-neutral-300 rounded-sm overflow-hidden">
                <input
                  type="search"
                  placeholder="¿Qué estás buscando?"
                  className="flex-1 min-w-0 px-4 text-sm placeholder:text-neutral-400 focus:outline-none"
                  aria-label="Buscar productos"
                />
                <button
                  type="button"
                  className="shrink-0 w-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4 text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-5 ml-auto">
              <Link
                href={`${basePath}/cuenta`}
                className="hidden sm:flex items-center gap-2"
                aria-label={customerName ? `Mi cuenta, ${customerName}` : "Entrá o registrate"}
              >
                <span className="h-9 w-9 rounded-full bg-[#e6007e] flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-white" />
                </span>
                {customerName ? (
                  <span className="block text-sm font-semibold text-black">Hola, {customerName}</span>
                ) : (
                  <span className="text-left leading-tight">
                    <span className="block text-sm font-semibold text-black">Entrá /</span>
                    <span className="block text-sm text-blue-600">Registrate</span>
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="flex items-center gap-2"
                onClick={() => setCartOpen(true)}
                aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
              >
                <span className="h-9 w-9 rounded-full bg-[#e6007e] flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold text-black">Carrito ({itemCount})</span>
                  <span className="block text-sm text-neutral-600">{formatPrice(total, store.country)}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="sm:hidden pb-4">
            <div className="flex items-stretch border border-neutral-300 rounded-sm overflow-hidden">
              <input
                type="search"
                placeholder="¿Qué estás buscando?"
                className="flex-1 min-w-0 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none"
                aria-label="Buscar productos"
              />
              <button type="button" className="shrink-0 w-12 flex items-center justify-center bg-neutral-100" aria-label="Buscar">
                <Search className="h-4 w-4 text-neutral-600" />
              </button>
            </div>
          </div>

          <nav
            className="hidden md:flex items-center gap-8 h-12 border-t border-neutral-100"
            aria-label="Navegacion principal de la tienda"
          >
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
                <div className="absolute top-full left-0 mt-0 bg-white border border-neutral-200 rounded-md shadow-lg min-w-[200px] py-2 z-50">
                  <Link href={basePath || "/"} className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors">
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
                  <Link key={cat.id} href={`${basePath}/categoria/${cat.slug}`} className="text-sm tracking-wide py-2 pl-2">
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
