import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Qué Productos Vender Online en Argentina (2026)",
  description:
    "Los productos más vendidos por internet en Argentina en 2026. Qué rubro conviene para empezar, cuáles tienen más demanda y cómo encontrar tu nicho.",
  keywords:
    "que productos vender online argentina, que vender por internet argentina 2026, productos mas vendidos online argentina, como elegir que vender online argentina, ideas para vender por internet argentina",
  alternates: {
    canonical: "https://tol.ar/blog/que-productos-vender-online-argentina",
  },
  openGraph: {
    title: "Qué Productos Vender Online en Argentina (2026)",
    description:
      "Los rubros con más demanda online en Argentina y cómo elegir qué vender para empezar con buen pie.",
    type: "article",
    url: "https://tol.ar/blog/que-productos-vender-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Qué Productos Vender Online en Argentina (2026)",
  description:
    "Análisis de los productos con más demanda para vender online en Argentina. Rubros populares, nichos con menos competencia y cómo elegir tu primer producto.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-06-28",
  dateModified: "2026-06-28",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/que-productos-vender-online-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué productos se venden más por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los rubros con más volumen de ventas online en Argentina son: ropa y calzado, electrónica y accesorios, artículos para el hogar, alimentos y bebidas (especialmente gourmet y naturales), y productos de belleza y cuidado personal. Dentro de cada categoría hay nichos con menos competencia y mejores márgenes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué conviene vender online si recién empiezo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para empezar conviene un producto que ya conozcas o que puedas hacer vos mismo, que no requiera mucho stock inicial, y que tenga margen suficiente para cubrir los costos de envío. Las artesanías, productos hechos a mano, ropa de nicho y alimentos artesanales son buenos puntos de entrada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito tener mucho stock para vender online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Podés empezar con poco stock o incluso trabajar por encargo (producís cuando te compran). Muchos vendedores exitosos arrancan con 5-10 productos y escalan gradualmente. Lo importante es validar que hay demanda antes de invertir en stock grande.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo sé si hay demanda para lo que quiero vender?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Buscá tu producto en Google Trends para ver si la búsqueda sube o baja. Fijate cuántos resultados hay en MercadoLibre para ese producto y si hay vendedores con muchas ventas. Y preguntale a 10 personas que conozcas si lo comprarían y cuánto pagarían. Si el precio que dicen cubre tus costos, hay negocio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene vender productos digitales online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, y tienen ventajas claras: no hay stock, no hay envío, el margen es muy alto y podés vender 24hs. Los más vendidos son cursos online, plantillas, ebooks, fotografías y recursos digitales. La demanda creció mucho en los últimos años y sigue en expansión.",
      },
    },
  ],
}

const categorias = [
  {
    nombre: "Ropa y accesorios",
    demanda: "Muy alta",
    competencia: "Alta",
    ideal: "Si tenés marca propia o revendés ropa con alguna diferenciación",
    color: "bg-blue-50 border-blue-200",
  },
  {
    nombre: "Artesanías y productos hechos a mano",
    demanda: "Alta",
    competencia: "Media",
    ideal: "Si fabricás vos mismo. Buen margen y clientes fieles",
    color: "bg-green-50 border-green-200",
  },
  {
    nombre: "Alimentos artesanales y gourmet",
    demanda: "Alta",
    competencia: "Media-baja",
    ideal: "Dulces, conservas, productos naturales. El nicho premium paga bien",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    nombre: "Belleza y cuidado personal",
    demanda: "Muy alta",
    competencia: "Alta",
    ideal: "Conviene si tenés una marca o si trabajás con productos naturales/sin TACC",
    color: "bg-pink-50 border-pink-200",
  },
  {
    nombre: "Productos digitales",
    demanda: "Alta y creciendo",
    competencia: "Variable",
    ideal: "Cursos, ebooks, plantillas. 0 stock, 0 envío, margen del 90%+",
    color: "bg-purple-50 border-purple-200",
  },
  {
    nombre: "Decoración y hogar",
    demanda: "Media-alta",
    competencia: "Media",
    ideal: "Especialmente si tenés productos únicos o personalizables",
    color: "bg-orange-50 border-orange-200",
  },
]

export default async function ProductosVenderOnlinePage() {
  const brand = await getBrand()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Header brand={brand} />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver al blog
            </Link>
          </div>

          <article>
            <header className="mb-10">
              <p className="text-sm text-indigo-600 font-medium mb-3">Ideas para emprender</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Qué Productos Vender Online en Argentina (2026)
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                La pregunta de los que recién empiezan. Te mostramos los rubros con más demanda,
                los nichos con menos competencia y cómo elegir qué vender.
              </p>
              <div className="mt-4 text-sm text-gray-400">
                Actualizado: junio 2026 · 8 min de lectura
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                No hay una respuesta única a esta pregunta. Lo que conviene vender depende de lo que sabés
                hacer, del capital que tenés para empezar y de lo que el mercado argentino está buscando.
                Pero sí hay tendencias claras que te pueden ayudar a arrancar por el buen camino.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
                Rubros con más demanda en 2026
              </h2>

              <div className="space-y-4 mb-10">
                {categorias.map((cat, i) => (
                  <div key={i} className={`border rounded-xl p-5 ${cat.color}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{cat.nombre}</h3>
                      <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 ml-4 shrink-0">
                        {cat.demanda}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Competencia:</span> {cat.competencia}
                    </p>
                    <p className="text-sm text-gray-700">{cat.ideal}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                La pregunta real: ¿qué conviene para VOS?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                La categoría no importa tanto como la combinación de tres factores:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-700">
                <li>
                  <strong>Que lo conozcas:</strong> vendés mejor lo que conocés. Si siempre compraste
                  ropa de niño y sabés qué buscan las madres, ese es tu nicho.
                </li>
                <li>
                  <strong>Que tengas margen:</strong> después de descontar el costo del producto, el
                  envío y las comisiones de la plataforma de pago, tiene que quedarte algo razonable.
                  Un margen del 30% para arriba es sostenible.
                </li>
                <li>
                  <strong>Que haya demanda:</strong> validá que la gente lo busca antes de invertir.
                  Revisá MercadoLibre, Google Trends y grupos de emprendedores de Argentina.
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Nichos con menos competencia en Argentina
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En los rubros masivos (ropa genérica, electrónica) la competencia es enorme. Hay opciones
                con menos competidores y clientes más dispuestos a pagar:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li>Productos sin TACC o veganos (comunidad grande y leal)</li>
                <li>Artículos personalizados (con nombre, fecha, imagen)</li>
                <li>Ropa de tallas especiales (demanda insatisfecha)</li>
                <li>Productos para mascotas artesanales</li>
                <li>Kits de regalo temáticos</li>
                <li>Insumos para hobbies (tejido, pintura, electrónica)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                ¿Y si no tengo producto todavía?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podés empezar con lo que ya tenés en casa (muchos emprendedores empezaron vendiendo
                cosas que no usaban), hacer productos por encargo para no arriesgar stock, o revendés
                algo que ya existe con alguna diferenciación (mejor presentación, kit, personalización).
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Lo importante es arrancar y aprender del mercado real, no de hipótesis. La primera
                venta enseña más que semanas de planificación.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Preguntas frecuentes
              </h2>
              <div className="space-y-6 mb-10">
                {faqLd.mainEntity.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.name}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mt-10">
                <h2 className="text-2xl font-bold mb-3">
                  Ya sé qué vender. Ahora necesito la tienda.
                </h2>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  Creá tu tienda online gratis en tol.ar en 2 minutos. Sin saber de tecnología,
                  sin pagar comisiones y con MercadoPago incluido.
                </p>
                <Link
                  href="https://tol.ar"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Crear mi tienda gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">Artículos relacionados:</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog/como-crear-tienda-online-gratis-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Cómo crear una tienda online gratis →
                  </Link>
                  <Link
                    href="/blog/como-vender-ropa-online-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Cómo vender ropa online →
                  </Link>
                  <Link
                    href="/blog/cuanto-cuesta-tienda-online-argentina"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    ¿Cuánto cuesta una tienda online? →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <RelatedArticles currentSlug="que-productos-vender-online-argentina" />
      <Footer brand={brand} />
    </>
  )
}
