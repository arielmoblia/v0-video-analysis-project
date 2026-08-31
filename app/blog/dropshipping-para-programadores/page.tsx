import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import DropshippingParaProgramadoresClient from "./page-client"

export const metadata: Metadata = {
  title: "Dropshipping en tol.ar Para Programadores: Cómo Funciona el Motor (2026)",
  description:
    "Cómo funciona por dentro el motor de dropshipping de tol.ar: plataformas soportadas, stock real vs. inventado, detección de bloqueos, cola de reintentos, re-scrapeo diario y auto-suspensión de seguridad.",
  keywords:
    "dropshipping para programadores, motor de scraping tol.ar, como funciona el dropshipping tecnico, dropshipping argentina desarrolladores",
  alternates: {
    canonical: "https://tol.ar/blog/dropshipping-para-programadores",
  },
  openGraph: {
    title: "Dropshipping en tol.ar Para Programadores",
    description:
      "Cómo funciona por dentro el motor de clonado: plataformas soportadas, stock real, bloqueos, reintentos y auto-suspensión de seguridad.",
    type: "article",
    url: "https://tol.ar/blog/dropshipping-para-programadores",
  },
}

const faqItems = [
  { q: "¿De qué plataformas puede clonar tol.ar una tienda?", a: "Soporta las plataformas de e-commerce más usadas del mercado. Cada una publica sus datos distinto y el motor de scraping sabe leer todas." },
  { q: "¿Qué pasa si la tienda de origen tiene problemas de conexión?", a: "Se distingue un corte real y persistente de un simple problema de red pasajero. Si el corte persiste en el re-scrapeo diario, la tienda clonada se suspende sola hasta volver a poder traer datos frescos." },
  { q: "¿Puede vender con stock que en realidad no existe?", a: "Se prioriza el dato de stock real que publica la fuente. Cuando esa fuente no publica ningún dato de stock, se marca esa diferencia en vez de inventar un número." },
  { q: "¿Con qué frecuencia se actualizan precio y stock?", a: "Todos los días, con un proceso automático que recorre todas las tiendas ya clonadas y vuelve a traer los datos actualizados de cada una." },
  { q: "¿Si un clonado falla, hay que reintentarlo a mano?", a: "No. Los clonados que fallan quedan en una cola que se reintenta sola cada 2 horas, hasta un límite de intentos, antes de avisar que se dio por vencido." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Dropshipping para programadores", item: "https://tol.ar/blog/dropshipping-para-programadores" },
  ],
}

export default function DropshippingParaProgramadores() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dropshipping en tol.ar Para Programadores: Cómo Funciona el Motor",
    description: "Cómo funciona por dentro el motor de dropshipping de tol.ar: plataformas soportadas, stock real, bloqueos, reintentos y auto-suspensión de seguridad.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-07-22",
    dateModified: "2026-07-22",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/dropshipping-para-programadores" },
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
      <DropshippingParaProgramadoresClient />
      <SeoExtraBlock page="blog-dropshipping-para-programadores" />
    </>
  )
}
