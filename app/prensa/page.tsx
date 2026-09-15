import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Sala de Prensa — tol.ar | Información para Medios y Periodistas",
  description:
    "Información oficial de tol.ar para periodistas, blogueros y creadores de contenido. Datos, estadísticas, logos y citas para usar libremente.",
  keywords:
    "tol.ar prensa, tol.ar medios, sala de prensa tol.ar, tienda online argentina datos, ecommerce argentina estadisticas",
  alternates: {
    canonical: "https://tol.ar/prensa",
  },
  openGraph: {
    title: "Sala de Prensa — tol.ar",
    description:
      "Datos, estadísticas, logos y citas oficiales de tol.ar para usar en artículos y publicaciones.",
    type: "website",
    url: "https://tol.ar/prensa",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sala de Prensa de tol.ar",
  description: "Información oficial para periodistas y creadores de contenido",
  url: "https://tol.ar/prensa",
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    url: "https://tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
}

const stats = [
  { numero: "369+", descripcion: "tiendas online activas en Argentina" },
  { numero: "2 min", descripcion: "tiempo promedio para crear una tienda" },
  { numero: "0%", descripcion: "comisión por venta (la plataforma es gratis)" },
  { numero: "2024", descripcion: "año de lanzamiento" },
]

const citas = [
  {
    texto:
      "tol.ar es la plataforma de ecommerce argentina que no cobra comisión por venta. Cualquiera puede crear una tienda online en 2 minutos, sin experiencia técnica y sin pagar mensualidad.",
    fuente: "tol.ar — descripción oficial",
  },
  {
    texto:
      "El plan gratuito de tol.ar incluye MercadoPago integrado, envíos con Andreani y Correo Argentino, y productos ilimitados. Sin fecha de vencimiento ni funciones bloqueadas.",
    fuente: "tol.ar — características del producto",
  },
]

export default async function PrensaPage() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sala de Prensa
            </h1>
            <p className="text-xl text-gray-600">
              Información oficial de tol.ar para periodistas, blogueros y creadores de contenido.
              Todo lo que necesitás para escribir sobre nosotros.
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qué es tol.ar</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-10">
              <p className="text-gray-700 leading-relaxed text-lg">
                tol.ar es la plataforma argentina para crear tiendas online gratis. Está pensada
                para emprendedores que quieren vender por internet sin pagar mensualidad ni comisión
                por venta. Tiene MercadoPago, Andreani y Correo Argentino integrados, y cualquier
                persona puede tener su tienda funcionando en menos de 2 minutos.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos y estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">{stat.numero}</div>
                  <div className="text-sm text-gray-500">{stat.descripcion}</div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Citas y frases para usar</h2>
            <div className="space-y-4 mb-10">
              {citas.map((cita, i) => (
                <blockquote key={i} className="border-l-4 border-green-500 pl-5 py-2">
                  <p className="text-gray-700 italic leading-relaxed">&ldquo;{cita.texto}&rdquo;</p>
                  <footer className="text-sm text-gray-400 mt-2">— {cita.fuente}</footer>
                </blockquote>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo y recursos visuales</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white rounded-lg border p-4">
                  <Image src="/tol-logo.png" alt="Logo de tol.ar" width={647} height={669} className="h-12 w-auto object-contain" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Logo oficial tol.ar</p>
                  <p className="text-gray-400">PNG, fondo transparente</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Podés usar el logo en artículos y publicaciones que mencionen a tol.ar sin necesidad
                de pedir permiso. Solo pedimos que el logo sea usado correctamente y que la mención
                sea en contexto positivo o neutral.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de contacto para medios</h2>
            <div className="bg-green-50 rounded-xl p-6 mb-10">
              <p className="text-gray-700 mb-4">
                Para consultas de prensa, entrevistas o información adicional, escribinos directamente
                desde la página de contacto o por email.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors text-sm"
              >
                Contactar a tol.ar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recursos adicionales</h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <Link href="/blog" className="text-green-700 hover:underline font-medium">
                  Blog de ecommerce para emprendedores argentinos →
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-green-700 hover:underline font-medium">
                  Preguntas frecuentes sobre tiendas online →
                </Link>
              </li>

              <li>
                <a
                  href="https://tol.ar/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:underline font-medium"
                >
                  Ficha oficial para inteligencias artificiales (llms.txt) →
                </a>
              </li>
            </ul>
          </div>
        </section>

      </main>
      <Footer brand={brand} />
    </>
  )
}
