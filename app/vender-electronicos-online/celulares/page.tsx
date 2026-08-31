import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Cómo Vender Celulares Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender celulares nuevos y usados online en Argentina: cómo verificar el IMEI, garantía legal según el estado del equipo, variantes de color y capacidad, requisitos legales, paso a paso y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender celulares online argentina, crear tienda de celulares online, como vender celulares usados por internet, tienda de celulares online gratis, vender celulares nuevos argentina",
  alternates: {
    canonical: "https://tol.ar/vender-electronicos-online/celulares",
  },
  openGraph: {
    title: "Cómo Vender Celulares Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de celulares online en Argentina, gratis. IMEI, garantía según estado, variantes y paso a paso.",
    type: "article",
    url: "https://tol.ar/vender-electronicos-online/celulares",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Celulares Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender celulares nuevos y usados online en Argentina: verificación de IMEI, garantía legal según el estado del equipo, variantes, requisitos legales, paso a paso y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-31",
  dateModified: "2026-08-31",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-electronicos-online/celulares" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo verifico que un celular usado no esté reportado como robado antes de venderlo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Marcando *#06# en el propio equipo se obtiene el IMEI, un número de 15 dígitos único por aparato. Con ese número se puede chequear en ENACOM (el organismo que regula las telecomunicaciones en Argentina) si el equipo figura bloqueado por robo o extravío. Vender a sabiendas un equipo con reporte de robo expone a la tienda a un reclamo del comprador y a un problema legal serio, más allá de la reputación.",
      },
    },
    {
      "@type": "Question",
      name: "¿La garantía de un celular usado es la misma que la de uno nuevo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. La Ley de Defensa del Consumidor (Ley 24.240, art. 11) establece 6 meses de garantía legal mínima para productos nuevos, pero para bienes muebles no consumibles usados —como un celular usado— el mínimo baja a 3 meses desde la entrega. Es un piso legal: se puede acordar una garantía más larga, pero no se puede ofrecer menos de ese mínimo aunque el comprador esté de acuerdo. Conviene aclarar por escrito en la publicación cuál de los dos aplica según el estado real del equipo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué variantes tengo que cargar al publicar un celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Como mínimo color y capacidad de almacenamiento (por ejemplo 128GB o 256GB), porque son las dos variables que más cambian el precio de un mismo modelo. Si vendés usados, conviene sumar el estado de batería y el estado estético (como nuevo, con marcas de uso, con detalles) como parte de la descripción de cada unidad, ya que en celulares usados cada equipo es distinto aunque sea el mismo modelo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender celulares por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar los primeros equipos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar como monotributista cuando las ventas empiecen a ser regulares. Si vendés celulares usados de forma habitual, conviene llevar un registro simple de a quién se le compró cada equipo, por las dudas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si un cliente se arrepiente de la compra de un celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Ley de Defensa del Consumidor (Ley 24.240) le da al comprador 10 días corridos desde que recibe el producto para arrepentirse de la compra a distancia, sin necesidad de justificar el motivo. Las tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado por defecto.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Vender electrónicos online", item: "https://tol.ar/vender-electronicos-online" },
    { "@type": "ListItem", position: 3, name: "Vender celulares online", item: "https://tol.ar/vender-electronicos-online/celulares" },
  ],
}

export default function VenderCelularesOnline() {
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
              Cómo Vender Celulares Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              IMEI, garantía según el estado del equipo, variantes de color y capacidad, requisitos legales
              y paso a paso para armar tu tienda de celulares. Sin tarjeta de crédito, sin mensualidad, con
              MercadoPago y envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 31 agosto 2026</span>
              <span>·</span>
              <span>10 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
            <div className="not-prose mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">En esta guía</p>
              <ol className="text-sm space-y-1.5 text-gray-700 list-decimal list-inside">
                <li><a href="#por-que-celulares" className="hover:underline text-green-700">Por qué el celular es un producto de alto ticket para arrancar</a></li>
                <li><a href="#variantes" className="hover:underline text-green-700">IMEI, estado del equipo y variantes: lo propio de vender celulares</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de celulares</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-celulares">Por qué el celular es un producto de alto ticket para arrancar</h2>
            <p>
              Dentro de electrónicos, el celular es la categoría de ticket promedio más alto: un solo
              equipo puede valer lo mismo que veinte accesorios juntos, lo que permite facturar montos
              relevantes con pocas unidades vendidas por mes. Es también uno de los productos que la gente
              más investiga y compara antes de comprar, así que una ficha completa (memoria, estado de
              batería, si viene con caja y cargador) pesa más en la decisión que en otras categorías.
            </p>
            <p>
              A diferencia de un celular nuevo, el mercado de celulares usados y reacondicionados tiene
              demanda propia en Argentina: mucha gente busca un equipo de gama media/alta a un precio menor
              al de un modelo nuevo equivalente. Esto abre una segunda vía de negocio (compra, reacondiciona
              y revende) además de la venta de equipos nuevos, pero también trae responsabilidades
              específicas que no existen al vender, por ejemplo, un cargador o unos auriculares.
            </p>
            <p>
              La contracara: es la categoría de electrónicos donde más pesa la confianza, porque el
              comprador no puede verificar el estado real de la batería o la pantalla antes de pagar. Fotos
              claras, un estado descripto con honestidad y una política de garantía visible son lo que
              diferencia a una tienda seria de una publicación de dudosa procedencia.
            </p>

            <h2 id="variantes">IMEI, estado del equipo y variantes: lo propio de vender celulares</h2>
            <p>
              Todo celular tiene un IMEI, un número de 15 dígitos único que se obtiene marcando{" "}
              <strong>*#06#</strong> en el propio equipo. Antes de publicar un celular usado para la venta,
              conviene chequear ese IMEI contra la base de ENACOM (el organismo argentino que regula las
              telecomunicaciones) para confirmar que el equipo no esté bloqueado por robo o extravío. Vender
              un equipo con ese problema, aunque haya sido sin saberlo, termina en un reclamo del comprador y
              en un dolor de cabeza legal evitable con un chequeo de un minuto.
            </p>
            <p>
              En variantes, lo mínimo para cargar es color y capacidad de almacenamiento (64GB, 128GB,
              256GB), porque cambian el precio de un mismo modelo. Si además vendés usados, cada unidad es
              distinta aunque sea el mismo modelo: conviene sumar el estado de batería (por ejemplo, "más de
              85% de salud" si el equipo lo informa) y el estado estético (como nuevo, con marcas de uso
              leves, con detalles visibles) en la descripción de cada publicación en lugar de tratarlas como
              variantes de un mismo producto genérico. La plantilla de electrónicos de tol.ar permite cargar
              color y capacidad como variantes con stock independiente, y podés ver un ejemplo real,
              funcionando, en{" "}
              <a href="https://electronicos.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                electronicos.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <p>
              Un dato que conviene tener siempre a mano: si comprás equipos usados para revender, guardá un
              registro simple de a quién se los compraste (nombre, DNI, fecha), aunque no sea un requisito
              formal para vender por internet. Ese registro es lo primero que te va a servir si en algún
              momento tenés que demostrar el origen legítimo de un equipo.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              No hace falta CUIT para crear la tienda ni para cargar los primeros celulares. Para facturar de
              forma regular hace falta CUIT y estar inscripto como monotributista, y desde 2021 MercadoPago
              está obligado a informar a AFIP las transacciones de sus usuarios. Por la Ley de Defensa del
              Consumidor (Ley 24.240), el comprador tiene 10 días corridos desde que recibe el producto para
              arrepentirse de la compra a distancia sin dar motivo; las tiendas de tol.ar ya tienen el botón
              de arrepentimiento incorporado.
            </p>
            <p>
              El punto propio de esta categoría es la garantía: la misma Ley 24.240 (art. 11) fija 6 meses de
              garantía legal mínima para un celular <strong>nuevo</strong>, pero para un celular{" "}
              <strong>usado</strong> el mínimo baja a 3 meses desde la entrega. Es un piso legal que no se
              puede reducir por acuerdo entre las partes: sí se puede ofrecer una garantía más larga si la
              tienda quiere, pero nunca menos del mínimo. Conviene dejar por escrito en cada publicación si
              el equipo es nuevo o usado y qué garantía aplica, para que no haya ambigüedad después de la
              venta.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de celulares online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de electrónicos</h3>
            <p>
              Es la misma plantilla que se usa para electrónicos en general, sin talles, con control de
              cantidad y stock, y con color/capacidad como variantes del producto.
            </p>
            <h3>Paso 3 — Cargar tus celulares</h3>
            <p>
              Subís fotos reales del equipo (frente, dorso, encendido mostrando la pantalla), cargás el IMEI
              verificado como referencia interna, aclarás si es nuevo o usado, el estado de batería si
              corresponde, y el precio por variante de color y capacidad.
            </p>
            <h3>Paso 4 — Configurar MercadoPago y envíos</h3>
            <p>
              Configurás MercadoPago para cobrar (útil que el comprador pueda pagar en cuotas por el ticket
              alto) y activás Andreani, Correo Argentino o retiro en persona. Para celulares, el retiro en
              persona es especialmente valorado, porque le permite al comprador encender el equipo y
              verificarlo antes de pagar.
            </p>
            <h3>Paso 5 — Publicar y compartir</h3>
            <p>
              Con los equipos cargados y los pagos configurados, tu tienda ya está activa y lista para
              compartir en Instagram, WhatsApp o grupos de compraventa de tecnología.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de celulares</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Verificaste el IMEI (*#06#) de cada equipo usado contra la base de ENACOM antes de publicarlo",
                "Aclaraste si cada celular es nuevo o usado, con la garantía correspondiente (6 o 3 meses)",
                "Cargaste color y capacidad como variantes, con fotos reales de cada equipo",
                "Si vendés usados, describiste el estado de batería y el estado estético con honestidad",
                "Conectaste MercadoPago y probaste un pago de prueba",
                "Ofreciste retiro en persona además del envío, para tickets altos",
                "La política de arrepentimiento (10 días) está visible en la tienda",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
            <h3>¿Cómo verifico que un celular usado no esté reportado como robado?</h3>
            <p>
              Marcando *#06# en el equipo obtenés el IMEI, y con ese número podés chequear en ENACOM si
              figura bloqueado por robo o extravío antes de publicarlo.
            </p>
            <h3>¿La garantía de un celular usado es la misma que la de uno nuevo?</h3>
            <p>
              No. Un celular nuevo tiene 6 meses de garantía legal mínima; uno usado, 3 meses desde la
              entrega. Es un mínimo legal: se puede ofrecer más tiempo, pero no menos (Ley 24.240, art. 11).
            </p>
            <h3>¿Qué variantes tengo que cargar al publicar un celular?</h3>
            <p>
              Como mínimo color y capacidad de almacenamiento. Si es usado, sumá el estado de batería y el
              estado estético en la descripción de cada unidad.
            </p>
            <h3>¿Necesito CUIT para vender celulares por internet?</h3>
            <p>
              No para crear la tienda ni cargar los primeros equipos. Sí conviene tramitarlo cuando las
              ventas empiecen a ser regulares, para facturar como monotributista.
            </p>
            <h3>¿Qué pasa si un cliente se arrepiente de la compra?</h3>
            <p>
              Tiene 10 días corridos desde que recibe el producto para arrepentirse sin dar motivo, por la
              Ley de Defensa del Consumidor. Las tiendas de tol.ar ya cumplen esto con el botón de
              arrepentimiento incorporado.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Seguir leyendo</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-electronicos-online" className="text-green-700 hover:underline">Vender electrónicos online: guía completa</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-cosmeticos-online" className="text-green-700 hover:underline">Vender cosméticos online</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de celulares gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="electronics" label="Crear mi tienda de celulares gratis" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
