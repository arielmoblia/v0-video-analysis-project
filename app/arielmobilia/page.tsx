import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Benefits } from "@/components/landing/benefits"
import { PlansSection } from "@/components/landing/plans-section"
import { FAQSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"
import { getBrand } from "@/lib/get-brand"

export default async function ArielmobiliaPage() {
  const brand = await getBrand()
  return (
    <main className="min-h-screen flex flex-col">
      {/* Banner de modo desarrollo */}
      <div className="bg-amber-500 text-black text-center py-2 text-sm font-medium">
        MODO DESARROLLO - Esta es la version completa (no visible para clientes)
      </div>
      
      <Header fullMenu={true} basePath="/arielmobilia" brand={brand} />
      <Hero />
      <HowItWorks />
      <Benefits />
      <PlansSection fullPlans={true} basePath="/arielmobilia" />
      <FAQSection />
      <Footer brand={brand} />
    </main>
  )
}
