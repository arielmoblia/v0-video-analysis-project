import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "Cómo Vender Online Sin Comisiones en Argentina (2026)",
  description:
    "Guía completa para vender por internet en Argentina sin pagar comisiones por venta. Qué plataformas cobran y cuáles no, y cómo reducir al mínimo lo que le das a los intermediarios.",
  keywords:
    "vender online sin comisiones argentina, tienda online sin comision, como vender sin comisiones argentina, plataforma sin comision argentina, ecommerce sin comision argentina",
  alternates: {
    canonical: "https://tol.ar/blog/vender-online-sin-comisiones-argentina",
  },
  openGraph: {
    title: "Cómo Vender Online Sin Comisiones en Argentina (2026)",
    description:
      "Qué plataformas cobran comisión y cuáles no. Cómo reducir al mínimo lo que le das a los intermediarios cuando vendés por internet en Argentina.",
    type: "article",
    url: "https://tol.ar/blog/vender-online-sin-comisiones-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Online Sin Comisiones en Argentina (2026)",
  description:
    "Guía completa para minimizar comisiones al vender por internet en Argentina. Comparativa de plataformas y estrategias para retener más dinero de cada venta.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-06-23",
  dateModified: "2026-06-23",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/vender-online-sin-comisiones-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Se puede vender online sin pagar comisiones en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, con tol.ar no pagás comisión por venta. La única comisión que existe es la de MercadoPago cuando el cliente paga con tarjeta, pero esa la pagarías en cualquier plataforma. Si ofrecés pago por transferencia bancaria, esa comisión también es cero.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son las plataformas sin comisión en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar no cobra comisión por venta. Algunas plataformas en su plan pago tampoco cobran comisión, pero tienen mensualidad. WooCommerce no cobra comisión pero tiene costos de hosting. MercadoLibre y otras marketplaces sí cobran comisión alta, y el porcentaje exacto varía según la categoría del producto (podés consultarlo en mercadolibre.com.ar/ayuda).",
      },
    },
    {
      "@type": "Question",
      name: "¿La transferencia bancaria no tiene comisión?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Correcto. Si tu cliente te paga por transferencia bancaria directa, la comisión es 0%. No paga MercadoPago, no paga la plataforma. El dinero llega directamente a tu cuenta. La desventaja es que el proceso es más manual y algunos clientes prefieren pagar con tarjeta.",
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
      name: "Cómo Vender Online Sin Comisiones en Argentina",
      item: "https://tol.ar/blog/vender-online-sin-comisiones-argentina",
    },
  ],
}

export default function VenderOnlineSinComisionesArgentina() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-purple-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Guías</span>
            </div>
            <div className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Online Sin Comisiones en Argentina (2026)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Qué plataformas cobran comisión y cuáles no. Cómo quedarte con más dinero de
              cada venta cuando vendés por internet en Argentina.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>23 junio 2026</span>
              <span>·</span>
              <span>7 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>¿De dónde vienen las comisiones cuando vendés online?</h2>
            <p>
              Cuando vendés por internet en Argentina, hay básicamente tres fuentes de comisión:
            </p>
            <ol>
              <li><strong>La plataforma de tu tienda</strong>: algunas cobran un porcentaje extra sobre cada venta.</li>
              <li><strong>El procesador de pagos</strong>: MercadoPago cobra cuando alguien paga con tarjeta. Esto es inevitable si querés aceptar tarjetas.</li>
              <li><strong>El marketplace</strong>: si vendés en MercadoLibre, Amazon o similares, cobran comisión por venta, con un porcentaje que varía según la categoría del producto (consultalo en mercadolibre.com.ar/ayuda). Suele ser la comisión más alta de las tres.</li>
            </ol>
            <p>
              La diferencia entre plataformas está en el punto 1. Algunas plataformas cobran comisión
              extra sobre tus ventas además de la que ya cobra MercadoPago. Otras no cobran nada.
            </p>

            <div className="not-prose my-8 rounded-xl border border-purple-200 bg-purple-50 p-6">
              <p className="text-sm font-semibold text-purple-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿Se puede vender online gratis y sin comisiones en Argentina?"</h3>
              <p className="text-gray-700">
                Sí. <strong>tol.ar</strong> no cobra mensualidad ni comisión propia por venta. Lo único
                que se paga es la comisión de MercadoPago cuando el cliente elige pagar con tarjeta
                — y esa comisión existe en cualquier plataforma, no es un costo de tol.ar.
              </p>
            </div>

            <h2>Plataformas que cobran comisión vs. las que no</h2>

            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión de la plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Mensualidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 font-semibold text-green-800">tol.ar</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Plataformas con comisión (plan gratis)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">2% (con MP)</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Plataformas con comisión (plan pago)</td>
                    <td className="py-3 px-4 text-center text-green-700">0%</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">~$15.000+/mes</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Shopify Basic</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">2% (si no usás Shopify Payments)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">MercadoLibre</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">Variable según categoría</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">WooCommerce</td>
                    <td className="py-3 px-4 text-center text-green-700">0%</td>
                    <td className="py-3 px-4 text-center text-gray-600">Costo de hosting</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500">
              Precio y comisión de Shopify verificados al 16/08/2026 en{" "}
              <a href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer nofollow" className="underline">shopify.com/pricing</a>{" "}
              y{" "}
              <a href="https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees" target="_blank" rel="noopener noreferrer nofollow" className="underline">help.shopify.com</a>.
              Comisión de MercadoLibre variable según categoría y tipo de publicación — ver{" "}
              <a href="https://www.mercadolibre.com.ar/ayuda/Costos-de-vender-un-producto_870" target="_blank" rel="noopener noreferrer nofollow" className="underline">mercadolibre.com.ar</a>.
            </p>

            <h2>Cómo minimizar la comisión de MercadoPago</h2>
            <p>
              La comisión de MercadoPago no la podés eliminar si querés aceptar tarjetas, pero sí
              podés reducirla ofreciendo alternativas de pago:
            </p>

            <h3>Transferencia bancaria (0% de comisión)</h3>
            <p>
              Si tu cliente te paga directamente a tu CBU/CVU, no hay comisión. El dinero llega
              inmediatamente a tu cuenta. Muchos compradores argentinos prefieren transferir porque
              también les conviene (no pagan intereses ni usan el límite de su tarjeta).
            </p>
            <p>
              En tol.ar podés activar transferencia bancaria en Configuración → Medios de pago.
              Configurás tu CBU/CVU y el sistema muestra esos datos al cliente cuando elige ese
              método de pago.
            </p>

            <h3>Pago por saldo de MercadoPago o QR (~1,80% con IVA)</h3>
            <p>
              Si el cliente paga con su saldo de MercadoPago o escaneando un QR, la comisión es
              ~1,80% con IVA. Mucho menos que el ~7,61% de tarjeta de crédito.
            </p>

            <h3>Efectivo contra entrega (0% de comisión)</h3>
            <p>
              Para ventas locales donde vos hacés la entrega, el efectivo no tiene ninguna comisión.
              tol.ar te permite activar "pago al recibir" como opción de pago.
            </p>

            <h2>La estrategia más inteligente: combinar métodos de pago</h2>
            <p>
              La mejor estrategia no es eliminar MercadoPago (vas a perder ventas), sino dar opciones.
              Si ofrecés transferencia bancaria con un pequeño descuento o beneficio adicional,
              muchos clientes van a elegirla.
            </p>
            <p>
              Por ejemplo: "Pagando por transferencia te hacemos envío gratis" o "Transferencia tiene
              10% de descuento". Eso te cuesta menos que la comisión de tarjeta y el cliente igual
              está contento.
            </p>

            <h2>¿Vale la pena vender en MercadoLibre para tener más clientes?</h2>
            <p>
              MercadoLibre tiene mucho tráfico, pero cobra comisión por venta (el porcentaje varía
              según la categoría, consultalo en mercadolibre.com.ar/ayuda) más costos de envío. En
              una categoría de bajo margen, eso puede comerse toda tu ganancia.
            </p>
            <p>
              La estrategia que usan muchos vendedores exitosos es usar MercadoLibre para que te
              descubran (pagan la comisión como costo de adquisición), y después dirigir a esos
              clientes a su tienda propia para las recompras, donde no pagan comisión.
            </p>

            <h2>Cuánto ahorrás con 0% de comisión de plataforma</h2>
            <p>
              Si vendés $500.000 por mes y la plataforma cobra 2% de comisión, le estás dando
              $10.000 por mes solo por usar el servicio. En un año, son $120.000 que podrían
              estar en tu bolsillo.
            </p>
            <p>
              Con tol.ar esos $10.000 mensuales son tuyos. La única comisión que pagás es la de
              MercadoPago, que la pagarías igual en cualquier plataforma.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Se puede vender online completamente sin comisiones?</h3>
            <p>
              Sin ninguna comisión es difícil si querés aceptar tarjetas, porque MercadoPago u otro
              procesador siempre cobra algo. Pero podés llegar a 0% si solo ofrecés pago por transferencia
              bancaria o efectivo. tol.ar no agrega ninguna comisión propia encima.
            </p>

            <h3>¿Hay plataformas que cobran comisión además de MercadoPago?</h3>
            <p>
              Sí. Algunas plataformas en su plan gratuito cobran 2% extra sobre cada venta cuando
              el cliente usa MercadoPago. En los planes pagos, no cobran comisión adicional, pero
              sí cobrás mensualidad. tol.ar no cobra ningún porcentaje extra, nunca.
            </p>

            <h3>¿La transferencia bancaria es segura para el vendedor?</h3>
            <p>
              Sí. Una vez que el dinero llegó a tu cuenta, es tuyo. El riesgo es que el cliente
              diga que transfirió y no lo haya hecho. Para mitigarlo, confirmá la transferencia
              en tu home banking antes de preparar el pedido.
            </p>

            <h3>¿MercadoPago es obligatorio para vender online en Argentina?</h3>
            <p>
              No es obligatorio, pero sí muy recomendable porque la mayoría de los compradores
              argentinos lo conocen y confían en él. Si no lo ofrecés, algunos clientes no te van
              a comprar. La solución es ofrecer MercadoPago y también transferencia bancaria como
              alternativa sin comisión.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Vendé sin comisiones de plataforma</h2>
            <p className="text-green-100 mb-8">
              tol.ar no cobra nada por venta. Gratis, en 2 minutos, con MercadoPago y transferencia incluidos.
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
      <RelatedArticles currentSlug="vender-online-sin-comisiones-argentina" />
      <Footer />
    </>
  )
}
