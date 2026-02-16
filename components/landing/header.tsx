"use client"

import Link from "next/link"
import Image from "next/image"
import { Handshake, Layout, RefreshCw } from "lucide-react"

interface HeaderProps {
  fullMenu?: boolean  // true = muestra todo, false = solo plan gratis y contacto
  basePath?: string   // para el modo desarrollo (ej: /arielmobilia)
}

export function Header({ fullMenu = false, basePath = "" }: HeaderProps) {
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
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Navegacion principal de tol.ar">
          {fullMenu && (
            <>
              <Link
                href={`${basePath}/templates`}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Layout className="h-4 w-4" />
                templates
              </Link>
            </>
          )}
          <Link href={fullMenu ? `${basePath}/plan-gratis` : "/plan-gratis"} className="text-muted-foreground hover:text-foreground transition-colors">
            plan gratis
          </Link>
          {fullMenu && (
            <>
              <Link href={`${basePath}/plan-cositas`} className="text-muted-foreground hover:text-foreground transition-colors">
                plan cositas
              </Link>
              <Link
                href={`${basePath}/plan-socio`}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <Handshake className="h-4 w-4" />
                plan socio
              </Link>
              <Link href={`${basePath}/plan-a-medida`} className="text-muted-foreground hover:text-foreground transition-colors">
                personalizado
              </Link>
              <Link
                href={`${basePath}/migrar`}
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                migrar
              </Link>
            </>
          )}
          <Link href={fullMenu ? `${basePath}/contacto` : "/contacto"} className="text-muted-foreground hover:text-foreground transition-colors">
            contacto
          </Link>
        </nav>
      </div>
    </header>
  )
}
