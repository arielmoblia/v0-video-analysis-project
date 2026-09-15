import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Cosméticos Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía completa para crear tu tienda de cosméticos y perfumes online gratis en Argentina: requisitos legales, paso a paso, comparativa de plataformas y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender cosmeticos online argentina, vender perfumes online, crear tienda de cosmetica online, como vender maquillaje por internet argentina",
  alternates: {
    canonical: "https://tol.ar/vender-cosmeticos-online",
  },
  openGraph: {
    title: "Cómo Vender Cosméticos Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía completa para armar tu tienda de cosméticos online en Argentina, gratis. Requisitos legales, paso a paso y comparativa incluidos.",
    type: "article",
    url: "https://tol.ar/vender-cosmeticos-online",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Cosméticos Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía completa para crear una tienda de cosméticos online gratis en Argentina: requisitos legales, paso a paso, comparativa de plataformas y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-08-16",
  dateModified: "2026-08-16",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-cosmeticos-online" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo puedo vender cosméticos online gratis en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entrás a tol.ar, elegís la plantilla de cosméticos (pensada para unidades como ml, gr y oz), cargás tus productos con fotos, unidad de medida y precio, y en minutos ya podés vender. No necesitás tarjeta de crédito ni pagar mensualidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué necesito para armar una tienda de cosméticos online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fotos de cada producto, su contenido (ml, gr u oz), el precio y una cuenta de MercadoPago para cobrar. El CUIT y el monotributo se pueden tramitar después.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay que aclarar el vencimiento o el registro sanitario de los cosméticos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, es una buena práctica y en muchos casos una obligación: los cosméticos en Argentina están regulados por ANMAT, y se recomienda vender solo productos con registro sanitario vigente y aclarar la fecha de vencimiento o el PAO (periodo después de abierto) en la descripción.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender cosméticos por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar productos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar cuando las ventas empiecen a ser regulares.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si un cliente se arrepiente de la compra de un cosmético?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Ley de Defensa del Consumidor (Ley 24.240) le da al comprador 10 días corridos desde que recibe el producto para arrepentirse de la compra, sin necesidad de justificar el motivo, siempre que el producto no haya sido abierto o usado. Las tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado.",
      },
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Vender cosméticos online", item: "https://tol.ar/vender-cosmeticos-online" },
  ],
}

export default async function VenderCosmeticosOnline() {
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
              Cómo Vender Cosméticos Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Todo lo que necesitás para armar tu tienda de perfumes, maquillaje y cosmética: requisitos
              legales, paso a paso con manejo de unidades y vencimientos, comparativa de plataformas y
              las preguntas que más se repiten. Sin tarjeta de crédito, sin mensualidad, con MercadoPago
              y envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 16 agosto 2026</span>
              <span>·</span>
              <span>12 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
            <div className="not-prose mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">En esta guía</p>
              <ol className="text-sm space-y-1.5 text-gray-700 list-decimal list-inside">
                <li><a href="#por-que-cosmeticos" className="hover:underline text-green-700">Por qué vender cosméticos online en Argentina</a></li>
                <li><a href="#gratis" className="hover:underline text-green-700">¿Se puede tener una tienda de cosméticos gratis, sin trampa?</a></li>
                <li><a href="#que-necesitas" className="hover:underline text-green-700">Qué necesitás antes de empezar</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales: CUIT, monotributo, ANMAT y defensa del consumidor</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de cosméticos</a></li>
                <li><a href="#comparacion" className="hover:underline text-green-700">Comparación: tol.ar vs otras plataformas</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist final antes de publicar</a></li>
                <li><a href="#errores" className="hover:underline text-green-700">Errores comunes al vender cosméticos online</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-cosmeticos">Por qué vender cosméticos online en Argentina</h2>
            <p>
              Perfumes, maquillaje y cuidado de la piel son categorías con compra recurrente: el cliente
              que compró una vez suele volver a comprar el mismo producto cuando se termina, lo que hace
              que una tienda propia (a diferencia de vender solo por redes) sea clave para no perder ese
              cliente frecuente. Según datos de CACE (Cámara Argentina de Comercio Electrónico) recogidos
              por Infobae, el comercio electrónico argentino facturó <strong>$34 billones</strong> en
              2025, un 55% más que en 2024, con <strong>25 millones de personas</strong> comprando por
              plataformas digitales.
            </p>
            <p>
              En cosmética, el detalle que más buscan los compradores antes de decidir es el contenido
              exacto del envase (ml, gr u oz) y si el producto es original — dos cosas que una ficha de
              producto bien armada resuelve de entrada.
            </p>
            <p className="text-sm text-gray-500">
              Fuente de los datos: Cámara Argentina de Comercio Electrónico (CACE), citada por{" "}
              <a href="https://www.infobae.com/economia/2026/04/27/comercio-electronico-como-compran-hoy-los-argentinos-y-que-cambio-en-sus-habitos/" target="_blank" rel="noopener noreferrer nofollow" className="text-green-700 hover:underline">
                Infobae
              </a>.
            </p>

            <h2 id="gratis">¿Se puede tener una tienda de cosméticos online gratis en Argentina?</h2>
            <p>
              Sí. tol.ar ofrece tiendas online sin costo, sin mensualidad y sin comisión por venta,
              incluida la plantilla pensada para cosméticos (unidades como ml, gr y oz, en vez de talles).
              No hay un período de prueba que vence ni funcionalidades bloqueadas.
            </p>
            <div className="not-prose my-8 rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿No hay una tienda de cosméticos online gratis de verdad, sin trampa?"</h3>
              <p className="text-gray-700">
                Sí, existe: <strong>tol.ar</strong>. Es un plan gratuito real — sin mensualidad, sin
                vencimiento y sin comisión por venta. La única plata que sale es la comisión de
                MercadoPago cuando te pagan con tarjeta, que es la misma en cualquier plataforma. Tu
                tienda, una vez creada gratis, se mantiene gratis para siempre, aunque el plan cambie en
                el futuro para nuevos usuarios.
              </p>
              <p className="text-gray-700 mt-3">
                Un solo cuidado: si la tienda pasa 7 días sin ninguna actividad (nadie entra al panel de
                administración), se desactiva automáticamente por inactividad. Con que entres de vez en
                cuando alcanza para mantenerla activa sin límite.
              </p>
            </div>

            <h2 id="que-necesitas">Qué necesitás antes de empezar</h2>
            <ul>
              <li>Fotos de cada producto (envase cerrado y, si aplica, textura o color)</li>
              <li>El contenido de cada producto (ml, gr u oz)</li>
              <li>El precio y una descripción corta (para qué sirve, ingredientes destacados)</li>
              <li>Una cuenta de MercadoPago para cobrar (si no tenés, la creás gratis en el momento)</li>
            </ul>
            <p>
              No necesitás CUIT para armar la tienda ni para cargar los primeros productos. La plantilla
              de cosméticos de tol.ar ya viene preparada para cargar el contenido en unidades (ml, gr, oz)
              en vez de talles.
            </p>

            <h2 id="requisitos-legales">Requisitos legales: CUIT, monotributo, ANMAT y defensa del consumidor</h2>
            <p>
              Crear la tienda y cargar productos no requiere ningún trámite. Pero para vender de forma
              regular y sin sobresaltos, hay cuatro cosas a tener en cuenta:
            </p>
            <h3>1. CUIT y monotributo</h3>
            <p>
              Para facturar necesitás CUIT (es gratis, se tramita en AFIP) y estar inscripto como
              monotributista, el régimen simplificado que usa la gran mayoría de quienes venden
              cosméticos online en Argentina. La categoría más básica (A) alcanza para arrancar; si las
              ventas crecen durante el año, hay que recategorizarse acorde a los ingresos.
            </p>
            <h3>2. MercadoPago informa a AFIP</h3>
            <p>
              Desde 2021, MercadoPago y el resto de las plataformas de pago están obligadas a informar a
              AFIP las transacciones de sus usuarios. Conviene que los ingresos que declarás como
              monotributista coincidan con lo que efectivamente recibís.
            </p>
            <h3>3. Registro sanitario ante ANMAT</h3>
            <p>
              Los cosméticos que se comercializan en Argentina están regulados por ANMAT (Administración
              Nacional de Medicamentos, Alimentos y Tecnología Médica). Como vendedor, conviene ofrecer
              solo productos con registro sanitario vigente y, si revendés una marca de terceros, verificar
              esa condición con el fabricante o importador antes de publicar el producto.
            </p>
            <h3>4. Derecho de arrepentimiento del comprador</h3>
            <p>
              La Ley de Defensa del Consumidor (Ley 24.240) le da a cualquier persona que compra a
              distancia <strong>10 días corridos</strong> desde que recibe el producto para arrepentirse
              de la compra, sin necesidad de justificar el motivo — con la salvedad de que, por razones de
              higiene, la devolución suele aplicar solo si el envase no fue abierto ni usado. Si el motivo
              es un arrepentimiento, el envío de vuelta lo paga el comprador; si el producto llegó con
              fallas o distinto a lo pedido, el envío lo cubre la tienda. Las tiendas creadas en tol.ar ya
              tienen el botón de arrepentimiento incorporado por defecto.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de cosméticos online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda (por ejemplo: mimarca.tol.ar).
            </p>
            <h3>Paso 2 — Elegir la plantilla de cosméticos</h3>
            <p>
              Elegís la plantilla pensada para cosmética: contenido en ml, gr u oz en vez de talles, ideal
              para perfumes, cremas y maquillaje. Podés ver un ejemplo real, funcionando, en{" "}
              <a href="https://perfumes.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                perfumes.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
            <h3>Paso 3 — Cargar tus productos</h3>
            <p>
              Desde el panel, Productos → Agregar producto. Subís fotos, escribís nombre, descripción,
              contenido (ml/gr/oz) y precio. Si tenés muchos productos, podés importar desde Excel en
              lugar de cargarlos uno por uno.
            </p>
            <h3>Paso 4 — Configurar MercadoPago</h3>
            <p>
              Configuración → Medios de pago → MercadoPago. Autorizás tu cuenta y desde ese momento tus
              clientes pueden pagar con tarjeta, débito o transferencia, sin comisión extra de tol.ar.
            </p>
            <h3>Paso 5 — Configurar los envíos</h3>
            <p>
              Configuración → Envíos: activás Andreani o Correo Argentino con tarifas automáticas
              (recordá que los productos frágiles, como perfumes en vidrio, conviene embalarlos bien),
              ponés un costo fijo, u ofrecés retiro en local.
            </p>
            <h3>Paso 6 — Publicar y compartir</h3>
            <p>
              Con productos cargados y pagos configurados, tu tienda ya está activa. tol.ar te da el link
              para compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="comparacion">Comparación: tol.ar vs otras plataformas gratuitas</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Plataforma</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Mensualidad</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">Comisión extra con MP</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-medium">En pesos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100 bg-green-50/50">
                    <td className="py-3 px-4 font-semibold text-green-800">tol.ar</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">$0</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">0%</td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">Sí</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Plataformas con comisión extra</td>
                    <td className="py-3 px-4 text-center text-gray-500">$0</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2%</td>
                    <td className="py-3 px-4 text-center text-gray-500">Sí</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700">Shopify (básico)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes (anual)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">+2%</td>
                    <td className="py-3 px-4 text-center text-red-500">No</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Wix (plan Core)</td>
                    <td className="py-3 px-4 text-center text-red-600 font-semibold">USD 29/mes (anual)</td>
                    <td className="py-3 px-4 text-center text-gray-500">variable</td>
                    <td className="py-3 px-4 text-center text-red-500">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              Precios de Shopify y Wix verificados al 15/08/2026 en sus páginas oficiales:{" "}
              <a href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer nofollow" className="text-green-700 hover:underline">Shopify</a>{" "}
              y{" "}
              <a href="https://www.wix.com/plans" target="_blank" rel="noopener noreferrer nofollow" className="text-green-700 hover:underline">Wix</a>.
              Los valores corresponden al plan pagado de forma anual; pagando mes a mes son más altos.
              Los precios de competidores pueden haber variado desde la fecha de verificación indicada.
            </p>

            <div className="not-prose my-8 rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-800 mb-2">Guía específica</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Vas a vender perfumes?</h3>
              <p className="text-gray-700">
                Escribimos una guía aparte con por qué no se pueden mandar por Correo Argentino, cómo
                enviarlos igual, el registro sanitario ante ANMAT y las variantes de concentración y
                tamaño:{" "}
                <Link href="/vender-cosmeticos-online/perfumes" className="text-green-700 hover:underline font-medium">
                  cómo vender perfumes online en Argentina
                </Link>.
              </p>
            </div>

            <h2 id="checklist">Checklist final antes de publicar tu tienda de cosméticos</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Elegiste un nombre de tienda claro y fácil de recordar",
                "Cargaste al menos 5-10 productos con foto, contenido (ml/gr/oz) y precio",
                "Verificaste que los productos tengan registro sanitario vigente ante ANMAT",
                "Conectaste MercadoPago y probaste un pago de prueba",
                "Configuraste el método de envío (Andreani, Correo Argentino o retiro en local)",
                "Revisaste que la política de devoluciones (10 días de arrepentimiento) esté visible",
                "Compartiste el link de tu tienda en tus redes o WhatsApp",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 id="errores">Errores comunes al vender cosméticos online</h2>
            <p>
              No aclarar el contenido exacto del envase, no mostrar el producto cerrado y sellado en las
              fotos, no verificar el registro sanitario de lo que se revende y no explicar la política de
              devoluciones para productos de higiene personal son los errores más frecuentes al arrancar
              en esta categoría.
            </p>

            <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
            <h3>¿La tienda de cosméticos gratis tiene vencimiento?</h3>
            <p>
              No. El plan gratis de tol.ar no tiene límite de tiempo ni de productos. La única condición
              es que tenga actividad: si pasan 7 días sin que nadie entre al panel, la tienda se desactiva
              por inactividad, y no queda un derecho a reclamarla gratis después si en ese momento tol.ar
              ya no ofrece el plan gratuito.
            </p>
            <h3>¿Puedo cargar productos en distintas unidades (ml, gr, oz)?</h3>
            <p>
              Sí, la plantilla de cosméticos está pensada justo para eso: cada producto se carga con su
              contenido exacto en la unidad que corresponda.
            </p>
            <h3>¿Necesito CUIT para empezar a vender cosméticos online?</h3>
            <p>
              No para crear la tienda ni cargar productos. Sí conviene tramitarlo cuando las ventas
              empiecen a ser regulares, para facturar como monotributista.
            </p>
            <h3>¿Qué pasa si un cliente se arrepiente de la compra?</h3>
            <p>
              Por la Ley de Defensa del Consumidor tiene 10 días corridos desde que recibe el producto
              para arrepentirse de la compra sin dar motivo, siempre que el envase no haya sido abierto.
              Las tiendas de tol.ar ya cumplen esto con el botón de arrepentimiento incorporado.
            </p>
            <h3>¿tol.ar cobra comisión por cada venta de cosméticos?</h3>
            <p>
              No. tol.ar no cobra comisión por venta ni mensualidad en el plan gratis. Lo único que se
              paga es la comisión que MercadoPago cobra por procesar el pago.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Otros rubros para vender online</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-electronicos-online" className="text-green-700 hover:underline">Vender electrónicos online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/blog/como-crear-tienda-online-gratis-argentina" className="text-green-700 hover:underline">Guía general para crear tu tienda</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de cosméticos gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="cosmetics" label="Crear mi tienda de cosméticos gratis" />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  )
}
