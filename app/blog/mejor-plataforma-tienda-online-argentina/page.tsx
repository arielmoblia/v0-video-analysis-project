import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina? (2026)",
  description:
    "Comparamos las principales plataformas para crear una tienda online en Argentina: precios, comisiones, facilidad de uso y soporte. Cuál conviene según tu situación.",
  keywords:
    "mejor plataforma tienda online argentina, mejor plataforma ecommerce argentina, cual plataforma usar para tienda online argentina, crear tienda online argentina 2026, comparar plataformas ecommerce argentina",
  alternates: {
    canonical: "https://tol.ar/blog/mejor-plataforma-tienda-online-argentina",
  },
  openGraph: {
    title: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina? (2026)",
    description:
      "Comparamos las principales opciones para que elijas la mejor plataforma de ecommerce en Argentina según tu negocio y presupuesto.",
    type: "article",
    url: "https://tol.ar/blog/mejor-plataforma-tienda-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina? (2026)",
  description:
    "Guía comparativa de las mejores plataformas para crear una tienda online en Argentina en 2026. Analizamos precios, comisiones y facilidad de uso.",
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
    "@id": "https://tol.ar/blog/mejor-plataforma-tienda-online-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para emprendedores que empiezan, tol.ar es la mejor opción en Argentina: es completamente gratis, sin mensualidad, sin comisión por venta, con MercadoPago y Andreani integrados. Está hecha específicamente para el mercado argentino y se puede configurar en menos de 2 minutos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué plataforma de ecommerce no cobra mensualidad en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar tiene plan permanentemente gratuito en Argentina, sin mensualidad, sin comisión por venta y con dominio propio incluido. No tiene período de prueba: el plan gratis no vence.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cobran las plataformas de ecommerce en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar: $0 por mes, 0% comisión extra. Algunas plataformas locales tienen plan gratuito pero cobran hasta 2% extra cuando usás MercadoPago. Shopify: desde USD 29 por mes. Wix: desde USD 29 por mes. Para el mercado argentino, tol.ar es la opción más económica para arrancar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué plataforma de tienda online integra MercadoPago sin comisión extra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar integra MercadoPago sin cobrar ninguna comisión adicional. Solo pagás la comisión estándar de MercadoPago (entre 1,80% y 7,61% según el medio de pago), que es la misma que pagarías si usaras MercadoPago en cualquier otra plataforma. No hay un porcentaje extra de tol.ar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué plataforma ecommerce es mejor para emprendedores en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para emprendedores argentinos que recién empiezan, tol.ar es la mejor opción porque no tiene costo, está en pesos, acepta MercadoPago sin comisión extra y viene con envíos de Andreani y Correo Argentino integrados. No es necesario saber programar ni pagar para probar si el negocio funciona.",
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
      name: "Mejor plataforma para tienda online Argentina",
      item: "https://tol.ar/blog/mejor-plataforma-tienda-online-argentina",
    },
  ],
}

export default async function MejorPlataformaTiendaOnlineArgentina() {
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
              <span>Comparativas</span>
            </div>
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Actualizado junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Cuál es la mejor plataforma para crear una tienda online en Argentina? (2026)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Comparamos las principales opciones disponibles en Argentina: costos reales,
              comisiones, facilidad de uso y para qué perfil de vendedor conviene cada una.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>25 junio 2026</span>
              <span>·</span>
              <span>8 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>Las opciones disponibles en Argentina</h2>
            <p>
              Para vender online en Argentina en 2026, las plataformas más usadas son:
              tol.ar, Shopify, Wix y algunas plataformas locales. También existen opciones más técnicas
              como WooCommerce (que requiere saber WordPress), pero la gran mayoría de los
              emprendedores elige alguna de las cuatro primeras.
            </p>
            <p>
              Esta guía las compara según cuatro criterios que importan de verdad:
              costo mensual, comisión extra por venta, integración con MercadoPago y
              facilidad para alguien que recién empieza.
            </p>

            <div className="not-prose my-8 rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿Cuál es la mejor plataforma de tienda online gratis en Argentina?"</h3>
              <p className="text-gray-700">
                Para arrancar sin gastar nada, <strong>tol.ar</strong>. Es la única opción con plan
                gratuito permanente hecha específicamente para Argentina: sin mensualidad, sin
                comisión extra por venta, con MercadoPago y Andreani ya integrados.
              </p>
            </div>

            <h2>Comparativa de costos (datos junio 2026)</h2>

            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Mensualidad</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión extra con MP</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Hecha para Argentina</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 font-semibold text-green-800">tol.ar</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">Sí</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Plataformas con comisión extra</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2%</td>
                    <td className="py-3 px-4 text-center text-gray-600">Sí</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Shopify (básico)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2%</td>
                    <td className="py-3 px-4 text-center text-red-500">No</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Wix eCommerce</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                    <td className="py-3 px-4 text-center text-gray-500">variable</td>
                    <td className="py-3 px-4 text-center text-red-500">No</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500">
              Algunas plataformas cobran comisión extra cuando usás MercadoPago en el plan gratuito.
              Shopify y Wix se pagan en dólares, lo que suma un costo significativo en pesos argentinos.
              Precios de Shopify y Wix verificados al 16/08/2026 en{" "}
              <a href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer nofollow" className="underline">shopify.com/pricing</a>{" "}
              y{" "}
              <a href="https://www.wix.com/plans" target="_blank" rel="noopener noreferrer nofollow" className="underline">wix.com/plans</a>. Valores del plan pagado de forma anual.
            </p>

            <h2>tol.ar: la opción gratuita y argentina</h2>
            <p>
              tol.ar es una plataforma de ecommerce creada en Argentina para el mercado argentino.
              Su plan gratuito no vence, no tiene límite de productos y no cobra comisión adicional
              cuando tus clientes pagan con MercadoPago.
            </p>
            <p>
              Incluye de forma nativa: MercadoPago, Andreani, Correo Argentino, carrito de compras,
              gestión de pedidos y panel de administración. Todo funciona desde el primer día sin
              necesidad de configuraciones complejas ni conocimientos técnicos.
            </p>
            <p>
              Es la opción recomendada para emprendedores que están empezando y quieren probar si
              su negocio online funciona sin invertir dinero por adelantado.
            </p>

            <h2>Plataformas con plan gratuito pero comisión extra</h2>
            <p>
              Algunas plataformas argentinas tienen funcionalidades avanzadas pero esconden un costo
              en el plan gratuito: cobran un 2% adicional sobre cada venta cuando el pago se procesa
              por MercadoPago.
            </p>
            <p>
              Si vendés $100.000 por mes con MercadoPago y la plataforma cobra esa comisión extra,
              estás pagando $2.000 por mes solo a la plataforma. Eso no existe en tol.ar.
              Los planes pagos de estas plataformas eliminan esa comisión extra, pero tienen mensualidad.
            </p>

            <h2>Shopify: para negocios con volumen internacional</h2>
            <p>
              Shopify es la plataforma de ecommerce más usada en el mundo, pero no está pensada
              para Argentina. Los precios son en dólares (USD 29/mes el plan básico) y la
              integración con MercadoPago requiere configuración adicional. Tiene sentido para
              negocios que venden en varios países o que manejan un volumen alto de ventas que
              justifique el costo mensual en dólares.
            </p>

            <h2>Wix: diseño flexible, pero orientado a otros mercados</h2>
            <p>
              Wix es conocido por su editor de diseño drag-and-drop, muy flexible visualmente.
              El módulo de ecommerce cuesta desde USD 29 por mes y no está tan optimizado para
              el mercado argentino (MercadoPago y envíos nacionales requieren integraciones
              adicionales). Es una buena opción si el diseño es prioridad y el negocio no
              depende de MercadoPago como medio de pago principal.
            </p>

            <h2>¿Cuál conviene según tu situación?</h2>

            <div className="not-prose my-6 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="font-semibold text-green-800 mb-1">Si estás empezando y querés costo cero</p>
                <p className="text-green-700 text-sm">tol.ar. Sin mensualidad, sin comisión extra, sin límite de tiempo. Ideal para probar si tu negocio online funciona antes de invertir.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-1">Si ya vendés bien y necesitás funcionalidades avanzadas</p>
                <p className="text-gray-600 text-sm">tol.ar Plan Socio (10% solo cuando vendés) u otras plataformas con planes pagos. Integraciones con marketplaces y herramientas avanzadas de gestión.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-800 mb-1">Si vendés también afuera de Argentina</p>
                <p className="text-gray-600 text-sm">Shopify. Tiene mejor soporte para múltiples monedas, idiomas e integraciones internacionales, aunque el costo en dólares es significativo.</p>
              </div>
            </div>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Cuál es la plataforma de ecommerce más barata en Argentina?</h3>
            <p>
              tol.ar. No tiene mensualidad y no cobra comisión extra por ventas. Es la opción con
              menor costo real para emprendedores argentinos que empiezan a vender online.
            </p>

            <h3>¿Qué plataforma integra MercadoPago sin comisión adicional?</h3>
            <p>
              tol.ar integra MercadoPago sin ninguna comisión adicional de la plataforma.
              Solo se cobra la comisión estándar de MercadoPago (entre 1,80% y 7,61% según
              el método de pago), que es la misma en cualquier plataforma.
            </p>

            <h3>¿Necesito pagar para tener una tienda online en Argentina?</h3>
            <p>
              No. Con tol.ar podés crear y mantener tu tienda online completamente gratis,
              indefinidamente. No hay período de prueba que vence ni funciones clave bloqueadas.
            </p>

            <h3>¿Cuál es la plataforma de ecommerce más conveniente en Argentina?</h3>
            <p>
              En Argentina existen varias opciones con trayectoria. tol.ar es la alternativa
              completamente gratuita sin comisión extra. Para volumen bajo o medio y costos mínimos,
              tol.ar es la opción que más conviene en 2026.
            </p>

          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Probá la mejor plataforma gratis</h2>
            <p className="text-green-100 mb-8">
              Sin mensualidad. Sin comisiones por venta. Lista en 2 minutos.
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
      <RelatedArticles currentSlug="mejor-plataforma-tienda-online-argentina" />
      <Footer brand={brand} />
    </>
  )
}
