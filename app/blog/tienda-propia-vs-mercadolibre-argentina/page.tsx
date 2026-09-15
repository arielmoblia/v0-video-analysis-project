import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Tienda Propia vs MercadoLibre: ¿Qué conviene en Argentina? (2026)",
  description:
    "¿Vender en MercadoLibre o tener tu propia tienda online? Comparativa honesta de comisiones, control de marca y datos de clientes para emprendedores argentinos.",
  keywords:
    "tienda propia vs mercadolibre argentina, vender en mercadolibre o tienda online, comision mercadolibre argentina, tienda online propia argentina, mercadolibre vs tienda online",
  alternates: {
    canonical: "https://tol.ar/blog/tienda-propia-vs-mercadolibre-argentina",
  },
  openGraph: {
    title: "Tienda Propia vs MercadoLibre: ¿Qué conviene en Argentina? (2026)",
    description:
      "Comparativa honesta entre vender en MercadoLibre y tener tu propia tienda online. Para emprendedores argentinos que quieren vender más y quedarse con más margen.",
    type: "article",
    url: "https://tol.ar/blog/tienda-propia-vs-mercadolibre-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Tienda Propia vs MercadoLibre: ¿Qué conviene en Argentina? (2026)",
  description:
    "Análisis comparativo entre vender en MercadoLibre y tener una tienda online propia en Argentina. Ventajas, desventajas y cuándo usar cada una.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/tienda-propia-vs-mercadolibre-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Conviene vender en MercadoLibre o tener mi propia tienda online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los dos cumplen roles distintos. MercadoLibre da tráfico inmediato porque la gente ya está ahí buscando para comprar, pero cobra comisión por venta y los datos del cliente quedan en la plataforma. Una tienda propia no tiene ese tráfico automático, pero no cobra comisión de plataforma y los datos de cada cliente son tuyos. Muchos vendedores usan los dos: MercadoLibre para conseguir compradores nuevos, tienda propia para que vuelvan a comprar sin pagar comisión de nuevo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánta comisión cobra MercadoLibre por venta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MercadoLibre cobra un porcentaje por cada venta que varía según la categoría del producto y el tipo de publicación, además de costos de envío según el programa que uses. Ese porcentaje se descuenta de cada venta, sin importar cuántas vendas. Con una tienda propia en tol.ar, la plataforma no cobra comisión en el plan gratuito.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo tener mi tienda propia y seguir vendiendo en MercadoLibre?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, no son excluyentes. Muchos negocios argentinos usan MercadoLibre para llegar a compradores nuevos que no los conocen, y su propia tienda online (con link en Instagram, WhatsApp o Google) para que los clientes que ya los conocen compren directo, sin pagar comisión de por medio.",
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
      name: "Tienda Propia vs MercadoLibre en Argentina",
      item: "https://tol.ar/blog/tienda-propia-vs-mercadolibre-argentina",
    },
  ],
}

export default async function TiendaPropiaVsMercadoLibreArgentina() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-indigo-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Comparativas</span>
            </div>
            <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Análisis actualizado — julio 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tienda Propia vs MercadoLibre: ¿Qué conviene en Argentina? (2026)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              La comparativa honesta para emprendedores argentinos que quieren vender más
              y quedarse con más margen de cada venta.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>28 julio 2026</span>
              <span>·</span>
              <span>6 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2>La pregunta real: ¿uno o el otro, o los dos?</h2>
            <p>
              Muchos emprendedores argentinos empiezan a vender en MercadoLibre porque ahí ya
              hay gente buscando activamente para comprar. Tiene sentido — es tráfico que no
              tenés que generar vos.
            </p>
            <p>
              El punto a entender es qué pasa con el margen y con la relación con el cliente
              a medida que el negocio crece. Esta guía compara los dos caminos sin vueltas.
            </p>

            <h2>Ventajas de vender en MercadoLibre</h2>
            <ul>
              <li><strong>Tráfico inmediato:</strong> millones de personas entran a buscar productos todos los días, sin que vos inviertas en conseguirlas.</li>
              <li><strong>Confianza de marca ya construida:</strong> el comprador confía en el sistema de MercadoLibre (pagos, reputación, devoluciones) más de lo que confiaría en una tienda nueva y desconocida.</li>
              <li><strong>Envíos resueltos:</strong> los programas de envío de MercadoLibre simplifican la logística.</li>
              <li><strong>Fácil para empezar:</strong> publicar un producto es rápido, sin necesidad de armar nada propio.</li>
            </ul>

            <h2>Los límites reales de vender solo en MercadoLibre</h2>

            <h3>La comisión se descuenta de cada venta, para siempre</h3>
            <p>
              MercadoLibre cobra un porcentaje por cada venta (varía según categoría y tipo de
              publicación), más costos de envío según el programa. Cuantas más ventas hacés, más
              comisión pagás en total — no es un costo que se diluye con el volumen.
            </p>

            <h3>El cliente es de MercadoLibre, no tuyo</h3>
            <p>
              No tenés acceso directo al email o teléfono del comprador salvo lo mínimo que la
              plataforma habilita para la operación. Si querés avisarle de un producto nuevo o
              hacerle un descuento por ser cliente recurrente, no podés hacerlo fácilmente —
              esa relación la administra MercadoLibre.
            </p>

            <h3>Competís codo a codo por precio</h3>
            <p>
              En una búsqueda de MercadoLibre, tu producto aparece al lado de otros vendedores
              que ofrecen lo mismo, muchas veces ordenados por precio. Es difícil diferenciarte
              por marca o experiencia de compra — la decisión se reduce fácil a quién cobra menos.
            </p>

            <h3>No controlás la marca ni el diseño</h3>
            <p>
              Tu página de vendedor en MercadoLibre sigue el formato de MercadoLibre. No podés
              construir una identidad visual propia, ni contar la historia de tu marca como
              querés.
            </p>

            <h2>Ventajas de tener tu propia tienda online</h2>
            <ul>
              <li><strong>Sin comisión de plataforma:</strong> con el plan gratuito de tol.ar no se paga comisión por venta.</li>
              <li><strong>Los datos son tuyos:</strong> email, teléfono e historial de compra de cada cliente quedan en tu tienda, para contactarlo cuando quieras.</li>
              <li><strong>Marca propia:</strong> diseño, textos y experiencia de compra los decidís vos, con ayuda de la IA de tol.ar.</li>
              <li><strong>Aparece en Google:</strong> tu tienda puede indexarse y traer clientes que buscan directamente tu marca o tus productos.</li>
              <li><strong>Fidelización sin fricción:</strong> podés ofrecer descuentos a quien ya te compró, sin pasar por la plataforma.</li>
            </ul>

            <h2>La estrategia que más usan los vendedores argentinos: los dos juntos</h2>
            <p>
              En la práctica, no es una decisión de todo o nada. La combinación que mejor
              funciona es:
            </p>
            <ul>
              <li><strong>MercadoLibre:</strong> para captar compradores nuevos que todavía no te conocen.</li>
              <li><strong>Tienda propia:</strong> para que esos mismos clientes vuelvan a comprarte directo, sin comisión, y con tu marca al frente.</li>
            </ul>
            <p>
              El flujo típico: alguien te compra por primera vez en MercadoLibre → le va bien
              con el producto → la próxima vez lo buscás por Google o le mandás un link directo
              a tu tienda, donde no hay comisión de por medio.
            </p>

            <h2>¿Cuándo conviene empezar solo por MercadoLibre?</h2>
            <p>
              Si estás validando si un producto tiene demanda y todavía no tenés marca ni
              seguidores, MercadoLibre puede ser un buen punto de partida para probar rápido.
            </p>
            <p>
              Pero apenas confirmás que el producto vende, armar tu tienda propia en paralelo
              te permite empezar a quedarte con más margen en cada venta siguiente. En tol.ar
              es gratis y tarda minutos.
            </p>

            <h2>Preguntas frecuentes</h2>

            <h3>¿Puedo linkear mi tienda de tol.ar desde mi publicación de MercadoLibre?</h3>
            <p>
              MercadoLibre restringe incluir links externos dentro de las publicaciones. Lo que
              sí podés hacer es incluir el link de tu tienda en la comunicación posventa (por
              ejemplo, al entregar el producto) o en tus redes sociales, para que el cliente
              vuelva a comprarte directo la próxima vez.
            </p>

            <h3>¿Necesito CUIT para vender en MercadoLibre o en mi propia tienda?</h3>
            <p>
              Para operar con volumen en cualquiera de las dos, en algún momento vas a necesitar
              inscribirte como monotributista. Para empezar y probar si el producto vende, en
              tol.ar podés crear la tienda sin CUIT.
            </p>

            <h3>¿Cuál conviene si recién estoy empezando?</h3>
            <p>
              Si no tenés nada de tráfico propio, MercadoLibre te da visibilidad inmediata.
              Si ya tenés seguidores en redes o contactos que te compran, una tienda propia
              te deja quedarte con más margen desde el primer día.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-indigo-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Vendé sin pagar comisión por cada venta</h2>
            <p className="text-indigo-100 mb-8">
              tol.ar es gratis y tarda minutos. Tu tienda, tu marca, tus clientes.
            </p>
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <RelatedArticles currentSlug="tienda-propia-vs-mercadolibre-argentina" />
      <Footer brand={brand} />
    </>
  )
}
