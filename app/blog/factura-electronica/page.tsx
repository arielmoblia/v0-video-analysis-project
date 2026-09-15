import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import FacturaElectronicaClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Factura Electrónica en tol.ar: Facturá Legal Sin Complicarte con AFIP (2026)",
  description:
    "Cómo va a funcionar la facturación electrónica conectada a AFIP en tol.ar: qué es el CAE, quién factura, y los pasos para autorizar el sistema desde tu cuenta de AFIP.",
  keywords:
    "factura electronica argentina, CAE afip, facturacion electronica tienda online, monotributo factura electronica, tol.ar afip",
  alternates: {
    canonical: "https://tol.ar/blog/factura-electronica",
  },
  openGraph: {
    title: "Factura Electrónica en tol.ar: Facturá Legal Sin Complicarte con AFIP",
    description:
      "Cómo va a funcionar la facturación electrónica conectada a AFIP en tol.ar: qué es el CAE, quién factura, y los pasos para autorizarlo.",
    type: "article",
    url: "https://tol.ar/blog/factura-electronica",
  },
}

const faqItems = [
  { q: "¿El remito y la factura electrónica son lo mismo?", a: "No. El remito es un comprobante interno sin validez fiscal. La factura electrónica está conectada a AFIP y emite un comprobante legal con CAE." },
  { q: "¿tol.ar factura con su propio CUIT?", a: "No. Cada factura sale del CUIT del dueño de la tienda. tol.ar la emite en su nombre, con su autorización previa en AFIP." },
  { q: "¿El trámite en AFIP tiene costo?", a: "No, es gratuito y se hace online, sin ir a ninguna oficina." },
  { q: "¿Ya está activo el sistema?", a: "Todavía no, está en desarrollo. Se avisa en el panel de cada tienda cuando se pueda empezar a usar." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Factura electrónica", item: "https://tol.ar/blog/factura-electronica" },
  ],
}

export default async function FacturaElectronicaPage() {
  const brand = await getBrand()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Factura electrónica en tol.ar: facturá legal, sin complicarte con AFIP",
    description:
      "Cómo va a funcionar la facturación electrónica conectada a AFIP en tol.ar: qué es el CAE, quién factura, y los pasos para autorizarlo.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/factura-electronica" },
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
      <FacturaElectronicaClient brand={brand} />
      <SeoExtraBlock page="blog-factura-electronica" />
    </>
  )
}
