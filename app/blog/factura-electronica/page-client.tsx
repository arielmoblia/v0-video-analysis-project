"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

const PAGE = "blog-factura-electronica"

const pasosAfip = [
  {
    numero: 1,
    tk: "paso1_titulo",
    td: "Tener CUIT y Clave Fiscal",
    dk: "paso1_desc",
    dd: "Si todavía no la tenés, se saca gratis y online desde la web de AFIP.",
    lk: "paso1_link",
  },
  {
    numero: 2,
    tk: "paso2_titulo",
    td: "Estar inscripto (monotributo o responsable inscripto)",
    dk: "paso2_desc",
    dd: "Si todavía no diste de alta ninguna categoría, primero hay que hacer eso.",
    lk: "paso2_link",
  },
  {
    numero: 3,
    tk: "paso3_titulo",
    td: "Entrar a AFIP con tu Clave Fiscal",
    dk: "paso3_desc",
    dd: "Ir a \"Administrador de Relaciones de Clave Fiscal\", dentro de tu cuenta de AFIP.",
    lk: "paso3_link",
  },
  {
    numero: 4,
    tk: "paso4_titulo",
    td: "Autorizar a tol.ar para facturar en tu nombre",
    dk: "paso4_desc",
    dd: "Buscás el servicio \"Facturación Electrónica\" y le das el permiso (delegación) a tol.ar. Es un trámite online, sin papeles, de pocos minutos.",
    lk: "paso4_link",
  },
  {
    numero: 5,
    tk: "paso5_titulo",
    td: "Listo",
    dk: "paso5_desc",
    dd: "Con el permiso cargado, tol.ar queda habilitado para emitir facturas válidas a tu nombre, con tu CUIT.",
    lk: "paso5_link",
  },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿El remito y la factura electrónica son lo mismo?",
    ak: "faq1_a",
    a: "No. El botón Remito que ya existe genera un comprobante interno en PDF, sin validez fiscal. La factura electrónica es otro sistema, conectado a AFIP, que emite un comprobante legal con CAE.",
  },
  {
    qk: "faq2_q",
    q: "¿tol.ar factura con su propio CUIT?",
    ak: "faq2_a",
    a: "No. Cada factura sale del CUIT del dueño de la tienda, porque la venta es de él. tol.ar solo la emite en su nombre, con su autorización previa en AFIP.",
  },
  {
    qk: "faq3_q",
    q: "¿El trámite en AFIP tiene costo?",
    ak: "faq3_a",
    a: "No, es gratuito y se hace online, sin ir a ninguna oficina ni presentar papeles.",
  },
  {
    qk: "faq4_q",
    q: "¿Ya está activo el sistema?",
    ak: "faq4_a",
    a: "Todavía no. Está en desarrollo. Esta guía se va completando a medida que cada etapa queda lista, y se avisa en el panel de cada tienda cuando se puede empezar a usar.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function FacturaElectronicaClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
  )

  const EI = (field: string, alt: string, placeholderLabel: string, className = "w-full rounded-xl border border-gray-200 mb-8") => (
    <EditableImage page={PAGE} field={field} defaultValue={get(field, "")} isAdmin={isAdmin} alt={alt} className={className} uploadType="banner" placeholderLabel={placeholderLabel} />
  )

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos e imágenes para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8 flex items-center justify-between flex-wrap gap-2">
            <span>
              <Link href="/" className="hover:text-blue-600">tol.ar</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              <span className="mx-2">/</span>
              <span>Factura electrónica</span>
            </span>
          </nav>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Factura electrónica en tol.ar: facturá legal, sin complicarte con AFIP")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: agosto 2026")}</p>

          {/* Síntesis en criollo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET(
                "criollo_texto",
                "Hoy tenés el botón Remito, que te arma un comprobante en PDF al toque — pero ese papel no es una factura, no tiene validez ante AFIP. Estamos construyendo el sistema para que factures de verdad, con el mismo botón fácil, pero conectado a AFIP: cada venta va a generar una factura electrónica real, con el número (CAE) que la hace legal, a tu nombre y con tu CUIT. Vos seguís siendo el responsable ante AFIP — tol.ar solo te hace invisible el trámite técnico."
              )}
            </p>
          </div>

          {/* Desarrollo */}
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{ET("teoria_titulo", "La teoría: qué es la factura electrónica y por qué el remito no alcanza")}</h2>
            <p className="text-gray-700 mb-4">
              {ET(
                "teoria_texto1",
                "En Argentina, toda venta que hace un monotributista o un responsable inscripto tiene que estar respaldada por una factura válida ante AFIP. Esa validez se la da un número llamado CAE (Código de Autorización Electrónico), que AFIP genera automáticamente cuando se le informa la venta. Sin CAE, el comprobante no es una factura: es un papel interno, como el remito que ya tenés en tol.ar."
              )}
            </p>
            <p className="text-gray-700 mb-4">
              {ET(
                "teoria_texto2",
                "La factura siempre sale del CUIT de quien vende, no del nuestro. Por eso el primer paso no es técnico, es un permiso: el dueño de cada tienda tiene que autorizar a tol.ar, dentro de su propia cuenta de AFIP, para que factura en su nombre. Es el mismo tipo de autorización que le das a un contador cuando le delegás la facturación."
              )}
            </p>
            <p className="text-gray-700 mb-4">
              {ET(
                "teoria_texto3",
                "Una vez dado ese permiso, todo lo demás lo resuelve tol.ar: cada venta se informa a AFIP en el momento, se recibe el CAE, y la factura queda lista para el cliente. El proceso completo tiene tres etapas: el permiso en AFIP (lo hace el dueño de la tienda), la confirmación de que quedó bien cargado (lo prueba tol.ar) y la conexión automática venta por venta (el sistema técnico)."
              )}
            </p>

            {EI("img_teoria", "Esquema del circuito de facturación electrónica", "Captura o esquema: circuito factura electrónica")}

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("pasos_titulo", "Los pasos para autorizar a tol.ar en AFIP")}</h2>
            <p className="text-gray-700 mb-4">
              {ET(
                "pasos_texto",
                "Este trámite lo hace el dueño de cada tienda, porque la factura sale de su CUIT. Cada paso va a tener su propia guía con capturas de pantalla — por ahora los links quedan como referencia, se van completando a medida que se arma cada guía."
              )}
            </p>
            <div className="space-y-6 mb-10">
              {pasosAfip.map((paso) => (
                <div key={paso.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {paso.numero}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{ET(paso.tk, paso.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">{ET(paso.dk, paso.dd)}</p>
                      <Link href="#" className="text-blue-600 text-sm font-semibold hover:underline">
                        {ET(paso.lk, "Ver guía paso a paso (próximamente) →")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("construccion_titulo", "Lo que estamos construyendo del lado de tol.ar")}</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-10">
              <li>{ET("construccion_item1", "Un asistente dentro del panel de cada tienda, que muestra estos pasos con capturas reales, pantalla por pantalla.")}</li>
              <li>{ET("construccion_item2", "Un botón \"ya lo autoricé\", que verifica contra AFIP si el permiso quedó bien cargado.")}</li>
              <li>{ET("construccion_item3", "La conexión técnica con AFIP para informar cada venta y recibir el CAE que hace válida la factura.")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("faq_titulo", "Preguntas frecuentes")}</h2>
            <div className="space-y-6">
              {faqItems.map((faq) => (
                <div key={faq.qk} className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{ET(faq.qk, faq.q)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ET(faq.ak, faq.a)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Mientras tanto, ya tenés el remito")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Creá tu tienda gratis en tol.ar. El botón de remito ya está activo hoy en todos los pedidos, y la factura electrónica se va a sumar en el mismo lugar.")}
            </p>
            <Link
              href="https://app.tol.ar/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {ET("cta_boton", "Crear tienda gratis")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
