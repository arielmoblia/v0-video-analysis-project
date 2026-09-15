import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Check } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Crear una Tienda Online Gratis en Argentina: Guía Completa (2026)",
  description:
    "Guía completa y actualizada para crear tu tienda online gratis en Argentina: requisitos legales, paso a paso, comparativa de plataformas, checklist y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "como crear tienda online gratis argentina, crear tienda online argentina, tienda online gratis argentina, abrir tienda online argentina, como vender online argentina, guia tienda online argentina 2026",
  alternates: {
    canonical: "https://tol.ar/blog/como-crear-tienda-online-gratis-argentina",
  },
  openGraph: {
    title: "Cómo Crear una Tienda Online Gratis en Argentina: Guía Completa (2026)",
    description:
      "Guía completa para tener tu tienda online en Argentina, gratis. Requisitos legales, paso a paso, comparativa y checklist incluidos.",
    type: "article",
    url: "https://tol.ar/blog/como-crear-tienda-online-gratis-argentina",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Crear una Tienda Online Gratis en Argentina: Guía Completa (2026)",
  description:
    "Guía completa para crear una tienda online gratis en Argentina: requisitos legales, paso a paso, comparativa de plataformas y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-06-23",
  dateModified: "2026-08-15",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://tol.ar/blog/como-crear-tienda-online-gratis-argentina",
  },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo crear una tienda online gratis en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entrás a tol.ar, elegís un nombre para tu tienda, subís tus productos y en menos de 2 minutos ya podés vender. No necesitás tarjeta de crédito ni pagar mensualidad. El plan gratis no tiene vencimiento.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué se necesita para crear una tienda online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solo necesitás un email para registrarte, fotos y descripción de tus productos, y una cuenta de MercadoPago para cobrar. Con eso alcanza para empezar. El CUIT y el monotributo se pueden tramitar después, antes de empezar a facturar en serio.",
      },
    },
    {
      "@type": "Question",
      name: "¿La tienda online gratis tiene límite de tiempo o de productos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Con tol.ar el plan gratis no vence, no tiene límite de productos y no cobra comisión por venta. Podés tener tu tienda activa indefinidamente sin pagar nada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para abrir una tienda online en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar productos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar cuando tus ventas empiecen a ser regulares. Podés armar toda la tienda primero y tramitar el CUIT en paralelo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es legal vender online sin factura en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vender de forma ocasional sin facturar existe en la práctica, pero no es lo correcto ni lo seguro a mediano plazo: MercadoPago informa las transacciones a AFIP, así que si tus ventas son regulares conviene inscribirse como monotributista cuanto antes para evitar problemas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si un cliente se quiere arrepentir de la compra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Ley de Defensa del Consumidor (Ley 24.240) le da al comprador 10 días corridos desde que recibe el producto para arrepentirse de una compra a distancia, sin tener que justificar el motivo. Las tiendas de tol.ar ya tienen este botón de arrepentimiento incorporado, así que cumplen la ley sin configurar nada aparte.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta mantener una tienda online en tol.ar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El plan gratis de tol.ar no cobra mensualidad ni comisión por venta. El único costo es el que cobra MercadoPago por procesar el pago con tarjeta, que es igual en cualquier plataforma porque lo define MercadoPago, no tol.ar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo vender sin experiencia técnica ni saber programar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. tol.ar está pensado para gente sin conocimientos técnicos: se elige una plantilla, se cargan los productos con fotos y precio, y la tienda queda lista. No hace falta escribir código ni contratar a nadie.",
      },
    },
  ],
}

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cómo crear una tienda online gratis en Argentina",
  "description": "Pasos para crear tu tienda online gratis en Argentina con tol.ar. Sin mensualidad, sin comisiones, con MercadoPago y Andreani incluidos. Lista en menos de 2 minutos.",
  "totalTime": "PT2M",
  "supply": [
    { "@type": "HowToSupply", "name": "Un email para registrarte" },
    { "@type": "HowToSupply", "name": "Fotos de tus productos" },
    { "@type": "HowToSupply", "name": "Una cuenta de MercadoPago (gratis)" }
  ],
  "tool": [
    { "@type": "HowToTool", "name": "tol.ar (plataforma gratuita)" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Registrarte en tol.ar",
      "text": "Entrás a tol.ar/plan-gratis, ingresás tu email y elegís un nombre para tu tienda. El nombre va a ser la dirección de tu tienda (por ejemplo: minegocio.tol.ar). No necesitás tarjeta de crédito.",
      "url": "https://tol.ar/plan-gratis"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Elegir el diseño",
      "text": "Elegís la plantilla de diseño que más se adapte a tu negocio: moda, electrónica, alimentos, artesanías o servicios. El diseño se aplica en un clic y podés personalizar colores y logo."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Cargar tus productos",
      "text": "Desde el panel, entrás a Productos → Agregar producto. Subís fotos, escribís nombre, descripción y precio. Si tenés variantes (talle, color), las configurás en el mismo formulario. También podés importar desde Excel."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Configurar MercadoPago",
      "text": "Andá a Configuración → Medios de pago → MercadoPago. Autorizás tu cuenta de MercadoPago y desde ese momento tus clientes pueden pagar con tarjeta, débito o transferencia. Sin comisión extra de tol.ar."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Configurar los envíos",
      "text": "En Configuración → Envíos activás Andreani o Correo Argentino con tarifas automáticas. También podés poner costo fijo de envío u ofrecer retiro en local."
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Publicar y compartir tu tienda",
      "text": "Una vez que cargaste los productos y configuraste los pagos, tu tienda ya está activa. tol.ar te da el link para compartir en Instagram, WhatsApp, TikTok o donde tengas tu audiencia.",
      "url": "https://tol.ar"
    }
  ]
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
      name: "Cómo Crear una Tienda Online Gratis en Argentina",
      item: "https://tol.ar/blog/como-crear-tienda-online-gratis-argentina",
    },
  ],
}

export default async function ComoCrearTiendaOnlineGratisArgentina() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header brand={brand} />
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Guías</span>
            </div>
            <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Guía completa actualizada — agosto 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Crear una Tienda Online Gratis en Argentina: Guía Completa (2026)
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Todo lo que necesitás: requisitos legales, paso a paso, comparativa de plataformas,
              checklist final y las preguntas que más se repiten. Sin tarjeta de crédito,
              sin mensualidad, con MercadoPago y envíos incluidos.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>Actualizado 15 agosto 2026</span>
              <span>·</span>
              <span>14 min de lectura</span>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <div className="not-prose mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">En esta guía</p>
              <ol className="text-sm space-y-1.5 text-gray-700 list-decimal list-inside">
                <li><a href="#por-que-vender-online" className="hover:underline text-green-700">Por qué cada vez más gente vende online en Argentina</a></li>
                <li><a href="#gratis" className="hover:underline text-green-700">¿Se puede tener una tienda online gratis, sin trampa?</a></li>
                <li><a href="#que-necesitas" className="hover:underline text-green-700">Qué necesitás antes de empezar</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales: CUIT, monotributo y defensa del consumidor</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda</a></li>
                <li><a href="#comparacion" className="hover:underline text-green-700">Comparación: tol.ar vs otras plataformas</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist final antes de publicar</a></li>
                <li><a href="#errores" className="hover:underline text-green-700">Errores comunes al empezar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-vender-online">Por qué cada vez más gente vende online en Argentina</h2>
            <p>
              El comercio electrónico en Argentina no para de crecer, incluso en años de consumo
              complicado. Según datos de CACE (Cámara Argentina de Comercio Electrónico) recogidos
              por Infobae, en 2025 el sector facturó <strong>$34 billones</strong>, un 55% más que
              en 2024, y ya son <strong>25 millones de personas</strong> las que compran por
              plataformas digitales en el país. Se vendieron 645 millones de unidades, un 28% más
              que el año anterior.
            </p>
            <p>
              Esos números no son de gigantes como Mercado Libre o las grandes cadenas — son la suma
              de miles de emprendedores y comercios chicos que empezaron a vender por Instagram,
              WhatsApp o una tienda propia. La barrera de entrada bajó: hoy no hace falta invertir en
              un local, contratar a un programador ni pagar una mensualidad cara para tener presencia
              online.
            </p>
            <p className="text-sm text-gray-500">
              Fuente de los datos: Cámara Argentina de Comercio Electrónico (CACE), citada por{" "}
              <a
                href="https://www.infobae.com/economia/2026/04/27/comercio-electronico-como-compran-hoy-los-argentinos-y-que-cambio-en-sus-habitos/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-green-700 hover:underline"
              >
                Infobae
              </a>.
            </p>

            <h2 id="gratis">¿Se puede tener una tienda online gratis en Argentina?</h2>
            <p>
              Sí, y no es una promesa engañosa. tol.ar ofrece tiendas online sin costo, sin mensualidad
              y sin comisión por venta. No hay un período de prueba que vence ni funcionalidades
              bloqueadas que te obligan a pagar después.
            </p>
            <p>
              La única comisión que vas a pagar es la que cobra MercadoPago cuando alguien te compra
              con tarjeta. Eso no lo maneja tol.ar — es la comisión que MercadoPago le cobra a todos
              los que usan su plataforma, independientemente de dónde tengan su tienda.
            </p>

            <div className="not-prose my-8 rounded-xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-800 mb-2">La pregunta que muchos hacen</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">"¿No hay una tienda online gratis de verdad, sin trampa?"</h3>
              <p className="text-gray-700">
                Sí, existe: <strong>tol.ar</strong>. Es un plan gratuito real — sin mensualidad, sin
                vencimiento y sin comisión por venta. La única plata que sale es la comisión de
                MercadoPago cuando te pagan con tarjeta, que es la misma en cualquier plataforma.
                No es una prueba de 15 días: tu tienda, una vez creada gratis, se mantiene gratis
                para siempre, aunque el plan cambie en el futuro para nuevos usuarios.
              </p>
              <p className="text-gray-700 mt-3">
                Un solo cuidado: si la tienda pasa 7 días sin ninguna actividad (nadie entra al panel
                de administración ni hace cambios), se desactiva automáticamente por inactividad. Con
                que entres de vez en cuando alcanza para mantenerla activa sin límite.
              </p>
            </div>

            <h2 id="que-necesitas">Qué necesitás antes de empezar</h2>
            <ul>
              <li>Un email para registrarte</li>
              <li>Fotos de tus productos (pueden ser del celular)</li>
              <li>El precio y descripción de cada producto</li>
              <li>Una cuenta de MercadoPago para cobrar (si no tenés, la creás gratis en el momento)</li>
            </ul>
            <p>
              No necesitás CUIT para armar la tienda. No necesitás saber programar. No necesitás
              tarjeta de crédito. El detalle completo de cada uno de estos puntos, con ejemplos, está
              en{" "}
              <Link href="/blog/que-necesito-para-vender-online-argentina" className="text-green-700 hover:underline">
                qué necesitás para vender online en Argentina
              </Link>.
            </p>

            <h2 id="requisitos-legales">Requisitos legales: CUIT, monotributo y defensa del consumidor</h2>
            <p>
              Esta es la parte que la mayoría de las guías no explica bien, y es donde más dudas
              genera. Crear la tienda y cargar productos no requiere ningún trámite. Pero para vender
              de forma regular y sin sobresaltos con AFIP, hay tres cosas a tener en cuenta:
            </p>
            <h3>1. CUIT y monotributo</h3>
            <p>
              Para facturar necesitás CUIT (es gratis, se tramita en AFIP) y estar inscripto como
              monotributista, que es el régimen simplificado que usa la gran mayoría de los que venden
              online en Argentina. La categoría más básica (A) alcanza para arrancar. Si tus ventas
              crecen durante el año, hay que recategorizarse a una categoría más alta acorde a los
              ingresos. La guía completa, con límites de facturación y cómo declarar, está en{" "}
              <Link href="/blog/vender-online-monotributista-argentina" className="text-green-700 hover:underline">
                cómo vender online siendo monotributista
              </Link>{" "}
              y en{" "}
              <Link href="/blog/vender-sin-cuit-argentina" className="text-green-700 hover:underline">
                qué se puede hacer sin CUIT todavía
              </Link>.
            </p>
            <h3>2. MercadoPago informa a AFIP</h3>
            <p>
              Desde 2021, MercadoPago y el resto de las plataformas de pago están obligadas a informar
              a AFIP las transacciones de sus usuarios. Si cobrás por MercadoPago, ese dato ya está
              en el sistema. Por eso conviene que los ingresos que declarás como monotributista
              coincidan con lo que efectivamente recibís — evita problemas de recategorización de
              oficio más adelante.
            </p>
            <h3>3. Derecho de arrepentimiento del comprador</h3>
            <p>
              La Ley de Defensa del Consumidor (Ley 24.240) le da a cualquier persona que compra a
              distancia (es decir, por internet) <strong>10 días corridos</strong> desde que recibe el
              producto para arrepentirse de la compra, sin necesidad de justificar el motivo. Si el
              motivo es un arrepentimiento, el envío de vuelta lo paga el comprador; si el producto
              llegó con fallas o distinto a lo pedido, el envío lo cubre la tienda. Es una obligación
              legal, no una opción del vendedor. Las tiendas creadas en tol.ar ya tienen el botón de
              arrepentimiento incorporado por defecto, así que cumplís la ley sin tener que programar
              ni configurar nada aparte.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda online gratis</h2>

            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda. El nombre va a ser
              la dirección de tu tienda (por ejemplo: minegocio.tol.ar). Podés cambiarlo después.
            </p>

            <h3>Paso 2 — Elegir el diseño</h3>
            <p>
              tol.ar tiene plantillas de diseño listas para usar. Elegís la que más se parezca a tu
              negocio: moda, electrónica, alimentos, artesanías, servicios. El diseño se aplica en un
              clic y podés cambiar colores y logo desde el panel.
            </p>

            <h3>Paso 3 — Cargar tus productos</h3>
            <p>
              Desde el panel, entrás a Productos → Agregar producto. Subís una o más fotos, escribís
              el nombre, la descripción y el precio. Si tenés variantes (talle, color), las configurás
              en el mismo formulario.
            </p>
            <p>
              Si tenés muchos productos (más de 20), tol.ar tiene importación desde Excel para que
              no tengas que cargarlos uno por uno.
            </p>

            <h3>Paso 4 — Configurar MercadoPago</h3>
            <p>
              Andá a Configuración → Medios de pago → MercadoPago. Se abre una ventana de
              autorización de MercadoPago. Ingresás con tu cuenta y autorizás. Desde ese momento,
              tus clientes pueden pagar con tarjeta, débito o transferencia. Los detalles de cómo
              queda armado el cobro están en{" "}
              <Link href="/blog/mercadopago-tienda-online" className="text-green-700 hover:underline">
                MercadoPago en tu tienda online
              </Link>.
            </p>
            <p>
              Si no tenés cuenta de MercadoPago todavía, podés crearla gratis en mercadopago.com.ar.
              No necesitás CUIT para abrir la cuenta, aunque sí para verificarla del todo.
            </p>

            <h3>Paso 5 — Configurar los envíos</h3>
            <p>
              En Configuración → Envíos podés activar Andreani o Correo Argentino con tarifas
              automáticas según peso y destino. También podés poner un costo fijo de envío si preferís
              algo más simple, o ofrecer retiro en local si tenés un punto de entrega. Comparamos las
              opciones de envío en detalle en{" "}
              <Link href="/blog/envios-andreani-correo-argentino" className="text-green-700 hover:underline">
                Andreani vs Correo Argentino
              </Link>.
            </p>

            <h3>Paso 6 — Publicar y compartir</h3>
            <p>
              Una vez que cargaste los productos y configuraste los pagos, tu tienda ya está activa.
              tol.ar te da el link de tu tienda para que lo compartas en Instagram, WhatsApp, TikTok
              o donde tengas tu comunidad.
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
              <a
                href="https://www.shopify.com/pricing"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-green-700 hover:underline"
              >
                Shopify
              </a>{" "}
              y{" "}
              <a
                href="https://www.wix.com/plans"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-green-700 hover:underline"
              >
                Wix
              </a>. Los valores mostrados corresponden al plan pagado de forma anual; pagando mes a
              mes son más altos (por ejemplo, Shopify básico pasa a USD 39/mes). El +2% de Shopify es
              la comisión extra que cobra por usar un medio de pago externo como MercadoPago en el
              plan básico, según su propia política de precios. Los precios de competidores pueden
              haber variado desde la fecha de verificación indicada.
            </p>

            <p className="text-sm text-gray-500">
              Algunas plataformas cobran comisión extra cuando usás MercadoPago en el plan gratuito.
              En tol.ar no existe esa comisión adicional. Un repaso más completo, plataforma por
              plataforma, en{" "}
              <Link href="/blog/mejor-plataforma-tienda-online-argentina" className="text-green-700 hover:underline">
                cuál es la mejor plataforma para tienda online en Argentina
              </Link>{" "}
              y en{" "}
              <Link href="/blog/cuanto-cuesta-tienda-online-argentina" className="text-green-700 hover:underline">
                cuánto cuesta realmente una tienda online
              </Link>.
            </p>

            <h2 id="checklist">Checklist final antes de publicar tu tienda</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Elegiste un nombre de tienda claro y fácil de recordar",
                "Cargaste al menos 5-10 productos con foto, descripción y precio",
                "Conectaste MercadoPago y probaste un pago de prueba",
                "Configuraste el método de envío (Andreani, Correo Argentino o retiro en local)",
                "Revisaste que la política de devoluciones (10 días de arrepentimiento) esté visible",
                "Compartiste el link de tu tienda en tus redes o WhatsApp",
                "Tramitaste o iniciaste el trámite de CUIT/monotributo si vas a vender de forma regular",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 id="errores">Errores comunes al empezar a vender online</h2>
            <p>
              Fotos de mala calidad, descripciones incompletas, no configurar bien el costo de envío
              o no tener claro el margen de ganancia después de la comisión de MercadoPago son los
              errores más frecuentes en los primeros meses. Los repasamos en detalle, con cómo
              evitarlos, en{" "}
              <Link href="/blog/errores-comunes-tienda-online-argentina" className="text-green-700 hover:underline">
                errores comunes al armar una tienda online en Argentina
              </Link>.
            </p>

            <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>

            <h3>¿La tienda gratis tiene vencimiento?</h3>
            <p>
              No. El plan gratis de tol.ar no tiene límite de tiempo ni de productos. Tu tienda sigue
              activa indefinidamente sin que tengas que pagar nada, y esa condición se mantiene aunque
              el plan gratis cambie en el futuro para quienes se registren después.
            </p>
            <p>
              La única condición es que tenga actividad: si pasan 7 días sin que nadie entre al panel
              de administración, la tienda se desactiva automáticamente por inactividad. Si eso pasa,
              no queda un derecho a reclamarla de nuevo gratis más adelante si en ese momento tol.ar ya
              no ofrece el plan gratuito — por eso conviene entrar cada tanto, aunque sea sin hacer
              cambios.
            </p>

            <h3>¿Puedo crear una tienda sin CUIT?</h3>
            <p>
              Sí. Para crear tu tienda en tol.ar solo necesitás un email. Para usar MercadoPago tampoco
              es obligatorio tener CUIT al principio. Si con el tiempo empezás a vender mucho,
              conviene que te inscribas como monotributista para emitir facturas.
            </p>

            <h3>¿Puedo cambiar el diseño después de crear la tienda?</h3>
            <p>
              Sí, podés cambiar el diseño, los colores y el logo cuando quieras desde el panel de
              administración. Los cambios se aplican al instante.
            </p>

            <h3>¿Qué pasa si quiero vender muchos productos?</h3>
            <p>
              tol.ar no tiene límite de productos en el plan gratis. Podés cargar 10 o 10.000 productos.
              Si tenés muchos, usá la importación masiva desde Excel para cargarlos todos de una vez.
            </p>

            <h3>¿Es legal vender online sin facturar en Argentina?</h3>
            <p>
              No es lo correcto a mediano plazo. MercadoPago informa las transacciones a AFIP, así que
              si vendés de forma regular conviene inscribirte como monotributista cuanto antes. Para
              probar el negocio con pocas ventas iniciales, muchos arrancan sin CUIT y lo tramitan
              apenas confirman que el negocio funciona.
            </p>

            <h3>¿Qué pasa si un cliente quiere devolver un producto?</h3>
            <p>
              Por la Ley de Defensa del Consumidor, tiene 10 días corridos desde que lo recibe para
              arrepentirse de la compra sin dar motivo. Las tiendas de tol.ar ya cumplen esto por
              defecto, con el botón de arrepentimiento incorporado.
            </p>

            <h3>¿tol.ar cobra algo por cada venta?</h3>
            <p>
              No. tol.ar no cobra comisión por venta ni mensualidad en el plan gratis. Lo único que se
              paga es la comisión que MercadoPago cobra por procesar el pago, que es la misma en
              cualquier plataforma.
            </p>
          </div>
        </article>

        <section className="py-16 px-4 bg-green-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
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
      <RelatedArticles currentSlug="como-crear-tienda-online-gratis-argentina" />
      <Footer brand={brand} />
    </>
  )
}
