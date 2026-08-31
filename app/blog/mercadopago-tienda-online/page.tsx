import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "Cómo Integrar MercadoPago en tu Tienda Online Argentina",
  description:
    "Guía completa para integrar MercadoPago en tu tienda online en Argentina. Comisiones actualizadas 2026, configuración paso a paso y comparación con otros métodos de pago.",
  keywords:
    "mercadopago tienda online, integrar mercadopago tienda, mercadopago ecommerce argentina, comisiones mercadopago 2026, configurar mercadopago, cobrar con mercadopago tienda",
  alternates: {
    canonical: "https://tol.ar/blog/mercadopago-tienda-online",
  },
  openGraph: {
    title: "Cómo Integrar MercadoPago en tu Tienda Online | tol.ar",
    description:
      "Configurá MercadoPago en tu tienda online en 2 minutos. Comisiones actualizadas 2026 y todo lo que necesitás saber para cobrar online en Argentina.",
    type: "article",
    url: "https://tol.ar/blog/mercadopago-tienda-online",
  },
}

const breadcrumbJsonLd_mercadopago_tienda_online = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Cómo Integrar MercadoPago en tu Tienda Online", item: "https://tol.ar/blog/mercadopago-tienda-online" },
  ],
}


export default function MercadoPagoTiendaOnline() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cómo Integrar MercadoPago en tu Tienda Online Argentina",
    description:
      "Guía completa para integrar MercadoPago en tu tienda online. Comisiones actualizadas 2026 y configuración paso a paso.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-06-04",
    dateModified: "2026-06-04",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/mercadopago-tienda-online" },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cobra MercadoPago por venta en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Las comisiones de MercadoPago vigentes desde el 6/3/2026 son: débito/QR/saldo MP: 1,49% + IVA (total ~1,80%); tarjeta de crédito 1 cuota: 6,29% + IVA (total ~7,61%). Estas son las comisiones de MercadoPago como procesador de pagos. tol.ar no cobra comisión adicional sobre las ventas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo conecto MercadoPago a mi tienda online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Con tol.ar, conectar MercadoPago es inmediato: entrá a tu panel, elegí Medios de pago, hacé click en MercadoPago y autorizá con tu cuenta. Sin código, sin técnicos. Si no tenés cuenta MercadoPago, podés crearla gratis en mercadopago.com.ar.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuándo me acredita MercadoPago el dinero?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los tiempos de acreditación de MercadoPago dependen del medio de pago: débito/QR/saldo: 35 días hábiles. Tarjeta de crédito 1 cuota con acreditación inmediata: inmediato (mayor comisión). Crédito 3 cuotas: 14 días hábiles. Podés ver los tiempos actualizados en mercadopago.com.ar/ayuda/220.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd_mercadopago_tienda_online) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Pagos</span>
            </div>
            <div className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Comisiones actualizadas — vigentes desde 6/3/2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Integrar MercadoPago en tu Tienda Online
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Todo lo que necesitás saber sobre MercadoPago para vender online en Argentina: comisiones
              reales, configuración y comparación con otras opciones.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>4 junio 2026</span>
              <span>·</span>
              <span>7 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>¿Por qué MercadoPago para tu tienda online?</h2>
            <p>
              MercadoPago es el procesador de pagos más usado en Argentina: más del 80% de los
              compradores online argentinos tienen cuenta o al menos pueden pagar con tarjeta a través
              de MercadoPago. Si no lo ofrecés, perdés ventas.
            </p>
            <p>
              Ventajas concretas para tu tienda:
            </p>
            <ul>
              <li>Tus clientes ya lo conocen y confían en él</li>
              <li>Acepta tarjetas de crédito, débito, transferencia y Mercado Crédito</li>
              <li>Funciona con cuotas sin interés en muchos bancos</li>
              <li>La configuración es inmediata y sin código</li>
              <li>Tiene protección al comprador (lo que también te protege a vos)</li>
            </ul>

            <h2>Comisiones de MercadoPago actualizadas (junio 2026)</h2>
            <p>
              Las comisiones vigentes desde el 6/3/2026 son:
            </p>

            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Medio de pago</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión base</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Total c/IVA</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Acreditación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Débito / QR / Saldo MP</td>
                    <td className="py-3 px-4 text-center text-gray-700">1,49%</td>
                    <td className="py-3 px-4 text-center font-semibold text-orange-600">~1,80%</td>
                    <td className="py-3 px-4 text-center text-gray-500">35 días hábiles</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Crédito 1 cuota</td>
                    <td className="py-3 px-4 text-center text-gray-700">6,29%</td>
                    <td className="py-3 px-4 text-center font-semibold text-orange-600">~7,61%</td>
                    <td className="py-3 px-4 text-center text-gray-500">Inmediata</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Crédito 3 cuotas</td>
                    <td className="py-3 px-4 text-center text-gray-700">6,29% + interés banco</td>
                    <td className="py-3 px-4 text-center font-semibold text-orange-600">variable</td>
                    <td className="py-3 px-4 text-center text-gray-500">14 días hábiles</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 text-gray-700">Efectivo / Transferencia</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-gray-500">Inmediata</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              Fuente: <a href="https://www.mercadopago.com.ar/ayuda/220" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mercadopago.com.ar/ayuda/220</a>.
              tol.ar no cobra comisión adicional sobre estas transacciones.
            </p>

            <h2>¿Qué significa "acreditación a 35 días hábiles"?</h2>
            <p>
              Este es el punto que más confunde. Cuando alguien te paga con débito a través de MercadoPago,
              el dinero no llega a tu cuenta de inmediato: MercadoPago lo retiene por 35 días hábiles
              (aproximadamente 7 semanas) antes de acreditártelo.
            </p>
            <p>
              Alternativas si necesitás el dinero antes:
            </p>
            <ul>
              <li><strong>Acreditación inmediata</strong>: MercadoPago ofrece esta opción a cambio de una comisión mayor. La tarjeta de crédito 1 cuota ya tiene acreditación inmediata incluida.</li>
              <li><strong>Transferencia bancaria</strong>: si ofrecés transferencia como método de pago, la acreditación es inmediata y sin comisión.</li>
              <li><strong>Efectivo</strong>: cobro en el momento, sin intermediarios.</li>
            </ul>

            <h2>Cómo conectar MercadoPago a tu tienda en tol.ar</h2>
            <p>
              Si tu tienda está en tol.ar, la integración con MercadoPago es inmediata:
            </p>
            <ol>
              <li>Entrá a tu panel de administración en tol.ar</li>
              <li>Andá a <strong>Configuración → Medios de pago</strong></li>
              <li>Hacé click en el botón de MercadoPago</li>
              <li>Se abre una ventana de autorización de MercadoPago</li>
              <li>Ingresá con tu cuenta de MercadoPago y autorizá</li>
              <li>Listo. Tus clientes ya pueden pagar</li>
            </ol>
            <p>
              No necesitás código, no necesitás técnicos. Si no tenés cuenta de MercadoPago,
              podés crearla gratis en mercadopago.com.ar antes de este paso.
            </p>

            <h2>MercadoPago vs otros métodos de pago</h2>
            <p>
              MercadoPago no es el único método de pago que podés ofrecer. tol.ar también soporta:
            </p>
            <ul>
              <li><strong>Transferencia bancaria (CVU/CBU)</strong>: 0% de comisión, acreditación inmediata. Excelente para complementar MercadoPago.</li>
              <li><strong>Efectivo contra entrega</strong>: 0% de comisión, ideal para ventas locales.</li>
              <li><strong>Mobbex</strong>: otro procesador de pagos disponible en Argentina (próximamente en tol.ar). Las comisiones varían según el plan; conviene comparar directamente en el sitio de cada procesador antes de elegir.</li>
            </ul>
            <p>
              La recomendación es ofrecer al menos MercadoPago y transferencia bancaria. Así cubrís tanto
              a quienes prefieren pagar con tarjeta como a quienes prefieren transferir directamente.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Cuánto cobra MercadoPago por venta en 2026?</h3>
            <p>
              Depende del medio de pago: débito/QR/saldo ~1,80% con IVA; crédito 1 cuota ~7,61% con IVA;
              crédito 3 cuotas variable. Transferencia y efectivo: 0%. tol.ar no cobra comisión adicional.
            </p>

            <h3>¿Cómo conecto MercadoPago a mi tienda online?</h3>
            <p>
              Con tol.ar, desde Configuración → Medios de pago → MercadoPago. Se conecta en menos de
              2 minutos sin código.
            </p>

            <h3>¿Cuándo me acredita MercadoPago el dinero?</h3>
            <p>
              Débito: 35 días hábiles. Crédito 1 cuota: inmediato. Crédito 3 cuotas: 14 días hábiles.
              Para acreditación inmediata en débito, MercadoPago cobra una comisión adicional.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-blue-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda con MercadoPago incluido</h2>
            <p className="text-blue-100 mb-8">
              tol.ar tiene integración nativa con MercadoPago. Gratis, sin comisiones por venta, listo en 2 minutos.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <SeoExtraBlock page="blog-mercadopago-tienda-online" />
      <RelatedArticles currentSlug="mercadopago-tienda-online" />
      <Footer />
    </>
  )
}
