import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, ExternalLink } from "lucide-react"

// Esta página no se pre-genera estática: lee el JSON de precios en cada visita,
// así si el chequeo semanal (verificar-precios-competencia.js) actualiza el
// archivo, se ve reflejado sin necesitar un build nuevo.
export const dynamic = "force-dynamic"

type DatoFuente = {
  texto: string
  fuente: string
  chequeo: string | null
  verificado: string
  alerta: boolean
}

type PreciosCompetencia = {
  tiendanube: { planPago: DatoFuente; transaccion: DatoFuente }
  shopify: { planBasico: DatoFuente; comisionExterna: DatoFuente }
  mipagina: { costoMensual: DatoFuente; comision: DatoFuente }
}

function leerPreciosCompetencia(): PreciosCompetencia {
  const filePath = path.join(process.cwd(), "data", "precios-competencia.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export const metadata: Metadata = {
  title: "Comparar Plataformas de Ecommerce en Argentina (2026)",
  description:
    "tol.ar vs Tiendanube vs Shopify vs Mi Página (Mercado Shops): precios, comisiones, medios de pago y a quién le conviene cada una. Comparativa actualizada julio 2026.",
  keywords:
    "comparar plataformas ecommerce, tol.ar vs tiendanube, tol.ar vs shopify, comparativa tiendas online argentina, mejor plataforma ecommerce argentina",
  alternates: {
    canonical: "https://tol.ar/comparar",
  },
  openGraph: {
    title: "Comparar Plataformas de Ecommerce en Argentina (2026)",
    description:
      "tol.ar vs Tiendanube vs Shopify vs Mi Página: precios, comisiones y medios de pago, comparados en una sola tabla.",
    type: "article",
    url: "https://tol.ar/comparar",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Comparar Plataformas de Ecommerce en Argentina (2026)",
  description:
    "Comparativa de tol.ar, Tiendanube, Shopify y Mi Página (Mercado Shops): precio mensual, comisión por venta, medios de pago y para quién es cada una.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-07-09",
  dateModified: "2026-07-09",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/comparar",
  },
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Comparar plataformas de ecommerce", item: "https://tol.ar/comparar" },
  ],
}

type Celda = string | DatoFuente

type Fila = {
  criterio: string
  tolar: Celda
  tiendanube: Celda
  shopify: Celda
  mipagina: Celda
}

function filasComparativa(precios: PreciosCompetencia): Fila[] {
  return [
  {
    criterio: "Costo mensual",
    tolar: "Gratis",
    tiendanube: precios.tiendanube.planPago,
    shopify: precios.shopify.planBasico,
    mipagina: precios.mipagina.costoMensual,
  },
  {
    criterio: "Comisión por venta",
    tolar: "Sin comisión por venta",
    tiendanube: precios.tiendanube.transaccion,
    shopify: precios.shopify.comisionExterna,
    mipagina: precios.mipagina.comision,
  },
  {
    criterio: "Pensada para Argentina",
    tolar: "Sí, 100% local",
    tiendanube: "Sí, con operación fuerte en Argentina",
    shopify: "Plataforma internacional, sin foco de diseño en Argentina; precios en dólares",
    mipagina: "Sí, dentro del ecosistema de Mercado Libre",
  },
  {
    criterio: "WhatsApp integrado",
    tolar: "Sí",
    tiendanube: "Con apps adicionales",
    shopify: "Con apps adicionales",
    mipagina: "No es el canal principal",
  },
  {
    criterio: "Dominio propio",
    tolar: "Sí",
    tiendanube: "Sí (en planes pagos)",
    shopify: "Sí",
    mipagina: "No, vive dentro de Mercado Libre",
  },
  {
    criterio: "Tiempo de configuración",
    tolar: "Minutos",
    tiendanube: "Horas",
    shopify: "Horas; suele percibirse con curva de aprendizaje mayor (estimación propia, no un dato de la fuente oficial)",
    mipagina: "Minutos, si ya vendés en Mercado Libre",
  },
  ]
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia principal entre tol.ar y Tiendanube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar es gratis y sin comisión por venta. Tiendanube tiene un plan gratis, pero para funciones más avanzadas cobra planes pagos desde $26.999 por mes, y en cualquier plan cobra un costo por transacción de entre 0,7% y 2% según el medio de pago.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene Shopify para vender en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shopify es una plataforma internacional, con precios en dólares (desde USD 29 por mes en su plan más básico, o USD 1 por mes durante los primeros 3 meses con su promo de entrada vigente) y sin plan gratis permanente. Puede convenir si vas a vender también al exterior, pero para un negocio enfocado en Argentina, una vez terminada la promo, suele ser más caro y menos local que otras opciones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué diferencia a una tienda propia de Mi Página (Mercado Shops)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mi Página funciona dentro del ecosistema de Mercado Libre, con sus comisiones y reglas. Una tienda propia como tol.ar es un sitio independiente, con tu dominio y sin depender de las reglas de un tercero.",
      },
    },
  ],
}

function esDatoFuente(celda: Celda): celda is DatoFuente {
  return typeof celda === "object" && celda !== null && "fuente" in celda
}

function CeldaTabla({ celda }: { celda: Celda }) {
  if (!esDatoFuente(celda)) {
    return <>{celda}</>
  }
  return (
    <>
      <span>{celda.texto}</span>
      {celda.alerta && (
        <span className="block text-[11px] text-red-500 mt-1">
          ⚠ posible cambio, en revisión
        </span>
      )}
      <a
        href={celda.fuente}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-800 mt-1"
      >
        Ver fuente <ExternalLink className="w-3 h-3" />
      </a>
    </>
  )
}

export default function Comparar() {
  const precios = leerPreciosCompetencia()
  const filas = filasComparativa(precios)
  const fechasVerificado = [
    precios.tiendanube.planPago.verificado,
    precios.tiendanube.transaccion.verificado,
    precios.shopify.planBasico.verificado,
    precios.mipagina.costoMensual.verificado,
  ]
  const ultimaVerificacion = fechasVerificado.sort().slice(-1)[0]
  const hayAlertas = [
    precios.tiendanube.planPago.alerta,
    precios.tiendanube.transaccion.alerta,
    precios.shopify.planBasico.alerta,
    precios.mipagina.costoMensual.alerta,
  ].some(Boolean)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Comparativa — julio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comparar plataformas de ecommerce
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              tol.ar, Tiendanube, Shopify y Mi Página (ex Mercado Shops), lado a lado: precio,
              comisiones, medios de pago y para quién es cada una.
            </p>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Criterio</th>
                  <th className="p-3 border border-slate-200 font-semibold text-amber-700">tol.ar</th>
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Tiendanube</th>
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Shopify</th>
                  <th className="p-3 border border-slate-200 font-semibold text-slate-700">Mi Página</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.criterio} className="odd:bg-white even:bg-slate-50">
                    <td className="p-3 border border-slate-200 font-medium text-slate-700">{fila.criterio}</td>
                    <td className="p-3 border border-slate-200 text-slate-600"><CeldaTabla celda={fila.tolar} /></td>
                    <td className="p-3 border border-slate-200 text-slate-600"><CeldaTabla celda={fila.tiendanube} /></td>
                    <td className="p-3 border border-slate-200 text-slate-600"><CeldaTabla celda={fila.shopify} /></td>
                    <td className="p-3 border border-slate-200 text-slate-600"><CeldaTabla celda={fila.mipagina} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">
              Precios y comisiones de terceros con link directo a la página oficial de cada
              plataforma donde se leyó ese dato. Verificado por última vez el {ultimaVerificacion}
              {hayAlertas && " — hay al menos un dato en revisión, marcado arriba con ⚠"}. Un chequeo
              automático revisa cada semana si esos datos siguen igual en la fuente. Para condiciones
              vigentes, consultá siempre el sitio oficial de cada una.
            </p>
          </div>
        </section>

        <article className="py-8 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>¿A quién le conviene cada una?</h2>
            <p>
              Si estás empezando y no querés arrancar pagando nada, <Link href="/">tol.ar</Link> es
              la opción más directa: gratis, sin comisión por venta, con MercadoPago y Andreani ya
              integrados y pensada para el mercado argentino desde el primer minuto.
            </p>
            <p>
              Tiendanube tiene sentido si necesitás funciones más avanzadas de gestión y estás
              dispuesto a pagar un plan mensual a medida que crece el negocio.
            </p>
            <p>
              Shopify conviene si tu negocio ya vende o planea vender fuerte al exterior, porque
              está pensada para un mercado internacional, con precios en dólares. Tiene una promo
              de entrada de USD 1/mes por 3 meses, pero después pasa a costar desde USD 29-39/mes;
              tol.ar en cambio sigue siendo gratis y sin comisión por venta sin límite de tiempo.
            </p>
            <p>
              Mi Página (ex Mercado Shops) tiene sentido si ya vendés activamente en Mercado Libre
              y querés un espacio propio dentro del mismo ecosistema.{" "}
              <Link href="/alternativa-mercado-shops">Ver la comparación completa con Mi Página →</Link>
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-amber-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Probá tol.ar gratis</h2>
            <p className="text-amber-50 mb-8">
              Sin costo mensual, sin comisión por venta y lista en minutos.
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
