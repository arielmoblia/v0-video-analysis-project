import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { getBrand } from "@/lib/get-brand"
import { PLANS } from "@/components/landing/plans-section"
import { PlanesGrid } from "@/components/landing/planes-grid"

export const metadata: Metadata = {
  title: "Planes para crear tu tienda online en Argentina — tol.ar",
  description:
    "Comparativa de los planes de tol.ar: Plan Gratis para siempre y Plan Cositas con funciones a la carta. Elegí el que mejor te queda.",
  alternates: {
    canonical: "https://tol.ar/planes",
  },
  openGraph: {
    title: "Planes para crear tu tienda online en Argentina — tol.ar",
    description:
      "Plan Gratis y Plan Cositas. Comparalos y elegí el que mejor te queda.",
    type: "website",
    url: "https://tol.ar/planes",
  },
}

const PLAN_SUMMARIES: Record<string, string> = {
  "Plan Gratis":
    "Tu tienda con dominio propio (tuTienda.tol.ar), productos ilimitados, carrito, Mercado Pago, métodos de envío y panel de administración. Gratis para siempre, sin tarjeta de crédito.",
  "Plan Cositas":
    "Arrancás con el Plan Gratis y sumás funciones extra (estadísticas, video en portada, chat con IA, dominio propio, soporte prioritario) solo cuando las necesitás, pagando cada una por separado.",
}

const PLANES_PAGE = PLANS.filter(p => p.name !== "Plan Socio" && p.name !== "Plan Personalizado")

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://tol.ar/planes",
      url: "https://tol.ar/planes",
      name: "Planes para crear tu tienda online en Argentina — tol.ar",
      description:
        "Comparativa de los planes de tol.ar: Plan Gratis y Plan Cositas.",
      inLanguage: "es-AR",
      isPartOf: { "@id": "https://tol.ar/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tol.ar" },
          { "@type": "ListItem", position: 2, name: "Planes", item: "https://tol.ar/planes" },
        ],
      },
    },
    {
      "@type": "OfferCatalog",
      name: "Planes tol.ar",
      itemListElement: PLANES_PAGE.map((plan, idx) => ({
        "@type": "Offer",
        position: idx + 1,
        name: plan.name,
        url: `https://tol.ar${plan.href}`,
        description: PLAN_SUMMARIES[plan.name] || plan.features.join(". "),
      })),
    },
  ],
}

export default async function PlanesPage() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header brand={brand} />
        <main>
          <section className="py-16 px-4 text-center">
            <div className="container mx-auto max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros planes</h1>
              <p className="text-lg text-muted-foreground">
                Empezás gratis y elegís el plan que mejor te queda a medida que tu tienda crece. Sin letra chica.
              </p>
            </div>
          </section>

          <section className="pb-20 px-4">
            <PlanesGrid plans={PLANES_PAGE} />
          </section>
        </main>
        <Footer brand={brand} />
      </div>
    </>
  )
}
