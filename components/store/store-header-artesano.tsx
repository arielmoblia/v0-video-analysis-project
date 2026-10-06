"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"
import { artesanoHeading } from "@/lib/fonts/artesano"

interface StoreHeaderArtesanoProps {
  store: Store
  categories: Category[]
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

// Header inspirado en la demo real de mueblería (websitedemos.net/furniture-shop-04):
// logo a la izquierda en tipografía serif, buscador visible al centro y links
// de texto plano (sin píldoras ni franja de color arriba), distinto del header
// de "Bold" (franja rosa + logo circular centrado) y de "Elegante"/"Moderno".
export function StoreHeaderArtesano({
  store,
  categories,
  accentColor = "#C19A83",
  accentColor2 = "#4A3427",
  disableNav = false,
}: StoreHeaderArtesanoProps) {
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
    <header className="sticky top-0 z-50 bg-[#FAF6F1] border-b-2" style={{ borderColor: accentColor }}>
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
            store.logo_url ? (
              <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
            ) : (
              <span className={`${artesanoHeading.className} text-2xl tracking-wide`} style={{ color: accentColor2 }}>
                {store.site_title}
              </span>
            )
          ) : (
            <Link href={basePath || "/"} className={`${artesanoHeading.className} text-2xl tracking-wide`} style={{ color: accentColor2 }}>
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.site_title || "Logo"} className="h-12 w-auto object-contain" />
              ) : (
                store.site_title
              )}
            </Link>
          )}

          {!disableNav && (
            <nav className="hidden md:flex items-center gap-7" aria-label="Categorias de la tienda">
              <Link href={basePath || "/"} className="text-sm font-medium text-[#4A3427] hover:opacity-70 transition-opacity">
                Inicio
              </Link>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="text-sm font-medium text-[#4A3427] hover:opacity-70 transition-opacity"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center border border-[#e3d8cd] rounded-sm px-3 py-2 gap-2 w-48 bg-white">
              <Search className="h-4 w-4 text-[#a99a8c] shrink-0" />
              <input
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar productos"
                className="bg-transparent text-sm outline-none w-full placeholder:text-[#a99a8c]"
              />
            </div>

            <Button
              size="icon"
              className="relative rounded-sm"
              style={{ backgroundColor: accentColor }}
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-[#FAF6F1]"
                  style={{ backgroundColor: accentColor2 }}
                >
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && !disableNav && (
        <div className="md:hidden py-4 border-t border-[#e3d8cd] bg-white">
          <nav className="flex flex-col gap-1 px-4">
            <Link href={basePath || "/"} className="px-3 py-2 rounded-sm text-sm font-medium hover:bg-[#FAF6F1]">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-3 py-2 rounded-sm text-sm font-medium hover:bg-[#FAF6F1]"
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
