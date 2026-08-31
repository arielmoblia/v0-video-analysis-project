"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Shirt, Footprints, Smartphone, Sparkles } from "lucide-react"

interface HeaderProps {
  fullMenu?: boolean  // true = muestra todo, false = solo plan gratis y contacto
  basePath?: string   // para el modo desarrollo (ej: /arielmobilia)
}

const RUBROS = [
  { id: "clothing", label: "Ropa", icon: Shirt, href: "/vender-ropa-online" },
  { id: "footwear", label: "Calzado", icon: Footprints, href: "/vender-calzado-online" },
  { id: "electronics", label: "Electrónicos", icon: Smartphone, href: "/vender-electronicos-online" },
  { id: "cosmetics", label: "Cosméticos", icon: Sparkles, href: "/vender-cosmeticos-online" },
]

export function Header({ fullMenu = false, basePath = "" }: HeaderProps) {
  const [paginasMenu, setPaginasMenu] = useState<{slug: string; nombreLink: string}[] | null>(null)
  const [seoPagesMenu, setSeoPagesMenu] = useState<{url: string; nav_label: string}[]>([])
  const [rubroMenuOpen, setRubroMenuOpen] = useState(false)
  const rubroMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rubroMenuRef.current && !rubroMenuRef.current.contains(e.target as Node)) {
        setRubroMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    fetch("/api/super-admin/geo-publicar?tipo=menu")
      .then(r => r.json())
      .then(d => { if (d.paginas) setPaginasMenu(d.paginas) })
      .catch(() => {})
    fetch("/api/super-admin/seo-pages")
      .then(r => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return
        const menuPages = data.filter(p => p.show_in_header).sort((a, b) => (a.nav_order ?? 99) - (b.nav_order ?? 99))
        setSeoPagesMenu(menuPages.map(p => ({ url: p.url, nav_label: p.nav_label || p.url.replace("/", "") })))
      })
      .catch(() => {})
  }, [])
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={basePath || "/"} className="flex items-center gap-2" aria-label="Ir al inicio de tol.ar">
          <Image 
            src="/tol-logo.png" 
            alt="tol.ar logo" 
            width={28} 
            height={28}
            priority
            quality={80}
            fetchPriority="high"
            loading="eager"
          />
          <span className="text-xl">
            <span className="font-bold">tol</span><span className="font-normal text-gray-500">.ar</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Navegacion principal de tol.ar" suppressHydrationWarning>
          <div className="relative" ref={rubroMenuRef}>
            <button
              type="button"
              onClick={() => setRubroMenuOpen(v => !v)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={rubroMenuOpen}
              aria-haspopup="true"
            >
              ¿Qué querés vender?
              <ChevronDown className={`h-4 w-4 transition-transform ${rubroMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {rubroMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-md border border-border bg-card shadow-lg py-1 z-50">
                {RUBROS.map(r => (
                  <Link
                    key={r.id}
                    href={r.href}
                    onClick={() => setRubroMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <r.icon className="h-4 w-4 text-muted-foreground" />
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {paginasMenu && paginasMenu.map(p => (
            <Link key={p.slug} href={`/${p.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
              {p.nombreLink}
            </Link>
          ))}
          {seoPagesMenu.map(p => (
            <Link key={p.url} href={p.url} className="text-muted-foreground hover:text-foreground transition-colors">
              {p.nav_label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
