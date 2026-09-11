"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart-provider"
import type { Store, Category } from "@/lib/store-context"

interface StoreHeaderBoldProps {
  store: Store
  categories: Category[]
  accentColor?: string
  accentColor2?: string
  disableNav?: boolean
}

// Header inspirado en tiendas juveniles de regalos personalizados: franja
// superior rosa con el mensaje de envío, logo redondo bicolor al centro,
// nav en pastillas debajo.
export function StoreHeaderBold({
  store,
  categories,
  accentColor = "#ec4899",
  accentColor2 = "#22c55e",
  disableNav = false,
}: StoreHeaderBoldProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [basePath, setBasePath] = useState(`/tienda/${store.subdomain}`)
  const { items, setCartOpen } = useCart()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const initial = (store.site_title || "T").trim().charAt(0).toUpperCase()

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div className="text-center text-[11px] font-semibold tracking-wide py-1.5 px-4 text-white" style={{ backgroundColor: accentColor }}>
        {store.banner_subtitle || "Envío a todo el país en compras seleccionadas"}
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

            <div className="hidden sm:flex items-center border-2 border-neutral-100 rounded-full px-4 py-2 gap-2 w-56 bg-neutral-50">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                className="bg-transparent text-sm outline-none w-full placeholder:text-neutral-400"
              />
            </div>

            {disableNav ? (
              <span className="flex items-center gap-2">
                <LogoBadge initial={initial} accentColor={accentColor} accentColor2={accentColor2} />
                <span className="font-extrabold text-2xl tracking-tight" style={{ color: accentColor }}>
                  {store.site_title}
                </span>
              </span>
            ) : (
              <Link href={basePath || "/"} className="flex items-center gap-2">
                <LogoBadge initial={initial} accentColor={accentColor} accentColor2={accentColor2} />
                <span className="font-extrabold text-2xl tracking-tight" style={{ color: accentColor }}>
                  {store.site_title}
                </span>
              </Link>
            )}

            <Button
              size="icon"
              className="relative rounded-full"
              style={{ backgroundColor: accentColor2 }}
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito de compras${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center justify-center gap-2 py-2.5 bg-neutral-50 border-b border-neutral-100" aria-label="Categorias de la tienda">
        {disableNav ? (
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: accentColor }}>
            Todo
          </span>
        ) : (
          <Link
            href={basePath || "/"}
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            Todo
          </Link>
        )}
        {categories.slice(0, 6).map((cat) =>
          disableNav ? (
            <span key={cat.id} className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-700 bg-white border border-neutral-200">
              {cat.name}
            </span>
          ) : (
            <Link
              key={cat.id}
              href={`${basePath}/categoria/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors"
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
              <span className="px-3 py-2 rounded-lg text-sm font-semibold">Todo</span>
            ) : (
              <Link href={basePath || "/"} className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100">
                Todo
              </Link>
            )}
            {categories.map((cat) =>
              disableNav ? (
                <span key={cat.id} className="px-3 py-2 rounded-lg text-sm font-semibold">
                  {cat.name}
                </span>
              ) : (
                <Link
                  key={cat.id}
                  href={`${basePath}/categoria/${cat.slug}`}
                  className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100"
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

function LogoBadge({ initial, accentColor, accentColor2 }: { initial: string; accentColor: string; accentColor2: string }) {
  return (
    <span
      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0"
      style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor2})` }}
    >
      {initial}
    </span>
  )
}
