"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ShoppingBag, Code2 } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const pasosUsuario = [
  {
    numero: 1,
    tk: "u_paso1_titulo",
    td: "Elegís la tienda que querés clonar",
    dk: "u_paso1_desc",
    dd: "Pegás el link de la tienda proveedora (la \"tienda madre\") en tu panel de tol.ar. No hace falta ningún conocimiento técnico de tu parte.",
  },
  {
    numero: 2,
    tk: "u_paso2_titulo",
    td: "Nosotros traemos todo el catálogo solos",
    dk: "u_paso2_desc",
    dd: "En minutos, tu tienda queda cargada con los productos de esa tienda: nombre, fotos, precio, talles/colores y categorías armadas, sin que cargues nada a mano.",
  },
  {
    numero: 3,
    tk: "u_paso3_titulo",
    td: "Elegís tu ganancia y ya podés vender",
    dk: "u_paso3_desc",
    dd: "Definís qué porcentaje sumarle a cada precio y tu tienda queda lista. El resto — envíos, cobro con Mercado Pago — se configura igual que en cualquier tienda de tol.ar.",
  },
]

const faqUsuario = [
  {
    qk: "u_faq1_q",
    q: "¿Necesito saber programar para usar el scraping?",
    ak: "u_faq1_a",
    a: "No. Es pegar un link desde tu panel y esperar unos minutos. Todo el trabajo técnico lo hacemos nosotros.",
  },
  {
    qk: "u_faq2_q",
    q: "¿Necesito permiso de la tienda que quiero clonar?",
    ak: "u_faq2_a",
    a: "Depende del caso — hay puntos legales concretos que conviene cuidar (fotos, textos, uso de marca). Los explicamos en detalle en nuestra guía legal sobre scraping.",
  },
  {
    qk: "u_faq3_q",
    q: "¿Con qué frecuencia se actualiza el catálogo clonado?",
    ak: "u_faq3_a",
    a: "Todos los días. Un proceso automático revisa cada tienda clonada y trae los cambios reales de precio y stock desde la tienda de origen.",
  },
  {
    qk: "u_faq4_q",
    q: "¿Puedo mezclar productos clonados con mis propios productos?",
    ak: "u_faq4_a",
    a: "Sí. Las dos cosas conviven en la misma tienda y el mismo panel de administración, sin que tengas que elegir entre una u otra.",
  },
  {
    qk: "u_faq5_q",
    q: "¿De qué plataformas puede clonar tol.ar una tienda?",
    ak: "u_faq5_a",
    a: "Hoy el motor soporta las plataformas de e-commerce más usadas del mercado. Si la tienda que querés clonar usa una que todavía no soportamos, escribinos y lo evaluamos.",
  },
]

const caracteristicasDev = [
  {
    numero: 1,
    tk: "p_c1_titulo",
    td: "Descubre las URLs de producto vía sitemap",
    dk: "p_c1_desc",
    dd: "El motor arma la lista completa de páginas de producto a partir del sitemap.xml público de la tienda de origen, en vez de rastrear el sitio página por página a ciegas.",
  },
  {
    numero: 2,
    tk: "p_c2_titulo",
    td: "Extrae nombre, precio y stock real de cada página",
    dk: "p_c2_desc",
    dd: "Por cada URL descubierta, lee la página y saca los datos publicados por la tienda: nombre, precio, stock y variantes de talle/color. Si la fuente no publica el stock de una variante, no se completa con un valor por defecto — se distingue 'sabemos que hay stock' de 'no lo sabemos'.",
  },
  {
    numero: 3,
    tk: "p_c3_titulo",
    td: "Arma las categorías en dos pasadas separadas",
    dk: "p_c3_desc",
    dd: "Una pasada arma las categorías del menú de navegación de la tienda clonada. Otra, aparte, asigna la categoría de cada producto individual a partir del breadcrumb de su propia página — son dos procesos independientes, para que el menú quede prolijo aunque el breadcrumb de un producto puntual sea inconsistente.",
  },
  {
    numero: 4,
    tk: "p_c4_titulo",
    td: "Reconoce la plataforma de origen sola",
    dk: "p_c4_desc",
    dd: "Cada plataforma de e-commerce publica sus datos distinto (JSON-LD, clases CSS propias, u objetos JavaScript inyectados). El motor identifica la plataforma de la tienda de origen y usa la estrategia de extracción que corresponde, sin configuración manual.",
  },
  {
    numero: 5,
    tk: "p_c5_titulo",
    td: "Re-scrapeo diario e incremental",
    dk: "p_c5_desc",
    dd: "Todos los días, un proceso recorre cada tienda ya clonada y vuelve a traer sus datos. Es incremental: usa el campo lastmod del sitemap para saltear productos que no cambiaron desde el último scrapeo, en vez de reprocesar el catálogo entero cada vez.",
  },
  {
    numero: 6,
    tk: "p_c6_titulo",
    td: "Historial de precio y stock",
    dk: "p_c6_desc",
    dd: "Cada cambio real de precio o stock queda guardado con fecha, para poder auditar cuándo y cuánto varió un producto a lo largo del tiempo.",
  },
]

const faqDev = [
  {
    qk: "p_faq1_q",
    q: "¿Qué plataformas de e-commerce soporta el motor hoy?",
    ak: "p_faq1_a",
    a: "Hoy el motor soporta las plataformas de e-commerce más usadas del mercado. Sitios armados con frameworks headless/CSR (por ejemplo, con el precio inyectado del lado del cliente) todavía no tienen una estrategia de extracción propia.",
  },
  {
    qk: "p_faq2_q",
    q: "¿Cómo evita clonar catálogos con stock inventado?",
    ak: "p_faq2_a",
    a: "El motor solo usa el número de stock que la fuente publica explícitamente por variante. Si ese dato no está publicado, no se completa con un valor por defecto.",
  },
  {
    qk: "p_faq3_q",
    q: "¿Cómo descubre qué productos tiene una tienda?",
    ak: "p_faq3_a",
    a: "A partir del sitemap.xml público de la tienda de origen, no rastreando enlaces a ciegas. Eso también permite el re-scrapeo incremental usando el lastmod de cada URL.",
  },
  {
    qk: "p_faq4_q",
    q: "¿Qué pasa si la tienda de origen cambia de diseño?",
    ak: "p_faq4_a",
    a: "El motor identifica la plataforma subyacente, no el tema visual puntual, así que sigue funcionando aunque cambie el diseño, siempre que la plataforma de base sea la misma.",
  },
  {
    qk: "p_faq5_q",
    q: "¿Cada cuánto se re-sincroniza el catálogo clonado?",
    ak: "p_faq5_a",
    a: "Una vez por día, mediante un proceso automático que recorre todas las tiendas ya clonadas.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function ScrapingBlogClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("blog-scraping")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="blog-scraping" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
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
              <span>Scraping</span>
            </span>
            <span className="flex items-center gap-4">
              <Link
                href="/blog/cosas-legales-antes-de-usar-scraping"
                className="text-red-600 font-semibold text-xs uppercase tracking-wide hover:text-red-800 whitespace-nowrap"
              >
                Marco legal
              </Link>
              <Link
                href="/blog/que-es-el-dropshipping"
                className="text-blue-600 font-semibold text-xs uppercase tracking-wide hover:text-blue-800 whitespace-nowrap"
              >
                Qué es el dropshipping →
              </Link>
            </span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Scraping en tol.ar: cómo clonamos un catálogo entero en minutos")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Actualizado: agosto 2026 · Elegí abajo si querés la versión para vender o la versión técnica")}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET("criollo_texto", "Scraping, en tol.ar, es copiar el catálogo completo de otra tienda a la tuya sin cargar nada a mano: fotos, precios, stock y categorías. Se arma en minutos y se mantiene actualizado solo, todos los días.")}
            </p>
          </div>

          <Tabs defaultValue="usuarios" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
              <TabsTrigger value="usuarios" className="gap-2"><ShoppingBag className="w-4 h-4" />Para vender</TabsTrigger>
              <TabsTrigger value="programadores" className="gap-2"><Code2 className="w-4 h-4" />Para programadores</TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{ET("u_que_es_titulo", "Qué es el scraping en tol.ar, sin vueltas")}</h2>
                <p className="text-gray-700 mb-4">
                  {ET("u_que_es_texto1", "Cuando armás una tienda de la nada, el trabajo más pesado no es elegir el diseño: es cargar cada producto a mano — sacar fotos, escribir la descripción, poner el precio, cargar el talle y el color de cada variante. Con cientos de productos, eso puede llevar semanas.")}
                </p>
                <p className="text-gray-700 mb-4">
                  {ET("u_que_es_texto2", "El scraping de tol.ar hace ese trabajo por vos: le pasás el link de una tienda proveedora y copiamos su catálogo completo a la tuya — fotos, precios, stock y categorías — listo para vender en minutos, no semanas.")}
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("u_para_quien_titulo", "Para quién es esto")}</h2>
                <ul className="space-y-2 mb-8 text-gray-700">
                  <li className="flex gap-3 items-start"><span className="text-green-600 font-bold flex-shrink-0">✓</span><span>{ET("u_para_quien1", "Querés empezar a vender ya, sin esperar a sacar fotos ni escribir descripciones de cada producto")}</span></li>
                  <li className="flex gap-3 items-start"><span className="text-green-600 font-bold flex-shrink-0">✓</span><span>{ET("u_para_quien2", "Tenés un proveedor o mayorista con su propia tienda online y querés revender su catálogo")}</span></li>
                  <li className="flex gap-3 items-start"><span className="text-green-600 font-bold flex-shrink-0">✓</span><span>{ET("u_para_quien3", "No querés depender de cargar precio y stock a mano cada vez que algo cambia")}</span></li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("u_pasos_titulo", "Cómo funciona, en 3 pasos")}</h2>
                <div className="space-y-6 mb-10">
                  {pasosUsuario.map((paso) => (
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

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("u_actualiza_titulo", "Se mantiene actualizado solo")}</h2>
                <p className="text-gray-700 mb-4">
                  {ET("u_actualiza_texto", "Todos los días, sin que hagas nada, revisamos de nuevo la tienda proveedora y actualizamos precio y stock en la tuya. Si un producto se agotó o cambió de precio en el origen, tu tienda lo refleja sola al otro día.")}
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("u_faq_titulo", "Preguntas frecuentes")}</h2>
                <div className="space-y-6">
                  {faqUsuario.map((faq) => (
                    <div key={faq.qk} className="border-b border-gray-100 pb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{ET(faq.qk, faq.q)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(faq.ak, faq.a)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-3">{ET("u_cta_titulo", "Cloná tu primera tienda gratis")}</h2>
                <p className="text-blue-100 mb-6">
                  {ET("u_cta_texto", "Creá tu tienda en tol.ar y conectá una tienda proveedora para ver el clonado en acción.")}
                </p>
                <Link
                  href="https://app.tol.ar/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  {ET("u_cta_boton", "Crear tienda gratis")} <ArrowRight size={18} />
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="programadores">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{ET("p_arq_titulo", "Arquitectura del motor")}</h2>
                <p className="text-gray-700 mb-4">
                  {ET("p_arq_texto1", "scraping.tol.ar es el motor que clona catálogos completos de otras tiendas hacia tol.ar. No es un scraper genérico que copia HTML y listo: reconoce la estructura de cada plataforma de e-commerce, distingue stock real de stock inventado, y se re-ejecuta solo todos los días para mantener el catálogo al día.")}
                </p>
                <p className="text-gray-700 mb-4">
                  {ET("p_arq_texto2", "Estas son las decisiones técnicas concretas del motor que corre hoy en producción.")}
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("p_caract_titulo", "Cómo descubre y extrae productos")}</h2>
                <div className="space-y-6 mb-10">
                  {caracteristicasDev.map((c) => (
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

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">{ET("p_faq_titulo", "Preguntas frecuentes")}</h2>
                <div className="space-y-6">
                  {faqDev.map((faq) => (
                    <div key={faq.qk} className="border-b border-gray-100 pb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{ET(faq.qk, faq.q)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(faq.ak, faq.a)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-3">{ET("p_cta_titulo", "Probá el motor de clonado vos mismo")}</h2>
                <p className="text-blue-100 mb-6">
                  {ET("p_cta_texto", "Creá tu tienda gratis en tol.ar y conectá una tienda madre para ver el clonado en acción.")}
                </p>
                <Link
                  href="https://app.tol.ar/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  {ET("p_cta_boton", "Crear tienda gratis")} <ArrowRight size={18} />
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
