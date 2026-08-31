import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "¿Cuánto Cuesta una Tienda Online en Argentina en 2026? Precios Reales",
  description:
    "Comparamos los costos reales de tener una tienda online en Argentina: mensualidades, comisiones y costos ocultos explicados en pesos. Cuál es la opción más económica.",
  keywords:
    "cuanto cuesta tienda online argentina, precio tienda online argentina, cuanto vale tienda online, costo tienda online argentina 2026, shopify precio argentina, plataforma gratis argentina",
  alternates: {
    canonical: "https://tol.ar/blog/cuanto-cuesta-tienda-online-argentina",
  },
  openGraph: {
    title: "¿Cuánto Cuesta una Tienda Online en Argentina en 2026? Precios Reales",
    description:
      "Los costos reales de cada plataforma. Mensualidades, comisiones por venta y costos ocultos comparados. Hay una opción que sale $0.",
    type: "article",
    url: "https://tol.ar/blog/cuanto-cuesta-tienda-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "¿Cuánto Cuesta una Tienda Online en Argentina en 2026? Precios Reales",
  description:
    "Comparamos los costos reales de tener una tienda online en Argentina: mensualidades, comisiones y costos ocultos.",
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
    "@id": "https://tol.ar/blog/cuanto-cuesta-tienda-online-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta tener una tienda online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de la plataforma. Con tol.ar cuesta $0: sin mensualidad, sin comisión por venta. Algunas plataformas en el plan gratis cobran 2% extra cuando usás MercadoPago. Shopify parte de USD 29 por mes. El costo real incluye la mensualidad más la comisión que te cobran sobre cada venta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay plataformas de ecommerce realmente gratis en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar tiene plan permanentemente gratuito sin mensualidad y sin comisión extra por venta. Otras plataformas tienen plan sin mensualidad pero cobran una comisión adicional del 2% por cada venta cuando el cliente paga con MercadoPago. Si vendés $1.000.000 al mes, eso son $20.000 extra que pagás a la plataforma además de la comisión de MercadoPago.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cobra MercadoPago por venta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las comisiones vigentes desde marzo 2026 son: débito/QR/saldo ~1,80% con IVA; crédito 1 cuota ~7,61% con IVA; transferencia bancaria: 0%. Estas comisiones las cobra MercadoPago directamente, independientemente de qué plataforma uses para tu tienda.",
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
      name: "¿Cuánto Cuesta una Tienda Online en Argentina?",
      item: "https://tol.ar/blog/cuanto-cuesta-tienda-online-argentina",
    },
  ],
}

export default function CuantoCuestaTiendaOnlineArgentina() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-orange-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Comparativas</span>
            </div>
            <div className="inline-block bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Precios actualizados — junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Cuánto Cuesta una Tienda Online en Argentina en 2026?
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Los costos reales de cada plataforma, incluyendo mensualidades, comisiones por venta
              y los costos que no te cuentan hasta que ya estás usando el servicio.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>23 junio 2026</span>
              <span>·</span>
              <span>8 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>Los tres tipos de costo que tenés que mirar</h2>
            <p>
              Cuando evaluás una plataforma para tu tienda online, hay tres costos que importan:
            </p>
            <ol>
              <li><strong>Mensualidad</strong>: lo que pagás por usar la plataforma, independientemente de si vendés o no.</li>
              <li><strong>Comisión de la plataforma</strong>: el porcentaje extra que te descuenta la plataforma sobre cada venta (además de la comisión de MercadoPago).</li>
              <li><strong>Comisión del procesador de pagos</strong>: lo que cobra MercadoPago, Stripe u otro procesador cuando te compran con tarjeta.</li>
            </ol>
            <p>
              La publicidad suele mostrar solo el punto 1. El punto 2 es donde están los costos ocultos.
            </p>

            <div className="not-prose my-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm font-semibold text-orange-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿Hay alguna tienda online que sea gratis en Argentina?"</h3>
              <p className="text-gray-700">
                Sí. <strong>tol.ar</strong> tiene un plan gratuito permanente: $0 de mensualidad y 0%
                de comisión por venta. Solo pagás lo que cobra MercadoPago cuando el cliente te paga
                con tarjeta — eso no depende de la plataforma, es igual en todos lados.
              </p>
            </div>

            <h2>Comparativa de plataformas — Argentina 2026</h2>

            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Mensualidad</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión extra por venta</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Moneda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 font-semibold text-green-800">tol.ar</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700">ARS</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Plataforma con comisión (plan gratis)</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2% con MP</td>
                    <td className="py-3 px-4 text-center text-gray-600">ARS</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Plataforma con comisión (plan pago)</td>
                    <td className="py-3 px-4 text-center text-gray-600">~$15.000/mes</td>
                    <td className="py-3 px-4 text-center text-gray-600">0%</td>
                    <td className="py-3 px-4 text-center text-gray-600">ARS</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Shopify Basic</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2%</td>
                    <td className="py-3 px-4 text-center text-red-500">USD</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">WooCommerce</td>
                    <td className="py-3 px-4 text-center text-gray-600">$0 (plugin gratis)</td>
                    <td className="py-3 px-4 text-center text-gray-600">0%</td>
                    <td className="py-3 px-4 text-center text-gray-500">USD (hosting)</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Wix eCommerce</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes</td>
                    <td className="py-3 px-4 text-center text-gray-600">variable</td>
                    <td className="py-3 px-4 text-center text-red-500">USD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500">
              Precios de Shopify y Wix verificados al 16/08/2026 en{" "}
              <a href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer nofollow" className="underline">shopify.com/pricing</a>{" "}
              y{" "}
              <a href="https://www.wix.com/plans" target="_blank" rel="noopener noreferrer nofollow" className="underline">wix.com/plans</a>. Valores del plan pagado de forma anual.
            </p>

            <h2>El costo real en un ejemplo concreto</h2>
            <p>
              Supongamos que tenés una tienda que vende $500.000 por mes, con todos los pagos
              a través de MercadoPago con tarjeta de crédito (1 cuota).
            </p>
            <p>
              La comisión de MercadoPago (tarjeta crédito 1 cuota) es ~7,61% con IVA, igual para todos:
              eso son $38.050 que se lleva MercadoPago.
            </p>
            <p>
              Ahora sumá el costo de la plataforma:
            </p>
            <ul>
              <li><strong>tol.ar</strong>: $0 extra → costo total: $38.050</li>
              <li><strong>Plataforma con comisión (plan gratis)</strong>: 2% de $500.000 = $10.000 extra → costo total: $48.050</li>
              <li><strong>Plataforma con comisión (plan pago)</strong>: ~$15.000 de mensualidad → costo total: $53.050</li>
              <li><strong>Shopify Basic</strong>: 2% de $500.000 + USD 29 de mensualidad ≈ $10.000 + ~$38.000 extra → costo total mucho más alto</li>
            </ul>
            <p>
              Esa diferencia de $10.000 por mes son $120.000 en un año que te quedás vos en vez de dárselos a la plataforma.
            </p>

            <h2>¿WooCommerce no es gratis también?</h2>
            <p>
              WooCommerce es el plugin, pero para usarlo necesitás hosting (entre USD 5 y USD 20
              por mes según el proveedor), un dominio (entre USD 10 y USD 15 por año) y configuración
              técnica. No es imposible, pero requiere conocimientos de WordPress y más tiempo de
              mantenimiento. Para alguien que quiere vender sin complicarse con tecnología,
              tol.ar es más directo.
            </p>

            <h2>Costos que no son de la plataforma pero importan</h2>
            <p>
              Además de la plataforma, tenés otros costos inevitables cuando vendés online:
            </p>
            <ul>
              <li><strong>Envíos</strong>: Andreani y Correo Argentino tienen sus propias tarifas. El costo varía según peso y destino. Negociar con Andreani un convenio puede bajar bastante el costo por bulto.</li>
              <li><strong>Publicidad</strong>: Instagram y Google Ads son opcionales, pero si querés escalar rápido, van a ser un costo. Para empezar no son obligatorios.</li>
              <li><strong>Fotografía</strong>: fotos de buena calidad venden más. Al principio podés hacerlas vos con el celular.</li>
              <li><strong>Embalaje</strong>: bolsas, cajas, cinta. Un costo pequeño pero real.</li>
            </ul>

            <h2>Conclusión</h2>
            <p>
              Si estás empezando a vender online en Argentina y querés minimizar costos, tol.ar
              es la opción más barata: $0 de mensualidad y 0% de comisión por venta. La única
              comisión que pagás es la de MercadoPago, que la pagarías igual en cualquier plataforma.
            </p>
            <p>
              Si ya tenés un volumen alto de ventas y necesitás integraciones muy específicas
              (ERP, marketplaces internacionales, logística avanzada), ahí sí tiene sentido
              evaluar plataformas más complejas. Pero para el 90% de los emprendedores argentinos
              que recién empiezan o tienen ventas medianas, tol.ar cubre todo lo que necesitás sin pagar nada.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Hay plataformas que parecen gratis pero tienen costos ocultos?</h3>
            <p>
              Sí. Algunas plataformas no cobran mensualidad pero sí cobran un 2% extra por cada venta
              cuando usás MercadoPago. Eso significa que si vendés $1.000.000, pagás $20.000 a la
              plataforma además de lo que le pagás a MercadoPago. tol.ar no cobra ese 2%.
            </p>

            <h3>¿Cuánto cobra MercadoPago por venta en 2026?</h3>
            <p>
              Comisiones vigentes desde marzo 2026: débito/QR/saldo ~1,80% con IVA. Tarjeta de
              crédito 1 cuota ~7,61% con IVA. Transferencia bancaria: 0%. Estas comisiones las
              cobra MercadoPago, no la plataforma de tu tienda. Fuente:{" "}
              <a href="https://www.mercadopago.com.ar/ayuda/220" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                mercadopago.com.ar/ayuda/220
              </a>{" "}
              (verificado al 19/08/2026).
            </p>

            <h3>¿Vale la pena pagar por una plataforma de tienda online?</h3>
            <p>
              Si tenés más de $2.000.000 de ventas al mes y necesitás funcionalidades avanzadas
              (múltiples vendedores, integraciones con ERP, analytics avanzado), puede valer la pena.
              Para empezar o para ventas medianas, las plataformas pagas no agregan tanto valor como
              para justificar el costo.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Empezá con $0. Sin sorpresas.</h2>
            <p className="text-green-100 mb-8">
              tol.ar es gratis de verdad: sin mensualidad, sin comisión por venta. Solo pagás a MercadoPago cuando vendés.
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
      <RelatedArticles currentSlug="cuanto-cuesta-tienda-online-argentina" />
      <Footer />
    </>
  )
}
