"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wand2, 
  Sparkles, 
  Globe, 
  Palette, 
  Type, 
  Layout, 
  Zap,
  ArrowRight,
  Check,
  Clock,
  DollarSign
} from "lucide-react"
import Link from "next/link"

const STEPS = [
  {
    icon: Globe,
    title: "1. Elegí un sitio",
    description: "Buscá en internet un sitio web cuyo diseño te guste. Puede ser de cualquier rubro."
  },
  {
    icon: Wand2,
    title: "2. Pegá la URL",
    description: "Copiá la dirección del sitio y pegala en el campo de tu panel de administración."
  },
  {
    icon: Sparkles,
    title: "3. Magia en segundos",
    description: "Nuestra IA analiza los colores, tipografía y estilo del sitio en 15-20 segundos."
  },
  {
    icon: Palette,
    title: "4. Tu tienda transformada",
    description: "Los estilos se aplican automáticamente a tu tienda. ¡Listo para vender!"
  }
]

const FEATURES = [
  {
    icon: Palette,
    title: "Colores",
    description: "Extrae la paleta de colores principal y secundaria del sitio"
  },
  {
    icon: Type,
    title: "Tipografía",
    description: "Identifica el estilo de fuentes: moderna, clásica, minimalista"
  },
  {
    icon: Layout,
    title: "Estilo general",
    description: "Detecta si es claro/oscuro, minimalista/cargado, formal/casual"
  }
]

const EXAMPLES = [
  {
    name: "Sitio minimalista",
    url: "ejemplo-minimal.com",
    colors: ["#FFFFFF", "#000000", "#F5F5F5"],
    style: "Minimalista, limpio, mucho espacio en blanco"
  },
  {
    name: "Sitio vibrante",
    url: "ejemplo-vibrante.com", 
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
    style: "Colorido, juvenil, energético"
  },
  {
    name: "Sitio elegante",
    url: "ejemplo-elegante.com",
    colors: ["#1A1A2E", "#C9A227", "#EAEAEA"],
    style: "Oscuro, premium, sofisticado"
  }
]

export default function DisenoIAPage() {
  const [demoUrl, setDemoUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDemo = () => {
    if (!demoUrl) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      alert("Esta es una demo. Para usar Diseño con IA, creá tu tienda gratis y activá esta cosita desde tu panel.")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-100">
            <Sparkles className="w-3 h-3 mr-1" />
            Nueva función exclusiva
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Diseño con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Inteligencia Artificial
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Pegá la URL de cualquier sitio web que te guste y nuestra IA copiará su estilo visual para tu tienda. En segundos.
          </p>
          
          {/* Demo interactiva */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-4">Probá cómo funciona:</p>
            <div className="flex gap-2">
              <Input 
                placeholder="https://www.sitio-que-te-gusta.com"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleDemo}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Analizar
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" />
              <span>15-20 segundos</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-violet-600" />
              <span>Solo $2 USD (pago único)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-600" />
              <span>Resultados instantáneos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {index < STEPS.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-violet-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué analiza la IA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Qué analiza la IA?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Nuestra inteligencia artificial extrae los elementos visuales clave del sitio que elegiste
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ejemplos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Ejemplos de resultados</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Mirá cómo la IA interpreta diferentes estilos de sitios web
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {EXAMPLES.map((example, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">{example.url}</p>
                  <h3 className="font-semibold mb-4">{example.name}</h3>
                  <div className="flex gap-2 mb-4">
                    {example.colors.map((color, i) => (
                      <div 
                        key={i}
                        className="w-10 h-10 rounded-lg border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{example.style}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué usar Diseño con IA?</h2>
            <div className="space-y-4">
              {[
                "No necesitás conocimientos de diseño",
                "Ahorrás horas de trabajo configurando colores y estilos",
                "Resultados profesionales en segundos",
                "Podés probarlo con diferentes sitios hasta encontrar tu estilo",
                "Pago único de $2 USD - sin suscripciones",
                "Funciona con cualquier sitio web público"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tu tienda?</h2>
          <p className="text-xl opacity-90 mb-8">Creá tu tienda gratis y activá Diseño con IA desde tu panel</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-gratis">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100">
                Crear tienda gratis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/plan-cositas">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Ver Plan Cositas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
