import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { MigracionContent } from "@/components/landing/migracion-content"

export const metadata: Metadata = {
  title: "Cerro Mercado Shops? Migra a Tol.ar | Tu Tienda Online 0% Comision",
  description:
    "Te quedaste sin plataforma por el cierre de Mercado Shops? Recupera tu negocio en Tol.ar. Crea tu tienda online sin comisiones por venta y con dominio propio.",
  keywords: [
    "mercado shops cerro",
    "alternativa mercado shops",
    "mercado shops cierre",
    "migrar mercado shops",
    "tienda online sin comisiones",
    "alternativa tiendanube",
    "crear tienda online argentina",
    "ecommerce sin comision",
  ],
  alternates: {
    canonical: "https://tol.ar/alternativa-mercado-shops",
  },
  openGraph: {
    title: "Cerro Mercado Shops? Migra a Tol.ar",
    description:
      "Recupera tu negocio en Tol.ar. Crea tu tienda online sin comisiones por venta y con dominio propio. Migra hoy!",
    type: "article",
    url: "https://tol.ar/alternativa-mercado-shops",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Migra de Mercado Shops a Tol.ar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerro Mercado Shops? Migra a Tol.ar",
    description:
      "Recupera tu negocio en Tol.ar. Crea tu tienda online sin comisiones.",
  },
}

export default function AlternativaMercadoShopsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Tu tienda de Mercado Shops cerro? Recupera tu negocio hoy en Tol.ar",
    description:
      "El cierre de Mercado Shops dejo a miles de vendedores sin plataforma. En Tol.ar te ofrecemos la plataforma mas estable y rapida para volver a vender online.",
    author: {
      "@type": "Organization",
      name: "tol.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://tol.ar/tol-logo.png",
      },
    },
    datePublished: "2025-02-01",
    dateModified: new Date().toISOString(),
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <MigracionContent />
      <Footer />
    </main>
  )
}
