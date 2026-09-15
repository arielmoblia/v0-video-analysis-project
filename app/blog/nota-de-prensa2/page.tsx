
import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import NotaDePrensa2Client from "./page-client"
import { getBrand } from "@/lib/get-brand"

const SLUG = "nota-de-prensa2"

export const metadata: Metadata = {
  title: "tol.ar suma el Plan Cositas: pagás solo por las funciones que tu tienda usa",
  description:
    "tol.ar presenta el Plan Cositas: en vez de un paquete cerrado, cada emprendedor elige y paga solo las funciones que su tienda online necesita.",
  alternates: { canonical: `https://tol.ar/blog/${SLUG}` },
  openGraph: {
    title: "tol.ar suma el Plan Cositas: pagás solo por las funciones que tu tienda usa",
    description:
      "tol.ar presenta el Plan Cositas: en vez de un paquete cerrado, cada emprendedor elige y paga solo las funciones que su tienda online necesita.",
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
  headline: "tol.ar suma el Plan Cositas: pagás solo por las funciones que tu tienda usa",
  description:
    "tol.ar presenta el Plan Cositas: en vez de un paquete cerrado, cada emprendedor elige y paga solo las funciones que su tienda online necesita.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://tol.ar/blog/${SLUG}` },
}

export default async function NotaDePrensa2Page() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <NotaDePrensa2Client brand={brand} />
      <SeoExtraBlock page={`blog-${SLUG}`} />
    </>
  )
}
