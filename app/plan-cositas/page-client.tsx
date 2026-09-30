"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { EditableText, usePageContent } from "@/components/editable-text"
import {
  BarChart3, Video, MessageSquare, Globe, Package, Headphones,
  ShoppingCart, Sparkles, Zap, CreditCard, Clock, Shield,
  DollarSign, Search, Palette, FileSpreadsheet, MessageCircle,
  EyeOff, Wand2, Megaphone, ShoppingBag, Images,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { CositasCheckout } from "@/components/cositas-checkout"

const ICON_MAP: Record<string, any> = {
  BarChart3, Video, MessageSquare, Globe, Package, Headphones,
  ShoppingCart, Sparkles, Zap, CreditCard, Clock, Shield,
  DollarSign, Search, Palette, FileSpreadsheet, MessageCircle,
  EyeOff, Wand2, Megaphone, ShoppingBag, Images,
}

interface StoreFeature {
  code: string
  name: string
  description: string
  full_description: string | null
  price: number
  price_type: "mes" | "unica" | "percent"
  icon: string | null
  categoria: string
  is_active: boolean
  trial_days: number
}

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanCositasPage({ brand = "tol" }: Props) {
  const [features, setFeatures] = useState<StoreFeature[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [dolarRate, setDolarRate] = useState(1200)
  const [loading, setLoading] = useState(true)
  const { isAdmin, get } = usePageContent("plan-cositas")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-cositas" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#d97706" />
  )

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/super-admin/features", { cache: "no-store" })
      if (res.ok) {
        const { features: allFeatures } = await res.json()
        setFeatures((allFeatures || []).filter((f: StoreFeature) => f.is_active))
      }
      fetch("/api/super-admin/exchange-rate")
        .then(r => r.json())
        .then(d => { if (d.rate) setDolarRate(d.rate) })
        .catch(() => {})
      setLoading(false)
    }
    fetchData()
  }, [])

  const categorias = features.reduce((acc, f) => {
    const cat = f.categoria || "Producción"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {} as Record<string, StoreFeature[]>)

  const toggleFeature = (code: string) => {
    setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }

  const total = features
    .filter(f => selected.includes(f.code))
    .reduce((sum, f) => sum + Math.round(f.price * dolarRate), 0)

  const priceDisplay = (f: StoreFeature) =>
    `$ ${Math.round(f.price * dolarRate).toLocaleString("es-AR")}`

  const priceLabel = (f: StoreFeature) =>
    f.price_type === "mes" ? " / mes" : f.price_type === "unica" ? " / única vez" : " / mes"

  const IconComp = (iconName: string | null) => {
    const Comp = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : Package
    return <Comp className="w-5 h-5 text-[#62162f]" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff9fc5]/20 via-white to-[#ca678e]/10">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #62162f, #96305a)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff9fc5]/30 text-[#62162f] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Para tu tienda online en Argentina
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#62162f] to-[#96305a]">
              Plan Cositas
            </span>
          </h1>
          <div className="max-w-2xl mx-auto mb-4 px-6 py-5">
            <p className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
              Hacé tu tienda gratis y andá agregándole "cositas" cuando las necesites
            </p>
            <p className="text-lg text-slate-700">
              sin pagar de más. Activá las que necesites.
            </p>
          </div>
          <div className="max-w-2xl mx-auto px-6 py-5">
            <p className="text-lg font-bold text-[#62162f] mb-1">
              Cada "cosita" te cuesta ${Math.round(dolarRate).toLocaleString("es-AR")} por mes.
            </p>
            <p className="text-base text-slate-700">
              Sin paquetes cerrados
            </p>
            <p className="text-base text-[#96305a] font-medium">
              Sin letra chica (todo super claro)
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            ¿Por qué pagar de más?
          </h2>
          <p className="text-muted-foreground mb-4">
            Cada plataforma te vende un paquete cerrado. Pagás por diez cosas aunque uses tres. Con tol.ar es distinto.
          </p>
          <p className="text-muted-foreground mb-4">
            Si necesitás que tus clientes vean más fotos de tus productos, activás Galería de Imágenes. Si querés aparecer primero en Google, activás SEO Profesional y nosotros te lo configuramos. Si vendés en dólares pero cobrás en pesos, Dólar/Peso lo convierte automático todos los días sin que toques nada.
          </p>
          <p className="text-muted-foreground">
            Cada funcionalidad es independiente. Las combinás como querés. Y si en algún momento no la necesitás más, la desactivás.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("seccion_cositas_titulo", "Elegí tus cositas")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {ET("seccion_cositas_subtitulo", "Seleccioná las funcionalidades que querés agregar a tu tienda.")}
          </p>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando cositas...</div>
          ) : features.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Próximamente...</div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {Object.entries(categorias).map(([categoria, items]) => (
                <div key={categoria}>
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">{categoria}</h3>
                  <div className="space-y-2">
                    {items.map((cosita) => {
                      const isSelected = selected.includes(cosita.code)
                      return (
                        <div
                          key={cosita.code}
                          className={`flex items-center gap-4 p-4 border rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#96305a] bg-orange-100 hover:bg-orange-100"
                              : "border-orange-300 bg-orange-50 hover:bg-orange-100"
                          }`}
                          onClick={() => toggleFeature(cosita.code)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleFeature(cosita.code)}
                            className="data-[state=checked]:bg-[#62162f] data-[state=checked]:border-[#62162f]"
                          />
                          <div className="w-10 h-10 bg-[#ff9fc5]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            {IconComp(cosita.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{cosita.name}</p>
                            {cosita.trial_days > 0 && (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {cosita.trial_days} días gratis
                              </span>
                            )}
                          </div>
                          <p className="hidden md:block flex-1 text-sm text-muted-foreground truncate">
                            {cosita.description}
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className="text-xs font-semibold text-[#96305a] hover:underline tracking-wide"
                                onClick={(e) => e.stopPropagation()}
                              >
                                LEER MÁS
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{cosita.name}</DialogTitle>
                                <DialogDescription className="pt-4">
                                  {cosita.full_description || cosita.description}
                                </DialogDescription>
                              </DialogHeader>
                              {cosita.code === "dolar_peso" && (

                                <a
                                  href="/plan-cositas/dolar-peso"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "dropshipping" && (
                                <a
                                  href="https://tol.ar/blog/que-es-el-dropshipping"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "mayorista_minorista" && (
                                <a
                                  href="/plan-cositas/mayorista-minorista"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "modelos_templates" && (
                                <a
                                  href="/plan-cositas/modelos-templates"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "multi_images" && (
                                <a
                                  href="/plan-cositas/galeria-imagenes"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "lupa" && (
                                <a
                                  href="/plan-cositas/lupa"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              {cosita.code === "theme_custom_url" && (
                                <a
                                  href="/plan-cositas/portada-especial"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 mb-2 text-sm text-blue-600 hover:underline"
                                >
                                  Leer más →
                                </a>
                              )}
                              <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p className="text-2xl font-bold text-[#62162f]">
                                  {priceDisplay(cosita)}
                                  <span className="text-base font-normal text-muted-foreground">{priceLabel(cosita)}</span>
                                </p>
                                {cosita.trial_days > 0 && (
                                  <p className="text-sm text-green-600 mt-1">{cosita.trial_days} días de prueba gratis</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <p className="text-right min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                            <span className="font-semibold">{priceDisplay(cosita)}</span>
                            <span className="text-sm text-muted-foreground">{priceLabel(cosita)}</span>
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto">
              {selected.map((code) => {
                const cosita = features.find(f => f.code === code)
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
                  <p className="text-2xl font-bold text-[#62162f]">${total.toLocaleString("es-AR")}</p>
                </div>
                <CositasCheckout selectedCositas={selected} total={total} hasPercentItem={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("faq_titulo", "Preguntas frecuentes")}</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              ["faq1_p","¿Cómo funciona el pago?","faq1_r","Pagás mensualmente por cada cosita activa. Podés cancelar cuando quieras."],
              ["faq2_p","¿Puedo agregar más cositas después?","faq2_r","Sí, podés activar más cositas cuando quieras desde tu panel de administración."],
              ["faq3_p","¿Qué incluye el plan gratis?","faq3_r","El plan gratis incluye tu tienda funcionando con productos ilimitados, categorías, carrito de compras y todas las funciones básicas."],
              ["faq4_p","¿Cómo funciona el dominio propio?","faq4_r","Comprás tu dominio en cualquier registrador y nosotros te ayudamos a conectarlo a tu tienda."],
            ].map(([pk, pd, rk, rd]) => (
              <div key={pk} className="border-b pb-6">
                <h3 className="font-bold mb-2">{ET(pk, pd)}</h3>
                <p className="text-muted-foreground">{ET(rk, rd)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#62162f] to-[#96305a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">¿Por qué existe el Plan Cositas?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Conocé la historia detrás del plan y hacia dónde va.</p>
          <a href="/plan-cositas/proyecto" className="inline-block bg-white text-[#62162f] font-semibold px-8 py-3 rounded-lg hover:bg-[#ff9fc5]/20 hover:text-white transition-colors">
            Conocer más →
          </a>
        </div>
      </section>
      <Footer brand={brand} />
    </div>
  )
}
