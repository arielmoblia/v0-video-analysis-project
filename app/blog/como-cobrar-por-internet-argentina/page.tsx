import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Cobrar por Internet en Argentina (2026)",
  description:
    "Guía completa para cobrar por tus ventas online en Argentina. MercadoPago, transferencia bancaria, Naranja X y otras opciones. Cuál conviene según lo que vendés.",
  keywords:
    "como cobrar por internet argentina, cobrar ventas online argentina, medios de pago tienda online argentina, mercadopago tienda online, como recibir pagos online argentina",
  alternates: {
    canonical: "https://tol.ar/blog/como-cobrar-por-internet-argentina",
  },
  openGraph: {
    title: "Cómo Cobrar por Internet en Argentina (2026)",
    description:
      "MercadoPago, transferencia, tarjeta. Cuál es la mejor forma de cobrar tus ventas online en Argentina según tu negocio.",
    type: "article",
    url: "https://tol.ar/blog/como-cobrar-por-internet-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Cobrar por Internet en Argentina (2026)",
  description:
    "Guía completa sobre medios de pago para vender online en Argentina: MercadoPago, transferencia bancaria, tarjetas y más. Cuál conviene para tu negocio.",
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
    "@id": "https://tol.ar/blog/como-cobrar-por-internet-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo puedo cobrar por mis ventas online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las opciones principales son MercadoPago (el más usado, acepta tarjetas, débito y saldo), transferencia bancaria CVU/CBU, y otras billeteras virtuales como Naranja X o Ualá. MercadoPago es el más conveniente porque permite cobrar con tarjeta sin que el comprador tenga cuenta.",
      },
    },
    {
      "@type": "Question",
      name: "¿MercadoPago cobra comisión por las ventas online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, MercadoPago cobra una comisión por cada transacción. Varía según el tipo de pago y si el comprador tiene o no cuenta en MercadoPago. Para ventas con tarjeta de crédito la comisión suele estar entre 4% y 6%. Con cuenta MercadoPago la comisión es menor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo cobrar por transferencia bancaria sin comisión?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Las transferencias entre cuentas argentinas (CVU o CBU) son gratuitas. Es la forma de cobrar con 0% de comisión, pero requiere que el comprador haga la transferencia manualmente, lo que puede reducir las conversiones. Muchas tiendas ofrecen descuento por transferencia para incentivar esta opción.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué necesito para empezar a cobrar con MercadoPago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solo una cuenta en MercadoPago verificada con tu DNI. Una vez verificada, podés generar links de pago, integrar con tu tienda online o recibir pagos con QR. Si tenés una tienda en tol.ar, la integración con MercadoPago se hace en menos de 2 minutos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda en acreditarse el dinero de una venta online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con MercadoPago: pagos con saldo de MercadoPago se acreditan en el momento. Pagos con tarjeta de débito en 1 día hábil. Tarjeta de crédito en 14 días hábiles (salvo que pagues comisión extra para acreditación inmediata). Transferencia bancaria: acreditación instantánea.",
      },
    },
  ],
}

export default async function CobroPorInternetPage() {
  const brand = await getBrand()
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
      <Header brand={brand} />
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
              <p className="text-sm text-indigo-600 font-medium mb-3">Medios de pago</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Cómo Cobrar por Internet en Argentina (2026)
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                La pregunta más común al empezar a vender online. Te explicamos todas las opciones
                disponibles en Argentina, cuánto cobra cada una y cuál conviene según tu negocio.
              </p>
              <div className="mt-4 text-sm text-gray-400">
                Actualizado: junio 2026 · 6 min de lectura
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Antes de empezar a vender online, todos tienen la misma duda: <strong>¿cómo hago para que me paguen?</strong>{" "}
                En Argentina hay varias opciones, y elegir bien puede significar la diferencia entre retener el 94% de cada venta o el 100%.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Las formas de cobrar online en Argentina
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                1. MercadoPago — el más usado
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Es el medio de pago más adoptado en Argentina para ventas online. Permite cobrar con
                tarjeta de crédito, débito, transferencia y saldo de MercadoPago sin que el comprador
                tenga que ir al banco ni hacer nada complicado.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                La comisión varía entre el 4% y el 6% por venta, dependiendo de cómo pague el comprador.
                Es la opción que más conversiones genera porque los compradores ya confían en ella y la tienen instalada.
              </p>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-lg">
                <p className="text-gray-700 text-sm">
                  <strong>En tol.ar</strong>, la integración con MercadoPago se activa en 2 minutos
                  desde el panel de tu tienda. No necesitás saber nada técnico.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                2. Transferencia bancaria — sin comisión
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las transferencias entre cuentas argentinas (CVU o CBU) son gratuitas. Ni el que
                envía ni el que recibe paga nada. Es la forma de cobrar con 0% de comisión.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                La desventaja es que el comprador tiene que hacer la transferencia manualmente y
                esperás confirmación. Para compensarlo, muchos vendedores ofrecen un descuento del
                5-10% para quienes pagan por transferencia.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                3. Otras billeteras virtuales
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Naranja X, Ualá, Personal Pay y otras billeteras virtuales permiten cobrar y pagar
                online. Son útiles para ciertos nichos pero tienen menor adopción que MercadoPago.
                Revisá si tu público objetivo las usa antes de integrarlas.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Cuánto cobra MercadoPago exactamente?
              </h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Tipo de pago</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Comisión aprox.</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Acreditación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Saldo MercadoPago</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">~3.99%</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Inmediata</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Tarjeta de débito</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">~4.49%</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">1 día hábil</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Tarjeta de crédito</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">~5.99%</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">14 días hábiles</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Transferencia bancaria</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">0%</td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">Inmediata</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                * Las comisiones de MercadoPago pueden variar. Verificá los valores actuales en su sitio oficial.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Cuál conviene según tu negocio?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                No hay una respuesta única. Depende de quién te compra y cómo prefiere pagar:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li><strong>Si vendés a clientes jóvenes:</strong> MercadoPago. Ya lo tienen y es el más cómodo para ellos.</li>
                <li><strong>Si vendés productos caros o a empresas:</strong> Transferencia bancaria. Sin comisión en ventas grandes hace diferencia.</li>
                <li><strong>Si querés maximizar conversiones:</strong> Ofrecé las dos opciones. Quién paga con tarjeta lo hace ahí; quién prefiere transferir, transfiere. Y poné un descuento del 5% por transferencia para incentivarla.</li>
              </ul>

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
                  Empezá a cobrar online hoy mismo
                </h2>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  Con tol.ar tenés tu tienda con MercadoPago integrado en 2 minutos. Gratis, sin comisiones por venta de nuestra parte, y sin saber nada técnico.
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
                    href="/blog/mercadopago-tienda-online"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    MercadoPago para tienda online →
                  </Link>
                  <Link
                    href="/blog/vender-online-sin-comisiones-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Vender sin comisiones →
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
      <RelatedArticles currentSlug="como-cobrar-por-internet-argentina" />
      <Footer brand={brand} />
    </>
  )
}
