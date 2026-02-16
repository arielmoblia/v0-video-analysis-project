"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Video,
  MessageSquare,
  Globe,
  Package,
  Headphones,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  Zap,
  CreditCard,
  Clock,
  Shield,
  Info,
  Megaphone,
  DollarSign,
  Users,
  Percent,
  Search,
  Palette,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CositasCheckout } from "@/components/cositas-checkout"

type Cosita = {
  code: string
  name: string
  description: string
  fullDescription: string
  price: number | string
  priceType: "mes" | "unica" | "percent"
  icon: any
  popular?: boolean
}

type Category = {
  name: string
  items: Cosita[]
}

const CATEGORIAS: Category[] = [
  {
    name: "Marketing",
    items: [
      {
        code: "marketing_pro",
        name: "Marketing Pro",
        description: "Herramientas avanzadas de marketing para tu tienda.",
        fullDescription: "Incluye campañas de email automáticas, recuperación de carritos abandonados, cupones de descuento personalizados y más.",
        price: 1500,
        priceType: "mes",
        icon: BarChart3,
      },
      {
        code: "google_shopping",
        name: "Google Shopping",
        description: "Publicá tus productos en Google Shopping automáticamente.",
        fullDescription: "Sincronización automática de tu catálogo con Google Merchant Center. Tus productos aparecen en las búsquedas de Google.",
        price: 1500,
        priceType: "unica",
        icon: Globe,
      },
      {
        code: "diseno_ai",
        name: "Diseño AI",
        description: "Diseño de tienda personalizado con inteligencia artificial.",
        fullDescription: "Subí una foto de cualquier tienda que te guste y nuestra IA copia el diseño para tu tienda. Colores, tipografías y layout.",
        price: 1500,
        priceType: "unica",
        icon: Package,
      },
      {
        code: "video_portada",
        name: "Video de portada",
        description: "Poné un video en lugar de imagen en tu banner principal.",
        fullDescription: "Subí un video corto (hasta 30 segundos) que se reproduce automáticamente en la portada de tu tienda.",
        price: 1500,
        priceType: "unica",
        icon: Video,
      },
      {
        code: "seo_profesional",
        name: "SEO Profesional",
        description: "Aparece primero en Google. Configuracion completa + reportes.",
        fullDescription: "Te configuramos TODO el SEO de tu tienda: Meta tags optimizados para cada producto, sitemap dinamico que se actualiza solo, datos estructurados (JSON-LD) para que Google muestre fotos y precios, Google Search Console verificado, Google Analytics con dashboard de visitas, alertas cuando hay cambios importantes en tu posicionamiento, y reporte mensual con recomendaciones. En 30 dias empezas a aparecer en los primeros resultados de Google.",
        price: 2500,
        priceType: "mes",
        icon: Search,
        popular: true,
      },
    ],
  },
  {
    name: "Comunicaciones",
    items: [
      {
        code: "chat_ai",
        name: "Chat con AI",
        description: "Asistente virtual que responde consultas 24/7.",
        fullDescription: "Un chatbot inteligente que conoce tus productos y puede responder preguntas de tus clientes en cualquier momento.",
        price: 1500,
        priceType: "mes",
        icon: MessageSquare,
      },
      {
        code: "soporte_prioritario",
        name: "Soporte prioritario",
        description: "Atención de soporte comercial y de diseño prioritaria.",
        fullDescription: "Acceso directo a nuestro equipo de soporte con respuesta garantizada en menos de 2 horas por WhatsApp.",
        price: 1500,
        priceType: "mes",
        icon: Headphones,
      },
    ],
  },
  {
    name: "Producción",
    items: [
      {
        code: "variedades_personalizadas",
        name: "Variedades Personalizadas",
        description: "Creá opciones personalizadas: aromas, colores, sabores, etc.",
        fullDescription: "En lugar de solo talles (S, M, L) o medidas (ml, oz), podés crear tus propias opciones personalizadas para cada producto. Ideal para sahumerios (aromas), velas (fragancias), comida (sabores), ropa (colores), y mucho más. Configurá el nombre de la variedad y todas las opciones disponibles desde tu panel de administración.",
        price: 1500,
        priceType: "unica",
        icon: Palette,
        popular: true,
      },
      {
        code: "dominio_propio",
        name: "Dominio propio",
        description: "Usá tu dominio (mitienda.com) en vez de mitienda.tol.ar.",
        fullDescription: "Conectá tu propio dominio a tu tienda. Te ayudamos con la configuración técnica.",
        price: 1500,
        priceType: "mes",
        icon: Shield,
      },
      {
        code: "estadisticas",
        name: "Estadísticas",
        description: "Mirá visitas, productos más vistos y origen de clientes.",
        fullDescription: "Dashboard completo con métricas de tu tienda: visitas diarias, productos más vistos, conversiones y más.",
        price: 1500,
        priceType: "mes",
        icon: Clock,
      },
      {
        code: "dolar_pesos",
        name: "Dolar pesos",
        description: "Mostrá precios en dólares y cobrá en pesos automáticamente.",
        fullDescription: "Cargá tus productos en dólares y el sistema convierte automáticamente a pesos al momento de la compra.",
        price: 1500,
        priceType: "mes",
        icon: DollarSign,
      },
      {
        code: "productos_ilimitados",
        name: "Productos ilimitados",
        description: "Sin límite de productos (el plan gratis tiene hasta 20).",
        fullDescription: "Publicá todos los productos que quieras sin límites. Ideal para catálogos grandes.",
        price: 1500,
        priceType: "mes",
        icon: Users,
      },
      {
        code: "mayoristas",
        name: "MAYORISTAS",
        description: "Sistema de precios mayoristas para clientes especiales.",
        fullDescription: "Creá listas de precios diferentes para mayoristas. Los clientes aprobados ven precios especiales.",
        price: 1500,
        priceType: "mes",
        icon: Percent,
      },
      {
        code: "socio_ventas",
        name: "SOCIO DE VENTAS",
        description: "Nos encargamos de vender por vos, cobramos comisión.",
        fullDescription: "Nuestro equipo se encarga de promocionar y vender tus productos. Solo pagás un porcentaje de cada venta.",
        price: "10%",
        priceType: "percent",
        icon: Zap,
      },
    ],
  },
]

// Flatten para cálculos
const ALL_COSITAS = CATEGORIAS.flatMap(cat => cat.items)

const BENEFITS = [
  {
    icon: CreditCard,
    title: "Pagás una sola vez",
    description: "Sin suscripciones ni pagos recurrentes",
  },
  {
    icon: Zap,
    title: "Activación inmediata",
    description: "Tu cosita se activa al instante",
  },
  {
    icon: Clock,
    title: "Para siempre",
    description: "Una vez que pagás, es tuyo",
  },
  {
    icon: Shield,
    title: "Sin compromisos",
    description: "Elegí solo lo que necesitás",
  },
]

export default function PlanCositasPage() {
  const [selected, setSelected] = useState<string[]>([])

  const toggleFeature = (code: string) => {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const total = ALL_COSITAS.filter((c) => selected.includes(c.code)).reduce((sum, c) => {
    if (typeof c.price === "number") return sum + c.price
    return sum
  }, 0)
  
  const hasPercentItem = selected.some(code => {
    const item = ALL_COSITAS.find(c => c.code === code)
    return item?.priceType === "percent"
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff9fc5]/20 via-white to-[#ca678e]/10">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff9fc5]/30 text-[#62162f] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Personalizá tu tienda
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Plan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#62162f] to-[#96305a]">
              Cositas
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Armá tu propio plan eligiendo solo lo que necesitás. Sin paquetes cerrados, sin pagar de más.
          </p>
          <p className="text-lg text-[#96305a] font-medium">Pagás una sola vez, tuyo para siempre</p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Cositas?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#ff9fc5]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#62162f]" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Cositas por categorías */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Elegí tus cositas</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Seleccioná las funcionalidades que querés agregar a tu tienda. Organizadas por categoría para que encuentres fácil lo que necesitás.
          </p>
          <div className="max-w-4xl mx-auto space-y-8">
            {CATEGORIAS.map((categoria) => (
              <div key={categoria.name}>
                <h3 className="text-lg font-medium text-muted-foreground mb-4">{categoria.name}</h3>
                <div className="space-y-2">
                  {categoria.items.map((cosita) => {
                    const isSelected = selected.includes(cosita.code)
                    const priceDisplay = typeof cosita.price === "number" 
                      ? `$ ${cosita.price.toLocaleString("es-AR")}` 
                      : cosita.price
                    const priceLabel = cosita.priceType === "mes" 
                      ? " / mes" 
                      : cosita.priceType === "unica" 
                      ? " / única vez" 
                      : " / mes"

                    return (
                      <div
                        key={cosita.code}
                        className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:bg-muted/50 ${
                          isSelected ? "border-[#96305a] bg-[#ff9fc5]/10" : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleFeature(cosita.code)}
                          className="data-[state=checked]:bg-[#62162f] data-[state=checked]:border-[#62162f]"
                        />
                        <div className="w-10 h-10 bg-[#ff9fc5]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <cosita.icon className="w-5 h-5 text-[#62162f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{cosita.name}</p>
                        </div>
                        <p className="hidden md:block flex-1 text-sm text-muted-foreground truncate">
                          {cosita.description}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button 
                              className="p-1 hover:bg-muted rounded-full transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{cosita.name}</DialogTitle>
                              <DialogDescription className="pt-4">
                                {cosita.fullDescription}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <p className="text-2xl font-bold text-[#62162f]">
                                {priceDisplay}
                                <span className="text-base font-normal text-muted-foreground">{priceLabel}</span>
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <p className="text-right min-w-[120px]">
                          <span className="font-semibold">{priceDisplay}</span>
                          <span className="text-sm text-muted-foreground">{priceLabel}</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="container mx-auto max-w-5xl">
            {/* Fila superior: Cositas seleccionadas en 2 líneas */}
            <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto">
              {selected.map((code) => {
                const cosita = ALL_COSITAS.find((c) => c.code === code)
                return cosita ? (
                  <Badge 
                    key={code} 
                    className="text-xs bg-[#ff9fc5]/30 text-[#62162f] hover:bg-[#ff9fc5]/40 cursor-pointer"
                    onClick={() => toggleFeature(code)}
                  >
                    {cosita.name} ✕
                  </Badge>
                ) : null
              })}
            </div>
            {/* Fila inferior: Contador, Total y Botón */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#96305a]" />
                <span className="font-medium">
                  {selected.length} cosita{selected.length > 1 ? "s" : ""} seleccionada{selected.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total mensual</p>
                  <p className="text-2xl font-bold text-[#62162f]">
                    ${total.toLocaleString("es-AR")}
                    {hasPercentItem && " + 10%"}
                  </p>
                </div>
                <CositasCheckout 
                  selectedCositas={selected}
                  total={total}
                  hasPercentItem={hasPercentItem}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas frecuentes</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo funciona el pago?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pagás una sola vez por cada cosita que elijas. No hay suscripciones mensuales ni pagos recurrentes. Una
                  vez que pagás, la funcionalidad queda activa para siempre en tu tienda.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Puedo agregar más cositas después?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, podés comprar más cositas cuando quieras. Cada una se activa al instante después del pago.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Qué incluye el plan gratis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  El plan gratis incluye tu tienda funcionando con hasta 20 productos, categorías, carrito de compras,
                  checkout, gestión de pedidos y todas las funciones básicas. Las cositas son extras opcionales para
                  potenciar tu tienda.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo funciona el dominio propio?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprás tu dominio en cualquier registrador (ej: NIC Argentina, GoDaddy) y nosotros te ayudamos a
                  conectarlo a tu tienda. En lugar de mitienda.tol.ar, tus clientes entran a www.mitienda.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
