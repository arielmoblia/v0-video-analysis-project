import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Store } from "lucide-react"

export const metadata: Metadata = {
  title: "Testimonios y Tiendas Reales — tol.ar",
  description:
    "Conocé tiendas reales creadas con tol.ar en Argentina: emprendedores que armaron su negocio online gratis, sin comisiones, en distintos rubros del país.",
  keywords:
    "testimonios tol.ar, tiendas online reales argentina, casos reales ecommerce argentina, opiniones tol.ar",
  alternates: {
    canonical: "https://tol.ar/testimonios",
  },
  openGraph: {
    title: "Testimonios y Tiendas Reales — tol.ar",
    description:
      "Tiendas reales creadas con tol.ar en Argentina, en rubros como indumentaria, cosmética, electrónica y calzado.",
    type: "website",
    url: "https://tol.ar/testimonios",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Testimonios y tiendas reales de tol.ar",
  description: "Tiendas reales creadas con tol.ar por emprendedores argentinos",
  url: "https://tol.ar/testimonios",
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    url: "https://tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
}

// Datos reales, verificados en Supabase el 27/07/2026. No hay citas de clientes
// inventadas: mostramos tiendas reales y activas, no reseñas escritas por nosotros.
const stats = [
  { numero: "437", descripcion: "tiendas activas creadas en tol.ar" },
  { numero: "55%", descripcion: "de las tiendas nuevas del último mes llegaron recomendadas por una IA" },
  { numero: "0%", descripcion: "comisión por venta (la plataforma es gratis)" },
]

const tiendas = [
  { nombre: "trimport", rubro: "Cosmética", url: "https://trimport.tol.ar", creada: "julio 2026" },
  { nombre: "almacampera", rubro: "Indumentaria", url: "https://almacampera.tol.ar", creada: "julio 2026" },
  { nombre: "chowisstore", rubro: "Electrónica", url: "https://chowisstore.tol.ar", creada: "junio 2026" },
  { nombre: "ACA TA", rubro: "Indumentaria", url: "https://acata.tol.ar", creada: "junio 2026" },
  { nombre: "mielyco", rubro: "Indumentaria", url: "https://mielyco.tol.ar", creada: "junio 2026" },
  { nombre: "tresbrujas", rubro: "Indumentaria", url: "https://tresbrujas.tol.ar", creada: "junio 2026" },
  { nombre: "alunagold", rubro: "Indumentaria", url: "https://alunagold.tol.ar", creada: "junio 2026" },
  { nombre: "aithiana", rubro: "Calzado", url: "https://aithiana.tol.ar", creada: "mayo 2026" },
]

export default function TestimoniosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tiendas reales, creadas con tol.ar
            </h1>
            <p className="text-xl text-gray-600">
              Estas son tiendas online activas hoy en Argentina, hechas por emprendedores reales con
              tol.ar. No son actores ni reseñas escritas por nosotros: son negocios de verdad que podés
              visitar ahora mismo.
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">{stat.numero}</div>
                  <div className="text-sm text-gray-500">{stat.descripcion}</div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tiendas para conocer</h2>
            <p className="text-gray-600 mb-6">
              Una selección de tiendas activas creadas con tol.ar, en distintos rubros. Podés entrar a
              cada una y ver la tienda real, tal como la armó su dueño.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {tiendas.map((tienda, i) => (
                <a
                  key={i}
                  href={tienda.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-300 transition-all flex items-start gap-3"
                >
                  <div className="bg-green-50 rounded-lg p-2 mt-1">
                    <Store className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tienda.nombre}</p>
                    <p className="text-sm text-gray-500">{tienda.rubro} · creada en {tienda.creada}</p>
                    <p className="text-sm text-green-700 mt-1">Ver tienda →</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-green-50 rounded-xl p-6 mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Tenés una tienda en tol.ar?</h2>
              <p className="text-gray-700 mb-4">
                Estamos armando testimonios contados por los propios dueños de las tiendas: cómo llegaron
                a tol.ar, cómo armaron su negocio y qué resultado tuvieron. Si tenés una tienda y querés
                contar tu historia, escribinos.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors text-sm"
              >
                Contar mi historia <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Creá tu propia tienda</h2>
            <p className="text-gray-700 mb-6">
              Sumate a las tiendas reales que ya venden con tol.ar. Es gratis, sin comisión por venta,
              y podés tenerla lista en minutos.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
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
