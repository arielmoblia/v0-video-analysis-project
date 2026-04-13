"use client"

import { useState, useEffect, useRef } from "react"
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


function EditableText({ field, value, isAdmin, onSave, tag = "span", className = "" }: {
  field: string; value: string; isAdmin: boolean; onSave: (k: string, v: string) => Promise<void>; tag?: string; className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { setText(value) }, [value])
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  const handleSave = async () => {
    setSaving(true); await onSave(field, text); setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === "Escape") { setText(value); setEditing(false) }
  }
  if (!isAdmin) { const Tag = tag as any; return <Tag className={className}>{value}</Tag> }
  if (editing) return (
    <span style={{ display: "inline-block", width: "100%" }}>
      <textarea ref={ref} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} rows={2}
style={{ width: "100%", padding: "6px 10px", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit",
          color: "#62162f", background: "rgba(255,255,255,0.95)", border: "2px solid #96305a", borderRadius: "8px",
          resize: "vertical", outline: "none", lineHeight: "1.5", textAlign: "center" }} />
      <span style={{ display: "flex", gap: "8px", marginTop: "4px", justifyContent: "center" }}>
        <button onClick={() => { setText(value); setEditing(false) }}
          style={{ padding: "3px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "12px" }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "3px 12px", borderRadius: "6px", border: "none", background: saving ? "#ca678e" : "#62162f", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          {saving ? "Guardando..." : "Guardar"}</button>
      </span>
    </span>
  )
  const Tag = tag as any
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Tag className={className}
        style={{ cursor: "text", borderRadius: "4px", transition: "all 0.15s",
          outline: hover ? "2px dashed #ca678e" : "2px dashed transparent", outlineOffset: "3px",
          background: hover ? "rgba(255,159,197,0.1)" : "transparent" }}>
        {text}
      </Tag>
      {hover && <button onClick={() => setEditing(true)}
        style={{ position: "absolute", top: "-12px", right: "-12px", background: "#62162f", color: "white",
          border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(98,22,47,0.4)", zIndex: 10 }}>✏️</button>}
      {saved && <span style={{ position: "absolute", top: "-12px", right: "20px", background: "#10b981",
        color: "white", borderRadius: "4px", padding: "2px 7px", fontSize: "11px", fontWeight: 600 }}>✓</span>}
    </span>
  )
}

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
        code: "lupa",
        name: "Lupa",
        description: "Grabá y reproducí las sesiones de tus visitantes.",
        fullDescription: "Mirá exactamente cómo navegan tus clientes en tu tienda: dónde hacen click, hasta dónde scrollean, qué los frena antes de comprar. Reproducí sesiones reales para entender y mejorar tu tienda.",
        price: 1500,
        priceType: "mes",
        icon: Video,
        popular: true,
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

const BENEFITS_DEFAULT = [
  { icon: CreditCard, titleKey: "benefit1_titulo", descKey: "benefit1_desc", title: "Pagás una sola vez", description: "Sin suscripciones ni pagos recurrentes" },
  { icon: Zap,        titleKey: "benefit2_titulo", descKey: "benefit2_desc", title: "Activación inmediata", description: "Tu cosita se activa al instante" },
  { icon: Clock,      titleKey: "benefit3_titulo", descKey: "benefit3_desc", title: "Para siempre", description: "Una vez que pagás, es tuyo" },
  { icon: Shield,     titleKey: "benefit4_titulo", descKey: "benefit4_desc", title: "Sin compromisos", description: "Elegí solo lo que necesitás" },
]

export default function PlanCositasPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [content, setContent] = useState<Record<string,string>>({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch("/api/plan-cositas").then(r=>r.json()).then(setContent).catch(()=>{})
    fetch("/api/super-admin/check-auth").then(r=>r.json()).then(d=>setIsAdmin(d?.authenticated===true)).catch(()=>{})
  }, [])

  const handleSave = async (key: string, value: string) => {
    const res = await fetch("/api/plan-cositas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) })
    if (res.ok) setContent(prev => ({ ...prev, [key]: value }))
  }

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
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #62162f, #96305a)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos del hero para editarlos
        </div>
      )}

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff9fc5]/30 text-[#62162f] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Personalizá tu tienda
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <EditableText field="titulo" value={content.titulo || "Plan Cositas"} isAdmin={isAdmin} onSave={handleSave}
              tag="span" className={isAdmin ? "text-[#62162f]" : "text-transparent bg-clip-text bg-gradient-to-r from-[#62162f] to-[#96305a]"} />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            <EditableText field="subtitulo" value={content.subtitulo || "Armá tu propio plan eligiendo solo lo que necesitás. Sin paquetes cerrados, sin pagar de más."} isAdmin={isAdmin} onSave={handleSave} tag="span" />
          </p>
          <p className="text-lg text-[#96305a] font-medium">
            <EditableText field="cta_footer" value={content.cta_footer || "Pagás una sola vez, tuyo para siempre"} isAdmin={isAdmin} onSave={handleSave} tag="span" />
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <EditableText field="seccion_beneficios_titulo" value={content.seccion_beneficios_titulo || "¿Por qué elegir Cositas?"} isAdmin={isAdmin} onSave={handleSave} tag="span" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {BENEFITS_DEFAULT.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#ff9fc5]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#62162f]" />
                </div>
                <h3 className="font-semibold mb-2">
                  <EditableText field={benefit.titleKey} value={content[benefit.titleKey] || benefit.title} isAdmin={isAdmin} onSave={handleSave} tag="span" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  <EditableText field={benefit.descKey} value={content[benefit.descKey] || benefit.description} isAdmin={isAdmin} onSave={handleSave} tag="span" />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Cositas por categorías */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <EditableText field="seccion_cositas_titulo" value={content.seccion_cositas_titulo || "Elegí tus cositas"} isAdmin={isAdmin} onSave={handleSave} tag="span" />
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            <EditableText field="seccion_cositas_subtitulo" value={content.seccion_cositas_subtitulo || "Seleccioná las funcionalidades que querés agregar a tu tienda. Organizadas por categoría para que encuentres fácil lo que necesitás."} isAdmin={isAdmin} onSave={handleSave} tag="span" />
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
          <h2 className="text-3xl font-bold text-center mb-12">
            <EditableText field="faq_titulo" value={content.faq_titulo || "Preguntas frecuentes"} isAdmin={isAdmin} onSave={handleSave} tag="span" />
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><EditableText field="faq1_pregunta" value={content.faq1_pregunta || "¿Cómo funciona el pago?"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isAdmin ? <EditableText field="faq1_respuesta" value={content.faq1_respuesta || "Pagás una sola vez por cada cosita que elijas. No hay suscripciones mensuales ni pagos recurrentes. Una vez que pagás, la funcionalidad queda activa para siempre en tu tienda."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.faq1_respuesta || "Pagás una sola vez por cada cosita que elijas. No hay suscripciones mensuales ni pagos recurrentes. Una vez que pagás, la funcionalidad queda activa para siempre en tu tienda.")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><EditableText field="faq2_pregunta" value={content.faq2_pregunta || "¿Puedo agregar más cositas después?"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isAdmin ? <EditableText field="faq2_respuesta" value={content.faq2_respuesta || "Sí, podés comprar más cositas cuando quieras. Cada una se activa al instante después del pago."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.faq2_respuesta || "Sí, podés comprar más cositas cuando quieras. Cada una se activa al instante después del pago.")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><EditableText field="faq3_pregunta" value={content.faq3_pregunta || "¿Qué incluye el plan gratis?"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isAdmin ? <EditableText field="faq3_respuesta" value={content.faq3_respuesta || "El plan gratis incluye tu tienda funcionando con hasta 20 productos, categorías, carrito de compras, checkout, gestión de pedidos y todas las funciones básicas. Las cositas son extras opcionales para potenciar tu tienda."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.faq3_respuesta || "El plan gratis incluye tu tienda funcionando con hasta 20 productos, categorías, carrito de compras, checkout, gestión de pedidos y todas las funciones básicas. Las cositas son extras opcionales para potenciar tu tienda.")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><EditableText field="faq4_pregunta" value={content.faq4_pregunta || "¿Cómo funciona el dominio propio?"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isAdmin ? <EditableText field="faq4_respuesta" value={content.faq4_respuesta || "Comprás tu dominio en cualquier registrador (ej: NIC Argentina, GoDaddy) y nosotros te ayudamos a conectarlo a tu tienda. En lugar de mitienda.tol.ar, tus clientes entran a www.mitienda.com."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.faq4_respuesta || "Comprás tu dominio en cualquier registrador (ej: NIC Argentina, GoDaddy) y nosotros te ayudamos a conectarlo a tu tienda. En lugar de mitienda.tol.ar, tus clientes entran a www.mitienda.com.")}
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
