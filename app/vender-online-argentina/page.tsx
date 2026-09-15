import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Online en Argentina: Guía Completa 2026",
  description:
    "Todo lo que necesitás para vender por internet en Argentina: qué vender, dónde, cómo cobrar, cómo enviar y cómo hacer que te encuentren. Guía paso a paso.",
  keywords:
    "como vender online argentina, vender por internet argentina, empezar a vender online, guia vender online argentina",
  alternates: {
    canonical: "https://tol.ar/vender-online-argentina",
  },
  openGraph: {
    title: "Cómo Vender Online en Argentina: Guía Completa 2026",
    description:
      "Todo lo que necesitás para vender por internet en Argentina: qué vender, dónde, cómo cobrar y cómo enviar.",
    type: "article",
    url: "https://tol.ar/vender-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Online en Argentina: Guía Completa 2026",
  description:
    "Guía paso a paso para vender por internet en Argentina: qué vender, dónde, medios de pago, envíos y cómo conseguir clientes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-07-08",
  dateModified: "2026-07-08",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/vender-online-argentina",
  },
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Cómo Vender Online en Argentina",
      item: "https://tol.ar/vender-online-argentina",
    },
  ],
}

export default async function VenderOnlineArgentina() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — julio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Online en Argentina
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              El camino completo, de principio a fin: qué vender, dónde abrir tu tienda, cómo
              cobrar, cómo enviar y cómo hacer que te encuentren.
            </p>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>El camino, paso a paso</h2>
            <p>
              Vender online en Argentina no requiere saber de tecnología ni tener un capital
              grande para arrancar. Requiere ordenar unas pocas decisiones, en este orden: qué
              vender, dónde vender, cómo cobrar, cómo enviar y cómo conseguir los primeros clientes.
              Acá va cada paso, con la guía completa para profundizar en el que necesites.
            </p>

            <h2>1. Elegí qué vender</h2>
            <p>
              Si todavía no tenés definido el producto, conviene mirar qué rubros tienen demanda
              real antes de invertir tiempo o plata. Indumentaria es históricamente el rubro más
              vendido en Argentina, pero no es la única opción — depende de tu conocimiento del
              tema, de tus proveedores y de cuánta competencia estás dispuesto a enfrentar.
            </p>
            <p>
              <Link href="/blog/que-productos-vender-online-argentina">Ver la guía completa de qué productos vender online →</Link>
            </p>

            <h2>2. Elegí dónde vender</h2>
            <p>
              Marketplace, redes sociales o tienda propia — cada uno sirve para algo distinto, y
              lo más común es terminar usando una combinación de los tres.
            </p>
            <p>
              <Link href="/donde-abrir-tienda-online-argentina">Ver la comparación de dónde abrir tu tienda →</Link>
            </p>

            <h2>3. Definí cómo vas a cobrar</h2>
            <p>
              Transferencia bancaria, MercadoPago o tarjeta — cada medio de pago tiene su propia
              comisión y su propia forma de acreditar el dinero. Definir esto antes de la primera
              venta evita sorpresas.
            </p>
            <p>
              <Link href="/blog/como-cobrar-por-internet-argentina">Ver la guía completa de cómo cobrar por internet →</Link>
            </p>

            <h2>4. Resolvé el envío</h2>
            <p>
              Andreani, Correo Argentino y los envíos a domicilio o a sucursal son las opciones
              más usadas. El costo y el tiempo de entrega varían según el destino y el peso del
              paquete.
            </p>
            <p>
              <Link href="/blog/envios-andreani-correo-argentino">Ver la guía completa de envíos →</Link>
            </p>

            <h2>5. Si sos monotributista, entendé qué te corresponde facturar</h2>
            <p>
              Vender online no cambia las reglas de AFIP: si superás los límites de tu categoría
              de monotributo o facturás sin estar inscripto, hay consecuencias. Vale la pena
              revisarlo antes de escalar el negocio.
            </p>
            <p>
              <Link href="/blog/vender-online-monotributista-argentina">Ver la guía completa para monotributistas →</Link>
            </p>

            <h2>6. Evitá los errores más comunes</h2>
            <p>
              La mayoría de las tiendas que no funcionan repiten los mismos errores: fotos malas,
              precios sin actualizar, falta de información sobre envío y pago, o abandonar la
              tienda después de la primera semana sin ventas.
            </p>
            <p>
              <Link href="/blog/errores-comunes-tienda-online-argentina">Ver los 10 errores más comunes →</Link>
            </p>

            <h2>7. Poné en marcha tu tienda</h2>
            <p>
              Con <Link href="/">tol.ar</Link> podés crear tu tienda online gratis, sin comisión
              por venta, conectada a WhatsApp y con todo lo necesario para empezar a vender hoy
              mismo.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Empezá a vender hoy</h2>
            <p className="text-amber-50 mb-8">
              Tu tienda online gratis, sin comisiones y lista en minutos.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-colors"
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
