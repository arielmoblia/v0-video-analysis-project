import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { MigrarSistema } from "@/components/landing/migrar-sistema"

export const metadata: Metadata = {
  title: "Importar productos | Migrar a tol.ar",
  description: "Importá tus productos desde Mercado Libre, Tiendanube, Empretienda o cualquier CSV. La IA detecta el tipo de producto automáticamente.",
}

export default function MigrarSistemaPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header fullMenu={true} />
      <MigrarSistema />
      <Footer />
    </main>
  )
}
