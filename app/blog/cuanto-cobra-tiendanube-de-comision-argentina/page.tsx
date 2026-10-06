import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, ExternalLink } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

// No se pre-genera estática: lee el mismo JSON de precios que /vs-tiendanube y
// /comparar en cada visita, así si el chequeo semanal (verificar-precios-competencia.js)
// actualiza el porcentaje, los ejemplos en pesos de esta página se recalculan solos.
export const dynamic = "force-dynamic"

type DatoFuente = {
  texto: string
  fuente: string
  verificado: string
  alerta: boolean
}

function leerPreciosCompetencia(): { tiendanube: { transaccion: DatoFuente } } {
  const filePath = path.join(process.cwd(), "data", "precios-competencia.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export const metadata: Metadata = {
  title: "Cuánto Cobra Tiendanube de Comisión: la Cuenta en Pesos (2026)",
  description:
    "Cuánto te descuenta Tiendanube por costo de transacción en cada venta, con ejemplos reales en pesos, comparado con tol.ar que no cobra comisión. Fuente oficial citada.",
  keywords:
    "cuanto cobra tiendanube de comision, comision tiendanube, costo por transaccion tiendanube, tiendanube comision por venta, tienda online sin comision argentina",
  alternates: {
    canonical: "https://tol.ar/blog/cuanto-cobra-tiendanube-de-comision-argentina",
  },
  openGraph: {
    title: "Cuánto Cobra Tiendanube de Comisión: la Cuenta en Pesos (2026)",
    description:
      "Ejemplo real en pesos de cuánto te descuenta el costo por transacción de Tiendanube en cada venta, comparado con tol.ar sin comisión.",
    type: "article",
    url: "https://tol.ar/blog/cuanto-cobra-tiendanube-de-comision-argentina",
  },
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
      name: "Cuánto Cobra Tiendanube de Comisión",
      item: "https://tol.ar/blog/cuanto-cobra-tiendanube-de-comision-argentina",
    },
  ],
}

function formatearPesos(n: number): string {
  return n.toLocaleString("es-AR", { maximumFractionDigits: 0 })
}

export default async function CuantoCobraTiendanubeDeComision() {
  const brand = await getBrand()
  const precios = leerPreciosCompetencia()
  const transaccion = precios.tiendanube.transaccion

  // Rango real: 0,7% a 2%, tal como figura en la fuente oficial citada abajo.
  const porcentajeMin = 0.007
  const porcentajeMax = 0.02

  const ventaEjemplo = 50000
  const descuentoMin = ventaEjemplo * porcentajeMin
  const descuentoMax = ventaEjemplo * porcentajeMax

  const facturacionMensual = 800000
  const mensualMin = facturacionMensual * porcentajeMin
  const mensualMax = facturacionMensual * porcentajeMax
  const anualMin = mensualMin * 12
  const anualMax = mensualMax * 12

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cuánto Cobra Tiendanube de Comisión: la Cuenta en Pesos",
    description:
      "Cuánto te descuenta Tiendanube por costo de transacción en cada venta, con ejemplo real en pesos, comparado con tol.ar sin comisión.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://tol.ar/blog/cuanto-cobra-tiendanube-de-comision-argentina",
    },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cobra Tiendanube de comisión por venta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Según la documentación oficial de Tiendanube, el costo por transacción va del 0,7% al 2% de cada venta, dependiendo del plan contratado y el medio de pago que use el comprador. Esto es aparte de lo que cobra el procesador de pagos (por ejemplo MercadoPago), que se paga igual en cualquier plataforma.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Esa comisión es lo mismo que cobra MercadoPago?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. El costo por transacción de Tiendanube se suma aparte de la comisión del medio de pago. Esa comisión del medio de pago la pagás igual con tol.ar o con cualquier otra plataforma; la diferencia está en el costo extra que agrega la plataforma por encima de eso.",
        },
      },
      {
        "@type": "Question",
        name: "¿tol.ar cobra comisión por venta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, tol.ar no cobra comisión propia por venta ni mensualidad. Lo único que se paga es la comisión del medio de pago que elija el cliente (por ejemplo MercadoPago), igual que en cualquier plataforma.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-amber-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Comparativas</span>
            </div>
            <div className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Comparativa — septiembre 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cuánto cobra Tiendanube de comisión: la cuenta en pesos
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              El costo por transacción de Tiendanube, explicado con un ejemplo de venta concreto
              en pesos, comparado con tol.ar que no cobra comisión.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>11 septiembre 2026</span>
              <span>·</span>
              <span>5 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>El dato oficial: 0,7% a 2% por venta</h2>
            <p>
              Según la documentación oficial de Tiendanube, además de la mensualidad del plan
              contratado (planes pagos desde $20.999/mes pagando anual, o $27.999/mes pagando mes a
              mes, con un plan gratis limitado disponible),
              cobra un <strong>costo por transacción de 0,7% a 2%</strong> sobre cada venta,
              según el plan y el medio de pago que use el comprador.
            </p>
            <p className="text-sm text-gray-500 not-prose">
              Fuente: <a href={transaccion.fuente} target="_blank" rel="noopener noreferrer nofollow" className="underline inline-flex items-center gap-1">
                Centro de ayuda de Tiendanube <ExternalLink className="w-3 h-3" />
              </a>. Verificado por última vez el {transaccion.verificado}
              {transaccion.alerta ? " (posible cambio, en revisión)" : ""}.
              Ese costo es aparte de lo que cobra el medio de pago (por ejemplo MercadoPago), que
              se paga igual en cualquier plataforma.
            </p>

            <h2>Ejemplo con una venta concreta: $50.000</h2>
            <p>
              Supongamos que vendés un producto de <strong>${formatearPesos(ventaEjemplo)}</strong>.
              Con el costo por transacción de Tiendanube, de esa venta te descuentan entre:
            </p>

            <div className="not-prose my-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm text-red-700 font-medium mb-1">Con Tiendanube (0,7% a 2%)</p>
                <p className="text-3xl font-bold text-red-700">
                  ${formatearPesos(descuentoMin)} a ${formatearPesos(descuentoMax)}
                </p>
                <p className="text-xs text-red-600 mt-2">descontados de esta venta, aparte del medio de pago</p>
              </div>
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <p className="text-sm text-green-700 font-medium mb-1">Con tol.ar (0%)</p>
                <p className="text-3xl font-bold text-green-700">$0</p>
                <p className="text-xs text-green-600 mt-2">sin comisión propia por venta, nunca</p>
              </div>
            </div>

            <h2>Llevado a un mes de ventas</h2>
            <p>
              Una tienda chica que factura <strong>${formatearPesos(facturacionMensual)} por mes</strong> paga,
              solo por el costo por transacción de Tiendanube (sin contar la mensualidad del plan ni la
              comisión del medio de pago, que son aparte):
            </p>
            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Período</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Con Tiendanube (0,7%-2%)</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Con tol.ar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Por mes</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">
                      ${formatearPesos(mensualMin)} a ${formatearPesos(mensualMax)}
                    </td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Por año</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">
                      ${formatearPesos(anualMin)} a ${formatearPesos(anualMax)}
                    </td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              Cálculo propio sobre el porcentaje oficial de Tiendanube citado arriba. Una tienda que
              factura más, paga proporcionalmente más: el costo por transacción es un porcentaje fijo
              sobre cada venta, no un monto fijo mensual.
            </p>

            <h2>Por qué esto es aparte de la comisión del medio de pago</h2>
            <p>
              Cuando un cliente paga con tarjeta, el medio de pago (por ejemplo MercadoPago) siempre
              cobra su propia comisión, en cualquier plataforma. Eso no cambia si usás Tiendanube,
              tol.ar o cualquier otra. La diferencia está en el costo por transacción que algunas
              plataformas agregan por encima de eso, como el 0,7% a 2% de Tiendanube. tol.ar no
              agrega ese costo extra: solo pagás lo que cobra el medio de pago que elija tu cliente.
            </p>

            <h2>Preguntas frecuentes</h2>
            <h3>¿El costo por transacción de Tiendanube es fijo?</h3>
            <p>
              No, varía entre 0,7% y 2% según el plan contratado y el medio de pago que use el
              comprador. Para el número exacto de tu caso, consultá el centro de ayuda oficial de
              Tiendanube.
            </p>
            <h3>¿Con tol.ar pago algo aparte del medio de pago?</h3>
            <p>
              No. tol.ar no cobra mensualidad ni comisión propia por venta. Lo único que existe es
              la comisión del medio de pago que elija tu cliente, igual que en cualquier plataforma.
            </p>
            <h3>¿Puedo migrar mi tienda de Tiendanube a tol.ar sin perder mis productos?</h3>
            <p>
              Sí. tol.ar migra tu catálogo completo (nombre, precio, descripción, fotos y variantes)
              sin costo. Mirá el detalle en{" "}
              <Link href="/vs-tiendanube" className="underline">tol.ar vs Tiendanube</Link>.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Dejá de pagar comisión por venta</h2>
            <p className="text-amber-50 mb-8">
              Con tol.ar no se descuenta nada de tus ventas. Migramos tu catálogo gratis si ya
              tenés tu tienda armada en Tiendanube.
            </p>
            <Link
              href="/migrar/sistema"
              className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-colors"
            >
              Migrar mi catálogo gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="cuanto-cobra-tiendanube-de-comision-argentina" />
      <Footer brand={brand} />
    </>
  )
}
