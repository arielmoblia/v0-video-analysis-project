import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Ropa Deportiva Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender ropa deportiva online en Argentina: talles y compresión, telas técnicas, variantes de color y estampado, requisitos legales, paso a paso y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender ropa deportiva online argentina, crear tienda de ropa deportiva online, como vender indumentaria deportiva por internet, tienda de ropa fitness online gratis, vender leggings y calzas online",
  alternates: {
    canonical: "https://tol.ar/vender-ropa-online/ropa-deportiva",
  },
  openGraph: {
    title: "Cómo Vender Ropa Deportiva Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de ropa deportiva online en Argentina, gratis. Talles, telas técnicas, variantes y paso a paso.",
    type: "article",
    url: "https://tol.ar/vender-ropa-online/ropa-deportiva",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Ropa Deportiva Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender ropa deportiva online en Argentina: talles y compresión, telas técnicas, variantes de color y estampado, requisitos legales, paso a paso y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-04",
  dateModified: "2026-09-04",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-ropa-online/ropa-deportiva" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué talles tengo que cargar para arrancar con ropa deportiva?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La mayoría de las marcas argentinas de indumentaria deportiva usa talles de letra (XS a XXL), igual que la ropa general, pero con un dato extra clave: el nivel de compresión. Una calza o top deportivo calza distinto según sea de compresión suave, media o alta, así que conviene aclarar ese dato además del talle de letra, no solo copiar la tabla de una prenda casual.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué diferencia a la tela deportiva de la tela de ropa casual?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La ropa deportiva usa telas técnicas (poliéster/elastano, dry-fit, microfibra) pensadas para transpiración y elasticidad, distintas del algodón de una remera casual. Conviene aclarar la composición de tela en cada publicación porque influye directamente en la decisión de compra de quien entrena: no es lo mismo para correr que para hacer fuerza.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene tener el mismo modelo en varios colores y estampados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. En ropa deportiva el color y el estampado (liso, camuflado, degradé) pesan mucho en la decisión de compra, sobre todo en calzas y tops. La plantilla de indumentaria de tol.ar permite cargar talle, compresión y color como variantes del mismo producto, con stock independiente por combinación.",
      },
    },
    {
      "@type": "Question",
      name: "¿La ropa deportiva tiene estacionalidad marcada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Menos que otras categorías: se usa todo el año (gimnasio, running, entrenamiento en casa), aunque hay picos previsibles en enero-febrero (buenos propósitos de año nuevo) y antes del verano. Eso la vuelve una categoría con menos riesgo de stock parado fuera de temporada que la ropa de abrigo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender ropa deportiva por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar las primeras prendas. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar como monotributista cuando las ventas empiecen a ser regulares.",
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
    { "@type": "ListItem", position: 3, name: "Vender ropa deportiva online", item: "https://tol.ar/vender-ropa-online/ropa-deportiva" },
  ],
}

export default async function VenderRopaDeportivaOnline() {
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
              Guía para emprendedores — septiembre 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Ropa Deportiva Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Talles y compresión, telas técnicas, variantes de color y estampado, requisitos legales y
              paso a paso para armar tu tienda de indumentaria deportiva. Sin tarjeta de crédito, sin
              mensualidad, con MercadoPago y envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 4 septiembre 2026</span>
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
                <li><a href="#por-que-deportiva" className="hover:underline text-green-700">Por qué la ropa deportiva es un buen producto para arrancar</a></li>
                <li><a href="#talles" className="hover:underline text-green-700">Talles, compresión y tela: lo que distingue a la ropa deportiva</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de ropa deportiva</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-deportiva">Por qué la ropa deportiva es un buen producto para arrancar</h2>
            <p>
              La ropa deportiva se usa y se busca prácticamente todo el año: gimnasio, running, entrenamiento
              en casa. No tiene la estacionalidad marcada de un buzo de lana o una campera de invierno, aunque
              sí tiene picos previsibles en enero-febrero (propósitos de año nuevo) y antes del verano, algo
              útil para planificar cuándo reforzar stock.
            </p>
            <p>
              Es también una categoría de compra repetida: quien encuentra una calza o un top que le calza
              bien y con la compresión adecuada suele volver a comprar el mismo modelo en otro color, algo
              que favorece armar una cartera de clientes fija en lugar de depender solo de compradores nuevos.
            </p>
            <p>
              La contracara: es una categoría técnica, donde la tela y el nivel de compresión pesan tanto
              como el talle en la decisión de compra, así que la descripción del producto tiene que ser más
              precisa que en ropa casual para evitar devoluciones.
            </p>

            <h2 id="talles">Talles, compresión y tela: lo que distingue a la ropa deportiva</h2>
            <p>
              La mayoría de las marcas argentinas de indumentaria deportiva usa talles de letra (XS a XXL),
              igual que la ropa general, pero suma un dato propio de la categoría: el nivel de compresión
              (suave, media o alta). Una calza o un top de compresión alta calza distinto a uno de compresión
              suave en el mismo talle de letra, así que conviene aclarar ese dato en cada publicación, no solo
              copiar la tabla de talles de una prenda casual.
            </p>
            <p>
              El otro eje propio de la categoría es la tela: poliéster/elastano, dry-fit o microfibra, pensadas
              para transpiración y elasticidad, distintas del algodón de una remera casual. Aclarar la
              composición ayuda a que el comprador elija bien según el uso (correr, hacer fuerza, yoga). Color
              y estampado (liso, camuflado, degradé) también pesan bastante en la decisión, sobre todo en
              calzas y tops. La plantilla de indumentaria de tol.ar permite cargar talle, compresión y color
              como variantes del mismo producto, con foto y stock independiente por combinación — se puede ver
              funcionando en{" "}
              <a href="https://ropa.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                ropa.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              Los mismos que para cualquier otra prenda: no hace falta CUIT para crear la tienda ni cargar
              las primeras piezas. Para facturar de forma regular hace falta CUIT y estar inscripto como
              monotributista, y desde 2021 MercadoPago está obligado a informar a AFIP las transacciones de
              sus usuarios. Por la Ley de Defensa del Consumidor (Ley 24.240), el comprador tiene 10 días
              corridos desde que recibe la prenda para arrepentirse de la compra sin dar motivo — algo
              frecuente cuando la compresión o el talle no calzan como esperaba. Las tiendas de tol.ar ya
              tienen el botón de arrepentimiento incorporado por defecto.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de ropa deportiva online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de indumentaria</h3>
            <p>
              Es la misma plantilla que se usa para ropa en general, con talles de letra y variantes
              adicionales (compresión, color, estampado) que podés cargar como opciones del producto.
            </p>
            <h3>Paso 3 — Cargar tus prendas deportivas</h3>
            <p>
              Subís fotos de cada modelo (de frente, de espalda y en uso, si es posible), aclarás talle,
              nivel de compresión y composición de tela, y cargás las variantes de color con su stock.
            </p>
            <h3>Paso 4 — Configurar MercadoPago y envíos</h3>
            <p>
              Igual que en el resto de la tienda: configurás MercadoPago para cobrar y activás Andreani,
              Correo Argentino o retiro en local.
            </p>
            <h3>Paso 5 — Publicar y compartir</h3>
            <p>
              Con los modelos cargados y los pagos configurados, tu tienda ya está activa y lista para
              compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de ropa deportiva</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Tenés al menos 2-3 modelos en varios talles, colores y niveles de compresión",
                "Aclaraste el nivel de compresión (suave, media, alta) además del talle de letra",
                "Describiste la composición de la tela (poliéster/elastano, dry-fit, microfibra)",
                "Sacaste fotos de frente, espalda y, si es posible, en uso",
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
            <h3>¿Qué talles tengo que cargar para arrancar?</h3>
            <p>
              Talles de letra (XS a XXL) como en ropa general, aclarando además el nivel de compresión
              (suave, media, alta), porque afecta el calce tanto como el talle.
            </p>
            <h3>¿Qué diferencia a la tela deportiva de la tela casual?</h3>
            <p>
              Telas técnicas (poliéster/elastano, dry-fit, microfibra) pensadas para transpiración y
              elasticidad, distintas del algodón de una prenda casual. Conviene aclarar la composición en
              cada publicación.
            </p>
            <h3>¿Conviene tener el mismo modelo en varios colores?</h3>
            <p>
              Sí, el color y el estampado pesan bastante en la decisión de compra, sobre todo en calzas y
              tops. La plantilla de tol.ar permite cargar talle, compresión y color como variantes del mismo
              producto, con stock independiente.
            </p>
            <h3>¿La ropa deportiva tiene estacionalidad?</h3>
            <p>
              Menos que otras categorías: se usa todo el año, con picos previsibles en enero-febrero y antes
              del verano.
            </p>
            <h3>¿Necesito CUIT para vender ropa deportiva por internet?</h3>
            <p>
              No para crear la tienda ni cargar los primeros productos. Sí conviene tramitarlo cuando las
              ventas empiecen a ser regulares, para facturar como monotributista.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Seguir leyendo</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online: guía completa</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-ropa-online/jeans" className="text-green-700 hover:underline">Vender jeans online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-electronicos-online" className="text-green-700 hover:underline">Vender electrónicos online</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de ropa deportiva gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="clothing" label="Crear mi tienda de ropa deportiva gratis" />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  )
}
