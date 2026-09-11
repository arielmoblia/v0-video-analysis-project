"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"
import { vintageHeading } from "@/lib/fonts/vintage"

interface StoreHeaderVintageProps {
  store: Store
  categories: Category[]
  accentColor?: string
  disableNav?: boolean
}

// Header sobre fondo crema, logo en tipografía serif, tal cual la demo real
// de florería (floral.weblium.site). Sin buscador, con menú simple a la
// derecha — distinto del header negro de Luxury y del header en 2 filas de
// Minimal.
export function StoreHeaderVintage({ store, categories, accentColor = "#cc3833", disableNav = false }: StoreHeaderVintageProps) {
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
    <header className="sticky top-0 z-50 bg-[#f6f1ed]">
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

          {disableNav ? (
            <span className={`${vintageHeading.className} text-2xl text-[#4a4632]`}>{store.site_title}</span>
          ) : (
            <Link href={basePath || "/"} className={`${vintageHeading.className} text-2xl text-[#4a4632]`}>
              {store.site_title}
            </Link>
          )}

          {!disableNav && (
            <nav className="hidden md:flex items-center gap-7" aria-label="Categorias de la tienda">
              <Link href={basePath || "/"} className="text-sm text-[#6f6c4e] hover:text-[#4a4632] transition-colors">
                Inicio
              </Link>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="text-sm text-[#6f6c4e] hover:text-[#4a4632] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
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
              <span className="absolute -top-1.5 -right-1.5 bg-[#4a4632] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-[#f6f1ed]">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && !disableNav && (
        <div className="md:hidden py-4 border-t border-[#e5dfd4] bg-white">
          <nav className="flex flex-col gap-1 px-4">
            <Link href={basePath || "/"} className="px-3 py-2 rounded-full text-sm hover:bg-[#f6f1ed]">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-3 py-2 rounded-full text-sm hover:bg-[#f6f1ed]"
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
