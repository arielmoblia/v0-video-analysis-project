import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import DominioPropioClient from "./page-client"

export const metadata: Metadata = {
  title: "Dominio Propio para tu Tienda tol.ar: Guía Paso a Paso (2026)",
  description:
    "Cómo conectar tu propio dominio (comprado en nic.ar) a tu tienda de tol.ar en vez de usar tunombre.tol.ar. Beneficios y pasos, explicado para gente sin experiencia técnica.",
  keywords:
    "dominio propio tienda online, nic.ar, conectar dominio tol.ar, dominio .com.ar tienda, dns tienda online argentina",
  alternates: {
    canonical: "https://tol.ar/blog/dominio-propio",
  },
  openGraph: {
    title: "Dominio Propio para tu Tienda tol.ar: Guía Paso a Paso",
    description:
      "Cómo conectar tu propio dominio (comprado en nic.ar) a tu tienda de tol.ar, explicado paso a paso.",
    type: "article",
    url: "https://tol.ar/blog/dominio-propio",
  },
}

const faqItems = [
  { q: "¿Sirve cualquier dominio o solo los de nic.ar?", a: "Por ahora esta función solo está disponible para dominios comprados directo en nic.ar (los .com.ar, .ar, etc). Si tu dominio es de otro proveedor, escribinos y lo conectamos a mano." },
  { q: "¿Mi tienda deja de funcionar en tunombre.tol.ar?", a: "No. El dominio tunombre.tol.ar sigue funcionando igual que siempre, en paralelo. Tu dominio propio es una forma extra de llegar a la misma tienda." },
  { q: "¿Cuánto tarda en activarse?", a: "El DNS puede tardar desde minutos hasta unas horas en propagarse. Después, activar el certificado de seguridad (HTTPS) toma hasta 24-48hs." },
  { q: "¿Tiene costo?", a: "Sí, es una de las funciones pagas (\"cositas\") que se activan desde el panel de tu tienda." },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Dominio propio", item: "https://tol.ar/blog/dominio-propio" },
  ],
}

export default function DominioPropioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dominio propio para tu tienda tol.ar: guía paso a paso",
    description:
      "Cómo conectar tu propio dominio (comprado en nic.ar) a tu tienda de tol.ar, explicado paso a paso.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-30",
    dateModified: "2026-08-30",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/dominio-propio" },
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
      <DominioPropioClient />
      <SeoExtraBlock page="blog-dominio-propio" />
    </>
  )
}
