import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { MigracionContent } from "@/components/landing/migracion-content"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Migraciones | Migrá tu tienda a tol.ar",
  description:
    "Te quedaste sin plataforma? Migra tu tienda a Tol.ar. Sin comisiones por venta, dominio propio y soporte humano.",
}

export default async function ArielmobiliaMigrarPage() {
  const brand = await getBrand()
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="bg-amber-500 text-black text-center py-2 text-sm font-medium">
        MODO DESARROLLO - Esta es la version completa (no visible para clientes)
      </div>
      <Header fullMenu={true} basePath="/arielmobilia" brand={brand} />
      <MigracionContent />
      <Footer brand={brand} />
    </main>
  )
}
