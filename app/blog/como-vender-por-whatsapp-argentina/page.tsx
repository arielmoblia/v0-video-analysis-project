import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender por WhatsApp en Argentina: Guía Completa 2026",
  description:
    "Todo lo que necesitás para vender por WhatsApp en Argentina. WhatsApp Business, catálogo, respuestas automáticas y cómo cobrar. Guía actualizada 2026.",
  keywords:
    "como vender por whatsapp argentina, whatsapp business argentina, vender por whatsapp, catalogo whatsapp, cobrar por whatsapp argentina",
  alternates: {
    canonical: "https://tol.ar/blog/como-vender-por-whatsapp-argentina",
  },
  openGraph: {
    title: "Cómo Vender por WhatsApp en Argentina: Guía Completa 2026",
    description:
      "WhatsApp Business, catálogo, respuestas automáticas y cómo cobrar. Todo lo que necesitás para vender por WhatsApp en Argentina.",
    type: "article",
    url: "https://tol.ar/blog/como-vender-por-whatsapp-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender por WhatsApp en Argentina: Guía Completa 2026",
  description:
    "Guía práctica para vender por WhatsApp Business en Argentina. Catálogo, cobros y la diferencia entre WhatsApp y tener una tienda propia.",
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
    "@id": "https://tol.ar/blog/como-vender-por-whatsapp-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Necesito WhatsApp Business para vender por WhatsApp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No es obligatorio, pero sí muy recomendable. WhatsApp Business te da catálogo de productos, horario de atención, respuestas rápidas guardadas y estadísticas de mensajes. Es gratis y lo instalás en el mismo celular.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo cobro cuando vendo por WhatsApp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Podés cobrar por transferencia bancaria directa (CBU/CVU), enviando un link de pago de MercadoPago, o con QR de MercadoPago. La transferencia es gratis, el link de MercadoPago cobra comisión cuando el cliente usa tarjeta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre vender por WhatsApp y tener una tienda online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Por WhatsApp atendés uno a uno y el proceso es manual: el cliente pregunta, vos respondés, cobran por separado. En una tienda online el cliente entra, elige, paga solo y vos recibís el pedido listo. Muchos vendedores usan los dos: la tienda para que el cliente vea y compre, y WhatsApp para consultas.",
      },
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
      name: "Cómo Vender por WhatsApp en Argentina",
      item: "https://tol.ar/blog/como-vender-por-whatsapp-argentina",
    },
  ],
}

export default async function ComoVenderPorWhatsappArgentina() {
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
            <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Ventas</span>
            </div>
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Vender por WhatsApp en Argentina: Guía Completa 2026
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              WhatsApp Business, catálogo, respuestas automáticas y cómo cobrar.
              Todo lo que necesitás para vender por WhatsApp en Argentina.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>28 junio 2026</span>
              <span>·</span>
              <span>7 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>WhatsApp para ventas en Argentina: lo que funciona</h2>
            <p>
              En Argentina, WhatsApp es el canal de comunicación por excelencia. La mayoría de los
              compradores prefiere preguntar por WhatsApp antes de comprar — ya sea por precio,
              disponibilidad o método de pago. Ignorar ese canal es perder ventas.
            </p>
            <p>
              Pero hay una diferencia enorme entre usar WhatsApp como canal de consulta y usarlo
              como única forma de vender. Esta guía te muestra cómo sacarle el máximo provecho.
            </p>

            <h2>WhatsApp Business: qué es y por qué conviene</h2>
            <p>
              WhatsApp Business es la versión gratuita de WhatsApp diseñada para negocios. Se
              instala en el mismo celular que tu WhatsApp personal (en otro número) y te da:
            </p>
            <ul>
              <li><strong>Perfil de empresa:</strong> nombre del negocio, descripción, horario y dirección.</li>
              <li><strong>Catálogo de productos:</strong> mostrás tus productos con foto, precio y descripción.</li>
              <li><strong>Respuestas rápidas:</strong> mensajes guardados que enviás con un solo toque (precio, horarios, datos de pago).</li>
              <li><strong>Mensaje de bienvenida:</strong> se manda automáticamente cuando alguien te escribe por primera vez.</li>
              <li><strong>Etiquetas:</strong> organizás los chats por estado (nuevo cliente, pedido pendiente, enviado).</li>
              <li><strong>Estadísticas:</strong> cuántos mensajes enviaste, entregaste y leíste.</li>
            </ul>
            <p>
              Es completamente gratis. Si todavía vendés desde tu WhatsApp personal, pasarte a
              Business es el primer paso.
            </p>

            <h2>Cómo armar tu catálogo de WhatsApp Business</h2>
            <p>
              El catálogo de WhatsApp Business te permite mostrar tus productos directamente en
              la app. Para cargarlo:
            </p>
            <ol>
              <li>Abrí WhatsApp Business → Configuración → Herramientas para empresas → Catálogo</li>
              <li>Tocá "Agregar producto o servicio"</li>
              <li>Subí una foto, poné nombre, precio y descripción</li>
              <li>Repetí para cada producto</li>
            </ol>
            <p>
              El catálogo tiene un límite de 500 productos. Para más de eso, necesitás una tienda
              online propia.
            </p>

            <h2>Cómo cobrar cuando vendés por WhatsApp</h2>
            <p>
              El pago es el paso más complicado de vender por WhatsApp, porque no hay un carrito
              automático. Las opciones más usadas en Argentina:
            </p>

            <h3>Transferencia bancaria (la más simple)</h3>
            <p>
              El cliente hace una transferencia a tu CBU o CVU. Vos confirmás cuando llega y
              preparás el pedido. No hay comisión, el dinero llega al instante entre bancos.
              El problema: tenés que confirmar cada pago manualmente.
            </p>

            <h3>Link de pago de MercadoPago</h3>
            <p>
              Entrás a tu cuenta de MercadoPago, generás un link de cobro con el monto del pedido,
              y se lo mandás al cliente. El cliente paga con tarjeta o saldo de MercadoPago.
              MercadoPago cobra comisión cuando el cliente usa tarjeta (aprox. 7,61% + IVA para
              tarjeta de crédito). Vos recibís el dinero en tu cuenta de MercadoPago.
            </p>

            <h3>QR de MercadoPago</h3>
            <p>
              Mandás una foto de tu QR, el cliente lo escanea y paga. Funciona para pagos con
              saldo de MercadoPago o desde la app de cualquier banco. La comisión es menor que
              la de tarjeta.
            </p>

            <h2>El límite de vender solo por WhatsApp</h2>
            <p>
              WhatsApp es excelente para consultas y para mantener el contacto con clientes, pero
              tiene limitaciones importantes como único canal de ventas:
            </p>
            <ul>
              <li>El cliente no puede hacer el pedido sin que vos estés disponible para responder</li>
              <li>No hay carrito: tenés que tomar el pedido, calcular el total y cobrar manualmente</li>
              <li>No se puede vender mientras dormís o estás ocupado</li>
              <li>Si recibís muchos pedidos al mismo tiempo, se hace imposible de manejar</li>
              <li>No genera historial de pedidos organizado</li>
            </ul>
            <p>
              Por eso los vendedores más organizados combinan WhatsApp con una tienda online:
              la tienda maneja los pedidos automáticamente y WhatsApp queda para las consultas
              que realmente necesitan atención personal.
            </p>

            <h2>WhatsApp + tienda online: la combinación más efectiva</h2>
            <p>
              La estrategia que más funciona en Argentina:
            </p>
            <ol>
              <li>Tenés tu tienda online donde el cliente puede ver y comprar 24 horas</li>
              <li>En la tienda hay un botón de WhatsApp para consultas específicas</li>
              <li>Los pedidos que vienen por la tienda se procesan solos (el cliente paga, vos recibís el aviso)</li>
              <li>Los que escriben por WhatsApp primero los dirigís a la tienda cuando están listos para comprar</li>
            </ol>
            <p>
              Con <Link href="/">tol.ar</Link> podés tener tu tienda online gratis y conectar tu WhatsApp
              Business para que los clientes puedan contactarte directamente desde la tienda.
            </p>

            <h2>Respuestas rápidas que ahorran tiempo</h2>
            <p>
              Guardá respuestas a las preguntas que más repetís. Ejemplos útiles:
            </p>
            <ul>
              <li>📦 <strong>/envio:</strong> "Enviamos por Andreani a todo el país. El costo depende del destino. Cuando confirmás el pedido te calculo el total con envío."</li>
              <li>💳 <strong>/pago:</strong> "Aceptamos transferencia bancaria (sin comisión) y MercadoPago (con tarjeta o saldo)."</li>
              <li>⏰ <strong>/horarios:</strong> "Respondemos de lunes a viernes de 9 a 18hs. Los pedidos se preparan en 24-48hs hábiles."</li>
              <li>📷 <strong>/fotos:</strong> "Las fotos son del producto real que enviamos. Cualquier consulta sobre talle o material, escribinos."</li>
            </ul>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Puedo usar el mismo número para WhatsApp personal y Business?</h3>
            <p>
              No podés usar el mismo número para los dos al mismo tiempo. Necesitás un número
              distinto para WhatsApp Business, o migrar tu número actual de personal a Business
              (perdés el acceso a WhatsApp personal en ese número).
            </p>

            <h3>¿WhatsApp Business es gratis?</h3>
            <p>
              Sí, completamente gratis. La versión Business que se descarga en el celular no tiene
              ningún costo. Existe también WhatsApp Business API para empresas grandes que necesitan
              integraciones complejas, pero esa versión sí tiene costo.
            </p>

            <h3>¿Puedo automatizar los pedidos por WhatsApp?</h3>
            <p>
              Con WhatsApp Business básico podés automatizar solo los mensajes de bienvenida y
              las respuestas rápidas. Para automatizar pedidos completos necesitarías la API de
              WhatsApp, que es compleja y costosa. La alternativa más simple es tener una tienda
              online donde el proceso sea automático.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Sumá una tienda online a tu WhatsApp</h2>
            <p className="text-green-100 mb-8">
              tol.ar es gratis, sin comisiones y se conecta con WhatsApp. Tus clientes compran solos mientras vos atendés otras cosas.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="como-vender-por-whatsapp-argentina" />
      <Footer brand={brand} />
    </>
  )
}
