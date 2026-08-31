import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import IaNoHaceMilagrosClient from "./page-client"

export const metadata: Metadata = {
  title: "La IA No Hace Milagros: Por Qué tu Tienda Sigue Vacía (2026)",
  description:
    "La IA te arma la tienda en minutos, pero no vende sola. Por qué cientos de tiendas online quedan a medio hacer y qué hace falta para que la tuya no sea una más.",
  keywords:
    "ia no reemplaza el trabajo, tienda online abandonada, por que no vendo online, ia para emprender argentina, esfuerzo emprendimiento online",
  alternates: {
    canonical: "https://tol.ar/blog/ia-no-hace-milagros-tienda-online-argentina",
  },
  openGraph: {
    title: "La IA No Hace Milagros: Por Qué tu Tienda Sigue Vacía (2026)",
    description:
      "La IA te da la herramienta. Vos tenés que usarla. Un análisis directo, sin vueltas, sobre por qué tantas tiendas online quedan a medio armar.",
    type: "article",
    url: "https://tol.ar/blog/ia-no-hace-milagros-tienda-online-argentina",
  },
}

const faqItems = [
  {
    q: "¿Por qué mi tienda online no vende si ya la armé con IA?",
    a: "Porque armar la tienda es el 10% del trabajo. El otro 90% es cargar productos con fotos reales, poner precios correctos, contarle a gente que existís y responder cuando alguien pregunta. La IA hace el 10%, no el resto.",
  },
  {
    q: "¿Es normal que la mayoría de las tiendas online creadas queden abandonadas?",
    a: "Sí, y no es un problema exclusivo de Argentina ni de una plataforma en particular. Estudios sobre proyectos armados con IA muestran que más de 6 de cada 10 se abandonan antes de los tres meses, y más del 80% de los ecommerce chicos fracasa en sus primeros tres años por falta de seguimiento, no por falta de herramienta.",
  },
  {
    q: "¿Qué hace falta además de la IA para que una tienda online funcione?",
    a: "Constancia. Cargar productos de verdad, sacar o conseguir fotos que se vean bien, avisarle a tus contactos que la tienda existe, contestar mensajes rápido y ajustar precios o stock cuando hace falta. Nada de eso lo hace la IA sola.",
  },
]

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "La IA No Hace Milagros",
      item: "https://tol.ar/blog/ia-no-hace-milagros-tienda-online-argentina",
    },
  ],
}

export default function IaNoHaceMilagros() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "La IA No Hace Milagros: Por Qué tu Tienda Sigue Vacía",
    description:
      "Por qué tener IA para armar una tienda online no garantiza que vendas: la diferencia entre tener la herramienta y usarla.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-08-05",
    dateModified: "2026-08-05",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://tol.ar/blog/ia-no-hace-milagros-tienda-online-argentina",
    },
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
      <IaNoHaceMilagrosClient />
      <SeoExtraBlock page="blog-ia-no-hace-milagros" />
    </>
  )
}
