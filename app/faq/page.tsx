import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Tiendas Online en Argentina",
  description:
    "Respondemos las 10 preguntas más frecuentes sobre cómo crear y vender en una tienda online en Argentina. Gratis, sin CUIT, con MercadoPago y envíos incluidos.",
  keywords:
    "preguntas frecuentes tienda online argentina, faq tienda online, como crear tienda online argentina, vender online argentina preguntas",
  alternates: {
    canonical: "https://tol.ar/faq",
  },
  openGraph: {
    title: "Preguntas Frecuentes sobre Tiendas Online en Argentina | tol.ar",
    description:
      "Todo lo que necesitás saber para crear tu tienda online en Argentina. Las 10 preguntas más comunes respondidas.",
    type: "website",
    url: "https://tol.ar/faq",
  },
}

const preguntas = [
  {
    q: "¿Cómo crear una tienda online gratis en Argentina?",
    a: "Con tol.ar podés crear tu tienda online gratis en menos de 2 minutos. Entrás a tol.ar, elegís un nombre para tu tienda, subís tus productos y ya podés empezar a vender. No necesitás saber programar, no necesitás tarjeta de crédito y no hay costos ocultos. El plan gratis no vence ni tiene límite de tiempo.",
  },
  {
    q: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina?",
    a: "Para emprendedores argentinos que empiezan, tol.ar es una buena opción: es completamente gratis, está en pesos, tiene MercadoPago y Andreani integrados, y se crea en minutos. Algunas plataformas cobran comisión extra del 2% en el plan gratis con MercadoPago, y otras plataformas internacionales como Shopify cuestan desde USD 29 por mes (fuente: shopify.com/pricing, precios verificados al 16/08/2026). Si ya tenés volumen y necesitás integraciones muy específicas, ahí sí puede convenir evaluar otras opciones.",
  },
  {
    q: "¿Qué necesito para vender por internet en Argentina?",
    a: "Solo necesitás tres cosas: una tienda online (tol.ar te la da gratis), un medio de cobro (MercadoPago es el más usado, también es gratis) y una forma de enviar los productos (Andreani o Correo Argentino). Con eso ya podés vender. No necesitás local, no necesitás empleados y podés empezar hoy mismo.",
  },
  {
    q: "¿Puedo vender online sin CUIT en Argentina?",
    a: "Sí. Podés crear tu tienda y vender sin CUIT. tol.ar no te pide CUIT para registrarte. Si usás MercadoPago, también podés operar sin CUIT al principio. Lo que sí: si empezás a vender montos significativos, la AFIP puede requerirte que te inscribas como monotributista. Pero para empezar y probar si tu negocio funciona, podés hacerlo sin CUIT.",
  },
  {
    q: "¿Cuánto cuesta tener una tienda online en Argentina?",
    a: "Con tol.ar, el costo es cero. No hay mensualidad, no hay comisión por venta, no hay límite de productos. La única comisión que pagás es la de MercadoPago cuando te compran con tarjeta (entre 1,80% y 7,61% según el medio de pago, fuente: mercadopago.com.ar/ayuda/220, verificado al 19/08/2026), pero eso lo cobra MercadoPago directamente, no tol.ar. Si ofrecés transferencia bancaria, esa comisión también es cero.",
  },
  {
    q: "¿Cómo cobro con MercadoPago en mi tienda online?",
    a: "Si tu tienda está en tol.ar, conectar MercadoPago es inmediato: vas a Configuración → Medios de pago → MercadoPago, autorizás con tu cuenta de MercadoPago y listo. Tus clientes pueden pagar con tarjeta de crédito, débito, cuotas o transferencia. La comisión de MercadoPago depende del medio de pago: débito ~1,80%, crédito 1 cuota ~7,61%. tol.ar no cobra nada adicional.",
  },
  {
    q: "¿Cómo envío los productos de mi tienda online en Argentina?",
    a: "Las dos opciones más usadas en Argentina son Andreani y Correo Argentino. Con tol.ar, podés configurar envíos por peso y zona, o un costo fijo. También podés ofrecer retiro en local si tenés un punto de entrega. Para envíos frecuentes, Andreani tiene convenios especiales para tiendas online que bajan bastante el costo por bulto.",
  },
  {
    q: "¿Puedo vender sin comisiones en Argentina?",
    a: "Sí. Con tol.ar no pagás comisión por venta. Si además ofrecés pago por transferencia bancaria, tampoco pagás comisión a MercadoPago. La única comisión que existe es la de MercadoPago cuando el cliente paga con tarjeta, y esa la cobra MercadoPago (no tol.ar). Algunas otras plataformas, en su plan gratis, cobran comisión adicional por venta cuando usás MercadoPago; el porcentaje exacto varía según la plataforma.",
  },
  {
    q: "¿Cuánto tarda en crearse una tienda online?",
    a: "Con tol.ar, menos de 2 minutos para tener la tienda activa. Subir los productos tarda según cuántos tengas: un catálogo de 10 productos lo cargás en 15-20 minutos. Si tenés más de 100 productos, tol.ar tiene importación masiva desde un archivo Excel para que no tengas que cargar uno por uno.",
  },
  {
    q: "¿Cómo promociono mi tienda online en Argentina?",
    a: "Las formas más efectivas para empezar son: Instagram y TikTok con fotos y videos de tus productos (orgánico, sin pagar), WhatsApp Business para vender a tus contactos directos, y grupos de Facebook de tu ciudad o rubro. Una vez que empezás a tener ventas y saldo, podés probar anuncios pagos en Instagram o Google. tol.ar te da el link de tu tienda para compartir en todas estas redes.",
  },
]

export default async function FaqPage() {
  const brand = await getBrand()
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
      { "@type": "ListItem", position: 2, name: "Preguntas Frecuentes", item: "https://tol.ar/faq" },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes sobre tiendas online en Argentina
            </h1>
            <p className="text-xl text-gray-600">
              Todo lo que necesitás saber para crear tu tienda online y empezar a vender.
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {preguntas.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6 open:shadow-md transition-shadow"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg leading-snug list-none flex justify-between items-start gap-4">
                  <span>{item.q}</span>
                  <span className="text-green-600 text-xl mt-0.5 shrink-0">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">¿Listo para crear tu tienda?</h2>
            <p className="text-green-100 mb-8">
              Gratis, en 2 minutos, sin tarjeta de crédito. Sin comisiones por venta.
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
      <Footer brand={brand} />
    </>
  )
}
