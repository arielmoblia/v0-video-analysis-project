import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import QueEsElDropshippingClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "¿Qué es el Dropshipping? Explicado Fácil, Sin Vueltas (2026)",
  description:
    "Qué es el dropshipping explicado en criollo, sin tecnicismos: cómo vender productos sin tenerlos guardados en tu casa, ejemplos simples y cómo empezar en Argentina.",
  keywords:
    "que es el dropshipping, dropshipping explicado facil, dropshipping argentina, como funciona el dropshipping, vender sin stock argentina",
  alternates: {
    canonical: "https://tol.ar/blog/que-es-el-dropshipping",
  },
  openGraph: {
    title: "¿Qué es el Dropshipping? Explicado Fácil (2026)",
    description:
      "Vender productos sin tenerlos guardados en tu casa. Te lo explicamos con un ejemplo de todos los días, sin tecnicismos.",
    type: "article",
    url: "https://tol.ar/blog/que-es-el-dropshipping",
  },
}

const faqItems = [
  { q: "¿Qué es el dropshipping, explicado fácil?", a: "Es vender productos sin tenerlos guardados en tu casa. Vos los mostrás en tu tienda, cuando alguien compra, se lo pedís a un proveedor que ya los tiene, y ese proveedor se lo manda directo al cliente. Vos ganás la diferencia entre lo que cobraste y lo que pagaste." },
  { q: "¿Necesito plata para empezar con dropshipping?", a: "Muy poca, porque no comprás nada por adelantado. No hay que llenar un depósito de mercadería que capaz no se vende. Solo pagás el producto después de que alguien ya te lo compró y te pagó a vos." },
  { q: "¿Es legal el dropshipping en Argentina?", a: "Sí. Es una forma más de vender. Como cualquier venta, si querés facturar necesitás CUIT y monotributo, igual que en una tienda tradicional." },
  { q: "¿Cuál es la desventaja del dropshipping?", a: "Ganás menos por producto que si lo compraras al por mayor vos mismo, porque le comprás al proveedor a un precio de a uno. Y dependés de que el proveedor tenga stock y despache rápido, porque de eso depende que tu cliente reciba bien el pedido." },
  { q: "¿Cómo se hace dropshipping en tol.ar?", a: "tol.ar tiene una herramienta que clona el catálogo de un proveedor (la tienda madre) a tu tienda automáticamente, con los precios actualizados y el margen de ganancia que vos elijas. No tenés que cargar productos a mano." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "¿Qué es el Dropshipping?", item: "https://tol.ar/blog/que-es-el-dropshipping" },
  ],
}

export default async function QueEsElDropshipping() {
  const brand = await getBrand()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "¿Qué es el Dropshipping? Explicado Fácil, Sin Vueltas",
    description: "Qué es el dropshipping explicado en criollo, sin tecnicismos, con ejemplos de todos los días.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/que-es-el-dropshipping" },
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
      <QueEsElDropshippingClient brand={brand} />
      <SeoExtraBlock page="blog-que-es-el-dropshipping" />
    </>
  )
}
