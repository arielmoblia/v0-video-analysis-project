"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

const PAGE = "blog-dominio-propio"

const beneficios = [
  {
    tk: "beneficio1_titulo",
    td: "Se ve más profesional",
    dk: "beneficio1_desc",
    dd: "milatienda.com.ar transmite más confianza que milatienda.tol.ar. Es el mismo salto que hace cualquier negocio cuando pasa de usar un link genérico a tener su propia marca.",
  },
  {
    tk: "beneficio2_titulo",
    td: "Más fácil de recordar y compartir",
    dk: "beneficio2_desc",
    dd: "Un dominio corto con tu nombre es más fácil de decir en un video, poner en una bolsa o un cartel, que una dirección larga.",
  },
  {
    tk: "beneficio3_titulo",
    td: "No perdés nada de lo que ya tenés",
    dk: "beneficio3_desc",
    dd: "Tu dirección tunombre.tol.ar sigue funcionando igual que siempre. El dominio propio se suma, no reemplaza nada.",
  },
]

const pasos = [
  {
    numero: 1,
    tk: "paso1_titulo",
    td: "Comprá tu dominio en nic.ar",
    dk: "paso1_desc",
    dd: "Entrá a nic.ar y comprá el nombre que quieras (por ejemplo milatienda.com.ar). Por ahora esta función solo funciona con dominios comprados ahí directamente.",
  },
  {
    numero: 2,
    tk: "paso2_titulo",
    td: "Activá \"Dominio Propio\" en tu panel",
    dk: "paso2_desc",
    dd: "Entrá al admin de tu tienda, andá a Cositas → Dominio Propio, activá la función y escribí tu dominio (sin \"www\" ni \"https://\").",
  },
  {
    numero: 3,
    tk: "paso3_titulo",
    td: "Cargá el registro DNS en nic.ar",
    dk: "paso3_desc",
    dd: "Dentro de nic.ar, en la administración de tu dominio, buscá la sección de DNS y cargá un registro tipo A que apunte a: 157.173.212.229",
  },
  {
    numero: 4,
    tk: "paso4_titulo",
    td: "Esperá que se actualice (puede tardar unas horas)",
    dk: "paso4_desc",
    dd: "Los cambios de DNS no son instantáneos. A veces se ven en minutos, a veces tardan algunas horas en propagarse por internet.",
  },
  {
    numero: 5,
    tk: "paso5_titulo",
    td: "Activamos el certificado de seguridad",
    dk: "paso5_desc",
    dd: "Una vez que el DNS está apuntando bien, activamos a mano el HTTPS de tu dominio. Puede tardar hasta 24-48hs desde que quedó cargado el DNS.",
  },
  {
    numero: 6,
    tk: "paso6_titulo",
    td: "Listo",
    dk: "paso6_desc",
    dd: "Tu tienda queda funcionando también en tu propio dominio, además de tunombre.tol.ar.",
  },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿Sirve cualquier dominio o solo los de nic.ar?",
    ak: "faq1_a",
    a: "Por ahora esta función solo está disponible para dominios comprados directo en nic.ar (los .com.ar, .ar, etc). Si tu dominio es de otro proveedor, escribinos y lo conectamos a mano.",
  },
  {
    qk: "faq2_q",
    q: "¿Mi tienda deja de funcionar en tunombre.tol.ar?",
    ak: "faq2_a",
    a: "No. El dominio tunombre.tol.ar sigue funcionando igual que siempre, en paralelo. Tu dominio propio es una forma extra de llegar a la misma tienda.",
  },
  {
    qk: "faq3_q",
    q: "¿Cuánto tarda en activarse?",
    ak: "faq3_a",
    a: "El DNS puede tardar desde minutos hasta unas horas en propagarse. Después, activar el certificado de seguridad (HTTPS) toma hasta 24-48hs.",
  },
  {
    qk: "faq4_q",
    q: "¿Tiene costo?",
    ak: "faq4_a",
    a: "Sí, es una de las funciones pagas (\"cositas\") que se activan desde el panel de tu tienda.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function DominioPropioClient({ brand = "tol" }: Props) {
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
              <span>Dominio propio</span>
            </span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Dominio propio para tu tienda: guía paso a paso")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: agosto 2026")}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET(
                "criollo_texto",
                "Hoy tu tienda se ve en algo como tunombre.tol.ar. Si comprás tu propio dominio (por ejemplo milatienda.com.ar) en nic.ar, lo podés conectar para que tu tienda se vea también ahí, con tu propia marca. Es opcional, tiene un costo chico, y tu dirección de tol.ar sigue funcionando igual mientras tanto."
              )}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-6">{ET("beneficios_titulo", "Por qué conviene tener tu propio dominio")}</h2>
            <div className="space-y-4 mb-10">
              {beneficios.map((b) => (
                <div key={b.tk} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{ET(b.tk, b.td)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ET(b.dk, b.dd)}</p>
                </div>
              ))}
            </div>

            {EI("img_pasos", "Esquema de conexión de dominio propio", "Captura o esquema: conectar dominio propio")}

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("pasos_titulo", "Los pasos, uno por uno")}</h2>
            <p className="text-gray-700 mb-4">
              {ET(
                "pasos_texto",
                "No hace falta saber nada de tecnología. Seguí estos pasos en orden. Si te trabas en cualquiera, escribinos y te ayudamos."
              )}
            </p>
            <div className="space-y-6 mb-10">
              {pasos.map((paso) => (
                <div key={paso.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {paso.numero}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{ET(paso.tk, paso.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(paso.dk, paso.dd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "¿Ya comprás tu dominio en nic.ar?")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Activá \"Dominio Propio\" desde el panel de tu tienda, en la sección Cositas, y seguí los pasos de esta guía.")}
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
