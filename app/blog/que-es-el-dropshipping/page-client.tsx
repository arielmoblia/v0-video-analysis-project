"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const pasos = [
  {
    numero: 1,
    tk: "paso1_titulo",
    td: "Vos mostrás el producto en tu tienda",
    dk: "paso1_desc",
    dd: "Subís las fotos, el precio y la descripción a tu tienda online, igual que cualquier otro producto. El cliente no nota ninguna diferencia.",
  },
  {
    numero: 2,
    tk: "paso2_titulo",
    td: "Alguien lo compra y te paga a vos",
    dk: "paso2_desc",
    dd: "El cliente hace el pedido y paga en tu tienda, con tu precio. Esa plata es tuya.",
  },
  {
    numero: 3,
    tk: "paso3_titulo",
    td: "Vos le comprás ese mismo producto al proveedor",
    dk: "paso3_desc",
    dd: "Al precio más barato del proveedor (la 'tienda madre'). La diferencia entre lo que pagó el cliente y lo que vos pagaste es tu ganancia.",
  },
  {
    numero: 4,
    tk: "paso4_titulo",
    td: "El proveedor lo manda directo a la casa del cliente",
    dk: "paso4_desc",
    dd: "Vos nunca tenés el producto en tus manos. No alquilás depósito, no lo empaquetás, no vas al correo. Llega directo del proveedor a quien lo compró.",
  },
]

const buenos = [
  { k: "bueno1", d: "No necesitás plata guardada para comprar mercadería por adelantado" },
  { k: "bueno2", d: "No necesitás lugar para guardar cajas ni productos" },
  { k: "bueno3", d: "No hacés vos los envíos: los manda el proveedor" },
  { k: "bueno4", d: "Podés probar si un producto se vende antes de arriesgar plata" },
]

const malos = [
  { k: "malo1", d: "Ganás menos por producto que si comprás mercadería al por mayor vos mismo" },
  { k: "malo2", d: "Dependés de que el proveedor tenga stock real y despache a tiempo" },
  { k: "malo3", d: "El tiempo de entrega lo maneja el proveedor, no vos" },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿Qué es el dropshipping, explicado fácil?",
    ak: "faq1_a",
    a: "Es vender productos sin tenerlos guardados en tu casa. Vos los mostrás en tu tienda, cuando alguien compra, se lo pedís a un proveedor que ya los tiene, y ese proveedor se lo manda directo al cliente. Vos ganás la diferencia entre lo que cobraste y lo que pagaste.",
  },
  {
    qk: "faq2_q",
    q: "¿Necesito plata para empezar con dropshipping?",
    ak: "faq2_a",
    a: "Muy poca, porque no comprás nada por adelantado. No hay que llenar un depósito de mercadería que capaz no se vende. Solo pagás el producto después de que alguien ya te lo compró y te pagó a vos.",
  },
  {
    qk: "faq3_q",
    q: "¿Es legal el dropshipping en Argentina?",
    ak: "faq3_a",
    a: "Sí. Es una forma más de vender. Como cualquier venta, si querés facturar necesitás CUIT y monotributo, igual que en una tienda tradicional.",
  },
  {
    qk: "faq4_q",
    q: "¿Cuál es la desventaja del dropshipping?",
    ak: "faq4_a",
    a: "Ganás menos por producto que si lo compraras al por mayor vos mismo, porque le comprás al proveedor a un precio de a uno. Y dependés de que el proveedor tenga stock y despache rápido, porque de eso depende que tu cliente reciba bien el pedido.",
  },
  {
    qk: "faq5_q",
    q: "¿Cómo se hace dropshipping en tol.ar?",
    ak: "faq5_a",
    a: "tol.ar tiene una herramienta que clona el catálogo de un proveedor (la tienda madre) a tu tienda automáticamente: fotos, precios y stock actualizados solos, sin cargar nada a mano. Vos elegís qué porcentaje de ganancia sumarle, y se aplica a todo el catálogo. El pedido de tu cliente puede pasar directo al proveedor para que lo despache, o quedar para que vos se lo compres a mano — depende de cómo esté conectada tu tienda con la del proveedor.",
  },
  {
    qk: "faq6_q",
    q: "¿Puedo tener mis propios productos y además dropshipping en la misma tienda?",
    ak: "faq6_a",
    a: "Sí. No hay que elegir entre una cosa o la otra. Podés tener tu tienda con tus productos de siempre y sumarle, al mismo catálogo, productos clonados de una tienda proveedora. Las dos cosas conviven en la misma tienda y el mismo panel de administración.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function QueEsElDropshippingClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("blog-que-es-el-dropshipping")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="blog-que-es-el-dropshipping" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
  )

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
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
              <span>¿Qué es el dropshipping?</span>
            </span>
            <span className="flex items-center gap-4">
              <Link
                href="/blog/cosas-legales-antes-de-usar-scraping"
                className="text-red-600 font-semibold text-xs uppercase tracking-wide hover:text-red-800 whitespace-nowrap"
              >
                Marco legal
              </Link>
              <Link
                href="/blog/dropshipping-para-programadores"
                className="text-blue-600 font-semibold text-xs uppercase tracking-wide hover:text-blue-800 whitespace-nowrap"
              >
                Para programadores →
              </Link>
            </span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "¿Qué es el dropshipping? Te lo explicamos fácil")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: julio 2026 · Sin tecnicismos, para cualquier persona")}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET("criollo_texto", "Dropshipping es vender cosas sin tenerlas guardadas en tu casa. Vos las mostrás en tu tienda, cuando alguien las compra, se las pedís a un proveedor, y el proveedor se las manda directo al cliente. Vos te quedás con la diferencia de precio, sin tocar el producto ni una vez.")}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("ejemplo_titulo", "Un ejemplo comercial real")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("ejemplo_texto1", "Pensalo así: tenés un proveedor y en tu vidriera mostrás TODOS sus productos, no solo los que ya compraste. El problema real aparece ahí: el proveedor puede cambiarte el precio o quedarse sin stock de un día para el otro sin avisarte, y vos te enterás recién cuando ya le vendiste algo a un cliente que no podés cumplir.")}
            </p>
            <p className="text-gray-700 mb-4">
              {ET("ejemplo_texto2", "Por eso hay dos formas de hacerlo. En la primera, cuando alguien te compra, vos le comprás al proveedor y vos mismo empaquetás y entregás. En la segunda —el dropshipping en su forma más pura— vos le comprás al proveedor pero es el proveedor el que entrega directo al cliente: menos trabajo para vos, ya no tenés que tocar el paquete.")}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("pasos_titulo", "Cómo funciona, paso a paso")}</h2>
            <div className="space-y-6 mb-10">
              {pasos.map((paso) => (
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

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("bueno_titulo", "Lo bueno")}</h2>
            <ul className="space-y-2 mb-8 text-gray-700">
              {buenos.map((item) => (
                <li key={item.k} className="flex gap-3 items-start">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  <span>{ET(item.k, item.d)}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("malo_titulo", "Lo que hay que tener en cuenta")}</h2>
            <ul className="space-y-2 mb-8 text-gray-700">
              {malos.map((item) => (
                <li key={item.k} className="flex gap-3 items-start">
                  <span className="text-gray-400 font-bold flex-shrink-0">✗</span>
                  <span>{ET(item.k, item.d)}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("tolar_titulo", "¿Cómo se hace esto en tol.ar?")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("tolar_texto", "En tol.ar no tenés que cargar cada producto a mano. Elegís una tienda proveedora (la \"tienda madre\") y nosotros copiamos automáticamente todo su catálogo a tu tienda: fotos, precios y stock, actualizados solos. Vos elegís qué porcentaje querés ganar por arriba de cada precio, y se lo sumamos a todo el catálogo sin que tengas que tocar producto por producto.")}
            </p>
            <p className="text-gray-700 mb-4">
              {ET("tolar_texto2", "Cuando un cliente te compra, ese pedido puede pasar directo al proveedor para que lo despache él, o quedar para que vos se lo compres a mano — depende de cómo dejemos conectada tu tienda con la del proveedor. Las dos formas funcionan, es una decisión que se toma tienda por tienda.")}
            </p>
            <p className="text-gray-700 mb-4">
              {ET("tolar_texto3", "Y no hace falta elegir entre \"mi propia tienda\" o \"dropshipping\": podés tener tus propios productos de siempre y sumarle, al mismo catálogo, productos clonados de otra tienda. Las dos cosas conviven en la misma tienda y el mismo panel de administración.")}
            </p>

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
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Empezá a vender sin stock propio")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Creá tu tienda gratis en tol.ar y activá el dropshipping cuando quieras.")}
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
