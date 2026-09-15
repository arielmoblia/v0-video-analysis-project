import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import RemitosYGuiasClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Remito y Guía de Envío desde el Pedido, sin Salir de tol.ar (2026)",
  description:
    "Cómo imprimir el remito de un pedido y generar la guía de envío con Enviamelo directamente desde el panel de tu tienda tol.ar, sin cargar los datos a mano.",
  keywords:
    "remito tienda online, guia de envio enviamelo, enviamelo integracion, imprimir remito pedido, guia de envio tol.ar",
  alternates: {
    canonical: "https://tol.ar/blog/remitos-y-guias-de-envio",
  },
  openGraph: {
    title: "Remito y Guía de Envío desde el Pedido, sin Salir de tol.ar",
    description:
      "Imprimí el remito y generá la guía de envío de cada pedido directamente desde tu panel, sin cargar los datos a mano en otro sitio.",
    type: "article",
    url: "https://tol.ar/blog/remitos-y-guias-de-envio",
  },
}

const faqItems = [
  { q: "¿El remito reemplaza a una factura?", a: "No. El remito es un comprobante interno de tol.ar, sin validez fiscal ante AFIP. Sirve para dejar constancia del pedido, no para facturar." },
  { q: "¿El botón Remito aparece solo si uso Enviamelo?", a: "No, aparece en todos los pedidos de todas las tiendas, uses o no envío, y con cualquier transportista." },
  { q: "¿El botón Guía aparece siempre?", a: "Aparece en cualquier pedido que no sea retiro en local. Copia los datos del cliente y te lleva directo a la web de Enviamelo para pegarlos ahí." },
  { q: "¿Se puede generar la guía sin entrar a la web de Enviamelo?", a: "Se está probando esa versión en una tienda de prueba, porque cada guía real generada se cobra en la cuenta de Enviamelo de la tienda." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Remitos y guías de envío", item: "https://tol.ar/blog/remitos-y-guias-de-envio" },
  ],
}

export default async function RemitosYGuiasPage() {
  const brand = await getBrand()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Remito y guía de envío: imprimí todo desde el pedido, sin salir de tol.ar",
    description:
      "Imprimí el remito y generá la guía de envío de cada pedido directamente desde tu panel, sin cargar los datos a mano en otro sitio.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-26",
    dateModified: "2026-08-26",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/remitos-y-guias-de-envio" },
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
      <RemitosYGuiasClient brand={brand} />
      <SeoExtraBlock page="blog-remitos-y-guias-de-envio" />
    </>
  )
}
