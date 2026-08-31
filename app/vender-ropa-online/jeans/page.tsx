import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Cómo Vender Jeans Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender jeans online en Argentina: tabla de talles cintura/largo, variantes de lavado y tiro, requisitos legales, paso a paso y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender jeans online argentina, crear tienda de jeans online, como vender jeans por internet, tienda de jeans online gratis, talles de jeans argentina",
  alternates: {
    canonical: "https://tol.ar/vender-ropa-online/jeans",
  },
  openGraph: {
    title: "Cómo Vender Jeans Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de jeans online en Argentina, gratis. Talles, variantes de lavado, requisitos legales y paso a paso.",
    type: "article",
    url: "https://tol.ar/vender-ropa-online/jeans",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Jeans Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender jeans online en Argentina: talles, variantes de lavado y tiro, requisitos legales, paso a paso y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-17",
  dateModified: "2026-08-17",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-ropa-online/jeans" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué talles de jeans tengo que cargar para arrancar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En Argentina los jeans se venden mayormente por talle de letra (36 a 46) o por cintura en centímetros, según la marca. Para arrancar con pocas unidades por modelo, lo más común es cubrir el rango 38-44, que es el que más rota, y sumar los extremos (36 y 46) más adelante si hay pedidos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo evito devoluciones por talle en jeans, que calzan distinto según la marca?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Publicando una tabla de medidas propia por modelo (cintura, cadera y largo de la pierna en centímetros, tomados de una prenda real con cinta métrica), no solo el talle de letra. El jean es la prenda con más variación de calce entre marcas, así que la tabla de medidas reduce mucho más las devoluciones que en remeras o buzos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene tener el mismo modelo en varios lavados y tiros?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, es la forma en que la mayoría de las marcas de jeans arma su catálogo: mismo molde base (tiro alto, tiro medio, mom, wide leg, skinny) en 2 o 3 lavados (claro, oscuro, negro). La plantilla de indumentaria de tol.ar permite cargar todo eso como variantes de un mismo producto, con stock independiente por combinación de talle y lavado.",
      },
    },
    {
      "@type": "Question",
      name: "¿El jean pesa más para el envío y eso encarece el costo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, un jean pesa considerablemente más que una remera o una prenda liviana, así que el costo de envío por unidad es más alto. Conviene calcular la tarifa de envío con el peso real del jean (no un estimado genérico de 'ropa') para no perder margen en cada venta, sobre todo si se envía una sola unidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender jeans por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar los primeros productos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar como monotributista cuando las ventas empiecen a ser regulares.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Vender ropa online", item: "https://tol.ar/vender-ropa-online" },
    { "@type": "ListItem", position: 3, name: "Vender jeans online", item: "https://tol.ar/vender-ropa-online/jeans" },
  ],
}

export default function VenderJeansOnline() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía para emprendedores — agosto 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Jeans Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Talles, tabla de medidas, variantes de lavado y tiro, requisitos legales y paso a paso para
              armar tu tienda de jeans. Sin tarjeta de crédito, sin mensualidad, con MercadoPago y envíos
              incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 17 agosto 2026</span>
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
                <li><a href="#por-que-jeans" className="hover:underline text-green-700">Por qué el jean es un buen producto para arrancar</a></li>
                <li><a href="#talles" className="hover:underline text-green-700">Talles y variantes: lo que distingue al jean de otras prendas</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de jeans</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-jeans">Por qué el jean es un buen producto para arrancar</h2>
            <p>
              El jean tiene una ventaja frente a otras prendas para quien recién arranca: no depende tanto
              de la temporada. Un buzo de lana o una musculosa tienen una ventana de venta de pocos meses
              al año; el jean se usa (y se busca) los doce meses, lo que da más tiempo para vender el mismo
              stock sin tener que liquidarlo fuera de temporada.
            </p>
            <p>
              Es también una prenda de compra repetida: alguien que compró un jean y le calzó bien vuelve a
              comprar el mismo modelo en otro lavado o color, algo que pasa menos con prendas más puntuales
              de una sola temporada. Esa recompra es la base para armar una cartera de clientes fija con
              pocos modelos bien elegidos, en lugar de tener que renovar todo el catálogo cada temporada
              como en indumentaria general.
            </p>
            <p>
              La contracara: el jean es una prenda de costo unitario más alto que una remera o una musculosa,
              así que inmoviliza más plata por unidad de stock. Conviene arrancar con pocos modelos (2 o 3
              moldes) en varios talles antes que muchos modelos con poco stock de cada talle.
            </p>

            <h2 id="talles">Talles y variantes: lo que distingue al jean de otras prendas</h2>
            <p>
              El jean es la prenda de indumentaria con más variación de calce entre marcas: un talle 40 de
              una marca puede tener varios centímetros de diferencia de cintura respecto al 40 de otra. Por
              eso, además del talle de letra o número, conviene publicar una tabla de medidas propia por
              modelo (cintura, cadera y largo de pierna en centímetros), tomada con cinta métrica sobre una
              prenda real y no copiada de otra tienda.
            </p>
            <p>
              El otro eje de variantes es el tiro y el lavado: tiro alto, tiro medio, mom, wide leg o
              skinny, cada uno en 2 o 3 lavados (claro, oscuro, negro) y a veces con o sin roturas. La
              plantilla de indumentaria de tol.ar permite cargar talle, tiro y lavado como variantes del
              mismo producto, con foto y stock independiente por combinación — se puede ver funcionando en{" "}
              <a href="https://ropa.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                ropa.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <p>
              Un detalle logístico propio del jean: pesa bastante más que el resto de la indumentaria, lo
              que encarece el envío por unidad. Conviene calcular el costo de envío con el peso real del
              paquete (no la tarifa genérica de "ropa liviana") para no perder margen, sobre todo en envíos
              de una sola prenda.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              Los mismos que para cualquier otra prenda: no hace falta CUIT para crear la tienda ni cargar
              los primeros jeans. Para facturar de forma regular hace falta CUIT y estar inscripto como
              monotributista, y desde 2021 MercadoPago está obligado a informar a AFIP las transacciones de
              sus usuarios. Por la Ley de Defensa del Consumidor (Ley 24.240), el comprador tiene 10 días
              corridos desde que recibe el jean para arrepentirse de la compra sin dar motivo — algo
              frecuente cuando el talle no calza como esperaba por la variación entre marcas explicada
              arriba. Las tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado por defecto.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de jeans online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de indumentaria</h3>
            <p>
              Es la misma plantilla que se usa para ropa en general, con talles de letra o número, y
              variantes adicionales (tiro, lavado) que podés cargar como opciones del producto.
            </p>
            <h3>Paso 3 — Cargar tus jeans con tabla de medidas</h3>
            <p>
              Subís fotos de cada modelo (de frente, de espalda y de la etiqueta de composición), cargás la
              tabla de medidas propia por talle y las variantes de tiro y lavado con su stock.
            </p>
            <h3>Paso 4 — Configurar MercadoPago y envíos</h3>
            <p>
              Igual que en el resto de la tienda: configurás MercadoPago para cobrar y activás Andreani,
              Correo Argentino o retiro en local, ajustando el costo de envío al peso real del jean.
            </p>
            <h3>Paso 5 — Publicar y compartir</h3>
            <p>
              Con los modelos cargados y los pagos configurados, tu tienda ya está activa y lista para
              compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de jeans</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Tenés al menos 2-3 modelos de jean en varios talles y lavados",
                "Cargaste una tabla de medidas propia (cintura, cadera, largo) por modelo, no genérica",
                "Sacaste fotos de frente, espalda y etiqueta de composición de cada jean",
                "Calculaste el costo de envío con el peso real del jean, no una tarifa genérica",
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
            <h3>¿Qué talles de jeans tengo que cargar para arrancar?</h3>
            <p>
              En Argentina se vende mayormente por talle de letra (36 a 46) o por cintura en centímetros
              según la marca. Para arrancar conviene cubrir el rango 38-44, que es el que más rota, y sumar
              los extremos más adelante según los pedidos.
            </p>
            <h3>¿Cómo evito devoluciones por talle si el jean calza distinto en cada marca?</h3>
            <p>
              Publicando una tabla de medidas propia por modelo, tomada con cinta métrica sobre una prenda
              real, además del talle de letra. Es la prenda con más variación de calce entre marcas, así
              que esta tabla reduce mucho más las devoluciones que en otras prendas.
            </p>
            <h3>¿Conviene tener el mismo modelo en varios lavados y tiros?</h3>
            <p>
              Sí, es la forma habitual de armar catálogo de jeans: mismo molde en distintos tiros (alto,
              medio, mom, wide leg, skinny) y 2 o 3 lavados. La plantilla de tol.ar permite cargar todo como
              variantes del mismo producto, con stock independiente por combinación.
            </p>
            <h3>¿El jean encarece el envío por su peso?</h3>
            <p>
              Sí, pesa bastante más que otras prendas. Conviene calcular la tarifa de envío con el peso real
              del paquete para no perder margen, en especial en envíos de una sola unidad.
            </p>
            <h3>¿Necesito CUIT para vender jeans por internet?</h3>
            <p>
              No para crear la tienda ni cargar los primeros productos. Sí conviene tramitarlo cuando las
              ventas empiecen a ser regulares, para facturar como monotributista.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Seguir leyendo</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online: guía completa</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online</Link>
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
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de jeans gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="clothing" label="Crear mi tienda de jeans gratis" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
