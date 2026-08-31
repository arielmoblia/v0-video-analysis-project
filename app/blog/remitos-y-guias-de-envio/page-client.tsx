"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"
import { EditableVideo } from "@/components/editable-video"

const PAGE = "blog-remitos-y-guias-de-envio"

const pasosRemito = [
  {
    numero: 1,
    tk: "r_paso1_titulo",
    td: "Abrís el pedido",
    dk: "r_paso1_desc",
    dd: "Entrás a tu panel, a la lista de pedidos, y abrís el pedido que querés imprimir.",
  },
  {
    numero: 2,
    tk: "r_paso2_titulo",
    td: "Apretás \"Remito\"",
    dk: "r_paso2_desc",
    dd: "Al lado del botón para imprimir el pedido, aparece el botón \"Remito\". Genera un PDF con todos los datos: tienda, cliente, dirección, productos, talles, cantidades, precios y total.",
  },
  {
    numero: 3,
    tk: "r_paso3_titulo",
    td: "Lo imprimís o lo guardás",
    dk: "r_paso3_desc",
    dd: "Se abre en una pestaña nueva, listo para imprimir o guardar como PDF. No tiene validez fiscal — es un comprobante interno, no una factura de AFIP.",
  },
]

const pasosGuia = [
  {
    numero: 1,
    tk: "g_paso1_titulo",
    td: "Abrís el mismo pedido",
    dk: "g_paso1_desc",
    dd: "En cualquier pedido con envío (no aplica a retiro en local), vas a ver el botón \"Guía\" al lado de \"Remito\".",
  },
  {
    numero: 2,
    tk: "g_paso2_titulo",
    td: "Apretás \"Guía\"",
    dk: "g_paso2_desc",
    dd: "Copia automáticamente al portapapeles el nombre, teléfono, dirección, ciudad y código postal del cliente, y te abre la web de Enviamelo en una pestaña nueva.",
  },
  {
    numero: 3,
    tk: "g_paso3_titulo",
    td: "Pegás los datos y generás la guía",
    dk: "g_paso3_desc",
    dd: "En vez de tipear todo a mano en la web de Enviamelo, pegás lo que ya se copió. Enviamelo te devuelve la guía con su formato y su número de seguimiento real.",
  },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿El remito reemplaza a una factura?",
    ak: "faq1_a",
    a: "No. El remito es un comprobante interno de tol.ar, sin validez fiscal ante AFIP. Sirve para dejar constancia del pedido, no para facturar. Queda aclarado en el propio PDF.",
  },
  {
    qk: "faq2_q",
    q: "¿El botón Remito aparece solo si uso Enviamelo?",
    ak: "faq2_a",
    a: "No, aparece en todos los pedidos de todas las tiendas, uses o no envío, y con cualquier transportista.",
  },
  {
    qk: "faq3_q",
    q: "¿El botón Guía aparece siempre?",
    ak: "faq3_a",
    a: "Aparece en cualquier pedido que no sea retiro en local. Hoy copia los datos del cliente y te lleva directo a la web de Enviamelo para pegarlos ahí — no genera la guía sola todavía.",
  },
  {
    qk: "faq4_q",
    q: "¿Se puede generar la guía sin entrar a la web de Enviamelo?",
    ak: "faq4_a",
    a: "Estamos probando esa versión (que la guía se genere sola, con un clic, sin pasar por la web de Enviamelo). Cada vez que se genera una guía real se cobra en la cuenta de Enviamelo de la tienda, así que por ahora se está probando en una tienda de prueba antes de activarla para todos.",
  },
]

export default function RemitosYGuiasClient() {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
  )

  const EI = (field: string, alt: string, placeholderLabel: string, className = "w-full rounded-xl border border-gray-200 mb-8") => (
    <EditableImage page={PAGE} field={field} defaultValue={get(field, "")} isAdmin={isAdmin} alt={alt} className={className} uploadType="banner" placeholderLabel={placeholderLabel} />
  )

  return (
    <>
      <Header />
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
              <span>Remitos y guías de envío</span>
            </span>
          </nav>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Remito y guía de envío: imprimí todo desde el pedido, sin salir de tol.ar")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: agosto 2026")}</p>

          {/* Síntesis */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET("criollo_texto", "Antes, para armar el papeleo de un pedido tenías que ir a otro lado: imprimir un comprobante propio a mano y entrar a la web de tu transporte a cargar los datos del cliente uno por uno. Ahora, desde el mismo pedido en tu panel, apretás \"Remito\" y te da un comprobante en PDF con todos los datos, y apretás \"Guía\" y te copia los datos del cliente listos para pegar en Enviamelo.")}
            </p>
          </div>

          {/* Desarrollo */}
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{ET("que_es_titulo", "Por qué lo armamos")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("que_es_texto1", "Cada pedido que te compran necesita, en general, dos papeles: un comprobante para el cliente (o para vos, para tu propio control) y la guía que va pegada afuera del paquete para que el transporte lo lleve. Cargar esos datos a mano, pedido por pedido, es tiempo perdido y una fuente típica de errores de tipeo.")}
            </p>

            {EI("img_remito", "Botón Remito en el detalle de un pedido", "Captura: botón Remito en el pedido")}

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("remito_titulo", "El remito: tu comprobante interno")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("remito_texto", "Es un PDF con todos los datos del pedido: tienda, cliente, dirección, forma de pago, estado, productos con talle/cantidad/precio y el total. Aclara expresamente que no tiene validez fiscal ante AFIP — para eso hace falta una factura real, que es otro desarrollo aparte.")}
            </p>
            <div className="space-y-6 mb-10">
              {pasosRemito.map((paso) => (
                <div key={paso.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {paso.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(paso.tk, paso.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(paso.dk, paso.dd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {EI("img_guia", "Botón Guía en el detalle de un pedido", "Captura: botón Guía en el pedido")}

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("guia_titulo", "La guía: los datos ya cargados para Enviamelo")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("guia_texto", "El botón \"Guía\" no reemplaza a Enviamelo, lo hace más rápido: copia los datos del cliente al portapapeles y te lleva directo a su web para que solo tengas que pegarlos. La guía que te devuelve Enviamelo es la real, con su formato y su número de seguimiento oficial.")}
            </p>
            <div className="space-y-6 mb-10">
              {pasosGuia.map((paso) => (
                <div key={paso.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {paso.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(paso.tk, paso.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(paso.dk, paso.dd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("video_titulo", "Video: cómo se usa")}</h2>
            <EditableVideo page={PAGE} field="video_demo" defaultValue={get("video_demo", "")} isAdmin={isAdmin} className="w-full aspect-video rounded-xl border border-gray-200 mb-10" placeholderLabel="Pegar link del video demo" />

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
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Probalo en tu propia tienda")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Creá tu tienda gratis en tol.ar. El botón de remito ya está activo en todos los pedidos.")}
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
      <Footer />
    </>
  )
}
