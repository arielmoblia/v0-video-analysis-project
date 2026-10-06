"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"
import { luxuryHeading } from "@/lib/fonts/luxury"

interface StoreHeaderLuxuryProps {
  store: Store
  categories: Category[]
  disableNav?: boolean
}

// Header negro, logo centrado en mayúsculas con tracking amplio, menú en
// texto blanco fino a los costados — tal cual la demo real de moda
// (belle-demo-2.myshopify.com). Sin buscador visible ni color de acento en
// el header, a diferencia de todos los demás temples.
export function StoreHeaderLuxury({ store, categories, disableNav = false }: StoreHeaderLuxuryProps) {
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
    <header className="sticky top-0 z-50 bg-[#111111] text-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {!disableNav && (
            <nav className="hidden md:flex items-center gap-7" aria-label="Categorias de la tienda">
              <Link href={basePath || "/"} className="text-xs uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors">
                Inicio
              </Link>
              {categories.slice(0, 3).map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="text-xs uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          )}
          {disableNav && <div className="hidden md:block w-24" />}

          {disableNav ? (
            store.logo_url ? (
              <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
            ) : (
              <span className={`${luxuryHeading.className} text-2xl uppercase tracking-[0.2em] font-semibold`}>
                {store.site_title}
              </span>
            )
          ) : (
            <Link href={basePath || "/"} className={`${luxuryHeading.className} text-2xl uppercase tracking-[0.2em] font-semibold`}>
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
              ) : (
                store.site_title
              )}
            </Link>
          )}

          <div className="flex items-center gap-4 md:w-24 justify-end">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-white/70 transition-colors"
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ebb868] text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && !disableNav && (
        <div className="md:hidden py-4 border-t border-white/10 bg-[#111111]">
          <nav className="flex flex-col gap-1 px-4">
            <Link href={basePath || "/"} className="px-3 py-2 text-xs uppercase tracking-[0.15em] text-white/80 hover:bg-white/5">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-3 py-2 text-xs uppercase tracking-[0.15em] text-white/80 hover:bg-white/5"
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
