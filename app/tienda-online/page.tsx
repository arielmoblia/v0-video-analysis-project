import TiendaOnlinePage from "./page-client"

// Schema.org: WebPage + FAQ para "tienda online"
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://tol.ar/tienda-online",
      url: "https://tol.ar/tienda-online",
      name: "Crear una tienda online gratis en Argentina",
      description:
        "Creá tu tienda online en Argentina en 2 minutos. 100% gratis, sin tarjeta de crédito. Plataforma argentina para vender por internet.",
      inLanguage: "es-AR",
      isPartOf: { "@id": "https://tol.ar/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tol.ar" },
          { "@type": "ListItem", position: 2, name: "Tienda Online", item: "https://tol.ar/tienda-online" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es una tienda online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Una tienda online es un sitio web donde vendés tus productos o servicios por internet. Tus clientes pueden ver tus productos, agregarlos al carrito y pagar desde cualquier dispositivo, sin que tengas que estar presente. Con tol.ar podés crear tu tienda online gratis en Argentina en menos de 2 minutos.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta crear una tienda online en Argentina?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Con tol.ar podés crear tu tienda online gratis, sin tarjeta de crédito y sin límite de tiempo. El plan gratuito incluye productos ilimitados, carrito de compras, medios de pago (Mercado Pago, transferencia) y métodos de envío.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo crear una tienda online en Argentina?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para crear una tienda online en Argentina con tol.ar: 1) Elegí un template (ropa, calzado, cosméticos, electrónica), 2) Registrate con tu email, 3) Cargá tus productos. En menos de 2 minutos tenés tu tienda online funcionando en mitienda.tol.ar.",
          },
        },
        {
          "@type": "Question",
          name: "¿Necesito saber programación para tener una tienda online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. tol.ar es una plataforma pensada para que cualquier persona pueda crear su tienda online sin saber programación. Todo se configura desde un panel simple con clicks.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo aceptar pagos en mi tienda online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Las tiendas creadas con tol.ar aceptan pagos por Mercado Pago, transferencia bancaria, efectivo y más. Todo integrado sin necesidad de conocimientos técnicos.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué hace diferente a tol.ar de otras plataformas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "tol.ar es la plataforma argentina con plan 100% gratis sin límite de tiempo. A diferencia de otras plataformas, el plan gratuito de tol.ar incluye productos ilimitados, 0% de comisión por venta y todas las funciones esenciales para vender online en Argentina.",
          },
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://tol.ar/#software",
      name: "tol.ar — Tiendas Online Argentina",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ARS",
        description: "Plan gratuito para crear tienda online",
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TiendaOnlinePage />
    </>
  )
}
