import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import NotaDePrensa1Client from "./page-client"
import { getBrand } from "@/lib/get-brand"

const SLUG = "nota-de-prensa1"

export const metadata: Metadata = {
  title: "Nueva plataforma para tiendas online realmente gratis para emprendedores",
  description:
    "Hace 12 meses se lanzó tol.ar, una plataforma pensada para que cualquier emprendedor pueda armar su tienda online sin necesidad de presupuesto.",
  alternates: { canonical: `https://tol.ar/blog/${SLUG}` },
  openGraph: {
    title: "Nueva plataforma para tiendas online realmente gratis para emprendedores",
    description:
      "Hace 12 meses se lanzó tol.ar, una plataforma pensada para que cualquier emprendedor pueda armar su tienda online sin necesidad de presupuesto.",
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
  headline: "Nueva plataforma para tiendas online realmente gratis para emprendedores",
  description:
    "Hace 12 meses se lanzó tol.ar, una plataforma pensada para que cualquier emprendedor pueda armar su tienda online sin necesidad de presupuesto.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-29",
  dateModified: "2026-08-29",
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://tol.ar/blog/${SLUG}` },
}

export default async function NotaDePrensa1Page() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NotaDePrensa1Client brand={brand} />
      <SeoExtraBlock page={`blog-${SLUG}`} />
    </>
  )
}
