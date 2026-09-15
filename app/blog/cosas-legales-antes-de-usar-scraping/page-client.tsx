"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const temas = [
  {
    numero: 1,
    tk: "t1_titulo",
    td: "Las fotos de la tienda de origen no son tuyas para copiar",
    dk: "t1_desc",
    dd: "La Ley 11.723 de Propiedad Intelectual protege las fotografías y los textos como obra de su autor, aunque estén publicados en internet y a la vista de cualquiera. Guardar la foto exacta de un producto de la tienda madre y republicarla en tu tienda, sin permiso de quien la tomó, es una infracción. Lo seguro: usar fotos propias del producto, fotos que te ceda el fabricante, o bancos de imágenes con licencia.",
  },
  {
    numero: 2,
    tk: "t2_titulo",
    td: "Copiar la descripción palabra por palabra tampoco es gratis",
    dk: "t2_desc",
    dd: "El mismo fundamento de la Ley 11.723 protege los textos. Traer la descripción tal cual la escribió otro sitio y pegarla en tu tienda es el mismo problema que con las fotos. La solución es simple: reescribir la descripción con tus propias palabras antes de publicarla.",
  },
  {
    numero: 3,
    tk: "t3_titulo",
    td: "Podés nombrar la marca del producto, no simular que sos el vendedor oficial",
    dk: "t3_desc",
    dd: "La Ley 22.362 de Marcas permite nombrar la marca de un producto genuino para venderlo — es lo que hace cualquier revendedor. El problema aparece si tu tienda genera confusión, por ejemplo dando a entender que sos la tienda oficial de esa marca o de la tienda madre cuando no lo sos.",
  },
  {
    numero: 4,
    tk: "t4_titulo",
    td: "No fingir ser la tienda de origen ni usar engaños para captar sus clientes",
    dk: "t4_desc",
    dd: "El artículo 159 del Código Penal sanciona a quien, por maquinaciones fraudulentas o cualquier medio de propaganda desleal, trate de desviar en su provecho la clientela de un establecimiento. Esto se activa si se usa el mismo nombre, diseño o apariencia de la tienda madre de forma tal que el comprador no distingue de dónde viene realmente el producto.",
  },
  {
    numero: 5,
    tk: "t5_titulo",
    td: "Clonar el catálogo sin autorización es zona gris, no algo expresamente prohibido",
    dk: "t5_desc",
    dd: "Scrapear datos públicos como precio y stock no está prohibido por una ley puntual en Argentina. Pero si la tienda madre entiende que se perjudica su posición comercial sin acuerdo previo, puede reclamar por competencia desleal. No hay garantía legal de que 'es información pública' alcance como defensa. Lo más seguro a largo plazo es tener autorización de la tienda madre, o dejar de clonarla si te lo pide expresamente.",
  },
  {
    numero: 6,
    tk: "t6_titulo",
    td: "Frente a tu cliente final, respondés vos — tengas stock o no",
    dk: "t6_desc",
    dd: "El artículo 40 de la Ley 24.240 establece responsabilidad objetiva y solidaria en toda la cadena de comercialización. No tener stock propio, no haber fabricado el producto, o depender de que otro lo despache no te exime de responder si el pedido no llega, llega dañado, o no es lo que se anunció.",
  },
  {
    numero: 7,
    tk: "t7_titulo",
    td: "El precio y el stock que mostrás tienen que ser reales",
    dk: "t7_desc",
    dd: "El artículo 9 del Decreto 274/2019 (que reemplazó a la Ley 22.802 de Lealtad Comercial) prohíbe publicidad con inexactitudes que induzcan a error sobre precio, stock o características del producto. Si tu fuente de scraping no puede confirmar el stock real de una variante, hay que decirlo — no inventar un número por defecto.",
  },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿Puedo usar las fotos de la tienda de origen en mi tienda clonada?",
    ak: "faq1_a",
    a: "No sin autorización. Están protegidas por la Ley 11.723 aunque estén publicadas en internet. Lo más seguro es usar fotos propias o del fabricante, o reemplazarlas cuando no tengas permiso.",
  },
  {
    qk: "faq2_q",
    q: "¿Necesito autorización de la tienda madre para clonar su catálogo?",
    ak: "faq2_a",
    a: "No hay una ley puntual que lo exija para datos públicos como precio y stock, pero es la zona de mayor riesgo: sin acuerdo, un reclamo por competencia desleal es posible si la tienda madre considera que se perjudica su negocio. Tener autorización es lo más seguro.",
  },
  {
    qk: "faq3_q",
    q: "Si el producto llega mal o no llega, ¿quién responde ante el cliente?",
    ak: "faq3_a",
    a: "Vos, como proveedor. El artículo 40 de la Ley 24.240 establece responsabilidad objetiva y solidaria en toda la cadena de comercialización, sin importar que no tengas stock propio ni hayas fabricado el producto.",
  },
  {
    qk: "faq4_q",
    q: "¿Puedo mencionar la marca del producto que vendo?",
    ak: "faq4_a",
    a: "Sí, nombrar la marca de un producto genuino para identificarlo es lícito. El problema aparece si generás confusión sobre quién es el vendedor, por ejemplo dando a entender que sos la tienda oficial de esa marca (Ley 22.362).",
  },
  {
    qk: "faq5_q",
    q: "¿Qué pasa si la tienda madre me pide que deje de clonar su catálogo?",
    ak: "faq5_a",
    a: "Lo más prudente es dejar de hacerlo. Seguir después de un pedido expreso aumenta el riesgo de un reclamo por competencia desleal o, en casos extremos, por maquinaciones fraudulentas (art. 159 del Código Penal).",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function CosasLegalesScrapingClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("blog-cosas-legales-antes-de-usar-scraping")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="blog-cosas-legales-antes-de-usar-scraping" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
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
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Cosas legales antes de usar scraping</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Cosas legales que debés saber antes de usar scraping")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: julio 2026 · Marco legal argentino, explicado sin tecnicismos")}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
            <p className="text-amber-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-amber-800 mt-2">
              {ET("criollo_texto", "Clonar el catálogo de otra tienda (scraping) para armar la tuya no es ilegal en sí mismo, pero hay puntos concretos que sí pueden traerte un reclamo si no los cuidás: no copies fotos ni textos ajenos tal cual, no simules ser la tienda de origen, y recordá que frente a tu cliente respondés vos aunque no tengas el producto en tu casa.")}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("por_que_titulo", "Por qué esto importa si vas a usar scraping")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("por_que_texto1", "Cuando clonás el catálogo de una tienda de origen (la 'tienda madre') para vender sus productos, no solo estás copiando precio y stock. También hay decisiones sobre fotos, textos, uso de marca y trato con el cliente final que tienen consecuencias legales concretas, aunque nadie te las explique al usar una herramienta de scraping.")}
            </p>
            <p className="text-gray-700 mb-4">
              {ET("por_que_texto2", "Esta guía junta los puntos del marco legal argentino que más se aplican a este modelo de negocio, para que sepas qué es seguro hacer, qué es zona gris, y qué conviene evitar directamente.")}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("temas_titulo", "Los 7 puntos, uno por uno")}</h2>
            <div className="space-y-6 mb-10">
              {temas.map((t) => (
                <div key={t.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {t.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(t.tk, t.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(t.dk, t.dd)}</p>
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

            <p className="text-gray-400 text-xs mt-10 italic">
              {ET("disclaimer", "Esta guía es información general sobre el marco legal argentino aplicable al scraping para dropshipping y no reemplaza el asesoramiento de un abogado para tu caso puntual.")}
            </p>
          </div>

          <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Armá tu tienda con scraping en tol.ar")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Creá tu tienda gratis y conectá una tienda madre. Nosotros nos ocupamos de la parte técnica del clonado; vos ocupate de cuidar los puntos legales de esta guía.")}
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
