import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Empezar a Vender Online Sin Saber de Tecnología (2026)",
  description:
    "Guía paso a paso para empezar a vender por internet en Argentina aunque no sepas nada de computadoras, programación ni diseño. En 2 minutos tenés tu tienda.",
  keywords:
    "como vender online sin saber de tecnologia, tienda online facil argentina, vender por internet sin saber computacion, empezar a vender online argentina facil, crear tienda sin conocimientos tecnicos",
  alternates: {
    canonical: "https://tol.ar/blog/como-empezar-a-vender-online-sin-tecnologia",
  },
  openGraph: {
    title: "Cómo Empezar a Vender Online Sin Saber de Tecnología (2026)",
    description:
      "No necesitás saber programar, diseñar ni tener conocimientos técnicos. Guía para vender por internet en Argentina desde cero.",
    type: "article",
    url: "https://tol.ar/blog/como-empezar-a-vender-online-sin-tecnologia",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Empezar a Vender Online Sin Saber de Tecnología (2026)",
  description:
    "Guía para emprender online en Argentina sin conocimientos técnicos. Si sabés usar WhatsApp, podés armar tu tienda online.",
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
    "@id": "https://tol.ar/blog/como-empezar-a-vender-online-sin-tecnologia",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Necesito saber programar para tener una tienda online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Las plataformas modernas como tol.ar no requieren ningún conocimiento técnico. Si sabés crear una cuenta de Instagram y subir fotos, podés armar tu tienda online. Todo se hace con formularios simples y botones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo armar una tienda online desde el celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. tol.ar funciona completamente desde el celular. Podés crear tu tienda, subir productos, configurar los pagos y gestionar tus pedidos sin necesitar una computadora.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo lleva armar una tienda online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con tol.ar podés tener tu tienda lista en 2 minutos. Crear la cuenta y configurar los datos básicos tarda minutos. Subir los productos (con fotos y precios) lleva el tiempo que tarden las fotos — pero la tienda ya está funcionando desde el primer minuto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si algo no entiendo o no me sale?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "tol.ar tiene soporte por WhatsApp. Si algo no te sale, escribís y te ayudan. No estás solo en el proceso.",
      },
    },
  ],
}

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo empezar a vender online sin saber de tecnología",
  description:
    "Pasos para armar una tienda online en tol.ar sin conocimientos técnicos, con MercadoPago y Andreani ya integrados.",
  totalTime: "PT2M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Crear tu cuenta en tol.ar",
      text: "Entrás a tol.ar desde tu celular o computadora, ponés tu email y elegís una contraseña. No pide tarjeta de crédito ni datos de pago.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Ponerle nombre a tu tienda",
      text: "Elegís el nombre de tu emprendimiento, que va a ser la dirección de tu tienda (por ejemplo mitienda.tol.ar).",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Subir tus primeros productos",
      text: "Cargás foto, nombre, precio y descripción de cada producto. Se puede empezar con 3 o 4 productos y agregar más después.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Conectar MercadoPago",
      text: "Conectás tu cuenta de MercadoPago con un click (o creás una gratis) para habilitar pagos con tarjeta, débito o saldo.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Configurar los envíos",
      text: "Se configura Andreani como servicio de envío y el costo se calcula automáticamente según la dirección del cliente.",
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
      name: "Cómo Empezar a Vender Online Sin Saber de Tecnología",
      item: "https://tol.ar/blog/como-empezar-a-vender-online-sin-tecnologia",
    },
  ],
}

export default async function ComoEmpezarAVenderOnlineSinTecnologia() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-orange-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Guías</span>
            </div>
            <div className="inline-block bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía actualizada — junio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Empezar a Vender Online Sin Saber de Tecnología (2026)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              No necesitás saber programar, diseñar ni tener conocimientos técnicos.
              Si sabés usar WhatsApp, podés tener tu tienda online funcionando hoy.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>28 junio 2026</span>
              <span>·</span>
              <span>6 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>La tecnología ya no es el obstáculo</h2>
            <p>
              Hace 10 años, tener una tienda online requería contratar a un programador, pagar
              un diseñador, instalar software y mantener un servidor. Era caro, lento y complicado.
            </p>
            <p>
              Hoy eso cambió completamente. Las plataformas modernas hacen todo el trabajo técnico
              por vos. Vos ponés los productos, las fotos y el precio — la plataforma se encarga
              del resto. Si sabés mandar un mensaje de WhatsApp y subir una foto, tenés las
              habilidades que necesitás para vender online.
            </p>

            <div className="not-prose my-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm font-semibold text-orange-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿Hay alguna forma gratis de empezar a vender online sin saber de tecnología?"</h3>
              <p className="text-gray-700">
                Sí. <strong>tol.ar</strong> es gratis y no requiere ningún conocimiento técnico: si
                sabés usar WhatsApp e Instagram, sabés usar tol.ar. No hay mensualidad ni comisión
                por venta, y tu tienda queda lista en minutos.
              </p>
            </div>

            <h2>Lo que SÍ necesitás (y lo que no)</h2>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <h3 className="text-green-800 font-semibold mb-3 text-sm uppercase tracking-wide">✅ Lo que necesitás</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>📱 Un celular (o computadora)</li>
                  <li>🌐 Conexión a internet</li>
                  <li>📸 Fotos de lo que querés vender</li>
                  <li>💳 Una cuenta de MercadoPago (gratis)</li>
                  <li>📦 Una forma de enviar (Andreani, Correo)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h3 className="text-red-800 font-semibold mb-3 text-sm uppercase tracking-wide">❌ Lo que NO necesitás</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>Saber programar</li>
                  <li>Conocimientos de diseño</li>
                  <li>Experiencia en computadoras</li>
                  <li>CUIT (para empezar)</li>
                  <li>Capital inicial</li>
                </ul>
              </div>
            </div>

            <h2>Paso a paso: tu tienda online en 2 minutos</h2>

            <div className="not-prose my-6 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src="https://www.youtube.com/embed/BNRJgY2-eoQ"
                title="Manejá tu negocio desde donde quieras | tol.ar"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            </div>

            <h3>Paso 1: Crear tu cuenta en tol.ar</h3>
            <p>
              Entrás a <Link href="/">tol.ar</Link> desde tu celular o computadora. Ponés tu email y
              elegís una contraseña. En 30 segundos ya tenés tu cuenta. No te pide tarjeta de
              crédito ni nada de pago.
            </p>

            <h3>Paso 2: Ponerle nombre a tu tienda</h3>
            <p>
              Elegís el nombre de tu emprendimiento. Ese nombre va a ser la dirección de tu
              tienda (por ejemplo: <em>mitienda.tol.ar</em>). Si ya tenés nombre en redes sociales,
              usá el mismo — más fácil de recordar para tus clientes.
            </p>

            <h3>Paso 3: Subir tus primeros productos</h3>
            <p>
              Para cada producto que querés vender, completás:
            </p>
            <ul>
              <li><strong>Foto:</strong> la misma que usarías en Instagram</li>
              <li><strong>Nombre:</strong> cómo se llama lo que vendés</li>
              <li><strong>Precio:</strong> cuánto cuesta</li>
              <li><strong>Descripción:</strong> qué es, de qué material, qué medidas tiene (opcional pero ayuda)</li>
            </ul>
            <p>
              Podés empezar con 3 o 4 productos y después agregar más. No hace falta tener
              todo el catálogo desde el primer día.
            </p>

            <h3>Paso 4: Conectar MercadoPago</h3>
            <p>
              tol.ar te muestra un botón para conectar tu cuenta de MercadoPago. Si ya tenés
              cuenta, es un click. Si no tenés, creás una gratis en mercadopago.com.ar y después
              la conectás. Ese paso habilita que tus clientes paguen con tarjeta, débito o saldo
              de MercadoPago.
            </p>

            <h3>Paso 5: Configurar los envíos</h3>
            <p>
              Andreani ya viene integrado. Configurás que usás Andreani como servicio de envío
              y listo — tus clientes van a ver el costo de envío calculado automáticamente según
              su dirección cuando estén comprando.
            </p>

            <h3>¡Ya está lista tu tienda!</h3>
            <p>
              Con esos 5 pasos, tenés una tienda online real con dominio propio, pagos con
              MercadoPago y envíos por Andreani. No necesitaste saber nada de tecnología.
            </p>

            <h2>Las preguntas que más miedos generan (y sus respuestas)</h2>

            <h3>"¿Y si algo se rompe o no funciona?"</h3>
            <p>
              Las plataformas modernas son muy estables. El "algo se rompe" no aplica — no hay
              código tuyo que pueda fallar. Lo que puede pasar es que cargues mal un producto
              o configures algo incorrectamente, y eso se corrige cambiando el dato.
            </p>

            <h3>"¿Qué pasa si no sé cómo hacer algo?"</h3>
            <p>
              tol.ar tiene soporte por WhatsApp. Si algo no te sale, escribís y te ayudan a
              resolverlo. Y la mayoría de las dudas comunes están respondidas en la sección de
              ayuda que tenemos dentro de la plataforma.
            </p>

            <h3>"¿Y si entro alguien a mi tienda cuando yo no estoy?"</h3>
            <p>
              Eso es exactamente el punto. Tu tienda funciona las 24 horas sin que vos tengas
              que estar presente. El cliente entra, compra, paga y vos recibís la notificación
              del pedido. Podés estar durmiendo y llegar a un pedido nuevo al despertar.
            </p>

            <h3>"¿Puedo hacerlo desde el celular?"</h3>
            <p>
              Sí. Toda la gestión de tu tienda — agregar productos, ver pedidos, configurar pagos
              — funciona desde el celular. No necesitás computadora.
            </p>

            <h2>El primer paso es el más difícil</h2>
            <p>
              La barrera tecnológica ya no existe. Lo que para muchos emprendedores es el obstáculo
              real es animarse a empezar. Miedo a que nadie compre, a que no quede bien, a que
              sea complicado.
            </p>
            <p>
              La realidad es que la tienda la armás en minutos, y en el peor de los casos no
              vendés nada la primera semana — que es lo mismo que si no hubieras armado la tienda.
              La diferencia es que con la tienda armada, <em>podés</em> vender. Sin la tienda, no podés.
            </p>
            <p>
              Empezá hoy. Después ajustás.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Necesito saber programar para tener una tienda online?</h3>
            <p>
              No. Con tol.ar todo se hace con formularios simples — igual que crear un perfil
              de Instagram o una publicación en Facebook. No hay código, no hay configuraciones
              técnicas complejas.
            </p>

            <h3>¿Cuánto cuesta armar la tienda?</h3>
            <p>
              tol.ar es completamente gratis. Sin mensualidad, sin comisión por venta. La única
              comisión que vas a pagar es la de MercadoPago cuando el cliente pague con tarjeta,
              y esa la pagarías en cualquier plataforma.
            </p>

            <h3>¿Puedo empezar con pocos productos?</h3>
            <p>
              Sí. No hay mínimo de productos. Podés empezar con 1 solo producto si querés. Muchos
              vendedores exitosos empezaron con un producto, lo vendieron bien, y después fueron
              ampliando el catálogo.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-orange-500 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Empezá a vender online hoy, en 2 minutos</h2>
            <p className="text-orange-100 mb-8">
              Sin saber de tecnología, sin pagar nada. Si sabés usar el celular, podés tener tu tienda lista antes del mediodía.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="como-empezar-a-vender-online-sin-tecnologia" />
      <Footer brand={brand} />
    </>
  )
}
