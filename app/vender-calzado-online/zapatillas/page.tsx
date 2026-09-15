import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Zapatillas Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender zapatillas online en Argentina: numeración, cómo evitar problemas de originalidad, variantes de color y modelo, requisitos legales, paso a paso y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender zapatillas online argentina, crear tienda de zapatillas online, como vender zapatillas por internet, tienda de zapatillas online gratis, zapatillas deportivas venta online argentina",
  alternates: {
    canonical: "https://tol.ar/vender-calzado-online/zapatillas",
  },
  openGraph: {
    title: "Cómo Vender Zapatillas Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de zapatillas online en Argentina, gratis. Numeración, originalidad, variantes y paso a paso.",
    type: "article",
    url: "https://tol.ar/vender-calzado-online/zapatillas",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Zapatillas Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender zapatillas online en Argentina: numeración, originalidad, variantes de color y modelo, requisitos legales, paso a paso y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-24",
  dateModified: "2026-08-24",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-calzado-online/zapatillas" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué numeración de zapatillas tengo que cargar para arrancar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La numeración de zapatillas en Argentina va aproximadamente del 35 al 45, con el rango 38-42 concentrando la mayor parte de la demanda tanto en talles de mujer como de hombre. Para arrancar con poco stock por modelo conviene cubrir ese rango central y sumar los extremos (35-36 y 43-45) a medida que hay pedidos concretos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo evito problemas por vender zapatillas que no son originales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comprando solo a distribuidores mayoristas que puedan mostrar factura de origen y describiendo el producto con precisión (marca real, o aclarar expresamente si es un símil/genérico sin usar el logo ni el nombre de la marca registrada). Presentar una réplica como si fuera un producto original puede constituir una infracción a la Ley de Marcas (22.362) y habilitar un reclamo del comprador, además de dañar la confianza a largo plazo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene tener el mismo modelo de zapatilla en varios colores?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. En zapatillas el color y el modelo pesan tanto como el talle a la hora de decidir la compra, más que en otras categorías de calzado. La plantilla de calzado de tol.ar permite cargar talle y color como variantes del mismo producto, con foto y stock independiente por combinación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Las zapatillas tienen mucha rotación de stock o se venden todo el año igual?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las zapatillas urbanas y deportivas se venden todo el año, sin la estacionalidad marcada de otro calzado como botas o sandalias. Eso la vuelve una categoría con menos riesgo de quedarse con stock parado por cambio de temporada, aunque los lanzamientos de modelos nuevos (drops) sí generan picos puntuales de demanda.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender zapatillas por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar los primeros modelos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar como monotributista cuando las ventas empiecen a ser regulares.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Vender calzado online", item: "https://tol.ar/vender-calzado-online" },
    { "@type": "ListItem", position: 3, name: "Vender zapatillas online", item: "https://tol.ar/vender-calzado-online/zapatillas" },
  ],
}

export default async function VenderZapatillasOnline() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía para emprendedores — agosto 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Zapatillas Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Numeración, originalidad, variantes de color y modelo, requisitos legales y paso a paso para
              armar tu tienda de zapatillas. Sin tarjeta de crédito, sin mensualidad, con MercadoPago y
              envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 24 agosto 2026</span>
              <span>·</span>
              <span>9 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
            <div className="not-prose mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">En esta guía</p>
              <ol className="text-sm space-y-1.5 text-gray-700 list-decimal list-inside">
                <li><a href="#por-que-zapatillas" className="hover:underline text-green-700">Por qué las zapatillas son un buen producto para arrancar</a></li>
                <li><a href="#variantes" className="hover:underline text-green-700">Numeración, color y originalidad: lo que distingue a la zapatilla</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de zapatillas</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-zapatillas">Por qué las zapatillas son un buen producto para arrancar</h2>
            <p>
              La zapatilla es, dentro del calzado, la categoría con menos estacionalidad: se usa y se busca
              los doce meses del año, a diferencia de la bota (que se vende sobre todo en invierno) o la
              sandalia (concentrada en primavera-verano). Eso reduce el riesgo de quedarse con stock parado
              fuera de temporada, algo especialmente valioso para quien recién arranca con poco capital.
            </p>
            <p>
              Es también una categoría con alta frecuencia de recompra: quien encuentra un modelo cómodo
              suele volver a comprar el mismo diseño en otro color, o directamente el modelo siguiente de la
              misma línea cuando sale. Eso favorece armar una cartera de clientes que vuelve, en lugar de
              depender solo de compradores nuevos cada vez.
            </p>
            <p>
              La contracara: es una categoría muy competida, con mucha oferta online, así que la diferencia
              suele estar en la claridad de la numeración, la calidad de las fotos y la garantía de que el
              producto es lo que dice ser.
            </p>

            <h2 id="variantes">Numeración, color y originalidad: lo que distingue a la zapatilla</h2>
            <p>
              La numeración de zapatillas en Argentina va aproximadamente del 35 al 45, y a diferencia de
              otro calzado, muchos modelos deportivos usan numeración unisex — conviene aclarar en cada
              publicación si el talle corresponde a la línea de hombre, mujer o si es unisex, porque no
              siempre coincide entre marcas.
            </p>
            <p>
              El color y el modelo pesan en la decisión de compra tanto como el talle, más que en otras
              categorías de calzado: dos personas pueden comprar el mismo modelo en talles distintos, pero
              también la misma persona puede dudar entre dos colores del mismo modelo. La plantilla de
              calzado de tol.ar permite cargar talle y color como variantes del mismo producto, con foto y
              stock independiente por combinación — se puede ver funcionando en{" "}
              <a href="https://zapatos.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                zapatos.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <p>
              Un punto propio de esta categoría: la originalidad. Comprar a distribuidores que puedan mostrar
              factura de origen y ser preciso en la descripción (marca real, o aclarar expresamente si es un
              producto símil/genérico, sin usar el logo ni el nombre de una marca registrada) evita problemas
              legales y protege la reputación de la tienda a largo plazo.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              Los mismos que para cualquier otro calzado: no hace falta CUIT para crear la tienda ni cargar
              las primeras zapatillas. Para facturar de forma regular hace falta CUIT y estar inscripto como
              monotributista, y desde 2021 MercadoPago está obligado a informar a AFIP las transacciones de
              sus usuarios. Por la Ley de Defensa del Consumidor (Ley 24.240), el comprador tiene 10 días
              corridos desde que recibe el producto para arrepentirse de la compra sin dar motivo. Las
              tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado por defecto. A esto se suma
              lo dicho arriba sobre originalidad: presentar una réplica como si fuera un producto de marca
              original puede constituir una infracción a la Ley de Marcas (Ley 22.362), además de habilitar
              el reclamo del comprador por publicidad engañosa bajo la Ley de Defensa del Consumidor.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de zapatillas online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de calzado</h3>
            <p>
              Es la misma plantilla que se usa para calzado en general, con numeración del 34 al 46 y
              variantes de color como opciones del producto.
            </p>
            <h3>Paso 3 — Cargar tus zapatillas</h3>
            <p>
              Subís fotos de cada modelo (frente, perfil, suela y detalle de la etiqueta), aclarás si la
              numeración es de hombre, mujer o unisex, y cargás las variantes de color con su stock.
            </p>
            <h3>Paso 4 — Configurar MercadoPago y envíos</h3>
            <p>
              Igual que en el resto de la tienda: configurás MercadoPago para cobrar y activás Andreani,
              Correo Argentino o retiro en local, ajustando el costo de envío al peso real de la zapatilla.
            </p>
            <h3>Paso 5 — Publicar y compartir</h3>
            <p>
              Con los modelos cargados y los pagos configurados, tu tienda ya está activa y lista para
              compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de zapatillas</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Tenés al menos 5-10 modelos con numeración y color cargados como variantes",
                "Aclaraste si cada modelo es de talle hombre, mujer o unisex",
                "Sacaste fotos de frente, perfil, suela y etiqueta de cada zapatilla",
                "Verificaste el origen del producto y describiste la marca con precisión (sin presentar réplicas como originales)",
                "Conectaste MercadoPago y probaste un pago de prueba",
                "La política de arrepentimiento (10 días) está visible en la tienda",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
            <h3>¿Qué numeración de zapatillas tengo que cargar para arrancar?</h3>
            <p>
              Aproximadamente del 35 al 45, con el rango 38-42 concentrando la mayor parte de la demanda.
              Conviene arrancar por ese rango central y sumar los extremos según los pedidos.
            </p>
            <h3>¿Cómo evito problemas por vender zapatillas que no son originales?</h3>
            <p>
              Comprando a distribuidores que puedan mostrar factura de origen y describiendo con precisión
              si el producto es de marca original o un símil, sin usar el logo ni el nombre de una marca
              registrada si no lo es.
            </p>
            <h3>¿Conviene tener el mismo modelo en varios colores?</h3>
            <p>
              Sí, en zapatillas el color pesa tanto como el talle en la decisión de compra. La plantilla de
              tol.ar permite cargar talle y color como variantes del mismo producto, con stock independiente.
            </p>
            <h3>¿Las zapatillas se venden todo el año o tienen temporada?</h3>
            <p>
              Se venden todo el año, sin la estacionalidad marcada de botas o sandalias, aunque los
              lanzamientos de modelos nuevos generan picos puntuales de demanda.
            </p>
            <h3>¿Necesito CUIT para vender zapatillas por internet?</h3>
            <p>
              No para crear la tienda ni cargar los primeros productos. Sí conviene tramitarlo cuando las
              ventas empiecen a ser regulares, para facturar como monotributista.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Seguir leyendo</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online: guía completa</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-electronicos-online" className="text-green-700 hover:underline">Vender electrónicos online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-cosmeticos-online" className="text-green-700 hover:underline">Vender cosméticos online</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de zapatillas gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="footwear" label="Crear mi tienda de zapatillas gratis" />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  )
}
