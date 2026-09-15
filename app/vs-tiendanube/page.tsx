import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, ExternalLink, Zap, ShieldCheck, Package } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

// No se pre-genera estática: lee el JSON de precios en cada visita, así si el
// chequeo semanal (verificar-precios-competencia.js) actualiza el archivo,
// se ve reflejado sin necesitar un build nuevo. Mismo patrón que /comparar.
export const dynamic = "force-dynamic"

type DatoFuente = {
  texto: string
  fuente: string
  verificado: string
  alerta: boolean
}

type PreciosCompetencia = {
  tiendanube: { planPago: DatoFuente; transaccion: DatoFuente }
}

function leerPreciosCompetencia(): PreciosCompetencia {
  const filePath = path.join(process.cwd(), "data", "precios-competencia.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export const metadata: Metadata = {
  title: "tol.ar vs Tiendanube: comparativa y migración gratis (2026)",
  description:
    "Comparativa entre tol.ar y Tiendanube: precio mensual, comisión por venta y dominio propio, con fuente oficial citada. Te migramos tu catálogo de Tiendanube gratis.",
  keywords:
    "tol.ar vs tiendanube, alternativa a tiendanube, migrar de tiendanube, cambiarme de tiendanube, tiendanube alternativa gratis",
  alternates: {
    canonical: "https://tol.ar/vs-tiendanube",
  },
  openGraph: {
    title: "tol.ar vs Tiendanube: comparativa y migración gratis",
    description:
      "Precio, comisión por venta y dominio propio: tol.ar y Tiendanube, comparados con fuente citada. Migración de catálogo gratis.",
    type: "article",
    url: "https://tol.ar/vs-tiendanube",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "tol.ar vs Tiendanube: comparativa y migración gratis",
  description:
    "Comparativa entre tol.ar y Tiendanube: precio mensual, comisión por venta y dominio propio, con fuente oficial citada.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/vs-tiendanube",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta pasarme de Tiendanube a tol.ar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nada. tol.ar es gratis y no cobra comisión por venta, y además te migramos el catálogo de productos desde Tiendanube sin costo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Pierdo mis productos al migrar desde Tiendanube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Se migra el catálogo completo: nombre, precio, descripción, fotos y variantes de cada producto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda la migración desde Tiendanube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El objetivo es tenerla lista en 24 horas desde que se recibe el catálogo exportado.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia principal entre tol.ar y Tiendanube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar es gratis y no cobra comisión por venta. Tiendanube tiene un plan gratis, pero para funciones más avanzadas cobra planes pagos y en cualquier plan cobra un costo por transacción sobre cada venta.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "tol.ar vs Tiendanube", item: "https://tol.ar/vs-tiendanube" },
  ],
}

function FuenteLink({ dato }: { dato: DatoFuente }) {
  return (
    <>
      <span>{dato.texto}</span>
      {dato.alerta && (
        <span className="block text-[11px] text-red-500 mt-1">⚠ posible cambio, en revisión</span>
      )}
      <a
        href={dato.fuente}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-800 mt-1"
      >
        Ver fuente <ExternalLink className="w-3 h-3" />
      </a>
    </>
  )
}

export default async function VsTiendanube() {
  const brand = await getBrand()
  const precios = leerPreciosCompetencia()

  const filas = [
    { criterio: "Costo mensual", tolar: "Gratis", tn: precios.tiendanube.planPago },
    { criterio: "Comisión por venta", tolar: "Sin comisión por venta", tn: precios.tiendanube.transaccion },
    { criterio: "Dominio propio", tolar: "Sí, incluido", tn: "Sí (en planes pagos)" as const },
    {
      criterio: "Migrar tu catálogo",
      tolar: "Te lo migramos nosotros, gratis, en 24 horas",
      tn: "Exportación e importación a cargo del usuario",
    },
    { criterio: "WhatsApp integrado", tolar: "Sí", tn: "Con apps adicionales" as const },
  ]

  const ultimaVerificacion = [precios.tiendanube.planPago.verificado, precios.tiendanube.transaccion.verificado]
    .sort()
    .slice(-1)[0]

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
              Comparativa — septiembre 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              tol.ar vs Tiendanube
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Precio, comisión por venta y dominio propio, comparados con fuente oficial citada. Si
              ya tenés tu catálogo cargado en Tiendanube, te lo migramos gratis.
            </p>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Criterio</th>
                  <th className="p-3 border border-slate-200 font-semibold text-amber-700">tol.ar</th>
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Tiendanube</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.criterio} className="odd:bg-white even:bg-slate-50">
                    <td className="p-3 border border-slate-200 font-medium text-slate-700">{fila.criterio}</td>
                    <td className="p-3 border border-slate-200 text-slate-600">{fila.tolar}</td>
                    <td className="p-3 border border-slate-200 text-slate-600">
                      {typeof fila.tn === "string" ? fila.tn : <FuenteLink dato={fila.tn} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">
              Precios y comisiones de Tiendanube con link directo a su página oficial. Verificado por
              última vez el {ultimaVerificacion}. Un chequeo automático revisa cada semana si el dato
              sigue igual en la fuente. Para condiciones vigentes, consultá siempre el sitio oficial
              de Tiendanube.
            </p>
          </div>
        </section>

        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Zap className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">Migración gratis</h3>
              <p className="text-sm text-slate-600">
                Exportás tu catálogo de Tiendanube y nosotros lo importamos por vos, sin costo.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Package className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">Listo en 24 horas</h3>
              <p className="text-sm text-slate-600">
                El objetivo es tener productos, precios, fotos y variantes migrados en 24 horas
                desde que recibimos el catálogo exportado.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <ShieldCheck className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">No perdés nada</h3>
              <p className="text-sm text-slate-600">
                Se migra el catálogo completo: nombre, precio, descripción, fotos y variantes de
                cada producto.
              </p>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
            <h2>¿Por qué pasarte a tol.ar?</h2>
            <p>
              tol.ar es gratis y no cobra comisión por venta, con MercadoPago y Andreani ya
              integrados y pensada para el mercado argentino desde el primer minuto. Tiendanube
              tiene sentido si necesitás funciones más avanzadas de gestión y estás dispuesto a
              pagar un plan mensual y un costo por transacción a medida que crece el negocio.
            </p>
            <p>
              Si ya armaste tu catálogo en Tiendanube, no hace falta cargarlo todo de nuevo a mano:
              lo migramos nosotros, gratis.
            </p>

            <h2>Preguntas frecuentes</h2>
            <h3>¿Cuánto cuesta pasarme de Tiendanube a tol.ar?</h3>
            <p>Nada. Es gratis, sin comisión por venta y la migración del catálogo no tiene costo.</p>
            <h3>¿Pierdo mis productos al migrar?</h3>
            <p>No, se migra el catálogo completo: nombre, precio, descripción, fotos y variantes.</p>
            <h3>¿Cuánto tarda la migración?</h3>
            <p>El objetivo es tenerla lista en 24 horas desde que se recibe el catálogo exportado.</p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Te importamos gratis tu catálogo de Tiendanube</h2>
            <p className="text-amber-50 mb-8">
              El objetivo: en 24 horas y sin costo. Elegí Tiendanube como plataforma de origen y listo.
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
      <Footer brand={brand} />
    </>
  )
}
