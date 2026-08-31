import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import ScrapingBlogClient from "./page-client"

export const metadata: Metadata = {
  title: "Scraping en tol.ar: Cómo Clonamos un Catálogo Completo (2026)",
  description:
    "Cómo funciona el motor de scraping de tol.ar para clonar el catálogo de otra tienda: qué significa para quien vende y cómo está construido por dentro para quien programa.",
  keywords:
    "scraping tienda online argentina, clonado de catalogo, scraping para dropshipping, motor de clonado tol.ar, como clonar una tienda online",
  alternates: {
    canonical: "https://tol.ar/blog/scraping",
  },
  openGraph: {
    title: "Scraping en tol.ar: Cómo Clonamos un Catálogo Completo",
    description:
      "El motor que copia el catálogo de otra tienda a la tuya en minutos: fotos, precios, stock y categorías, actualizado solo todos los días.",
    type: "article",
    url: "https://tol.ar/blog/scraping",
  },
}

const faqItems = [
  { q: "¿Necesito saber programar para usar el scraping?", a: "No. Es pegar un link desde tu panel y esperar unos minutos. Todo el trabajo técnico lo hacemos nosotros." },
  { q: "¿Con qué frecuencia se actualiza el catálogo clonado?", a: "Todos los días. Un proceso automático revisa cada tienda clonada y trae los cambios reales de precio y stock desde la tienda de origen." },
  { q: "¿De qué plataformas puede clonar tol.ar una tienda?", a: "Hoy el motor soporta las plataformas de e-commerce más usadas del mercado. Sitios headless/CSR con el precio inyectado del lado del cliente todavía no tienen una estrategia de extracción propia." },
  { q: "¿Cómo descubre qué productos tiene una tienda?", a: "A partir del sitemap.xml público de la tienda de origen, no rastreando enlaces a ciegas. Eso también permite el re-scrapeo incremental." },
  { q: "¿Puede vender con stock que en realidad no existe?", a: "El motor solo usa el número de stock que la fuente publica explícitamente por variante. Si ese dato no está publicado, no se completa con un valor por defecto." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Scraping", item: "https://tol.ar/blog/scraping" },
  ],
}

export default function ScrapingBlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Scraping en tol.ar: cómo clonamos un catálogo entero en minutos",
    description:
      "El motor que copia el catálogo de otra tienda a la tuya en minutos: fotos, precios, stock y categorías, actualizado solo todos los días.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-06",
    dateModified: "2026-08-06",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/scraping" },
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
      <ScrapingBlogClient />
      <SeoExtraBlock page="blog-scraping" />
    </>
  )
}
