"use client"
import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableText, usePageContent } from "@/components/editable-text"
import { Wand2, Sparkles, Globe, Palette, Type, Layout, Zap, ArrowRight, Check, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { icon: Globe,    key:"paso1", title:"1. Elegí un sitio",        desc:"Buscá en internet un sitio web cuyo diseño te guste. Puede ser de cualquier rubro." },
  { icon: Wand2,    key:"paso2", title:"2. Pegá la URL",           desc:"Copiá la dirección del sitio y pegala en el campo de tu panel de administración." },
  { icon: Sparkles, key:"paso3", title:"3. Magia en segundos",     desc:"Nuestra IA analiza los colores, tipografía y estilo del sitio en 15-20 segundos." },
  { icon: Palette,  key:"paso4", title:"4. Tu tienda transformada",desc:"Los estilos se aplican automáticamente a tu tienda. ¡Listo para vender!" },
]

const FEATURES = [
  { icon: Palette, key:"feat1", title:"Colores",        desc:"Extrae la paleta de colores principal y secundaria del sitio" },
  { icon: Type,    key:"feat2", title:"Tipografía",     desc:"Identifica el estilo de fuentes: moderna, clásica, minimalista" },
  { icon: Layout,  key:"feat3", title:"Estilo general", desc:"Detecta si es claro/oscuro, minimalista/cargado, formal/casual" },
]

const BENEFITS = [
  "No necesitás conocimientos de diseño",
  "Ahorrás horas de trabajo configurando colores y estilos",
  "Resultados profesionales en segundos",
  "Podés probarlo con diferentes sitios hasta encontrar tu estilo",
  "Pago único de $2 USD - sin suscripciones",
  "Funciona con cualquier sitio web público",
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function DisenoIAPage({ brand = "tol" }: Props) {
  const [demoUrl, setDemoUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { isAdmin, get } = usePageContent("diseno-ia")
  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="diseno-ia" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#7c3aed" />
  )

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
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #5b21b6, #7c3aed)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-100">
            <Sparkles className="w-3 h-3 mr-1" />{ET("hero_badge", "Nueva función exclusiva")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {ET("hero_titulo1", "Diseño con")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              {ET("hero_titulo2", "Inteligencia Artificial")}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {ET("hero_subtitulo", "Pegá la URL de cualquier sitio web que te guste y nuestra IA copiará su estilo visual para tu tienda. En segundos.")}
          </p>
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-4">{ET("demo_label", "Probá cómo funciona:")}</p>
            <div className="flex gap-2">
              <Input placeholder="https://www.sitio-que-te-gusta.com" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} className="flex-1" />
              <Button onClick={handleDemo} disabled={isAnalyzing} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                {isAnalyzing ? <><Sparkles className="w-4 h-4 mr-2 animate-spin" />Analizando...</> : <><Wand2 className="w-4 h-4 mr-2" />{ET("demo_boton", "Analizar")}</>}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-violet-600" /><span>{ET("stat1", "15-20 segundos")}</span></div>
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-violet-600" /><span>{ET("stat2", "Solo $2 USD (pago único)")}</span></div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-600" /><span>{ET("stat3", "Resultados instantáneos")}</span></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("pasos_titulo", "¿Cómo funciona?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.key} className="text-center relative">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="font-semibold mb-2">{ET(`${step.key}_titulo`, step.title)}</h3>
                <p className="text-sm text-muted-foreground">{ET(`${step.key}_desc`, step.desc)}</p>
                {i < STEPS.length - 1 && <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-violet-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("analiza_titulo", "¿Qué analiza la IA?")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{ET("analiza_subtitulo", "Nuestra inteligencia artificial extrae los elementos visuales clave del sitio que elegiste")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURES.map(f => (
              <Card key={f.key} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{ET(`${f.key}_titulo`, f.title)}</h3>
                  <p className="text-sm text-muted-foreground">{ET(`${f.key}_desc`, f.desc)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{ET("beneficios_titulo", "¿Por qué usar Diseño con IA?")}</h2>
            <div className="space-y-4">
              {BENEFITS.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{ET(`beneficio${i+1}`, b)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{ET("cta_titulo", "¿Listo para transformar tu tienda?")}</h2>
          <p className="text-xl opacity-90 mb-8">{ET("cta_subtitulo", "Creá tu tienda gratis y activá Diseño con IA desde tu panel")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-gratis">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100">
                {ET("cta_boton1", "Crear tienda gratis")}<ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/plan-cositas">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                {ET("cta_boton2", "Ver Plan Cositas")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
