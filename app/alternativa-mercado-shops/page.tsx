import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Alternativa a Mi Página (ex Mercado Shops) en Argentina",
  description:
    "Diferencias entre Mi Página (Mercado Shops) y tener tu propia tienda online independiente. Comisiones, dominio propio y qué conviene según tu negocio.",
  keywords:
    "alternativa mi pagina, alternativa mercado shops, mercado shops vs tienda propia, tienda online independiente argentina",
  alternates: {
    canonical: "https://tol.ar/alternativa-mercado-shops",
  },
  openGraph: {
    title: "Alternativa a Mi Página (ex Mercado Shops) en Argentina",
    description:
      "Diferencias entre Mi Página (Mercado Shops) y tener tu propia tienda online independiente.",
    type: "article",
    url: "https://tol.ar/alternativa-mercado-shops",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Alternativa a Mi Página (ex Mercado Shops) en Argentina",
  description:
    "Comparación entre Mi Página (Mercado Shops) y una tienda online independiente: comisiones, dominio propio y a quién le conviene cada una.",
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
    "@id": "https://tol.ar/alternativa-mercado-shops",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es Mi Página (ex Mercado Shops)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es la herramienta de Mercado Libre para armar una tienda online dentro de su ecosistema, integrada con MercadoPago y con la infraestructura de Mercado Libre.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la principal diferencia con una tienda independiente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mi Página funciona dentro del ecosistema de Mercado Libre. Una tienda independiente como tol.ar es tu propio sitio, con tu dominio, sin depender de las reglas de un tercero, y podés elegir con qué medio de pago cobrar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Se puede migrar de Mi Página a una tienda propia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Se puede cargar el catálogo de productos en una tienda nueva e independiente sin perder la información del negocio (nombre, productos, fotos, precios).",
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
      name: "Alternativa a Mi Página (ex Mercado Shops)",
      item: "https://tol.ar/alternativa-mercado-shops",
    },
  ],
}

export default function AlternativaMercadoShops() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Comparativa — julio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Alternativa a Mi Página (ex Mercado Shops)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Qué diferencia a Mi Página de tener tu propia tienda online independiente, y a
              quién le conviene cada opción.
            </p>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>Qué es Mi Página (ex Mercado Shops)</h2>
            <p>
              Mi Página es la herramienta de Mercado Libre para armar una tienda online dentro de
              su ecosistema. Se integra con MercadoPago para cobrar y con la infraestructura de
              Mercado Libre para el resto del funcionamiento. Es una opción práctica si ya vendés
              en Mercado Libre y querés un espacio propio dentro del mismo sistema.
            </p>

            <h2>Qué es una tienda online independiente</h2>
            <p>
              Una tienda independiente, como la que armás con tol.ar, es tu propio sitio: no
              depende de un marketplace ni de las reglas de un tercero. Vos elegís el nombre, el
              diseño y con qué medio de pago cobrar (MercadoPago, transferencia u otros). El sitio
              es tuyo, no una sección dentro de otra plataforma.
            </p>

            <h2>Las diferencias que más importan</h2>
            <ul>
              <li>
                <strong>Independencia:</strong> con Mi Página, tu tienda vive dentro del
                ecosistema de Mercado Libre. Con una tienda propia, el sitio es enteramente tuyo.
              </li>
              <li>
                <strong>Medio de pago:</strong> Mi Página trabaja integrada con MercadoPago. En
                una tienda independiente podés elegir con qué medio de pago cobrar.
              </li>
              <li>
                <strong>Dominio:</strong> con tol.ar podés tener tu propio dominio
                (nombretienda.com) en vez de depender de la estructura de otra plataforma.
              </li>
              <li>
                <strong>Marca propia:</strong> una tienda independiente construye reconocimiento
                de marca para vos, no para el ecosistema donde está alojada.
              </li>
            </ul>
            <p>
              Los costos y comisiones exactos de Mi Página los define Mercado Libre y pueden
              cambiar — para conocer las condiciones vigentes, lo correcto es consultarlas
              directamente en su sitio oficial.
            </p>

            <h2>¿A quién le conviene cada una?</h2>
            <p>
              Si ya vendés activamente en Mercado Libre y querés aprovechar esa base de
              compradores, Mi Página tiene sentido como complemento. Si buscás un negocio con
              identidad propia, sin depender de las reglas de un tercero y sin resignar el control
              sobre el medio de pago, una tienda independiente como tol.ar es la opción.
            </p>
            <p>
              Con <Link href="/">tol.ar</Link> podés migrar tu catálogo de productos a una tienda
              propia, gratis y sin comisión por venta.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Qué es Mi Página (ex Mercado Shops)?</h3>
            <p>
              Es la herramienta de Mercado Libre para armar una tienda online dentro de su
              ecosistema, integrada con MercadoPago.
            </p>

            <h3>¿Cuál es la principal diferencia con una tienda independiente?</h3>
            <p>
              Mi Página funciona dentro del ecosistema de Mercado Libre. Una tienda independiente
              es tu propio sitio, sin depender de las reglas de un tercero.
            </p>

            <h3>¿Se puede migrar de Mi Página a una tienda propia?</h3>
            <p>
              Sí, se puede cargar el catálogo de productos en una tienda nueva sin perder la
              información del negocio.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Armá tu tienda independiente</h2>
            <p className="text-amber-50 mb-8">
              Gratis, sin comisión por venta y con tu propia identidad.
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
      <Footer />
    </>
  )
}
