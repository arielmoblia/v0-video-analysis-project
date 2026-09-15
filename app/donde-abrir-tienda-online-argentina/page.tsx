import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "¿Dónde Abrir mi Tienda Online en Argentina? Guía 2026",
  description:
    "Marketplace, redes sociales o tienda propia: las opciones reales para abrir tu tienda online en Argentina, con ventajas y límites de cada una.",
  keywords:
    "donde abrir tienda online argentina, donde vender por internet, marketplace vs tienda propia, abrir tienda online gratis",
  alternates: {
    canonical: "https://tol.ar/donde-abrir-tienda-online-argentina",
  },
  openGraph: {
    title: "¿Dónde Abrir mi Tienda Online en Argentina?",
    description:
      "Marketplace, redes sociales o tienda propia: las opciones reales para abrir tu tienda online en Argentina.",
    type: "article",
    url: "https://tol.ar/donde-abrir-tienda-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "¿Dónde Abrir mi Tienda Online en Argentina?",
  description:
    "Comparación de las opciones reales para vender online en Argentina: marketplace, redes sociales y tienda propia.",
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
    "@id": "https://tol.ar/donde-abrir-tienda-online-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Es mejor vender en un marketplace o tener tienda propia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende del objetivo. Un marketplace como Mercado Libre te da visibilidad inmediata pero con comisión por venta y sin marca propia. Una tienda propia no cobra comisión por venta y te deja construir tu marca, pero la visibilidad inicial la generás vos (redes, boca en boca, SEO).",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo vender solo por Instagram o Facebook sin tienda?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, y mucha gente empieza así. El límite aparece cuando crece el volumen: no hay carrito ni cobro automático, cada venta se coordina a mano por mensaje. Una tienda online resuelve eso sin reemplazar las redes, que siguen sirviendo para mostrar el producto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta abrir una tienda online propia en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con tol.ar, abrir la tienda no tiene costo. Se paga solo lo que cobra el medio de pago que uses (por ejemplo MercadoPago) cuando el cliente paga con tarjeta.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    {
      "@type": "ListItem",
      position: 2,
      name: "¿Dónde Abrir mi Tienda Online en Argentina?",
      item: "https://tol.ar/donde-abrir-tienda-online-argentina",
    },
  ],
}

export default async function DondeAbrirTiendaOnlineArgentina() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — julio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Dónde Abrir mi Tienda Online en Argentina?
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Marketplace, redes sociales o tienda propia. Cada opción sirve para algo distinto —
              acá te mostramos las diferencias reales para que elijas con criterio, no al azar.
            </p>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>Las tres opciones para vender online en Argentina</h2>
            <p>
              Cuando alguien decide vender por internet en Argentina, en general elige entre tres
              caminos: un marketplace (como Mercado Libre), vender directo por redes sociales
              (Instagram, Facebook, WhatsApp) o abrir una tienda online propia. No son excluyentes:
              muchos negocios usan más de uno al mismo tiempo.
            </p>

            <h2>Vender en un marketplace</h2>
            <p>
              Un marketplace es una plataforma donde conviven miles de vendedores distintos. La
              ventaja principal es la visibilidad: la gente ya está ahí buscando productos, no
              tenés que atraerla vos. A cambio, hay comisión sobre cada venta, dependés de las
              reglas de la plataforma (que pueden cambiar sin aviso) y competís directo, en la
              misma página, con otros vendedores que ofrecen lo mismo más barato.
            </p>
            <p>
              Tampoco es tu marca la que crece: el cliente recuerda que compró "en el marketplace",
              no necesariamente tu nombre.
            </p>

            <h2>Vender por redes sociales</h2>
            <p>
              Instagram, Facebook y WhatsApp son gratis y es donde mucha gente arranca. El problema
              aparece cuando crece el volumen de consultas: no hay carrito de compra, cada pedido
              se coordina a mano, y es fácil perder el hilo de quién pagó, qué talle pidió o a
              dónde hay que enviar. Además, el negocio queda a merced de que la cuenta no tenga
              problemas (caídas, suspensiones, cambios de algoritmo que bajan el alcance).
            </p>

            <h2>Tener una tienda online propia</h2>
            <p>
              Una tienda propia es un sitio con tu marca, tus productos, carrito de compra y cobro
              automático. El cliente entra, elige, paga y el pedido te llega listo — no hace falta
              que estés disponible para cerrar cada venta. No hay comisión por vender (solo lo que
              cobre el medio de pago que uses) y con el tiempo la tienda también empieza a aparecer
              en buscadores y en las respuestas de las IAs cuando alguien busca tu tipo de producto.
            </p>
            <p>
              La diferencia con el marketplace es que la visibilidad inicial la generás vos —con
              redes, recomendaciones, contenido— en lugar de heredarla de una plataforma ajena.
            </p>

            <h2>Lo que más funciona: combinarlas</h2>
            <p>
              En la práctica, lo que mejor funciona no es elegir una sola opción sino usar cada
              una para lo que sirve:
            </p>
            <ul>
              <li>Redes sociales para mostrar producto, generar confianza y responder consultas</li>
              <li>Tienda propia para que la venta se cierre sola, sin depender de que alguien esté disponible</li>
              <li>Marketplace (si el rubro lo justifica) como canal extra de visibilidad, sabiendo que ahí hay comisión y competencia directa</li>
            </ul>
            <p>
              Con <Link href="/">tol.ar</Link> podés tener tu tienda propia gratis y conectarla
              con WhatsApp e Instagram, sin dejar de usar esos canales para mostrar tus productos.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Es mejor vender en un marketplace o tener tienda propia?</h3>
            <p>
              Depende del objetivo. El marketplace da visibilidad inmediata con comisión y sin
              marca propia. La tienda propia no cobra comisión por venta y construye tu marca,
              pero la visibilidad la generás vos.
            </p>

            <h3>¿Puedo vender solo por Instagram o Facebook sin tienda?</h3>
            <p>
              Sí, y es común empezar así. El límite llega cuando crece el volumen: no hay carrito
              ni cobro automático, cada venta se coordina a mano.
            </p>

            <h3>¿Cuánto cuesta abrir una tienda online propia en Argentina?</h3>
            <p>
              Con tol.ar, abrir la tienda no cuesta nada. Solo se paga lo que cobra el medio de
              pago (por ejemplo MercadoPago) cuando el cliente paga con tarjeta.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Abrí tu tienda propia gratis</h2>
            <p className="text-amber-50 mb-8">
              Sin comisión por venta, conectada a WhatsApp e Instagram. Lista en minutos.
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
