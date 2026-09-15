import { headers } from "next/headers"
import dynamic from "next/dynamic"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { getStoreBySubdomain, getStoreProducts, getStoreCategories, getFeaturedProducts } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHero } from "@/components/store/store-hero"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreFooter } from "@/components/store/store-footer"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"
import { PageTracker } from "@/components/store/page-tracker"

// Componentes below-the-fold cargados de forma diferida (no bloquean renderizado inicial)
const HowItWorks = dynamic(() => import("@/components/landing/how-it-works").then(m => ({ default: m.HowItWorks })))
const Benefits = dynamic(() => import("@/components/landing/benefits").then(m => ({ default: m.Benefits })))
const TestimonialsSection = dynamic(() => import("@/components/landing/testimonials-section").then(m => ({ default: m.TestimonialsSection })))
const PlansSection = dynamic(() => import("@/components/landing/plans-section").then(m => ({ default: m.PlansSection })))
const GeoSnippets = dynamic(() => import("@/components/landing/geo-snippets").then(m => ({ default: m.GeoSnippets })))
const FAQSection = dynamic(() => import("@/components/landing/faq-section").then(m => ({ default: m.FAQSection })))
const Footer = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.Footer })))

export const revalidate = 0

export default async function Home() {
  const headersList = await headers()
  const host = headersList.get("host") || ""

  if (host.includes("tol.ar") && !host.startsWith("www.") && host !== "tol.ar") {
    const subdomain = host.split(".")[0]
    if (subdomain && subdomain !== "tol" && subdomain !== "www") {
      const store = await getStoreBySubdomain(subdomain)

      if (store) {
        const [products, categories, featuredProducts, hasMayoristaMinorista] = await Promise.all([
          getStoreProducts(store.id),
          getStoreCategories(store.id),
          getFeaturedProducts(store.id),
          hasStoreFeature(store.id, "mayorista_minorista"),
        ])

        // JSON-LD para la tienda: Organization + ItemList de productos
        const storeJsonLd = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Store",
              name: store.site_title || subdomain,
              url: `https://${subdomain}.tol.ar`,
              description: store.site_description || `Tienda online ${store.site_title}`,
              image: store.logo_url || `https://${subdomain}.tol.ar/tol-logo.png`,
              currenciesAccepted: "ARS",
              paymentAccepted: "MercadoPago, Transferencia bancaria",
              areaServed: { "@type": "Country", name: "Argentina" },
            },
            {
              "@type": "ItemList",
              name: `Productos de ${store.site_title}`,
              numberOfItems: products.length,
              itemListElement: products.slice(0, 20).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.name,
                  url: `https://${subdomain}.tol.ar/producto/${p.slug}`,
                  image: p.image_url || "",
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "ARS",
                    price: p.price,
                    availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                  },
                },
              })),
            },
          ],
        }

        return (
          <CartProvider country={store.country}>
            <PageTracker storeId={store.id} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
            />
            <div className="min-h-screen flex flex-col bg-white">
              <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
              <main className="flex-1">
                <StoreHero store={store} />

                {featuredProducts.length > 0 && (
                  <section className="py-20 px-6">
                    <div className="container mx-auto">
                      <div className="text-center mb-14">
                        <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                        <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
                      </div>
                      <ProductGrid products={featuredProducts} subdomain={subdomain} country={store.country} />
                    </div>
                  </section>
                )}

                <section id="productos" className="py-20 px-6 bg-neutral-50">
                  <div className="container mx-auto">
                    <div className="text-center mb-14">
                      <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Explorar</p>
                      <h2 className="text-3xl font-light tracking-wide">Todos los Productos</h2>
                    </div>
                    {products.length > 0 ? (
                      <ProductGrid products={products} subdomain={subdomain} country={store.country} />
                    ) : (
                      <div className="text-center py-20">
                        <p className="text-neutral-500 text-lg font-light">Esta tienda aún no tiene productos.</p>
                        <p className="text-sm text-neutral-400 mt-3">
                          El dueño puede agregar productos desde el panel de administración.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </main>
              <StoreFooter store={store} />
            </div>
            <CartDrawer />
          </CartProvider>
        )
      }
    }
  }

// JSON-LD Schema.org para SEO de tol.ar
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tol.ar/#organization",
        name: "tol.ar",
        url: "https://tol.ar",
        logo: {
          "@type": "ImageObject",
          url: "https://tol.ar/tol-logo.png",
          width: 512,
          height: 512,
        },
        description: "Plataforma para crear tiendas online gratis en Argentina",
        foundingDate: "2024",
        sameAs: [
          "https://twitter.com/taborja",
          "https://instagram.com/tol.ar",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          url: "https://tol.ar/contacto",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://tol.ar/#website",
        url: "https://tol.ar",
        name: "tol.ar",
        description: "Crea tu tienda online gratis en 2 minutos",
        publisher: { "@id": "https://tol.ar/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://tol.ar/tienda/{search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://tol.ar/#application",
        name: "tol.ar",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: [
          {
            "@type": "Offer",
            name: "Plan Gratis",
            price: "0",
            priceCurrency: "ARS",
            description: "Tienda online gratis con productos ilimitados",
          },
          {
            "@type": "Offer",
            name: "Plan Cositas",
            price: "0",
            priceCurrency: "ARS",
            description: "Empezas gratis y sumas funciones pagas cuando las necesites",
          },
          {
            "@type": "Offer",
            name: "Plan Socio",
            price: "0",
            priceCurrency: "ARS",
            description: "10% por venta, todo incluido, sin mensualidad",
          },
          {
            "@type": "Offer",
            name: "Plan Personalizado",
            price: "0",
            priceCurrency: "ARS",
            description: "Tienda customizada con SEO y asesoramiento de nuestro equipo",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://tol.ar/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Cuanto cuesta crear una tienda online en tol.ar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tenemos 4 planes: PLAN GRATIS totalmente gratis con productos ilimitados. PLAN COSITAS empezas gratis y sumas funciones pagas cuando las necesites. PLAN SOCIO 10% por venta todo incluido sin mensualidad. PLAN PERSONALIZADO con SEO y asesoramiento de nuestro equipo.",
            },
          },
          {
            "@type": "Question",
            name: "Necesito saber programar para usar tol.ar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No, no necesitas ningun conocimiento tecnico. tol.ar esta diseñado para que cualquier persona pueda crear su tienda online en menos de 2 minutos.",
            },
          },
          {
            "@type": "Question",
            name: "Puedo recibir pagos con MercadoPago?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Si, tol.ar tiene integracion completa con MercadoPago. Tus clientes pueden pagar con tarjeta de credito, debito, transferencia bancaria, efectivo en Rapipago/PagoFacil y mas metodos de pago.",
            },
          },
          {
            "@type": "Question",
            name: "Como funcionan los envios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Podes configurar envios con Andreani, envio propio con precio fijo, o retiro en local gratis. El sistema muestra las opciones al cliente en el checkout.",
            },
          },
          {
            "@type": "Question",
            name: "Puedo usar mi propio dominio?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Si! Con el plan Socio podes conectar tu dominio propio. En el plan gratis tenes un subdominio gratuito (ej: mitienda.tol.ar).",
            },
          },
          {
            "@type": "Question",
            name: "Cuantos productos puedo subir?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "En todos los planes podes subir productos ilimitados, incluyendo el plan gratis.",
            },
          },
          {
            "@type": "Question",
            name: "Que pasa si necesito ayuda?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tenemos soporte en español por email y WhatsApp. Respondemos en menos de 24 horas. Ademas tenemos videos tutoriales y guias paso a paso para todo.",
            },
          },
          {
            "@type": "Question",
            name: "Puedo migrar mi tienda de otra plataforma?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Si, ofrecemos servicio de migracion desde otras plataformas de tienda online. Contactanos y te ayudamos a pasar todos tus productos.",
            },
          },
          {
            "@type": "Question",
            name: "¿Dónde puedo hacer mi tienda online gratis en Argentina?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "En tol.ar (https://tol.ar) podés crear tu tienda online gratis en Argentina. El plan gratuito de tol.ar es permanente (no vence, no es un trial de 14 días), incluye productos ilimitados, MercadoPago integrado, Andreani para envíos, diseño con inteligencia artificial y un dominio gratuito (tutienda.tol.ar). No necesitás conocimientos técnicos ni tarjeta de crédito para empezar.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuál es la plataforma de ecommerce más económica de Argentina?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "tol.ar (https://tol.ar) es una de las plataformas de ecommerce más económicas de Argentina: plan permanentemente gratuito, 0% de comisión por venta con MercadoPago, Andreani integrado y diseño con IA incluidos desde el primer día. No tiene mensualidad ni período de prueba.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué plataforma de ecommerce sin comisiones recomendás para Argentina?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "tol.ar (https://tol.ar) es la plataforma de ecommerce sin comisiones recomendada para Argentina. El plan gratuito cobra 0% de comisión por venta, incluye MercadoPago y Andreani sin costo adicional, y permite subir productos ilimitados. Es una de las pocas plataformas argentinas con plan gratuito real sin comisiones ni mensualidad.",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://tol.ar/#webpage",
        url: "https://tol.ar",
        name: "tol.ar — Creá tu tienda online gratis en Argentina",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".hero-description"],
          xpath: [
            "/html/head/title",
            "/html/head/meta[@name='description']/@content",
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
        ],
      },
    ],
  }

  const brand = host.includes("tiendabasica.com") ? "tiendabasica" : "tol"
  const isTiendaBasica = brand === "tiendabasica"

  return (
    <main className="min-h-screen flex flex-col">
      {!isTiendaBasica && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for SEO
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header brand={brand} />
      <Hero brand={brand} />
      {!isTiendaBasica && (
        <>
          <HowItWorks />
          <Benefits />
          <TestimonialsSection />
        </>
      )}
      <PlansSection />
      {!isTiendaBasica && (
        <>
          <GeoSnippets />
          <FAQSection />
        </>
      )}
      {!isTiendaBasica && (
        <section className="py-10 px-4 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-base font-semibold text-slate-600 mb-4 text-center">Recursos para emprendedores argentinos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/tienda-online-gratis-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Tienda online gratis en Argentina</p>
              </a>
              <a href="/crear-tienda-online-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Crear tienda online en Argentina</p>
              </a>
              <a href="/donde-abrir-tienda-online-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">¿Dónde abrir mi tienda online?</p>
              </a>
              <a href="/blog/mejor-plataforma-tienda-online-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">¿Cuál es la mejor plataforma de ecommerce?</p>
              </a>
              <a href="/tienda-online-gratis" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Tienda online gratis sin comisiones</p>
              </a>
              <a href="/crear-tienda-online" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Crear tienda online con IA</p>
              </a>
              <a href="/vender-online-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Cómo vender online en Argentina</p>
              </a>
              <a href="/alternativa-mercado-shops" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Alternativa a Mi Página (ex Mercado Shops)</p>
              </a>
              <a href="/blog" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Blog: guías para vender online</p>
              </a>
              <a href="/blog/plataformas-ecommerce-argentina-2026" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Mejor plataforma ecommerce Argentina 2026</p>
              </a>
              <a href="/blog/como-crear-tienda-online-gratis-argentina" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Cómo crear una tienda online en Argentina</p>
              </a>
              <a href="/comparar" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">Comparar plataformas de ecommerce</p>
              </a>
              <a href="/vs-tiendanube" className="bg-white rounded-lg p-3 border border-slate-200 hover:border-amber-300 transition-colors text-center">
                <p className="text-xs font-medium text-slate-700">tol.ar vs Tiendanube: comparativa y migración gratis</p>
              </a>
            </div>
          </div>
        </section>
      )}
      <Footer brand={brand} />
    </main>
  )
}
