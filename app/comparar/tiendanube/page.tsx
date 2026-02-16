import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ArrowRight, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "tol.ar vs Tiendanube: Cual es Mejor para Emprendedores Argentinos? | Comparativa 2025",
  description: "Comparamos tol.ar con Tiendanube: precios, comisiones, facilidad de uso, MercadoPago, envios. Descubri cual plataforma de ecommerce es mejor para tu negocio en Argentina.",
  keywords: "tol.ar vs tiendanube, alternativa tiendanube, tiendanube precios, tiendanube comisiones, mejor plataforma ecommerce argentina",
  openGraph: {
    title: "tol.ar vs Tiendanube: Comparativa Completa 2025",
    description: "Cual plataforma de ecommerce es mejor para emprendedores argentinos? Comparamos precios, funciones y facilidad de uso.",
    type: "article",
  },
}

const comparacion = [
  { caracteristica: "Plan gratis disponible", tolar: true, tiendanube: false },
  { caracteristica: "Sin comision por venta (plan gratis)", tolar: true, tiendanube: false },
  { caracteristica: "MercadoPago integrado", tolar: true, tiendanube: true },
  { caracteristica: "Envios con Andreani", tolar: true, tiendanube: true },
  { caracteristica: "Crear tienda en 2 minutos", tolar: true, tiendanube: false },
  { caracteristica: "Sin conocimientos tecnicos", tolar: true, tiendanube: true },
  { caracteristica: "Soporte en español", tolar: true, tiendanube: true },
  { caracteristica: "Dominio gratis incluido", tolar: true, tiendanube: false },
  { caracteristica: "Diseños personalizables", tolar: true, tiendanube: true },
  { caracteristica: "Chat con AI 24/7", tolar: true, tiendanube: false },
  { caracteristica: "Plan sin mensualidad", tolar: true, tiendanube: false },
  { caracteristica: "Precios en pesos argentinos", tolar: true, tiendanube: true },
]

const precios = [
  { plan: "Plan basico", tolar: "Gratis (hasta 20 productos)", tiendanube: "~$15.000/mes" },
  { plan: "Plan intermedio", tolar: "Cositas (pagas lo que necesitas)", tiendanube: "~$30.000/mes" },
  { plan: "Plan completo", tolar: "Socio (10% por venta, sin mensualidad)", tiendanube: "~$60.000/mes + comision" },
  { plan: "Plan premium", tolar: "Personalizado (a medida)", tiendanube: "Consultar" },
]

export default function CompararTiendanube() {
  // JSON-LD para comparacion
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "tol.ar vs Tiendanube: Cual es Mejor para Emprendedores Argentinos?",
    description: "Comparativa completa entre tol.ar y Tiendanube para crear tu tienda online en Argentina",
    author: {
      "@type": "Organization",
      name: "tol.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "tol.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://tol.ar/tol-logo.png",
      },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString(),
  }

  return (
    <main className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            tol.ar vs Tiendanube: Cual es Mejor?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comparativa completa para emprendedores argentinos que quieren crear su tienda online. 
            Analizamos precios, funciones, facilidad de uso y mas.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/#crear-tienda">
                Probar tol.ar Gratis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparacion de Funcionalidades
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-4 font-bold text-center">
              <div>Caracteristica</div>
              <div className="text-green-600">tol.ar</div>
              <div className="text-blue-600">Tiendanube</div>
            </div>
            
            {comparacion.map((item, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 gap-4 py-4 border-b ${index % 2 === 0 ? 'bg-slate-50' : ''}`}
              >
                <div className="font-medium pl-4">{item.caracteristica}</div>
                <div className="flex justify-center">
                  {item.tolar ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div className="flex justify-center">
                  {item.tiendanube ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparacion de precios */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparacion de Precios 2025
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-4 font-bold text-center">
              <div>Plan</div>
              <div className="text-green-600">tol.ar</div>
              <div className="text-blue-600">Tiendanube</div>
            </div>
            
            {precios.map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-3 gap-4 py-4 border-b bg-white"
              >
                <div className="font-medium pl-4">{item.plan}</div>
                <div className="text-center text-green-700 font-semibold">{item.tolar}</div>
                <div className="text-center text-slate-600">{item.tiendanube}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Veredicto */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Nuestro Veredicto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  <strong>tol.ar es mejor si:</strong> Estas empezando, queres probar sin pagar, 
                  buscas algo simple y rapido, o no queres pagar mensualidades fijas.
                </p>
                <p className="text-lg">
                  <strong>Tiendanube puede ser mejor si:</strong> Ya tenes un negocio establecido 
                  con alto volumen de ventas y necesitas integraciones muy especificas.
                </p>
                <p className="text-muted-foreground">
                  Para el 90% de emprendedores argentinos que estan empezando o tienen un negocio 
                  pequeño/mediano, tol.ar ofrece todo lo necesario a una fraccion del costo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Proba tol.ar Gratis y Compara Vos Mismo
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crea tu tienda en 2 minutos. Sin tarjeta de credito. Sin compromisos.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/#crear-tienda">
              Crear mi Tienda Gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
