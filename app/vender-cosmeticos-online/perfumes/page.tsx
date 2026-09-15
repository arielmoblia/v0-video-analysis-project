import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { RubroCta } from "@/components/landing/rubro-cta"
import { Check, ExternalLink } from "lucide-react"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Cómo Vender Perfumes Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender perfumes online en Argentina: por qué no se pueden mandar por Correo Argentino, cómo enviarlos igual, registro sanitario ante ANMAT, diferencia entre perfume/eau de parfum/eau de toilette, requisitos legales, paso a paso y preguntas frecuentes. Sin mensualidad, sin comisión por venta.",
  keywords:
    "vender perfumes online argentina, crear tienda de perfumes online, como enviar perfumes correo argentino, vender perfumes por internet argentina, tienda de perfumes online gratis",
  alternates: {
    canonical: "https://tol.ar/vender-cosmeticos-online/perfumes",
  },
  openGraph: {
    title: "Cómo Vender Perfumes Online en Argentina: Creá tu Tienda Gratis (2026)",
    description:
      "Guía para armar tu tienda de perfumes online en Argentina, gratis. Envío de inflamables, ANMAT, variantes y paso a paso.",
    type: "article",
    url: "https://tol.ar/vender-cosmeticos-online/perfumes",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cómo Vender Perfumes Online en Argentina: Creá tu Tienda Gratis (2026)",
  description:
    "Guía para vender perfumes online en Argentina: restricciones de envío por ser un líquido inflamable, registro sanitario ante ANMAT, variantes de concentración y tamaño, requisitos legales, paso a paso y preguntas frecuentes.",
  author: { "@type": "Organization", name: "tol.ar", url: "https://tol.ar" },
  publisher: {
    "@type": "Organization",
    name: "tol.ar",
    logo: { "@type": "ImageObject", url: "https://tol.ar/tol-logo.png" },
  },
  datePublished: "2026-09-07",
  dateModified: "2026-09-07",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://tol.ar/vender-cosmeticos-online/perfumes" },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo enviar perfumes por Correo Argentino?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En general no: Correo Argentino prohíbe en sus encomiendas los líquidos y sólidos inflamables, y un perfume con alcohol entra en esa categoría. Para vender perfumes online conviene usar una empresa de logística privada que acepte este tipo de producto declarándolo correctamente, ofrecer retiro en persona, o consultar antes en la sucursal si un producto puntual puede transportarse y bajo qué condiciones. No declarar el contenido para poder despacharlo expone al envío a ser retenido y a la tienda a un reclamo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito registrar mis perfumes ante ANMAT antes de venderlos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Los perfumes se consideran productos cosméticos y ANMAT exige que cuenten con Certificado de Libre Venta vigente. ANMAT viene detectando cosméticos y perfumes sin registro sanitario ofrecidos en sitios propios, redes sociales y plataformas de ecommerce, y actuando para que esas publicaciones se bajen. Si revendés una marca de terceros, conviene pedirle al fabricante o importador que confirme el registro antes de publicar el producto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre perfume, eau de parfum y eau de toilette?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La diferencia principal es la concentración de esencia (y por lo tanto de alcohol) disuelta en la mezcla: un perfume o extrait concentra más esencia y dura más horas en la piel, un eau de parfum tiene una concentración intermedia, y un eau de toilette o una colonia llevan menos esencia y más agua/alcohol, por lo que se sienten más livianos y duran menos. Conviene aclarar esta diferencia en cada ficha de producto porque es lo primero que compara un comprador de perfumes antes de decidir entre dos variantes de la misma fragancia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito CUIT para vender perfumes por internet en Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No para crear la tienda ni cargar los primeros productos. Sí lo vas a necesitar para verificar la cuenta de MercadoPago y para facturar como monotributista cuando las ventas empiecen a ser regulares.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si un cliente se arrepiente de la compra de un perfume?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Ley de Defensa del Consumidor (Ley 24.240) le da al comprador 10 días corridos desde que recibe el producto para arrepentirse de la compra a distancia, sin necesidad de justificar el motivo, con la salvedad de que por tratarse de un producto de higiene personal la devolución suele aplicar solo si el envase no fue abierto ni usado. Las tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado por defecto.",
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
    { "@type": "ListItem", position: 3, name: "Vender perfumes online", item: "https://tol.ar/vender-cosmeticos-online/perfumes" },
  ],
}

export default async function VenderPerfumesOnline() {
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
              Cómo Vender Perfumes Online en Argentina: Creá tu Tienda Gratis
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Por qué el envío es distinto al resto de la cosmética, registro sanitario ante ANMAT,
              variantes de concentración y tamaño, requisitos legales y paso a paso para armar tu tienda
              de perfumes. Sin tarjeta de crédito, sin mensualidad, con MercadoPago incluido.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar</span>
              <span>·</span>
              <span>Actualizado 7 septiembre 2026</span>
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
                <li><a href="#por-que-perfumes" className="hover:underline text-green-700">Por qué el perfume es una categoría de compra recurrente</a></li>
                <li><a href="#envio" className="hover:underline text-green-700">Envío y variantes: lo propio de vender perfumes</a></li>
                <li><a href="#requisitos-legales" className="hover:underline text-green-700">Requisitos legales</a></li>
                <li><a href="#paso-a-paso" className="hover:underline text-green-700">Paso a paso: cómo crear tu tienda de perfumes</a></li>
                <li><a href="#checklist" className="hover:underline text-green-700">Checklist antes de publicar</a></li>
                <li><a href="#preguntas-frecuentes" className="hover:underline text-green-700">Preguntas frecuentes</a></li>
              </ol>
            </div>

            <h2 id="por-que-perfumes">Por qué el perfume es una categoría de compra recurrente</h2>
            <p>
              Dentro de cosmética, el perfume es de los productos con mayor recompra: quien encontró "su"
              fragancia vuelve a comprar el mismo frasco cuando se termina, muchas veces sin comparar
              precio, lo que hace especialmente valioso tener una tienda propia en lugar de depender de
              publicaciones sueltas en redes. También es una categoría con lugar para marcas chicas y
              perfumería de nicho o artesanal, que compite más por identidad y calidad de la fragancia que
              por precio frente a las marcas masivas.
            </p>
            <p>
              La contracara es que el comprador no puede oler el producto antes de pagar, así que una
              ficha completa (familia olfativa, notas principales, duración aproximada, ocasión de uso)
              pesa más en la decisión de compra que en otras categorías de cosmética.
            </p>

            <h2 id="envio">Envío y variantes: lo propio de vender perfumes</h2>
            <p>
              A diferencia de una crema o un labial, un perfume común lleva alcohol en su composición, lo
              que lo convierte en un líquido inflamable. Correo Argentino prohíbe expresamente los líquidos
              y sólidos inflamables en sus encomiendas, así que en la práctica <strong>no se puede
              despachar un perfume por Correo Argentino</strong> declarándolo como corresponde. Para
              resolverlo, las tiendas de perfumes suelen combinar tres caminos: ofrecer retiro en persona
              (elimina el problema por completo), trabajar con una empresa de logística privada que acepte
              mercancía de este tipo bajo sus propias condiciones, o consultar puntualmente en la sucursal
              del correo antes de despachar un producto específico. Lo que conviene evitar es despachar el
              envío sin declarar el contenido real para "hacerlo pasar": si el paquete se rompe en el
              trayecto o es detectado, queda retenido y el reclamo del comprador cae sobre la tienda.
            </p>
            <p>
              El vidrio del frasco suma otro cuidado propio de esta categoría: conviene embalar cada
              perfume con protección extra (film burbuja, caja rígida) para que no llegue roto, algo mucho
              menos crítico en otras categorías de cosmética como maquillaje o skincare en pomo plástico.
            </p>
            <p>
              En variantes, lo mínimo para cargar es la concentración (perfume/extrait, eau de parfum, eau
              de toilette o colonia — a mayor concentración de esencia, más dura la fragancia en la piel) y
              el tamaño del frasco (por ejemplo 30ml, 50ml, 100ml), porque ambas cambian el precio de una
              misma fragancia. La plantilla de cosméticos de tol.ar permite cargar el contenido exacto en
              ml y agregar variantes con stock independiente por cada una, y podés ver un ejemplo real,
              funcionando, en{" "}
              <a href="https://perfumes.tol.ar" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline inline-flex items-center gap-1">
                perfumes.tol.ar <ExternalLink className="w-3 h-3" />
              </a>.
            </p>

            <h2 id="requisitos-legales">Requisitos legales</h2>
            <p>
              No hace falta CUIT para crear la tienda ni para cargar los primeros perfumes. Para facturar
              de forma regular hace falta CUIT y estar inscripto como monotributista, y desde 2021
              MercadoPago está obligado a informar a AFIP las transacciones de sus usuarios.
            </p>
            <p>
              El punto propio de esta categoría es el registro sanitario: los perfumes se consideran
              productos cosméticos y están regulados por ANMAT, que exige Certificado de Libre Venta (CLV)
              vigente para poder comercializarlos. ANMAT viene detectando de forma activa cosméticos y
              perfumes sin registro ofrecidos en sitios web, redes sociales y plataformas de ecommerce, e
              interviene para que esas publicaciones se retiren. Conviene ofrecer solo perfumes con registro
              vigente y, si se revende una marca de terceros, pedirle al fabricante o importador que lo
              confirme antes de publicar el producto — publicar sin ese cuidado expone a que la publicación
              se dé de baja más adelante.
            </p>
            <p className="text-sm text-gray-500">
              Antecedente: mediante las Disposiciones 94/2026 y 3841/2026, ANMAT prohibió la venta y ordenó
              retirar de sitios propios, redes sociales y plataformas de ecommerce cosméticos y perfumes sin
              registro sanitario vigente. Cobertura periodística verificada al 07/09/2026:{" "}
              <a href="https://www.infobae.com/sociedad/2026/06/26/anmat-prohibio-la-venta-de-cosmeticos-para-ninas-desinfectantes-y-productos-medicos-por-irregularidades/" target="_blank" rel="noopener noreferrer nofollow" className="text-green-700 hover:underline">
                Infobae
              </a>.
            </p>
            <p>
              Por la Ley de Defensa del Consumidor (Ley 24.240), el comprador tiene 10 días corridos desde
              que recibe el producto para arrepentirse de la compra a distancia sin dar motivo, con la
              salvedad de que por ser un producto de higiene personal la devolución suele aplicar solo si el
              envase no fue abierto. Las tiendas de tol.ar ya tienen el botón de arrepentimiento incorporado.
            </p>

            <h2 id="paso-a-paso">Paso a paso: cómo crear tu tienda de perfumes online</h2>
            <h3>Paso 1 — Registrarte en tol.ar</h3>
            <p>
              Entrás a <a href="https://tol.ar/plan-gratis" className="text-green-700 hover:underline">tol.ar/plan-gratis</a>,
              ingresás tu email y elegís un nombre para tu tienda.
            </p>
            <h3>Paso 2 — Elegir la plantilla de cosméticos</h3>
            <p>
              Es la misma plantilla que se usa para cosmética en general, con contenido en ml en vez de
              talles, ideal para cargar el tamaño de cada frasco.
            </p>
            <h3>Paso 3 — Cargar tus perfumes</h3>
            <p>
              Subís fotos del frasco cerrado, escribís la familia olfativa y las notas principales, cargás
              la concentración (perfume, eau de parfum, eau de toilette) y el tamaño (ml) como variantes, y
              el precio de cada una.
            </p>
            <h3>Paso 4 — Configurar MercadoPago</h3>
            <p>
              Configuración → Medios de pago → MercadoPago. Autorizás tu cuenta y tus clientes ya pueden
              pagar con tarjeta, débito o transferencia.
            </p>
            <h3>Paso 5 — Configurar el envío pensando en el alcohol</h3>
            <p>
              Configuración → Envíos: activás una empresa de logística privada que acepte este tipo de
              producto, ofrecés retiro en local (recomendado si vendés en tu ciudad), o dejás un aviso
              claro de que el envío puede demorar más por tratarse de un líquido inflamable. Evitá prometer
              Correo Argentino como opción única para esta categoría.
            </p>
            <h3>Paso 6 — Publicar y compartir</h3>
            <p>
              Con productos cargados y pagos configurados, tu tienda ya está activa. tol.ar te da el link
              para compartir en Instagram, WhatsApp o TikTok.
            </p>

            <h2 id="checklist">Checklist antes de publicar tu tienda de perfumes</h2>
            <div className="not-prose my-6 rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              {[
                "Confirmaste que cada perfume tiene registro sanitario (CLV) vigente ante ANMAT",
                "Cargaste concentración (perfume/eau de parfum/eau de toilette) y tamaño (ml) como variantes",
                "Elegiste un método de envío que acepte líquidos inflamables, o activaste retiro en local",
                "Reforzaste el embalaje de cada frasco (film burbuja o caja rígida) contra roturas",
                "Conectaste MercadoPago y probaste un pago de prueba",
                "La política de arrepentimiento (10 días, envase sin abrir) está visible en la tienda",
                "Compartiste el link de tu tienda en tus redes o WhatsApp",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
            <h3>¿Puedo enviar perfumes por Correo Argentino?</h3>
            <p>
              En general no: los líquidos inflamables están prohibidos en sus encomiendas y un perfume con
              alcohol entra en esa categoría. Conviene usar logística privada que lo acepte, ofrecer retiro
              en persona, o consultar el caso puntual en la sucursal antes de despachar.
            </p>
            <h3>¿Necesito registrar mis perfumes ante ANMAT?</h3>
            <p>
              Sí, se consideran productos cosméticos y necesitan Certificado de Libre Venta vigente. ANMAT
              interviene activamente sobre publicaciones online de cosméticos y perfumes sin ese registro.
            </p>
            <h3>¿Qué diferencia hay entre perfume, eau de parfum y eau de toilette?</h3>
            <p>
              La concentración de esencia disuelta en la mezcla: a mayor concentración, más dura la
              fragancia en la piel. Un perfume o extrait concentra más, un eau de parfum es intermedio y un
              eau de toilette o colonia llevan menos esencia y más alcohol/agua.
            </p>
            <h3>¿Necesito CUIT para vender perfumes por internet?</h3>
            <p>
              No para crear la tienda ni cargar los primeros productos. Sí conviene tramitarlo cuando las
              ventas empiecen a ser regulares, para facturar como monotributista.
            </p>
            <h3>¿Qué pasa si un cliente se arrepiente de la compra?</h3>
            <p>
              Tiene 10 días corridos desde que recibe el producto para arrepentirse sin dar motivo, salvo
              que el frasco ya haya sido abierto, por tratarse de un producto de higiene personal.
            </p>

            <div className="not-prose mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Seguir leyendo</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/vender-cosmeticos-online" className="text-green-700 hover:underline">Vender cosméticos online: guía completa</Link>
                <span className="text-gray-300">·</span>
                <Link href="/vender-ropa-online" className="text-green-700 hover:underline">Vender ropa online</Link>
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
            <h2 className="text-3xl font-bold mb-3">Creá tu tienda de perfumes gratis ahora</h2>
            <p className="text-green-100 mb-8">
              2 minutos. Sin tarjeta de crédito. Sin comisiones por venta.
            </p>
            <RubroCta template="cosmetics" label="Crear mi tienda de perfumes gratis" />
          </div>
        </section>
      </main>
      <Footer brand={brand} />
    </>
  )
}
