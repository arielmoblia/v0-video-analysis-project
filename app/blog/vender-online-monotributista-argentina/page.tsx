import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "Cómo Vender Online Siendo Monotributista en Argentina (2026)",
  description:
    "Todo lo que necesitás saber para vender por internet siendo monotributista en Argentina. Facturación, límites de ingresos, AFIP y cómo declarar las ventas online.",
  keywords:
    "vender online siendo monotributista argentina, monotributista tienda online, facturar ventas online argentina, afip vender por internet argentina, ecommerce monotributista",
  alternates: {
    canonical: "https://tol.ar/blog/vender-online-monotributista-argentina",
  },
  openGraph: {
    title: "Cómo Vender Online Siendo Monotributista en Argentina (2026)",
    description:
      "Facturación, límites de ingresos y AFIP. Lo que necesitás saber para vender online como monotributista en Argentina.",
    type: "article",
    url: "https://tol.ar/blog/vender-online-monotributista-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Online Siendo Monotributista en Argentina (2026)",
  description:
    "Guía práctica para vender por internet como monotributista en Argentina. Cómo facturar, qué categoría elegir y cómo no tener problemas con AFIP.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-06-28",
  dateModified: "2026-06-28",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/vender-online-monotributista-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo vender online siendo monotributista en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, absolutamente. El monotributo incluye la venta de bienes y servicios por internet. Solo necesitás estar inscripto en AFIP, tener la categoría que corresponda a tu nivel de ingresos, y emitir facturas por cada venta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tengo que facturar cada venta online que hago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Técnicamente sí, deberías emitir comprobante por cada venta. En la práctica, muchos monotributistas emiten facturas cuando el comprador las pide. Lo importante es que tus ingresos anuales declarados no superen el límite de tu categoría de monotributo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si mis ventas online superan el límite del monotributo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si tus ingresos superan el límite de tu categoría actual, tenés que recategorizarte a una categoría más alta. Si superás el límite máximo del monotributo, debés pasarte al régimen general (IVA + Ganancias). Por eso es importante hacer seguimiento de tus ingresos durante el año.",
      },
    },
    {
      "@type": "Question",
      name: "¿MercadoPago informa a AFIP mis ventas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Desde 2021, MercadoPago y otras plataformas de pago están obligadas a informar a AFIP las transacciones de sus usuarios. Si recibís pagos por MercadoPago, AFIP tiene ese dato. Por eso es importante que tus ingresos declarados coincidan con lo que recibís.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo tener una tienda online sin estar inscripto en AFIP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Podés tener la tienda, pero para vender de forma legal y declarar tus ingresos necesitás estar inscripto. El trámite de inscripción al monotributo es gratuito y se hace en 20 minutos desde la web de AFIP. Si estás empezando y tenés ingresos bajos, la categoría A del monotributo tiene un costo mensual muy bajo.",
      },
    },
  ],
}

export default function MonotributistaOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver al blog
            </Link>
          </div>

          <article>
            <header className="mb-10">
              <p className="text-sm text-indigo-600 font-medium mb-3">Impuestos y facturación</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Cómo Vender Online Siendo Monotributista en Argentina
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                La mayoría de los emprendedores en Argentina son monotributistas. Te contamos exactamente
                qué necesitás para vender por internet sin problemas con AFIP.
              </p>
              <div className="mt-4 text-sm text-gray-400">
                Actualizado: junio 2026 · 7 min de lectura
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                El monotributo es el régimen fiscal más usado por los vendedores online en Argentina.
                Cubre tanto la venta de productos físicos como de servicios, y es compatible con tener
                una tienda online. Lo que cambia según tu situación es la categoría y el límite de ingresos.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Puedo vender online siendo monotributista?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sí. El monotributo está diseñado exactamente para esto: pequeños y medianos emprendedores
                que venden bienes o servicios. No importa si vendés en una feria, por WhatsApp o con una
                tienda online — el régimen es el mismo.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Lo que sí importa es que tus ingresos anuales no superen el límite de tu categoría.
                Las categorías van de la A (ingresos bajos) a la K (ingresos altos), y cada una tiene
                un tope de facturación anual.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Facturación en ventas online
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Como monotributista, emitís facturas tipo C. Podés hacerlo desde la web de AFIP
                (facturas electrónicas) o desde apps como Factura Móvil o similares.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                En ventas online, la mayoría de los compradores son consumidores finales que no te
                van a pedir factura. Pero si te la piden, tenés que emitirla. Y si no te la piden,
                igual es buena práctica tener registro de tus ventas para no exceder los límites
                de tu categoría sin darte cuenta.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <p className="text-gray-700 text-sm">
                  <strong>Importante:</strong> Desde 2021, MercadoPago informa a AFIP todas las
                  transacciones de sus usuarios. Si vendés con MercadoPago, AFIP ya tiene ese dato.
                  Asegurate de que tus ingresos declarados coincidan.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Qué pasa si mis ventas crecen mucho?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tus ventas online crecen y estás llegando al límite de tu categoría, tenés dos
                opciones: recategorizarte a una categoría más alta del monotributo, o si ya superás
                el máximo general, pasarte al régimen general (IVA + Ganancias).
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Este es un problema que quisieras tener — significa que tu negocio creció. Un contador
                puede ayudarte a planificar el cambio con anticipación para evitar sorpresas.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Y si todavía no estoy inscripto en AFIP?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si estás empezando y todavía no te inscribiste, el trámite es gratuito y rápido.
                Podés inscribirte al monotributo desde la web de AFIP en menos de 30 minutos, sin
                salir de tu casa. Necesitás CUIL, clave fiscal y saber qué actividad vas a declarar.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si recién empezás y tus ingresos son bajos, la categoría A es la más económica y
                tiene una cuota mensual muy accesible.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nota: si vendés online sin inscribirte, técnicamente es venta informal. Las plataformas
                de pago igual van a informar tus movimientos a AFIP, así que regularizarse cuanto
                antes es la opción más tranquila.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Preguntas frecuentes
              </h2>
              <div className="space-y-6 mb-10">
                {faqLd.mainEntity.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.name}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mt-10">
                <h2 className="text-2xl font-bold mb-3">
                  Armá tu tienda online como monotributista
                </h2>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  Con tol.ar podés tener tu tienda online gratis, conectar MercadoPago y empezar a vender hoy.
                  Sin saber de tecnología y sin pagar comisiones por cada venta.
                </p>
                <Link
                  href="https://tol.ar"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Crear mi tienda gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">Artículos relacionados:</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog/vender-sin-cuit-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Vender sin CUIT →
                  </Link>
                  <Link
                    href="/blog/como-cobrar-por-internet-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Cómo cobrar por internet →
                  </Link>
                  <Link
                    href="/blog/cuanto-cuesta-tienda-online-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    ¿Cuánto cuesta una tienda online? →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <RelatedArticles currentSlug="vender-online-monotributista-argentina" />
      <Footer />
    </>
  )
}
