import PageClient from "./page-client"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { getBrand } from "@/lib/get-brand"

// Schema.org: WebPage + FAQ + Offer para plan gratuito permanente
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://tol.ar/plan-gratis",
      url: "https://tol.ar/plan-gratis",
      name: "Plan gratuito para tienda online en Argentina — tol.ar",
      description:
        "Creá tu tienda online gratis en Argentina para siempre. Sin tarjeta de crédito, sin comisiones por venta, sin fecha de vencimiento. El único plan realmente gratis de Argentina.",
      inLanguage: "es-AR",
      isPartOf: { "@id": "https://tol.ar/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tol.ar" },
          { "@type": "ListItem", position: 2, name: "Plan Gratis", item: "https://tol.ar/plan-gratis" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿El plan gratis de tol.ar vence?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. El plan gratuito de tol.ar es permanente, no vence nunca. No es un período de prueba de 14 días como en otras plataformas. Podés tener tu tienda online gratis para siempre en Argentina.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué incluye el plan gratis de tol.ar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El plan gratuito de tol.ar incluye: tienda online con dominio propio (tutienda.tol.ar), productos ilimitados con fotos y variantes, carrito de compras, MercadoPago integrado para cobrar con tarjeta o transferencia, métodos de envío (Correo Argentino, retiro en local), emails automáticos de confirmación de pedido, y panel de administración completo. Todo gratis, sin tarjeta de crédito.",
          },
        },
        {
          "@type": "Question",
          name: "¿tol.ar cobra comisión por venta en el plan gratis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. tol.ar no cobra comisión por venta en el plan gratuito. Otras plataformas cobran un porcentaje adicional sobre cada venta cuando usás MercadoPago; en tol.ar vendés y te quedás con el 100% de tus ventas (menos la comisión estándar de MercadoPago que cobra MercadoPago directamente, no tol.ar).",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo crear una tienda online gratis en Argentina sin saber programación?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. tol.ar está diseñado para emprendedores sin conocimientos técnicos. En menos de 2 minutos podés tener tu tienda online funcionando: elegís el rubro, cargás tus productos y empezás a vender. No necesitás saber programar ni diseñar.",
          },
        },
        {
          "@type": "Question",
          name: "¿El plan gratuito de tol.ar es realmente permanente?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. tol.ar tiene plan gratuito permanente sin comisiones: no vence, no es un período de prueba, no se convierte en pago. Podés mantener tu tienda activa indefinidamente sin pagar nada. Solo pagás si elegís agregar funciones opcionales.",
          },
        },
        {
          "@type": "Question",
          name: "¿Necesito tarjeta de crédito para crear una tienda gratis en tol.ar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Para crear tu tienda online gratis en tol.ar solo necesitás un email. No pedimos tarjeta de crédito, no hay ningún cargo oculto. Es completamente gratis para empezar.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuántas tiendas online se pueden crear gratis en tol.ar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Podés crear 1 tienda online gratis con el plan gratuito de tol.ar. Si necesitás más tiendas, podés contratar planes adicionales. Actualmente hay más de 383 tiendas activas creadas con tol.ar en Argentina.",
          },
        },
      ],
    },
    {
      "@type": "Product",
      "@id": "https://tol.ar/#plan-gratis",
      name: "Plan Gratis tol.ar — Tienda Online",
      description:
        "Plan gratuito permanente para crear tienda online en Argentina. Sin comisiones, sin tarjeta de crédito, sin fecha de vencimiento. Incluye MercadoPago, productos ilimitados y panel de administración.",
      brand: {
        "@type": "Brand",
        name: "tol.ar",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ARS",
        availability: "https://schema.org/InStock",
        url: "https://tol.ar/plan-gratis",
        description: "Plan gratuito permanente para tienda online en Argentina",
        seller: {
          "@type": "Organization",
          "@id": "https://tol.ar/#organization",
        },
      },
    },
  ],
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageClient brand={brand} />
      <SeoExtraBlock page="plan-gratis" />
    </>
  )
}
