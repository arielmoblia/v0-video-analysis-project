import { headers } from "next/headers"
import dynamic from "next/dynamic"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { getStoreBySubdomain, getStoreProducts, getStoreCategories, getFeaturedProducts } from "@/lib/store-context"
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
const PlansSection = dynamic(() => import("@/components/landing/plans-section").then(m => ({ default: m.PlansSection })))
const Testimonials = dynamic(() => import("@/components/landing/testimonials").then(m => ({ default: m.Testimonials })))
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
        const [products, categories, featuredProducts] = await Promise.all([
          getStoreProducts(store.id),
          getStoreCategories(store.id),
          getFeaturedProducts(store.id),
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
          <CartProvider>
            <PageTracker storeId={store.id} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
            />
            <div className="min-h-screen flex flex-col bg-white">
              <StoreHeader store={store} categories={categories} />
              <main className="flex-1">
                <StoreHero store={store} />

                {featuredProducts.length > 0 && (
                  <section className="py-20 px-6">
                    <div className="container mx-auto">
                      <div className="text-center mb-14">
                        <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">Lo mejor</p>
                        <h2 className="text-3xl font-light tracking-wide">Productos Destacados</h2>
                      </div>
                      <ProductGrid products={featuredProducts} subdomain={subdomain} />
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
                      <ProductGrid products={products} subdomain={subdomain} />
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
            description: "Tienda online gratis hasta 20 productos",
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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
          bestRating: "5",
          worstRating: "1",
        },
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
              text: "Tenemos 4 planes: PLAN GRATIS totalmente gratis hasta 20 productos. PLAN COSITAS empezas gratis y sumas funciones pagas cuando las necesites. PLAN SOCIO 10% por venta todo incluido sin mensualidad. PLAN PERSONALIZADO con SEO y asesoramiento de nuestro equipo.",
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
              text: "Si, tol.ar tiene integracion completa con MercadoPago. Tus clientes pueden pagar con tarjeta de credito, debito, transferencia y mas.",
            },
          },
          {
            "@type": "Question",
            name: "Como funcionan los envios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Podes configurar envios con Andreani, envio propio o retiro en local. El sistema calcula automaticamente el costo de envio para tus clientes.",
            },
          },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <PlansSection />
      <Testimonials />
      <GeoSnippets />
      <FAQSection />
      <Footer />
    </main>
  )
}
