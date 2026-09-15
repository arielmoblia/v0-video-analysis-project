"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const caracteristicas = [
  {
    numero: 1,
    tk: "c1_titulo",
    td: "Detecta la plataforma de origen sola",
    dk: "c1_desc",
    dd: "No hay un único formato de tienda para leer. El motor reconoce las plataformas de e-commerce más usadas, cada una con su forma propia de publicar precio, stock y variantes (JSON-LD, clases CSS, o un objeto JavaScript que carga la página). Si la tienda de origen cambia de plataforma o de tema, no hay que reconfigurar nada a mano.",
  },
  {
    numero: 2,
    tk: "c2_titulo",
    td: "Talles y colores reales, no inventados",
    dk: "c2_desc",
    dd: "Cuando la variante (talle, color) trae un número de stock real publicado por la fuente, lo usamos. Si la fuente no publica ese dato, no lo inventamos con un valor por defecto que después genera una venta sin stock — se marca la diferencia entre 'sabemos que hay stock' y 'no sabemos'.",
  },
  {
    numero: 3,
    tk: "c3_titulo",
    td: "Corte real vs. problema de red nuestro",
    dk: "c3_desc",
    dd: "Si el sitio de origen deja de responder de forma persistente, lo tratamos distinto a un timeout puntual de nuestro lado. No confundimos 'la fuente no está disponible' con 'se nos cayó la conexión un segundo' — cada caso dispara una respuesta distinta.",
  },
  {
    numero: 4,
    tk: "c4_titulo",
    td: "Si falla, no se pierde: cola de reintentos",
    dk: "c4_desc",
    dd: "Un clonado que falla no queda fallado para siempre. Entra en una cola y un proceso aparte lo reintenta cada 2 horas, hasta 5 intentos, antes de darlo por perdido y avisar. Ese reintento corre solo, sin que nadie tenga que acordarse de reintentarlo a mano.",
  },
  {
    numero: 5,
    tk: "c5_titulo",
    td: "Re-scrapeo automático todos los días",
    dk: "c5_desc",
    dd: "Todos los días a la misma hora, un proceso recorre todas las tiendas ya clonadas y vuelve a traer precio y stock actualizados de la tienda madre. No hace falta tocar nada para que los datos no se queden viejos.",
  },
  {
    numero: 6,
    tk: "c6_titulo",
    td: "Se auto-apaga si el origen deja de responder en serio",
    dk: "c6_desc",
    dd: "Si el re-scrapeo diario detecta que la fuente no responde de forma persistente (no un simple corte de red pasajero), la tienda clonada se suspende sola: deja de mostrarse en tol.ar hasta que vuelva a poder traer datos frescos. Apenas el scraping funciona de nuevo, se reactiva sola. Así evitamos vender con precios o stock viejos de forma indefinida.",
  },
  {
    numero: 7,
    tk: "c7_titulo",
    td: "Nada de tráfico a lo bruto",
    dk: "c7_desc",
    dd: "El clonado no dispara todos los pedidos a la tienda de origen al mismo tiempo. Usa un número limitado de conexiones simultáneas, para no sobrecargar la tienda madre ni parecer un ataque.",
  },
  {
    numero: 8,
    tk: "c8_titulo",
    td: "Cada cambio de precio queda con historial",
    dk: "c8_desc",
    dd: "Cuando un precio o un stock cambia de verdad, no se pisa el dato viejo sin dejar rastro: queda guardado un historial de esos cambios reales, para poder auditar cuándo y cuánto varió.",
  },
]

const faqItems = [
  {
    qk: "faq1_q",
    q: "¿De qué plataformas puede clonar tol.ar una tienda?",
    ak: "faq1_a",
    a: "Soporta las plataformas de e-commerce más usadas del mercado. Cada una publica sus datos distinto y el motor de scraping sabe leer todas.",
  },
  {
    qk: "faq2_q",
    q: "¿Qué pasa si la tienda de origen tiene problemas de conexión?",
    ak: "faq2_a",
    a: "Se distingue un corte real y persistente de un simple problema de red pasajero. Si el corte persiste en el re-scrapeo diario, la tienda clonada se suspende sola hasta volver a poder traer datos frescos.",
  },
  {
    qk: "faq3_q",
    q: "¿Puede vender con stock que en realidad no existe?",
    ak: "faq3_a",
    a: "Se prioriza usar el dato de stock real que publica la fuente. Cuando esa fuente no publica ningún dato de stock, se marca esa diferencia en vez de inventar un número que después termine en una venta sin producto.",
  },
  {
    qk: "faq4_q",
    q: "¿Con qué frecuencia se actualizan precio y stock?",
    ak: "faq4_a",
    a: "Todos los días, con un proceso automático que recorre todas las tiendas ya clonadas y vuelve a traer los datos actualizados de cada una, sin intervención manual.",
  },
  {
    qk: "faq5_q",
    q: "¿Si un clonado falla, hay que reintentarlo a mano?",
    ak: "faq5_a",
    a: "No. Los clonados que fallan quedan en una cola que se reintenta sola cada 2 horas, hasta un límite de intentos, antes de avisar que se dio por vencido.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function DropshippingParaProgramadoresClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("blog-dropshipping-para-programadores")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="blog-dropshipping-para-programadores" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
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
            <span>Dropshipping para programadores</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Dropshipping en tol.ar, explicado para programadores")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: julio 2026 · Cómo funciona el motor de clonado por dentro, sin vueltas")}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo, para devs")}</p>
            <p className="text-blue-800 mt-2">
              {ET("criollo_texto", "El motor de dropshipping de tol.ar no es un scraper genérico que copia HTML y listo. Reconoce distintas plataformas de e-commerce, distingue stock real de stock inventado, distingue un corte real de un problema de red propio, reintenta solo lo que falla, y se apaga solo si detecta que los datos que está mostrando ya no son confiables.")}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("por_que_titulo", "Por qué esto no es 'un scraper más'")}</h2>
            <p className="text-gray-700 mb-4">
              {ET("por_que_texto1", "Cualquiera puede escribir un script que baje precios de una página una vez. El problema real aparece con el tiempo: la fuente cambia de tema, te bloquea, se cae un momento, o deja de tener stock de un producto sin avisar. Un scraper que no contempla nada de eso te termina vendiendo con datos viejos o rotos sin que nadie se entere hasta que un cliente se queja.")}
            </p>
            <p className="text-gray-700 mb-4">
              {ET("por_que_texto2", "Estas son las decisiones técnicas concretas que tomamos para que eso no pase, verificadas contra el motor real que corre hoy en producción.")}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("caracteristicas_titulo", "Las características, una por una")}</h2>
            <div className="space-y-6 mb-10">
              {caracteristicas.map((c) => (
                <div key={c.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {c.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(c.tk, c.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(c.dk, c.dd)}</p>
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
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Probá el motor de clonado vos mismo")}</h2>
            <p className="text-blue-100 mb-6">
              {ET("cta_texto", "Creá tu tienda gratis en tol.ar y conectá una tienda madre para ver el clonado en acción.")}
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
