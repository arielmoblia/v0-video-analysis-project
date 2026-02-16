import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { MigracionContent } from "@/components/landing/migracion-content"

export const metadata: Metadata = {
  title: "Migraciones | Alternativa a Mercado Shops y Tiendanube",
  description:
    "Te quedaste sin plataforma? Migra tu tienda a Tol.ar. Sin comisiones por venta, dominio propio y soporte humano.",
}

export default function ArielmobiliaMigrarPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="bg-amber-500 text-black text-center py-2 text-sm font-medium">
        MODO DESARROLLO - Esta es la version completa (no visible para clientes)
      </div>
      <Header fullMenu={true} basePath="/arielmobilia" />
      <MigracionContent />
      <Footer />
    </main>
  )
}
