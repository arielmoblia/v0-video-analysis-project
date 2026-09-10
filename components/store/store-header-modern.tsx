"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderModernProps {
  store: Store
  categories: Category[]
  accentColor?: string
}

export function StoreHeaderModern({ store, categories, accentColor = "#111827" }: StoreHeaderModernProps) {
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href={basePath || "/"} className="font-bold text-xl text-neutral-900">
            {store.site_title}
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Categorias de la tienda">
            <Link
              href={basePath || "/"}
              className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Todo
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`${basePath}/categoria/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-neutral-100 rounded-full px-4 py-2 gap-2 w-56">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                className="bg-transparent text-sm outline-none w-full placeholder:text-neutral-400"
              />
            </div>

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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <nav className="flex flex-col gap-1">
              <Link href={basePath || "/"} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100">
                Todo
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
