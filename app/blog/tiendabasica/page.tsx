import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import TiendaBasicaClient from "./page-client"

export const metadata: Metadata = {
  title: "Tienda Básica: llevar el sistema de tol.ar a toda Latinoamérica (2026)",
  description:
    "La idea de Tienda Básica: un portal donde cada país de Latinoamérica elige su tienda, con el mismo motor de tol.ar por dentro, y sus propios medios de pago, envíos y facturación.",
  keywords:
    "tienda basica, tol.ar latinoamerica, tienda online chile, expansion tol.ar, ecommerce latinoamerica",
  alternates: {
    canonical: "https://tol.ar/blog/tiendabasica",
  },
  openGraph: {
    title: "Tienda Básica: llevar el sistema de tol.ar a toda Latinoamérica",
    description:
      "Un portal donde cada país elige su tienda, con el mismo motor de tol.ar y sus propios medios de pago, envíos y facturación.",
    type: "article",
    url: "https://tol.ar/blog/tiendabasica",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Tienda Básica", item: "https://tol.ar/blog/tiendabasica" },
  ],
}

export default function TiendaBasicaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tienda Básica: llevar el sistema de tol.ar a toda Latinoamérica",
    description:
      "Un portal donde cada país elige su tienda, con el mismo motor de tol.ar y sus propios medios de pago, envíos y facturación.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-31",
    dateModified: "2026-08-31",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/tiendabasica" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TiendaBasicaClient />
      <SeoExtraBlock page="blog-tiendabasica" />
    </>
  )
}
