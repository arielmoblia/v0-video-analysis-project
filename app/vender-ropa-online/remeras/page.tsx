import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Remeras Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender remeras online en Argentina: talles, tipos de tela, estampado personalizado (DTF/sublimado), costo de envío por ser prenda liviana, requisitos legales y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender remeras online argentina, crear tienda de remeras online, como vender remeras por internet, tienda de remeras estampadas online, remeras personalizadas argentina",
  alternates: {
    canonical: "https://tol.ar/vender-ropa-online/remeras",
  },
  openGraph: {
    title: "Cómo Vender Remeras Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de remeras online en Argentina, gratis. Talles, telas, estampado personalizado y requisitos legales.",
    type: "article",
    url: "https://tol.ar/vender-ropa-online/remeras",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Remeras Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender remeras online en Argentina: talles, telas, estampado personalizado, costo de envío y requisitos legales.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-28",
  dateModified: "2026-09-28",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-ropa-online/remeras" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué talles de remera tengo que cargar para arrancar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En Argentina la remera se vende casi siempre por talle de letra (S a XXL), con muy poca variación de calce entre marcas comparado con el jean. Para arrancar alcanza con cubrir S, M, L y XL, que es el rango que más rota; XS y XXL se suman después según los pedidos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene vender remeras lisas o con estampado personalizado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las dos funcionan, pero tienen lógicas distintas. La remera lisa se compra en cantidad a un mayorista textil y se vende con stock fijo. La estampada por DTF o sublimado se puede producir por pedido (sin stock inmovilizado en cada diseño), a cambio de un tiempo de entrega más largo. Muchos emprendimientos arrancan con unos pocos diseños fijos en stock y agregan la opción de estampado a pedido más adelante.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué tela conviene para vender remeras online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El algodón peinado (conocido como 24/1) es el más usado para remeras de calidad media-alta por su tacto suave y buena caída. El jersey de algodón con poliéster (blend) es más económico y resiste mejor la deformación por lavado. Conviene aclarar siempre la composición de tela en la publicación, no solo el talle, porque afecta directamente cómo el comprador percibe la calidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿El envío de remeras sale más barato que el de otras prendas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La remera es de las prendas más livianas para envío: varias unidades entran en el mismo rango de peso que un solo jean, lo que deja más margen por unidad o permite ofrecer envío gratis a partir de determinado monto sin perder rentabilidad. Es una de las razones por las que suele ser un buen producto de entrada para quien recién arranca una tienda de indumentaria.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender remeras por internet en Argentina?",
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
    { "@type": "ListItem", position: 3, name: "Vender remeras online", item: "https://tol.ar/vender-ropa-online/remeras" },
  ],
}

export default async function VenderRemerasOnline() {
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
              Cómo Vender Remeras Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Talles, tipos de tela, estampado personalizado (DTF y sublimado), costo de envío y requisitos
              legales para armar tu tienda de remeras. Sin tarjeta de crédito, sin mensualidad, con
              MercadoPago y envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 28 septiembre 2026</span>
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
                <li><a href="#por-que-remeras" className="hover:underline text-green-700">Por qué la remera es un buen producto para arrancar</a></li>
                <li><a href="#talles-y-telas" className="hover:underline text-green-700">Talles, telas y estampado: las variantes propias de la remera</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de remeras</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-remeras">Por qué la remera es un buen producto para arrancar</h2>
            <p>
              La remera es, junto con el jean, uno de los productos de entrada más elegidos para armar una
              tienda de indumentaria, pero por motivos casi opuestos. Mientras el jean inmoviliza más plata
              por unidad, la remera tiene un costo unitario bajo, lo que permite tener varios diseños y
              colores en stock sin arriesgar mucho capital. Es también la prenda más liviana de todo el
              catálogo de indumentaria: varias remeras entran en el mismo rango de peso de envío que un solo
              jean, así que el costo de envío por unidad rinde mucho más y da margen para ofrecer envío
              gratis a partir de cierto monto de compra.
            </p>
            <p>
              A diferencia del jean, la remera calza de forma bastante pareja entre marcas dentro del mismo
              talle de letra (S, M, L, XL), por lo que las devoluciones por talle son menos frecuentes.
              La contracara es que, al ser un producto de bajo costo y alta disponibilidad en el mercado, la
              diferenciación pasa más por el diseño, el estampado o la calidad de tela que por el precio.
            </p>
            <p>
              Es también una de las prendas con mayor rotación de diseño: muchas marcas chicas renuevan
              estampados cada pocas semanas, algo que la venta a pedido (sin stock fijo de cada diseño)
              facilita bastante más que en otras categorías de indumentaria.
            </p>

            <h2 id="talles-y-telas">Talles, telas y estampado: las variantes propias de la remera</h2>
            <p>
              El talle de letra (XS a XXL) es el estándar y, a diferencia del jean, varía poco entre marcas
              argentinas, por lo que alcanza con una tabla de medidas simple (ancho de pecho y largo total en
              centímetros) para reducir consultas y devoluciones.
            </p>
            <p>
              El otro eje central es la tela. El algodón peinado (conocido comercialmente como 24/1) es el
              más elegido para remeras de calidad media-alta por su tacto suave, buena caída y menor
              deformación con el lavado. El jersey en blend de algodón y poliéster es más económico y
              resiste mejor el uso intensivo, aunque con un tacto algo más rústico. Conviene siempre aclarar
              la composición en la publicación: es un dato que el comprador busca activamente antes de
              decidir la compra.
            </p>
            <p>
              El estampado es la variante que más diferencia a la remera del resto de la indumentaria: se
              puede vender lisa, con estampado ya impreso en stock, o con estampado a pedido por DTF
              (transferencia digital) o sublimado, sin necesidad de tener stock de cada diseño por separado.
              La plantilla de indumentaria de tol.ar permite cargar talle, color y diseño de estampado como
              variantes del mismo producto, con foto y stock independiente por combinación — se puede ver
              funcionando en{" "}
              <a href="https://ropa.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                ropa.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              Los mismos que para cualquier otra prenda: no hace falta CUIT para crear la tienda ni cargar
              las primeras remeras. Para facturar de forma regular hace falta CUIT y estar inscripto como
              monotributista, y desde 2021 MercadoPago está obligado a informar a AFIP las transacciones de
              sus usuarios. Por la Ley de Defensa del Consumidor (Ley 24.240), el comprador tiene 10 días
              corridos desde que recibe la remera para arrepentirse de la compra sin dar motivo. Las tiendas
              de tol.ar ya tienen el botón de arrepentimiento incorporado por defecto.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de remeras online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de indumentaria</h3>
            <p>
              Es la misma plantilla que se usa para ropa en general, con talles de letra y variantes
              adicionales (color, diseño de estampado) que podés cargar como opciones del producto.
            </p>
            <h3>Paso 3 — Cargar tus remeras</h3>
            <p>
              Subís fotos de cada diseño (puesta y de detalle del estampado), cargás la composición de tela
              en la descripción y las variantes de talle y color con su stock. Si algún diseño lo vas a
              vender a pedido por DTF o sublimado, aclaralo en la descripción junto con el tiempo estimado de
              entrega.
            </p>
            <h3>Paso 4 — Configurar MercadoPago y envíos</h3>
            <p>
              Igual que en el resto de la tienda: configurás MercadoPago para cobrar y activás Andreani,
              Correo Argentino o retiro en local. Al ser una prenda liviana, es un buen momento para evaluar
              envío gratis a partir de un monto mínimo de compra sin perder margen.
            </p>
            <h3>Paso 5 — Publicar y compartir</h3>
            <p>
              Con los diseños cargados y los pagos configurados, tu tienda ya está activa y lista para
              compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de remeras</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Tenés al menos 3-5 diseños o modelos de remera en varios talles",
                "Aclaraste la composición de tela (algodón peinado, blend) en cada publicación",
                "Cargaste una tabla de medidas simple (ancho de pecho, largo) por talle",
                "Si ofrecés estampado a pedido (DTF/sublimado), aclaraste el tiempo de entrega",
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
            <h3>¿Qué talles de remera tengo que cargar para arrancar?</h3>
            <p>
              Alcanza con S, M, L y XL, que es el rango que más rota. XS y XXL se agregan después según los
              pedidos. La remera varía poco de calce entre marcas, a diferencia del jean.
            </p>
            <h3>¿Conviene vender remeras lisas o con estampado personalizado?</h3>
            <p>
              Las dos funcionan y muchos emprendimientos combinan ambas: diseños fijos en stock para venta
              inmediata y estampado a pedido por DTF o sublimado para no inmovilizar plata en cada diseño
              nuevo, a cambio de un tiempo de entrega algo más largo.
            </p>
            <h3>¿Qué tela conviene para vender remeras online?</h3>
            <p>
              El algodón peinado (24/1) es el más elegido para calidad media-alta por su caída y suavidad. El
              blend de algodón y poliéster es más económico y resiste mejor el lavado intensivo. Siempre
              conviene aclarar la composición en la publicación.
            </p>
            <h3>¿El envío de remeras sale más barato que el de otras prendas?</h3>
            <p>
              Sí, es de las prendas más livianas: varias unidades entran en el mismo rango de peso que un
              solo jean, lo que deja más margen por unidad o permite ofrecer envío gratis sin perder
              rentabilidad.
            </p>
            <h3>¿Necesito CUIT para vender remeras por internet?</h3>
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
                <Link href="/vender-ropa-online/ropa-deportiva" className="text-green-700 hover:underline">Vender ropa deportiva online</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-calzado-online" className="text-green-700 hover:underline">Vender calzado online</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de remeras gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="clothing" label="Crear mi tienda de remeras gratis" />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  )
}
