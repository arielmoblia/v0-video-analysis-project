import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { ArrowRight, Check, AlertCircle } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "¿Puedo Vender Online Sin CUIT en Argentina? (2026)",
  description:
    "Guía clara sobre vender por internet sin CUIT en Argentina: qué está permitido, cómo arrancar, cuándo necesitás inscribirte y cómo cobra tol.ar sin CUIT.",
  keywords:
    "vender online sin cuit argentina, vender por internet sin cuit, como vender sin cuit argentina, tienda online sin cuit, vender sin ser monotributista argentina",
  alternates: {
    canonical: "https://tol.ar/blog/vender-sin-cuit-argentina",
  },
  openGraph: {
    title: "¿Puedo Vender Online Sin CUIT en Argentina?",
    description:
      "Respuesta directa: sí podés empezar, pero hay límites. Acá te explicamos qué podés hacer sin CUIT y cuándo necesitás tramitarlo.",
    type: "article",
    url: "https://tol.ar/blog/vender-sin-cuit-argentina",
  },
}

const breadcrumbJsonLd_vender_sin_cuit_argentina = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    { "@type": "ListItem", position: 3, name: "¿Puedo Vender Online Sin CUIT en Argentina?", item: "https://tol.ar/blog/vender-sin-cuit-argentina" },
  ],
}


export default function VenderSinCuitArgentina() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "¿Puedo Vender Online Sin CUIT en Argentina?",
    description:
      "Guía sobre vender por internet sin CUIT en Argentina: qué está permitido, cómo arrancar y cuándo inscribirse.",
    author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
    },
    datePublished: "2026-06-05",
    dateModified: "2026-06-05",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/blog/vender-sin-cuit-argentina" },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Puedo vender online sin CUIT en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, podés crear una tienda online sin CUIT y empezar a vender en Argentina. Sin embargo, para cobrar con MercadoPago necesitás tener CUIT y estar inscripto en AFIP (al menos como monotributista). La plataforma tol.ar te deja crear la tienda sin CUIT, pero para habilitar los cobros vas a necesitar tramitarlo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo tramito el CUIT para vender online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para obtener el CUIT en Argentina: 1) Entrá a afip.gob.ar, 2) Solicitá turno para inscripción, 3) Presentate con DNI, 4) AFIP te asigna el CUIT automáticamente. El CUIT es gratuito. Después necesitás inscribirte como monotributista (desde $0 en las categorías más bajas) para poder facturar.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hasta cuánto puedo vender sin facturar en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En Argentina, técnicamente toda actividad comercial requiere facturación desde el primer peso. Sin embargo, en la práctica muchos emprendedores empiezan a escala muy pequeña antes de formalizarse. Lo recomendable es inscribirse como monotributista apenas empezás a tener ventas regulares para evitar problemas con AFIP.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo crear una tienda online gratis sin CUIT en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. En tol.ar podés crear tu tienda online gratis sin necesitar CUIT para registrarte. Podés configurar tus productos, tu catálogo y diseñar tu tienda. Para activar los cobros con MercadoPago vas a necesitar tu CUIT y cuenta de MercadoPago verificada.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd_vender_sin_cuit_argentina) }} />
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Vender sin CUIT en Argentina</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Puedo vender online sin CUIT en Argentina?
          </h1>
          <p className="text-gray-500 text-sm mb-8">Actualizado: junio 2026</p>

          {/* Respuesta directa */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">Respuesta corta</p>
            <p className="text-blue-800 mt-2">
              Podés crear la tienda sin CUIT. Para cobrar con MercadoPago necesitás CUIT. Tramitarlo es gratis y tarda un día.
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Qué podés hacer sin CUIT</h2>
            <p className="text-gray-700 mb-4">
              Crear tu tienda online, cargar productos, elegir el diseño y compartir el link: todo eso lo podés hacer desde ya, sin CUIT. Plataformas como tol.ar no piden CUIT para registrarse ni para configurar tu catálogo.
            </p>
            <p className="text-gray-700 mb-4">
              Lo que no podés hacer sin CUIT es cobrar con MercadoPago o cualquier otra pasarela de pago habilitada en Argentina, porque todos los procesadores de pago exigen verificación fiscal.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
              <p className="text-blue-900 font-semibold text-sm mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">"¿Hay tiendas online gratis en Argentina si todavía no tengo CUIT?"</h3>
              <p className="text-blue-800">
                Sí. En tol.ar podés crear tu tienda gratis sin CUIT, cargar productos y tener todo
                listo. El CUIT solo lo vas a necesitar cuando actives los cobros con MercadoPago,
                y tramitarlo es gratis y rápido.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cómo tramitar el CUIT (es gratis)</h2>
            <ol className="space-y-4 mb-6">
              {[
                "Entrá a afip.gob.ar y buscá la opción de inscripción de personas humanas.",
                "Pedí turno online o presencial en tu agencia AFIP más cercana.",
                "Llevá DNI original. En muchos casos te asignan el CUIT en el momento.",
                "Con el CUIT, abrí tu cuenta en MercadoPago y verificala.",
                "Inscribite como monotributista si vas a tener actividad regular (categoría A arranca en $0 de cuota).",
              ].map((paso, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{paso}</span>
                </li>
              ))}
            </ol>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-amber-800 text-sm">
                En Argentina toda actividad comercial requiere facturación desde el primer peso vendido. Formalizarte como monotributista es la forma correcta y más económica de hacerlo.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Qué incluye tol.ar sin costo</h2>
            <ul className="space-y-3 mb-8">
              {[
                "Tienda online en tutienda.tol.ar (gratis, sin vencimiento)",
                "0% de comisión por venta",
                "MercadoPago integrado (activo con tu cuenta MercadoPago)",
                "Andreani para gestión de envíos",
                "Diseño con inteligencia artificial",
                "Sin tarjeta de crédito para empezar",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-700">{item}</span>
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

          {/* CTA */}
          <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Creá tu tienda mientras tramitás el CUIT</h2>
            <p className="text-blue-100 mb-6">
              Empezá a configurar productos y diseño hoy. Activás los cobros cuando tengas la cuenta de MercadoPago lista.
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
      <SeoExtraBlock page="blog-vender-sin-cuit-argentina" />
      <RelatedArticles currentSlug="vender-sin-cuit-argentina" />
      <Footer />
    </>
  )
}
