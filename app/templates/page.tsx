"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SignupModal } from "@/components/landing/signup-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Sparkles, ShoppingBag, Shirt, Smartphone, Check, Footprints, Loader2, Wand2, ExternalLink } from "lucide-react"
import Image from "next/image"

// Templates GRATIS
const templatesFree = [
  {
    id: "cosmetics",
    name: "Cosméticos",
    subtitle: "Productos simples",
    description: "Productos con unidades (ml, gr, oz) sin variantes de talla.",
    idealFor: ["Cosméticos", "Perfumería", "Accesorios", "Artesanías"],
    image: "/images/templates/cosmetics-store-pink-elegant-beauty-products.jpg",
    previewUrl: "https://template-cosmeticos.tol.ar",
    color: "from-pink-500 to-rose-500",
    icon: Sparkles,
  },
  {
    id: "clothing",
    name: "Ropa",
    subtitle: "Tallas de letras",
    description: "Productos con tallas XS, S, M, L, XL, XXL.",
    idealFor: ["Remeras", "Pantalones", "Vestidos", "Camperas"],
    image: "/images/templates/clothing-fashion-store-modern-shirts-pants-apparel.jpg",
    previewUrl: "https://template-ropa.tol.ar",
    color: "from-blue-500 to-indigo-500",
    icon: Shirt,
    popular: true,
  },
  {
    id: "footwear",
    name: "Calzado",
    subtitle: "Tallas numéricas",
    description: "Productos con tallas numéricas (34 al 46).",
    idealFor: ["Zapatos", "Zapatillas", "Botas", "Sandalias"],
    image: "/images/templates/footwear-shoes-store-modern-sneakers-boots-elegant.jpg",
    previewUrl: "https://template-calzado.tol.ar",
    color: "from-amber-500 to-orange-500",
    icon: Footprints,
    popular: true,
  },
  {
    id: "electronics",
    name: "Electrónicos",
    subtitle: "Solo cantidad",
    description: "Productos sin tallas, ideal para tecnología.",
    idealFor: ["Celulares", "Computación", "Gaming", "Audio"],
    image: "/images/templates/electronics-store-modern-phones-gadgets-tech-devic.jpg",
    previewUrl: "https://template-electronica.tol.ar",
    color: "from-emerald-500 to-teal-500",
    icon: Smartphone,
  },
]

// Templates PAGOS
const templatesPaid = [
  {
    id: "luxury",
    name: "Luxury",
    subtitle: "Elegante y premium",
    description: "Diseño oscuro con detalles dorados para marcas premium.",
    image: "/images/templates/luxury-elegant-store-dark-gold.jpg",
    previewUrl: "https://template-luxury.tol.ar",
    price: 2,
  },
  {
    id: "minimal",
    name: "Minimal",
    subtitle: "Limpio y moderno",
    description: "Diseño minimalista con mucho espacio en blanco.",
    image: "/images/templates/minimal-clean-white-store-modern.jpg",
    previewUrl: "https://template-minimal.tol.ar",
    price: 2,
  },
  {
    id: "bold",
    name: "Bold",
    subtitle: "Colorido y vibrante",
    description: "Colores llamativos para marcas jóvenes y dinámicas.",
    image: "/images/templates/bold-colorful-vibrant-store-young.jpg",
    previewUrl: "https://template-bold.tol.ar",
    price: 2,
  },
  {
    id: "vintage",
    name: "Vintage",
    subtitle: "Clásico y artesanal",
    description: "Estilo retro para productos artesanales o vintage.",
    image: "/images/templates/vintage-retro-store-classic-artisan.jpg",
    previewUrl: "https://template-vintage.tol.ar",
    price: 2,
  },
]

export default function TemplatesPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<typeof templatesPaid[0] | null>(null)
  const [activeTab, setActiveTab] = useState("free")
  
  // AI Design state
  const [aiUrl, setAiUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<{
    colors: string[]
    fonts: string[]
    style: string
  } | null>(null)

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsSignupOpen(true)
  }

  const handleAnalyzeUrl = async () => {
    if (!aiUrl) return
    setIsAnalyzing(true)
    // Simular análisis de IA
    setTimeout(() => {
      setAiResult({
        colors: ["#1a1a1a", "#f5f5f5", "#e63946", "#a8dadc"],
        fonts: ["Inter", "Playfair Display"],
        style: "Moderno y minimalista con acentos de color rojo",
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Tabs Navigation */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-14 w-full justify-start rounded-none bg-transparent border-none p-0">
              <TabsTrigger 
                value="free" 
                className="h-14 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger 
                value="paid"
                className="h-14 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  Templates pagos
                  <Badge variant="secondary" className="text-xs">$2</Badge>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai"
                className="h-14 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  Diseño con AI
                  <Wand2 className="h-4 w-4" />
                </span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Templates Gratis */}
            <TabsContent value="free" className="mt-0">
              {/* Hero */}
              <div className="py-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Elegí el template <span className="text-primary">GRATIS</span> para tu negocio
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Cada diseño está optimizado para un tipo de producto diferente. Todos incluyen productos de ejemplo para que veas cómo queda.
                </p>
              </div>

              {/* Grid */}
              <div className="pb-16">
                <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templatesFree.map((template) => {
                      const IconComponent = template.icon
                      return (
                        <div
                          key={template.id}
                          className={`relative rounded-2xl overflow-hidden border-2 transition-all hover:shadow-xl ${
                            template.popular ? "border-primary" : "border-border"
                          }`}
                        >
                          {template.popular && (
                            <div className="absolute top-4 right-4 z-10">
                              <Badge className="bg-primary text-primary-foreground text-xs">Popular</Badge>
                            </div>
                          )}

<div className="relative h-40 overflow-hidden">
                                            <Image
                                              src={template.image || "/images/placeholders/placeholder.svg"}
                                              alt={template.name}
                                              fill
                                              className="object-cover"
                                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                              loading="lazy"
                                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                              <a
                                href={template.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white text-foreground px-3 py-1.5 rounded-full text-sm font-medium"
                              >
                                <Eye className="h-3 w-3" />
                                Ver demo
                              </a>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${template.color}`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold">{template.name}</h3>
                                <p className="text-xs text-muted-foreground">{template.subtitle}</p>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{template.description}</p>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {template.idealFor.map((item) => (
                                <Badge key={item} variant="secondary" className="text-xs px-1.5 py-0">
                                  {item}
                                </Badge>
                              ))}
                            </div>

                            <Button
                              onClick={() => handleSelectTemplate(template.id)}
                              className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90 text-white`}
                              size="sm"
                            >
                              Usar este template
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold text-center mb-8">Comparación de templates</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-card rounded-xl overflow-hidden text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Característica</th>
                          <th className="text-center p-3 font-medium">Cosméticos</th>
                          <th className="text-center p-3 font-medium bg-primary/5">Ropa</th>
                          <th className="text-center p-3 font-medium bg-primary/5">Calzado</th>
                          <th className="text-center p-3 font-medium">Electrónicos</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">Tipo de tallas</td>
                          <td className="text-center p-3 text-muted-foreground">Sin tallas</td>
                          <td className="text-center p-3 bg-primary/5 font-medium">XS, S, M, L, XL</td>
                          <td className="text-center p-3 bg-primary/5 font-medium">34-46</td>
                          <td className="text-center p-3 text-muted-foreground">Sin tallas</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Stock por talla</td>
                          <td className="text-center p-3">-</td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Guía de tallas</td>
                          <td className="text-center p-3">-</td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3">-</td>
                        </tr>
                        <tr>
                          <td className="p-3">Variantes de color</td>
                          <td className="text-center p-3">-</td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3 bg-primary/5"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                          <td className="text-center p-3"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Templates Pagos */}
            <TabsContent value="paid" className="mt-0">
              <div className="py-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Elegí el template <span className="text-primary">$2</span> (única vez) para tu negocio
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Diseños premium con estilos únicos. Pagás una sola vez y es tuyo para siempre.
                </p>
              </div>

              <div className="pb-16">
                <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templatesPaid.map((template) => (
                      <div
                        key={template.id}
                        className="relative rounded-2xl overflow-hidden border-2 border-border transition-all hover:shadow-xl cursor-pointer group"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-foreground text-background">${template.price}</Badge>
                        </div>

<div className="relative h-48 overflow-hidden">
                                          <Image
                                            src={template.image || "/images/placeholders/placeholder.svg"}
                                            alt={template.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            loading="lazy"
                                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="flex items-center gap-2 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium">
                              <Eye className="h-4 w-4" />
                              Ver preview
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold">{template.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{template.subtitle}</p>
                          <p className="text-muted-foreground text-sm">{template.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Diseño con AI */}
            <TabsContent value="ai" className="mt-0">
              <div className="py-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Elegí el template <span className="text-primary">perfecto</span> para tu negocio
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Pegá la URL de cualquier tienda que te guste y nuestra IA copia el diseño para tu tienda.
                </p>
              </div>

              <div className="pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                  {/* AI Input */}
                  <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wand2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Diseño con IA</h3>
                        <p className="text-sm text-muted-foreground">Copiá cualquier diseño que te guste</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="https://ejemplo.com - pegá la URL del sitio que querés copiar"
                        value={aiUrl}
                        onChange={(e) => setAiUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAnalyzeUrl} 
                        disabled={!aiUrl || isAnalyzing}
                        className="min-w-[120px]"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analizando
                          </>
                        ) : (
                          "Analizar"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="border-2 border-dashed border-border rounded-2xl min-h-[400px] flex items-center justify-center bg-muted/20">
                    {aiResult ? (
                      <div className="w-full p-8">
                        <div className="text-center mb-8">
                          <h3 className="text-xl font-bold mb-2">Diseño analizado</h3>
                          <p className="text-muted-foreground">Así quedaría tu tienda con este estilo</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-card p-4 rounded-xl">
                            <h4 className="font-medium mb-3">Colores detectados</h4>
                            <div className="flex gap-2">
                              {aiResult.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-10 h-10 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="bg-card p-4 rounded-xl">
                            <h4 className="font-medium mb-3">Tipografías</h4>
                            <div className="flex flex-wrap gap-2">
                              {aiResult.fonts.map((font, i) => (
                                <Badge key={i} variant="secondary">{font}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-card p-4 rounded-xl mb-8">
                          <h4 className="font-medium mb-2">Estilo detectado</h4>
                          <p className="text-muted-foreground">{aiResult.style}</p>
                        </div>

                        <div className="flex justify-center">
                          <Button size="lg" onClick={() => setIsSignupOpen(true)}>
                            Aplicar este diseño a mi tienda
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Muestra funcional</p>
                        <p className="text-sm">Pegá una URL arriba para ver el resultado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¿No sabés cuál elegir?</h2>
          <p className="text-muted-foreground mb-6">
            No te preocupes, podés cambiar el diseño después. Empezá con el que más te guste.
          </p>
          <Button size="lg" onClick={() => setIsSignupOpen(true)} className="text-lg px-8">
            Crear mi tienda gratis
          </Button>
        </div>
      </section>

      {/* Preview Dialog for Paid Templates */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between space-y-0">
            <div>
              <DialogTitle>{previewTemplate?.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{previewTemplate?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={previewTemplate?.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir en nueva pestaña
              </a>
              <Button onClick={() => {
                setPreviewTemplate(null)
                handleSelectTemplate(previewTemplate?.id || "")
              }}>
                Usar este template (${previewTemplate?.price})
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={previewTemplate?.previewUrl}
              className="w-full h-full border-0"
              title={`Preview de ${previewTemplate?.name}`}
            />
          </div>
        </DialogContent>
      </Dialog>

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        preselectedTemplate={selectedTemplate}
      />

      <Footer />
    </div>
  )
}
