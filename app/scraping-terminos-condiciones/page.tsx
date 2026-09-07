import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import ScrapingTerminosClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Términos y Condiciones — Programa de Reventa Online | Tienda Online",
  description:
    "Términos y condiciones del programa de reventa online de Tienda Online (tiendaonline.com.ar): cómo publicamos tus productos, comisión, plazo, actualización de precios y protección de datos.",
  alternates: {
    canonical: "https://tol.ar/scraping-terminos-condiciones",
  },
  openGraph: {
    title: "Términos y Condiciones — Programa de Reventa Online",
    description:
      "Condiciones del programa por el cual Tienda Online publica y vende tus productos por internet sin costo para tu negocio.",
    type: "article",
    url: "https://tol.ar/scraping-terminos-condiciones",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Términos y condiciones — Programa de reventa online", item: "https://tol.ar/scraping-terminos-condiciones" },
  ],
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ScrapingTerminosClient brand={brand} />
      <SeoExtraBlock page="scraping-terminos-condiciones" />
    </>
  )
}
