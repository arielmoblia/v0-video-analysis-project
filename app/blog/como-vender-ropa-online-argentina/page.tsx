import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "Cómo Vender Ropa Online en Argentina: Guía Completa 2026",
  description:
    "Todo lo que necesitás saber para vender ropa por internet en Argentina. Fotos, precios, envíos, cobro con MercadoPago y cómo armar tu tienda online de ropa.",
  keywords:
    "como vender ropa online argentina, tienda de ropa online argentina, vender indumentaria por internet, tienda de ropa gratis argentina, como vender ropa por internet",
  alternates: {
    canonical: "https://tol.ar/blog/como-vender-ropa-online-argentina",
  },
  openGraph: {
    title: "Cómo Vender Ropa Online en Argentina: Guía Completa 2026",
    description:
      "Fotos, precios, envíos y cobro. Todo lo que necesitás para armar tu tienda de ropa online en Argentina sin pagar comisiones.",
    type: "article",
    url: "https://tol.ar/blog/como-vender-ropa-online-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Ropa Online en Argentina: Guía Completa 2026",
  description:
    "Guía práctica para armar una tienda de ropa online en Argentina. Desde las fotos hasta el envío, pasando por el cobro con MercadoPago.",
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
    "@id": "https://tol.ar/blog/como-vender-ropa-online-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender ropa online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No es obligatorio para empezar. Podés crear tu tienda y vender ropa online sin CUIT. Cuando tus ventas crezcan y necesites emitir facturas, podés inscribirte como monotributista.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo hacer fotos de ropa para vender online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lo más efectivo: fondo blanco o neutro, buena luz natural (cerca de una ventana), prenda bien planchada y sin arrugas. Si tenés modelo, aún mejor — las prendas puestas venden más que las fotos de maniquí o planas. Con el celular es suficiente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cobrar por el envío de ropa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Andreani cobra desde $3.000 a $8.000 dependiendo del peso y la distancia. Podés trasladarlo al cliente o incluirlo en el precio. Muchos vendedores ofrecen envío gratis en compras superiores a cierto monto para incentivar compras más grandes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo cobro cuando vendo ropa online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con MercadoPago podés cobrar con tarjeta, débito, saldo MP o en efectivo en puntos de pago. También podés ofrecer transferencia bancaria directa, que no tiene comisión. tol.ar integra ambos métodos automáticamente.",
      },
    },
  ],
}

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo armar tu tienda de ropa online",
  description:
    "Pasos para crear una tienda de ropa online en Argentina con tol.ar, con medios de pago y envíos integrados.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Creá tu tienda en tol.ar",
      text: "Entrás a tol.ar, creás tu cuenta y ya tenés tu tienda online con dominio propio, sin mensualidad ni comisión por venta.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Subí tus productos con fotos y talles",
      text: "Cargás nombre, descripción, precio y fotos de cada prenda. Las variantes de talle o color se cargan como opciones del mismo producto.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Configurá los medios de pago",
      text: "Conectás MercadoPago en 2 clics para habilitar tarjeta, débito, saldo MP y pagos en efectivo, o activás transferencia bancaria sin comisión.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Configurá los envíos",
      text: "Integrás Andreani y Correo Argentino para que el cliente elija envío a domicilio o retiro en sucursal al hacer el pedido.",
    },
  ],
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://tol.ar/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cómo Vender Ropa Online en Argentina",
      item: "https://tol.ar/blog/como-vender-ropa-online-argentina",
    },
  ],
}

export default function ComoVenderRopaOnlineArgentina() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-purple-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Ventas</span>
            </div>
            <div className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender Ropa Online en Argentina: Guía Completa 2026
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Desde las fotos hasta el envío. Todo lo que necesitás para armar tu tienda
              de ropa online en Argentina y empezar a vender esta semana.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>28 junio 2026</span>
              <span>·</span>
              <span>8 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>¿Por qué conviene tener tu propia tienda de ropa online?</h2>
            <p>
              Vender ropa por Instagram o WhatsApp está bien para empezar, pero tiene un límite claro:
              dependés de que el algoritmo te muestre, no tenés carrito de compras, y cobrar es manual.
              Con una tienda online propia, el cliente entra, elige talle y color, paga solo, y vos
              recibís la notificación. Mucho menos trabajo para vos.
            </p>
            <p>
              La buena noticia: armar una tienda de ropa online en Argentina hoy es gratis y tarda
              menos de 10 minutos. No necesitás saber programar ni diseño.
            </p>

            <h2>Paso a paso: cómo armar tu tienda de ropa online</h2>

            <h3>1. Creá tu tienda en tol.ar (5 minutos)</h3>
            <p>
              Entrá a <Link href="/">tol.ar</Link>, creá tu cuenta y ya tenés tu tienda online con
              dominio propio. No se cobra mensualidad ni comisión por venta. Lo que vendés es tuyo.
            </p>

            <h3>2. Subí tus productos con fotos y talles</h3>
            <p>
              Para cada prenda, cargás nombre, descripción, precio y las fotos. Si tenés variantes
              (talle S, M, L, XL o distintos colores), las cargás como opciones del mismo producto.
              El cliente elige su talle antes de agregar al carrito.
            </p>

            <h3>3. Configurá los medios de pago</h3>
            <p>
              MercadoPago se conecta con tu cuenta en 2 clics. Eso habilita tarjeta de crédito,
              débito, saldo de MercadoPago y pagos en efectivo en puntos de pago (Rapipago, Pago Fácil).
              También podés activar transferencia bancaria directa, que no tiene comisión.
            </p>

            <h3>4. Configurá los envíos</h3>
            <p>
              Andreani y Correo Argentino se pueden integrar directamente. El cliente elige
              entre envío a domicilio o retiro en sucursal al momento de hacer el pedido.
              También podés habilitar entrega en mano para ventas locales.
            </p>

            <h2>Las fotos son lo más importante</h2>
            <p>
              En ropa, la foto es la diferencia entre vender y no vender. No necesitás estudio
              profesional. Esto es lo que funciona:
            </p>
            <ul>
              <li><strong>Fondo neutro:</strong> pared blanca o gris, sábana lisa. Sin elementos que distraigan.</li>
              <li><strong>Luz natural:</strong> cerca de una ventana grande, sin sol directo. Es gratis y da los mejores resultados.</li>
              <li><strong>Prenda bien presentada:</strong> planchada, sin arrugas, bien acomodada. El cliente no puede tocar la tela.</li>
              <li><strong>Con modelo si podés:</strong> las prendas puestas venden mucho más que en maniquí o planas. Podés pedirle a un amigo o familiar.</li>
              <li><strong>Varios ángulos:</strong> frente, espalda y detalle de textura o terminación. Cuanto más vea el cliente, más confianza tiene.</li>
            </ul>
            <p>
              El celular alcanza. La cámara no es el problema — la luz y el fondo sí.
            </p>

            <h2>Cómo fijar los precios de tu ropa</h2>
            <p>
              Un error común es poner el precio pensando solo en el costo de la prenda. Tenés que
              incluir también:
            </p>
            <ul>
              <li>Costo de la prenda o materia prima</li>
              <li>Tu tiempo (confección o compra, fotografía, atención al cliente)</li>
              <li>Comisión de MercadoPago (cuando el cliente paga con tarjeta)</li>
              <li>Costo de envío (si lo absorbés vos)</li>
              <li>Ganancia que querés obtener</li>
            </ul>
            <p>
              Una forma simple: calculá todos tus costos, sumá el margen de ganancia que querés
              (mínimo 40-50% para que sea sustentable), y ese es tu precio de venta.
            </p>

            <h2>Cómo manejar los talles y el stock</h2>
            <p>
              Las devoluciones por talle son el problema más común en ropa online. Para minimizarlas:
            </p>
            <ul>
              <li>Publicá la tabla de talles real de tus prendas (no la estándar genérica)</li>
              <li>Indicá el talle de la modelo y su altura si usás fotos con modelo</li>
              <li>Describí la tela y si la prenda tiene elasticidad</li>
              <li>Especificá si el talle es generoso o ajustado</li>
            </ul>
            <p>
              Cuanta más información sobre el talle real, menos "compré y no me quedó bien" después.
            </p>

            <h2>Envíos: cuánto cobrar y cómo organizarlos</h2>
            <p>
              Las dos estrategias más usadas:
            </p>
            <p>
              <strong>Envío con costo:</strong> el cliente paga el envío aparte. Andreani cobra desde
              $3.000 aproximadamente según el peso y el destino. Transparente para el cliente, pero
              algunos se frenan cuando ven el costo de envío al final.
            </p>
            <p>
              <strong>Envío gratis con compra mínima:</strong> por ejemplo, "envío gratis en compras
              mayores a $30.000". Funcionan muy bien porque incentivan a comprar más para alcanzar
              el mínimo. Incluís el costo del envío en el precio de los productos.
            </p>

            <h2>Cómo atraer tus primeros clientes</h2>
            <p>
              Cuando tu tienda está lista, el primer empujón más efectivo:
            </p>
            <ul>
              <li>Compartila en tus historias de Instagram con el link directo a tu tienda</li>
              <li>Avisá a tus contactos de WhatsApp con un mensaje personal, no masivo</li>
              <li>Pedí a familiares y amigos que compartan — el primer cliente siempre viene de ahí</li>
              <li>Publicá en grupos de Facebook de ventas de tu zona o de tu rubro</li>
            </ul>
            <p>
              No hace falta pagar publicidad para los primeros clientes. La red de contactos es tu
              canal más barato y más efectivo al principio.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Necesito CUIT para vender ropa online en Argentina?</h3>
            <p>
              No es obligatorio para empezar. Podés crear tu tienda y empezar a vender sin CUIT.
              Cuando tus ventas crezcan y necesites emitir facturas, podés inscribirte como monotributista.
              El mínimo de facturación para ser obligatorio depende de la categoría.
            </p>

            <h3>¿Puedo vender ropa que yo misma confecciono?</h3>
            <p>
              Sí, es uno de los casos más comunes. Cargás cada modelo que hacés con sus colores
              y talles disponibles. Cuando se agota un talle, lo marcás sin stock. Si hacés
              prendas bajo pedido, podés indicarlo en la descripción y manejar los tiempos de
              entrega acordados con el cliente.
            </p>

            <h3>¿Puedo vender ropa al por mayor?</h3>
            <p>
              Sí. Podés configurar precios por cantidad mínima de compra o tener una sección
              mayorista. Muchos vendedores tienen precios minoristas en su tienda pública y
              atienden mayoristas por WhatsApp con listas de precios separadas.
            </p>

            <h3>¿Qué pasa si el cliente quiere cambiar el talle?</h3>
            <p>
              Eso depende de tu política de cambios, que podés definir vos. Lo más común es
              aceptar cambio de talle dentro de los 30 días con el producto sin uso y con etiquetas.
              Es buena idea publicar esta política claramente en tu tienda — genera más confianza
              y más ventas.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-purple-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Armá tu tienda de ropa online gratis</h2>
            <p className="text-purple-100 mb-8">
              Sin mensualidad, sin comisión por venta. MercadoPago y Andreani incluidos. En 5 minutos estás vendiendo.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-colors"
            >
              Crear mi tienda de ropa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="como-vender-ropa-online-argentina" />
      <Footer />
    </>
  )
}
