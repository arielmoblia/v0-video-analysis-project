import { Images, MessageCircle, Palette, BarChart3, Video, Bot, Globe, Package, HeadphonesIcon, DollarSign, ShoppingBag, Megaphone, Check, FileSpreadsheet, Layers, Wand2, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const FEATURES_ACTIVAS = [
  {
    code: "multi_images",
    name: "Galeria de Imagenes",
    description: "Subi hasta 5 fotos por producto para mostrar todos los detalles. Tus clientes pueden ver el producto desde diferentes angulos.",
    icon: Images,
    price: 1,
    pago: "unico",
    benefits: [
      "Hasta 5 imagenes por producto",
      "Galeria con miniaturas",
      "Click para imagen principal",
      "Mejor experiencia de compra"
    ]
  },
  {
    code: "whatsapp_chat",
    name: "Chat de WhatsApp",
    description: "Agrega un boton flotante de WhatsApp en tu tienda para que tus clientes te contacten directamente con un solo clic.",
    icon: MessageCircle,
    price: 1,
    pago: "unico",
    benefits: [
      "Boton flotante en tu tienda",
      "Contacto directo con clientes",
      "Mensaje predeterminado",
      "Aumenta las ventas"
    ]
  },
  {
    code: "custom_variants",
    name: "Variantes Personalizables",
    description: "Crea opciones personalizadas para tus productos: aromas, colores, sabores, materiales y mas. Ideal para productos artesanales.",
    icon: Palette,
    price: 3,
    pago: "unico",
    benefits: [
      "Variantes ilimitadas",
      "Aromas, colores, sabores",
      "Stock por variante",
      "Ideal para artesanias"
    ]
  },
  {
    code: "csv_import",
    name: "Importar Productos (CSV/Excel)",
    description: "Subi todos tus productos de una sola vez desde un archivo Excel o CSV. Ideal para migrar desde otra plataforma o cargar catalogos grandes.",
    icon: FileSpreadsheet,
    price: 1,
    pago: "unico",
    benefits: [
      "Carga masiva de productos",
      "Formato CSV o Excel",
      "Plantilla descargable",
      "Ideal para migraciones"
    ]
  },
]

const FEATURES_PROXIMAMENTE = [
  {
    code: "combined_variants",
    name: "Variantes Combinadas",
    description: "Cruza talles con colores, aromas o cualquier variante. Stock individual por cada combinacion (ej: S-Rojo: 1, M-Negro: 34).",
    icon: Layers,
    price: 2,
  },
  {
    code: "ai_design",
    name: "Diseno con IA",
    description: "Pega la URL de un sitio que te guste y nuestra IA analizara los colores, tipografia y estilo para aplicarlo a tu tienda en segundos.",
    icon: Wand2,
    price: 2,
  },
  {
    code: "ai_chat",
    name: "Chat con IA",
    description: "Un asistente virtual que responde consultas de tus clientes automaticamente, 24/7.",
    icon: Bot,
    price: 1,
  },
  {
    code: "analytics",
    name: "Estadisticas Avanzadas",
    description: "Conoce en detalle el comportamiento de tus clientes: visitas, productos mas vistos, conversiones y mas.",
    icon: BarChart3,
    price: 1,
  },
  {
    code: "video_hero",
    name: "Video de Portada",
    description: "Reemplaza la imagen de portada por un video para captar la atencion de tus visitantes.",
    icon: Video,
    price: 1,
  },
  {
    code: "custom_domain",
    name: "Dominio Propio",
    description: "Conecta tu propio dominio (ej: tutienda.com) para una imagen mas profesional.",
    icon: Globe,
    price: 1,
  },
  {
    code: "unlimited_products",
    name: "Productos Ilimitados",
    description: "Sin limite en la cantidad de productos que podes publicar en tu tienda.",
    icon: Package,
    price: 1,
  },
  {
    code: "priority_support",
    name: "Soporte Prioritario",
    description: "Atencion preferencial por WhatsApp con respuesta en menos de 2 horas.",
    icon: HeadphonesIcon,
    price: 1,
  },
  {
    code: "dolar_peso",
    name: "Dolar/Peso Automatico",
    description: "Pone tus precios en dolares y tus clientes los ven en pesos argentinos. Se actualiza con la cotizacion del dolar blue.",
    icon: DollarSign,
    price: 1,
  },
  {
    code: "google_merchant",
    name: "Google Shopping",
    description: "Tus productos aparecen en Google Shopping cuando la gente busca lo que vendes. Incluye feed automatico.",
    icon: ShoppingBag,
    price: 2,
  },
  {
    code: "marketing_pro",
    name: "Marketing Pro",
    description: "Todas las herramientas de marketing: Pixels (Meta, TikTok, Google), Recupero de carrito, Cupones, Email marketing.",
    icon: Megaphone,
    price: 1,
  },
  {
    code: "remove_branding",
    name: "Quitar \"tol.ar\"",
    description: "Elimina el link de tol.ar del pie de pagina de tu tienda para una imagen 100% profesional.",
    icon: EyeOff,
    price: 1,
  },
]

export default function CositasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            TOL<span className="text-orange-500">.AR</span>
          </Link>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            Plan Cositas
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Plan <span className="text-orange-500">Cositas</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Funcionalidades extra para potenciar tu tienda. Pagá solo por lo que necesitás.
        </p>
      </section>

      {/* Features Activas */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-2 text-center">Disponibles Ahora</h2>
        <p className="text-muted-foreground text-center mb-8">Activalas desde el panel de tu tienda</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {FEATURES_ACTIVAS.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.code} className="overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-colors">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8" />
                    <div className="text-right">
                      <p className="text-3xl font-bold">${feature.price}</p>
                      <p className="text-xs opacity-80">
                        {feature.pago === "unico" ? "Pago unico" : "USD/mes"}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mt-3">{feature.name}</h3>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features Proximamente */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-2 text-center text-slate-500">Próximamente</h2>
        <p className="text-muted-foreground text-center mb-8">Estamos trabajando en estas funcionalidades</p>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {FEATURES_PROXIMAMENTE.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.code} className="bg-slate-50 border-slate-200 hover:border-slate-300 transition-colors">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 shrink-0">
                    <Icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-slate-700">{feature.name}</h3>
                      <Badge variant="outline" className="text-xs text-orange-500 border-orange-300">Pronto</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{feature.description}</p>
                    {feature.price && (
                      <p className="text-xs font-medium text-orange-600">Desde ${feature.price} USD</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Potenciá tu tienda hoy</h2>
          <p className="text-lg opacity-90 mb-6">
            Activá las cositas que necesites desde el panel de administración de tu tienda.
          </p>
          <p className="text-sm opacity-75">
            Tenés dudas? Escribinos por WhatsApp y te ayudamos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            TOL.AR - Tu Tienda Online en Argentina
          </p>
        </div>
      </footer>
    </div>
  )
}
