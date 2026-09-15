import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import CosasLegalesScrapingClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cosas Legales que Debés Saber Antes de Usar Scraping (Guía 2026)",
  description:
    "Guía legal clara sobre el scraping para clonar catálogos: derechos de autor sobre fotos y textos (Ley 11.723), uso de marcas (Ley 22.362), competencia desleal y responsabilidad ante el consumidor (Ley 24.240).",
  keywords:
    "scraping legal argentina, es legal el scraping, derechos de autor fotos productos, dropshipping legal argentina, competencia desleal scraping, ley 11723 fotografias",
  alternates: {
    canonical: "https://tol.ar/blog/cosas-legales-antes-de-usar-scraping",
  },
  openGraph: {
    title: "Cosas Legales que Debés Saber Antes de Usar Scraping",
    description:
      "Qué dice la ley argentina sobre copiar fotos, textos y catálogos de otra tienda: derechos de autor, marcas, competencia desleal y responsabilidad frente al comprador.",
    type: "article",
    url: "https://tol.ar/blog/cosas-legales-antes-de-usar-scraping",
  },
}

const faqItems = [
  { q: "¿Puedo usar las fotos de la tienda de origen en mi tienda clonada?", a: "No sin autorización. Las fotografías están protegidas por la Ley 11.723 de Propiedad Intelectual aunque estén publicadas en internet. Lo más seguro es usar fotos propias o del fabricante, o reemplazarlas cuando no tengas permiso." },
  { q: "¿Necesito autorización de la tienda madre para clonar su catálogo?", a: "No hay una ley puntual que lo exija para datos públicos como precio y stock, pero es la zona de mayor riesgo: sin acuerdo, un reclamo por competencia desleal es posible si la tienda madre considera que se perjudica su negocio. Tener autorización es lo más seguro." },
  { q: "Si el producto llega mal o no llega, ¿quién responde ante el cliente?", a: "Vos, como proveedor. El artículo 40 de la Ley 24.240 establece responsabilidad objetiva y solidaria en toda la cadena de comercialización, sin importar que no tengas stock propio ni hayas fabricado el producto." },
  { q: "¿Puedo mencionar la marca del producto que vendo?", a: "Sí, nombrar la marca de un producto genuino para identificarlo es lícito. El problema aparece si generás confusión sobre quién es el vendedor, por ejemplo dando a entender que sos la tienda oficial de esa marca (Ley 22.362)." },
  { q: "¿Qué pasa si la tienda madre me pide que deje de clonar su catálogo?", a: "Lo más prudente es dejar de hacerlo. Seguir después de un pedido expreso aumenta el riesgo de un reclamo por competencia desleal o, en casos extremos, por maquinaciones fraudulentas (art. 159 del Código Penal)." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Cosas legales antes de usar scraping", item: "https://tol.ar/blog/cosas-legales-antes-de-usar-scraping" },
  ],
}

export default async function CosasLegalesScraping() {
  const brand = await getBrand()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cosas Legales que Debés Saber Antes de Usar Scraping",
    description: "Qué dice la ley argentina sobre copiar fotos, textos y catálogos de otra tienda: derechos de autor, marcas, competencia desleal y responsabilidad frente al comprador.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-07-23",
    dateModified: "2026-07-23",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/cosas-legales-antes-de-usar-scraping" },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CosasLegalesScrapingClient brand={brand} />
      <SeoExtraBlock page="blog-cosas-legales-antes-de-usar-scraping" />
    </>
  )
}
