"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderDianiProps {
  store: Store
  categories: Category[]
  disableNav?: boolean
}

// Header "Minimalista" (diani): una sola fila (no dos como Minimal), barra de
// anuncio arriba, logo en serif centrado, nav en minúsculas, cero color de
// acento — todo en negro/blanco, igual a dianiswim.com.
export function StoreHeaderDiani({ store, categories, disableNav = false }: StoreHeaderDianiProps) {
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
      <div className="bg-[#111] text-white text-center text-[11px] tracking-wide py-1.5">
        Envío gratis en compras superiores a $50.000
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-6 border-b border-neutral-100">
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

          {!disableNav && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Categorias de la tienda">
              <Link href={basePath || "/"} className="text-[13px] lowercase tracking-wide text-[#222] hover:opacity-60 transition-opacity">
                inicio
              </Link>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="text-[13px] lowercase tracking-wide text-[#222] hover:opacity-60 transition-opacity"
                >
                  {cat.name.toLowerCase()}
                </Link>
              ))}
            </nav>
          )}

          {disableNav ? (
            store.logo_url ? (
              <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-10 w-auto object-contain" />
            ) : (
              <span className="font-serif text-xl text-[#222] tracking-wide">{store.site_title.toLowerCase()}</span>
            )
          ) : (
            <Link href={basePath || "/"} className="font-serif text-xl text-[#222] tracking-wide md:absolute md:left-1/2 md:-translate-x-1/2">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-10 w-auto object-contain" />
              ) : (
                store.site_title.toLowerCase()
              )}
            </Link>
          )}

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-[#222] hover:opacity-60 transition-opacity" aria-label="Buscar">
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#222] hover:opacity-60 transition-opacity"
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#111] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && !disableNav && (
        <div className="md:hidden py-4 border-b border-neutral-100 bg-white">
          <nav className="flex flex-col gap-1 px-4">
            <Link href={basePath || "/"} className="px-3 py-2 text-[13px] lowercase hover:bg-neutral-50">
              inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-3 py-2 text-[13px] lowercase hover:bg-neutral-50"
              >
                {cat.name.toLowerCase()}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
