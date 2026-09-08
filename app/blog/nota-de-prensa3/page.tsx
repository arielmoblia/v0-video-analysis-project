
import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import NotaDePrensa3Client from "./page-client"
import { getBrand } from "@/lib/get-brand"

const SLUG = "nota-de-prensa3"

export const metadata: Metadata = {
  title: "tol.ar: 73 tiendas online nuevas se crearon en la plataforma gratuita en solo una semana",
  description:
    "La plataforma argentina para crear tiendas online sin costo ya suma 739 locales activos, la mayoría armados por personas sin experiencia en programación ni diseño.",
  alternates: { canonical: `https://tol.ar/blog/${SLUG}` },
  openGraph: {
    title: "tol.ar: 73 tiendas online nuevas se crearon en la plataforma gratuita en solo una semana",
    description:
      "La plataforma argentina para crear tiendas online sin costo ya suma 739 locales activos, la mayoría armados por personas sin experiencia en programación ni diseño.",
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
  headline: "tol.ar: 73 tiendas online nuevas se crearon en la plataforma gratuita en solo una semana",
  description:
    "La plataforma argentina para crear tiendas online sin costo ya suma 739 locales activos, la mayoría armados por personas sin experiencia en programación ni diseño.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-05",
  dateModified: "2026-09-05",
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
