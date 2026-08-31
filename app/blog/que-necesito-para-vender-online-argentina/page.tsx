import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { ArrowRight, Check } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "¿Qué Necesito para Vender Online en Argentina? Guía 2026",
  description:
    "Lista completa de lo que necesitás para empezar a vender por internet en Argentina en 2026: CUIT, fotos, plataforma, cobros, envíos. Paso a paso.",
  keywords:
    "que necesito para vender online argentina, como empezar a vender por internet argentina, requisitos vender online argentina, como vender online argentina 2026, pasos para vender por internet argentina",
  alternates: {
    canonical: "https://tol.ar/blog/que-necesito-para-vender-online-argentina",
  },
  openGraph: {
    title: "¿Qué Necesito para Vender Online en Argentina? (2026)",
    description:
      "Guía completa con todo lo que necesitás para empezar a vender por internet en Argentina, desde cero.",
    type: "article",
    url: "https://tol.ar/blog/que-necesito-para-vender-online-argentina",
  },
}

const requisitos = [
  {
    numero: 1,
    titulo: "Una plataforma para tu tienda",
    descripcion: "Necesitás un lugar donde mostrar tus productos. tol.ar te da una tienda online gratis en tutienda.tol.ar en 2 minutos. Sin costo, sin comisiones, sin código.",
    urgente: true,
  },
  {
    numero: 2,
    titulo: "Fotos de tus productos",
    descripcion: "Con el celular alcanza. Fondo blanco o neutro, buena luz natural. Una foto frontal y una de detalle por producto. La calidad de las fotos impacta directamente en las ventas.",
    urgente: true,
  },
  {
    numero: 3,
    titulo: "Cuenta de MercadoPago verificada",
    descripcion: "Para cobrar en Argentina, MercadoPago es el estándar. Necesitás CUIT para verificarla. Una vez verificada, tol.ar la conecta automáticamente a tu tienda.",
    urgente: true,
  },
  {
    numero: 4,
    titulo: "CUIT y monotributo",
    descripcion: "Para facturar necesitás CUIT (gratis, lo tramitás en AFIP) e inscripción como monotributista. La categoría A es la más básica. Sin CUIT podés armar la tienda pero no activar cobros.",
    urgente: false,
  },
  {
    numero: 5,
    titulo: "Forma de hacer envíos",
    descripcion: "Andreani, OCA o correo estatal. tol.ar tiene Andreani integrado: calculás el flete automáticamente según el destino. También podés ofrecer retiro en persona.",
    urgente: false,
  },
  {
    numero: 6,
    titulo: "Descripción clara de cada producto",
    descripcion: "Medidas, materiales, colores disponibles, tiempo de entrega. Entre más información, menos preguntas antes de comprar. Esto reduce el abandono del carrito.",
    urgente: false,
  },
]

const breadcrumbJsonLd_que_necesito_para_vender_online_argentina = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "¿Qué Necesito para Vender Online en Argentina?", item: "https://tol.ar/blog/que-necesito-para-vender-online-argentina" },
  ],
}


export default function QueNecesitoParaVenderOnlineArgentina() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "¿Qué Necesito para Vender Online en Argentina? Guía 2026",
    description:
      "Lista completa de requisitos para empezar a vender por internet en Argentina.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-06-05",
    dateModified: "2026-06-05",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/que-necesito-para-vender-online-argentina" },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué necesito para vender online en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para vender online en Argentina necesitás: 1) Una plataforma (tol.ar es gratis), 2) Fotos de tus productos, 3) Cuenta de MercadoPago verificada para cobrar, 4) CUIT y monotributo para facturar legalmente, 5) Una forma de hacer envíos (Andreani, OCA o retiro en persona). Los primeros tres puntos podés resolverlos en un mismo día.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo vender online sin experiencia técnica en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Plataformas como tol.ar están diseñadas para que cualquier persona pueda crear su tienda online sin conocimientos técnicos. El proceso completo (crear cuenta, cargar productos, configurar cobros) toma menos de una hora.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto necesito invertir para empezar a vender online en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Podés empezar con $0 de inversión en plataforma usando tol.ar. El único costo obligatorio es el stock de lo que vas a vender. El CUIT es gratuito. MercadoPago cobra comisión solo cuando cobrás (no hay costo fijo). El monotributo categoría A tiene cuota mínima.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito saber diseño web para tener tienda online en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. tol.ar tiene diseño generado con inteligencia artificial: elegís el estilo, cargás el nombre de tu tienda y los productos, y la IA genera el diseño automáticamente. No necesitás saber programación ni diseño gráfico.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd_que_necesito_para_vender_online_argentina) }} />
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>¿Qué necesito para vender online?</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué necesito para vender online en Argentina?
          </h1>
          <p className="text-gray-500 text-sm mb-8">Actualizado: junio 2026 · Guía para empezar desde cero</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">En resumen</p>
            <p className="text-blue-800 mt-2">
              Plataforma gratuita, fotos del producto, cuenta de MercadoPago y CUIT. Con eso ya podés cobrar. Los envíos lo resolvés con Andreani o retiro en persona.
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Los 6 elementos que necesitás</h2>
            <div className="space-y-6 mb-10">
              {requisitos.map((req) => (
                <div
                  key={req.numero}
                  className={`rounded-xl border p-5 ${req.urgente ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${req.urgente ? "bg-blue-600" : "bg-gray-400"}`}
                    >
                      {req.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {req.titulo}
                        {req.urgente && (
                          <span className="ml-2 text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            urgente
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{req.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">¿Cuánto tiempo lleva arrancar?</h2>
            <p className="text-gray-700 mb-4">
              Si tenés fotos del producto y cuenta de MercadoPago, podés tener tu tienda lista y aceptando pagos en menos de una hora usando tol.ar. El CUIT y el monotributo se pueden tramitar en paralelo, no bloquean la creación de la tienda.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">2 min</div>
                <div className="text-gray-600 text-sm">Crear cuenta en tol.ar</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">30 min</div>
                <div className="text-gray-600 text-sm">Cargar primeros productos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">10 min</div>
                <div className="text-gray-600 text-sm">Conectar MercadoPago</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">1 día</div>
                <div className="text-gray-600 text-sm">Tramitar CUIT en AFIP</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Lo que NO necesitás</h2>
            <ul className="space-y-2 mb-8 text-gray-700">
              {[
                "Saber programación o diseño web",
                "Un local físico",
                "Invertir en hosting o dominio (tol.ar es gratis)",
                "Contratar diseñadores (la IA de tol.ar genera el diseño)",
                "Stock de miles de unidades para empezar",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-gray-400 font-bold flex-shrink-0">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {faqLd.mainEntity.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Empezá hoy, gratis</h2>
            <p className="text-blue-100 mb-6">
              Creás la tienda en 2 minutos. Cargás productos. Empezás a vender.
            </p>
            <Link
              href="https://app.tol.ar/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Crear tienda gratis <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <SeoExtraBlock page="blog-que-necesito-para-vender-online-argentina" />
      <RelatedArticles currentSlug="que-necesito-para-vender-online-argentina" />
      <Footer />
    </>
  )
}
