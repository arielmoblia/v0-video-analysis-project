import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Plataformas de ecommerce en Argentina 2026: comparativa completa",
  description:
    "Guía completa de las plataformas de ecommerce disponibles en Argentina en 2026. Precios reales, comisiones, ventajas y para quién conviene cada una.",
  keywords:
    "plataformas ecommerce argentina 2026, ecommerce argentina, vender online argentina plataformas, tienda online argentina opciones, plataforma venta online argentina",
  alternates: {
    canonical: "https://tol.ar/blog/plataformas-ecommerce-argentina-2026",
  },
  openGraph: {
    title: "Plataformas de ecommerce en Argentina 2026: comparativa completa",
    description:
      "Todo lo que necesitás saber sobre las plataformas de ecommerce en Argentina: precios, comisiones y cuál usar según tu tipo de negocio.",
    type: "article",
    url: "https://tol.ar/blog/plataformas-ecommerce-argentina-2026",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plataformas de ecommerce en Argentina 2026: comparativa completa",
  description:
    "Comparativa completa de las plataformas de ecommerce disponibles en Argentina en 2026. Precios, comisiones y ventajas de cada opción.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-06-25",
  dateModified: "2026-06-25",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/plataformas-ecommerce-argentina-2026",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuáles son las plataformas de ecommerce disponibles en Argentina en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las principales plataformas de ecommerce en Argentina en 2026 son: tol.ar (la única 100% gratuita sin comisión extra), otras plataformas locales (con plan gratuito pero comisión extra del 2% con MercadoPago), Shopify (internacional, desde USD 29/mes), Wix (desde USD 29,77/mes) y WooCommerce (requiere WordPress y hosting propio).",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué plataforma de ecommerce es gratuita en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar ofrece plan permanentemente gratuito en Argentina, sin mensualidad, sin comisión por venta y sin fecha de vencimiento, con dominio propio incluido. Otras plataformas locales también tienen plan gratuito, pero cobran hasta 2% extra por venta con medios de pago externos y no incluyen dominio propio en ese plan.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo crear una tienda online en Argentina sin pagar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con tol.ar podés crear tu tienda online en Argentina completamente gratis: sin mensualidad, sin comisión extra por venta, sin período de prueba que vence. Solo necesitás un email para registrarte. En menos de 2 minutos tenés tu tienda activa con MercadoPago y envíos integrados.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué plataforma de ecommerce conviene para emprendedores en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para emprendedores que empiezan en Argentina, tol.ar es la opción más conveniente: cero costo, MercadoPago integrado sin comisión extra, Andreani y Correo Argentino incluidos, en pesos. Para negocios con más volumen que necesitan integraciones avanzadas, los planes pagos de tol.ar o plataformas con más funcionalidades son alternativas válidas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el ecommerce en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de la plataforma. tol.ar: $0 por mes sin comisiones extra. Algunas plataformas locales: $0 por mes pero cobran 2% extra por venta con MercadoPago. Planes pagos de otras plataformas desde aproximadamente USD 15/mes. Shopify desde USD 29/mes. Wix desde USD 29,77/mes. La opción más económica para el mercado argentino es tol.ar.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Plataformas de ecommerce en Argentina 2026",
      item: "https://tol.ar/blog/plataformas-ecommerce-argentina-2026",
    },
  ],
}

export default async function PlataformasEcommerceArgentina2026() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Ecommerce Argentina</span>
            </div>
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Junio 2026 — datos actualizados
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plataformas de ecommerce en Argentina 2026: comparativa completa
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Todas las opciones reales para vender online en Argentina, con precios actualizados
              y análisis de para quién conviene cada una.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>25 junio 2026</span>
              <span>·</span>
              <span>10 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>El mercado del ecommerce en Argentina en 2026</h2>
            <p>
              El ecommerce en Argentina creció de manera sostenida en los últimos años. Más
              personas compran online, más emprendedores abren tiendas digitales, y las opciones
              de plataformas son más variadas que antes. Pero la variedad no siempre facilita la
              decisión: hay mucha diferencia de precios, funcionalidades y adaptación al contexto
              argentino entre una plataforma y otra.
            </p>
            <p>
              Esta guía analiza las principales opciones disponibles en Argentina en 2026, con
              datos reales de costos y comisiones.
            </p>

            <h2>Plataformas disponibles en Argentina</h2>

            <h3>1. tol.ar — gratuita, argentina, sin comisiones</h3>
            <p>
              tol.ar es una plataforma de ecommerce 100% argentina, creada específicamente para el
              mercado local. Su plan gratuito incluye todo lo necesario para empezar a vender:
              productos ilimitados, carrito de compras, MercadoPago integrado sin comisión extra,
              Andreani y Correo Argentino para envíos, y panel de administración completo.
            </p>
            <p>
              El plan gratis no tiene vencimiento ni límite de productos. No hay período de prueba
              que se convierte en pago: podés mantener tu tienda activa indefinidamente sin pagar
              nada. tol.ar también tiene un Plan Socio donde pagás 10% solo cuando efectivamente
              vendés, lo que lo hace ideal para etapas de crecimiento.
            </p>

            <div className="not-prose my-4 bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="font-semibold text-green-800 mb-2">tol.ar en números</p>
              <ul className="text-green-700 text-sm space-y-1 list-none m-0 p-0">
                <li>Mensualidad: $0</li>
                <li>Comisión extra por venta: 0%</li>
                <li>MercadoPago: integrado nativo</li>
                <li>Andreani y Correo Argentino: incluidos</li>
                <li>Límite de productos: ninguno</li>
                <li>Vencimiento del plan gratis: nunca</li>
              </ul>
            </div>

            <h3>2. Plataformas locales con plan gratis y comisión extra</h3>
            <p>
              Existen plataformas de ecommerce con mayor trayectoria en Argentina y América Latina.
              Tienen funcionalidades avanzadas: integraciones con marketplaces (Mercado Libre, Linio),
              herramientas de marketing, gestión de inventario y reportes detallados.
            </p>
            <p>
              Su plan gratuito existe pero tiene una limitación importante: cobra una comisión extra
              del 2% sobre cada venta cuando el pago se realiza por MercadoPago. Para un vendedor
              que mueve $200.000 por mes, eso son $4.000 que paga a la plataforma, independientemente
              de la comisión de MercadoPago. Los planes pagos eliminan esa comisión pero tienen mensualidad.
            </p>
            <p>
              Esta opción conviene cuando el negocio ya tiene volumen y necesita integraciones con
              marketplaces o herramientas de gestión avanzadas que justifiquen el costo mensual.
            </p>

            <h3>3. Shopify — el estándar internacional</h3>
            <p>
              Shopify es la plataforma de ecommerce más usada en el mundo. Tiene un ecosistema
              enorme de apps e integraciones, y es ideal para negocios que venden en múltiples
              países o que necesitan funcionalidades muy específicas. El plan básico sale USD 29
              por mes, más la comisión por transacción si no usás su pasarela de pago propia.
            </p>
            <p>
              Para el mercado argentino, Shopify tiene algunas fricciones: el precio en dólares
              es un costo significativo en pesos, la integración con MercadoPago requiere
              configuración extra, y el soporte en español no siempre está disponible. Conviene
              para negocios consolidados con ventas en el exterior.
            </p>

            <h3>4. Wix — el editor más flexible visualmente</h3>
            <p>
              Wix es conocido por su constructor visual tipo drag-and-drop, muy fácil para diseñar
              páginas a gusto. El módulo de ecommerce (Wix Stores) cuesta desde USD 29,77 por mes.
              La integración con MercadoPago no es nativa y requiere una app adicional.
            </p>
            <p>
              Es una buena opción si el diseño personalizado es prioridad y el negocio no depende
              de MercadoPago o envíos nacionales como funcionalidades centrales.
            </p>

            <h3>5. WooCommerce — para perfiles técnicos</h3>
            <p>
              WooCommerce es el módulo de ecommerce de WordPress. Técnicamente es gratuito, pero
              requiere un hosting propio (desde USD 5-10 por mes), un dominio y conocimientos para
              instalarlo y administrarlo. No es una opción para quien empieza sin conocimientos
              técnicos.
            </p>
            <p>
              Para agencias o personas con conocimientos técnicos que quieren control total del
              sitio, WooCommerce ofrece la mayor flexibilidad. Para todos los demás, hay opciones
              más simples.
            </p>

            <h2>Resumen comparativo</h2>

            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Costo mínimo/mes</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión extra MP</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Para Argentina</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 font-semibold text-green-800">tol.ar</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">100%</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Plataformas locales con comisión</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0 (o desde ~USD 15)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">2% (plan gratis)</td>
                    <td className="py-3 px-4 text-center text-gray-600">Sí</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Shopify</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">variable</td>
                    <td className="py-3 px-4 text-center text-gray-500">Parcial</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Wix</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29,77/mes</td>
                    <td className="py-3 px-4 text-center text-gray-500">variable</td>
                    <td className="py-3 px-4 text-center text-gray-500">Parcial</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">WooCommerce</td>
                    <td className="py-3 px-4 text-center text-gray-600">desde USD 5 (hosting)</td>
                    <td className="py-3 px-4 text-center text-gray-500">ninguna</td>
                    <td className="py-3 px-4 text-center text-gray-500">Con plugins</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500">
              Precios de Shopify y Wix verificados al 19/09/2026 en{" "}
              <a href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer nofollow" className="underline">shopify.com/pricing</a>{" "}
              y{" "}
              <a href="https://www.wix.com/plans" target="_blank" rel="noopener noreferrer nofollow" className="underline">wix.com/plans</a>. Valores del plan pagado de forma anual.
            </p>

            <h2>¿Cuál conviene según el tipo de vendedor?</h2>

            <div className="not-prose my-6 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="font-semibold text-green-800 mb-1">Emprendedor que empieza</p>
                <p className="text-green-700 text-sm">tol.ar. Cero costo, en pesos, MercadoPago y envíos nativos, listo en 2 minutos. El mejor punto de partida para validar si el negocio funciona antes de invertir.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-1">Negocio con volumen y necesidades avanzadas</p>
                <p className="text-gray-600 text-sm">tol.ar Plan Socio (10% solo cuando vendés) u otras plataformas con plan pago. Acceso a integraciones con marketplaces, herramientas de marketing y gestión de inventario avanzada.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-1">Negocio que vende en varios países</p>
                <p className="text-gray-600 text-sm">Shopify. La mejor infraestructura para ventas internacionales, múltiples monedas y logística global.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-1">Perfil técnico que quiere control total</p>
                <p className="text-gray-600 text-sm">WooCommerce. Máxima flexibilidad y control, pero requiere conocimientos técnicos y mantenimiento propio del servidor.</p>
              </div>
            </div>

            <h2>Preguntas frecuentes sobre plataformas de ecommerce en Argentina</h2>

            <h3>¿Cuáles son las plataformas de ecommerce disponibles en Argentina?</h3>
            <p>
              Las principales en 2026 son tol.ar, Shopify, Wix y WooCommerce, además de varias
              plataformas locales. tol.ar es la más adaptada al contexto argentino con MercadoPago,
              envíos nacionales y precios en pesos sin comisión extra.
            </p>

            <h3>¿Qué plataforma de ecommerce es gratuita en Argentina?</h3>
            <p>
              tol.ar tiene el plan gratuito más completo: sin mensualidad, sin comisión extra por
              venta y sin vencimiento. Otras plataformas también tienen plan gratuito pero cobran
              hasta 2% extra cuando se procesa el pago por MercadoPago.
            </p>

            <h3>¿Cómo crear una tienda online en Argentina sin pagar?</h3>
            <p>
              Entrás a tol.ar, elegís el nombre de tu tienda, subís tus productos y en menos de
              2 minutos tenés tu tienda activa. No necesitás tarjeta de crédito ni pagar ninguna
              mensualidad. El plan gratis incluye todo lo esencial para empezar a vender.
            </p>

            <h3>¿Es rentable vender online en Argentina en 2026?</h3>
            <p>
              Sí. El mercado del ecommerce en Argentina sigue creciendo. Los costos de entrada
              son bajos (podés empezar sin invertir con tol.ar) y la infraestructura de pagos
              y envíos en Argentina está bien desarrollada: MercadoPago para cobrar y Andreani
              o Correo Argentino para enviar. La clave es encontrar un producto con demanda y
              comunicarlo bien.
            </p>

          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Empezá gratis hoy</h2>
            <p className="text-green-100 mb-8">
              La plataforma de ecommerce más económica de Argentina. Sin mensualidad, sin comisiones extra.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="plataformas-ecommerce-argentina-2026" />
      <Footer brand={brand} />
    </>
  )
}
