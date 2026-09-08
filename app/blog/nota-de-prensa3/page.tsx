
import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import NotaDePrensa3Client from "./page-client"
import { getBrand } from "@/lib/get-brand"

const SLUG = "nota-de-prensa3"

export const metadata: Metadata = {
  title: "tol.ar suma nuevas funciones para que cualquier tienda online cumpla con la ley y venda con más opciones de pago",
  description:
    "La plataforma argentina para crear tiendas online gratis incorporó un botón de arrepentimiento automático en todas sus tiendas y sumó el cobro con tarjeta al momento de la entrega, sin costo adicional para el dueño del negocio.",
  alternates: { canonical: `https://tol.ar/blog/${SLUG}` },
  openGraph: {
    title: "tol.ar suma nuevas funciones para que cualquier tienda online cumpla con la ley y venda con más opciones de pago",
    description:
      "La plataforma argentina para crear tiendas online gratis incorporó un botón de arrepentimiento automático en todas sus tiendas y sumó el cobro con tarjeta al momento de la entrega, sin costo adicional para el dueño del negocio.",
    type: "article",
    url: `https://tol.ar/blog/${SLUG}`,
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Nota de prensa", item: `https://tol.ar/blog/${SLUG}` },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "tol.ar suma nuevas funciones para que cualquier tienda online cumpla con la ley y venda con más opciones de pago",
  description:
    "La plataforma argentina para crear tiendas online gratis incorporó un botón de arrepentimiento automático en todas sus tiendas y sumó el cobro con tarjeta al momento de la entrega, sin costo adicional para el dueño del negocio.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-05",
  dateModified: "2026-09-08",
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://tol.ar/blog/${SLUG}` },
}

export default async function NotaDePrensa3Page() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NotaDePrensa3Client brand={brand} />
      <SeoExtraBlock page={`blog-${SLUG}`} />
    </>
  )
}
