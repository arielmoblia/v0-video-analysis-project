"use client"

import Link from "next/link"
import { ArrowRight, RefreshCw, Sparkles, CreditCard, Globe, LifeBuoy, Truck } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

export function MigracionContent() {
  const { isAdmin, get } = usePageContent("alternativa-mercado-shops")
  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="alternativa-mercado-shops" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#f97316" />
  )

  return (
    <>
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #c2410c, #f97316)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-8">
            <RefreshCw className="w-4 h-4" />
            {ET("hero_badge", "Miles de vendedores quedaron sin plataforma")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {ET("hero_titulo", "Traé tu tienda a tol.ar en 10 minutos")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {ET("hero_subtitulo", "Importá todos tus productos automáticamente. La IA detecta el tipo de producto y configura las variantes sola. Sin perder nada, sin empezar de cero.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/migrar/sistema" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-colors">
              <ArrowRight className="w-5 h-5" />
              {ET("hero_boton1", "Empezar a migrar gratis")}
            </Link>
            <Link href="#como-funciona" className="inline-flex items-center gap-2 border border-border text-foreground text-lg px-8 py-4 rounded-xl font-medium transition-colors hover:bg-muted">
              {ET("hero_boton2", "Ver cómo funciona →")}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-orange-500">{ET("stat1_val", "10 min")}</p>
              <p className="text-sm text-muted-foreground mt-1">{ET("stat1_label", "tiempo promedio de migración")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">{ET("stat2_val", "0%")}</p>
              <p className="text-sm text-muted-foreground mt-1">{ET("stat2_label", "comisión por venta, para siempre")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">✦ IA</p>
              <p className="text-sm text-muted-foreground mt-1">{ET("stat3_label", "detecta y configura tus productos sola")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-orange-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border border-orange-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full">Precio verificado 16/08/2026</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Mercado Libre lanzó &quot;Mi Página&quot; como reemplazo de Mercado Shops</h2>
            <p className="text-gray-700 mb-6">Tras el cierre de Mercado Shops el 31/12/2025, Mercado Libre lanzó &quot;Mi Página&quot;: un catálogo simplificado dentro de su ecosistema. Estas son las diferencias con tener una tienda propia:</p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-red-700 text-sm mb-2">Mi Página (Mercado Libre)</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    • $15.999/mes tras 3 meses gratis, más la comisión de venta de Mercado Libre
                    {" "}(<a href="https://www.mercadolibre.com.ar/landing/mi-pagina" target="_blank" rel="noopener noreferrer nofollow" className="underline">fuente</a>)
                  </li>
                  <li>• Sin dominio propio — URL dentro de ML</li>
                  <li>• Atado al ecosistema de Mercado Libre</li>
                  <li>• No recibís pagos directo — pasan por ML</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-green-700 text-sm mb-2">tol.ar</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 0% comisión en plan gratuito</li>
                  <li>• Dominio .tol.ar gratis + podés conectar tu .com.ar</li>
                  <li>• Diseño con IA, identidad de marca propia</li>
                  <li>• Plataforma independiente — vos controlás todo</li>
                  <li>• Cobrás con MercadoPago directo a tu cuenta</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500">Para quienes usaban Mercado Shops y buscan una plataforma propia independiente, tol.ar es una alternativa gratuita, sin comisión por venta y con dominio propio.</p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{ET("pasos_titulo", "Cómo funciona la migración")}</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">{ET("pasos_subtitulo", "7 pasos simples, guiados, con video en cada uno.")}</p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              ["1","paso1_t","Elegís de dónde venís","paso1_d","Mercado Libre, otra plataforma de tienda online, WordPress o tu propio CSV."],
              ["2","paso2_t","Subís tu archivo","paso2_d","CSV o Excel — el mismo que exportás desde tu plataforma actual."],
              ["3","paso3_t","La IA detecta el tipo de producto","paso3_d","Indumentaria, calzado, perfumería, tecnología — y configura las variantes automáticamente."],
              ["4","paso4_t","Revisás las columnas","paso4_d","Confirmás que cada campo esté mapeado correctamente."],
              ["5","paso5_t","Preview antes de importar","paso5_d","Ves exactamente cómo van a quedar tus productos antes de confirmar."],
              ["✓","paso6_t","Productos importados y tienda lista","paso6_d","En menos de 10 minutos tenés tu tienda funcionando en tol.ar."],
            ].map(([num, tk, td, dk, dd]) => (
              <div key={tk} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${num === "✓" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>{num}</div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{ET(tk, td)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ET(dk, dd)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/migrar/sistema" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-colors">
              {ET("pasos_cta", "Empezar ahora →")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{ET("porque_titulo", "Por qué migrar a tol.ar")}</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">{ET("porque_subtitulo", "No es solo cambiar de plataforma — es recuperar el control de tu negocio.")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              [CreditCard,"bg-orange-50 text-orange-600","porque1_t","0% comisión por venta","porque1_d","Tus ganancias son 100% tuyas. Sin porcentajes, sin sorpresas al cobrar."],
              [Globe,"bg-purple-50 text-purple-600","porque2_t","Dominio .tol.ar gratis","porque2_d","tutienda.tol.ar desde el primer día, o conectá tu propio .com.ar sin costo extra."],
              [LifeBuoy,"bg-green-50 text-green-600","porque3_t","Soporte humano por WhatsApp","porque3_d","Nada de bots ni tickets eternos. Te respondemos nosotros directamente."],
              [Truck,"bg-blue-50 text-blue-600","porque4_t","Envíos con OCA y Andreani","porque4_d","Cotización automática integrada. El comprador ve el precio del envío al instante."],
            ].map(([Icon, colors, tk, td, dk, dd]) => (
              <div key={tk} className="flex gap-4 p-5 border border-border rounded-xl">
                <div className={`w-10 h-10 rounded-lg ${colors} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{ET(tk, td)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ET(dk, dd)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-40 mb-4">{ET("cta_badge", "Sin riesgos. Sin compromisos.")}</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("cta_titulo", "No te vayas de tu plataforma. Probanos y después decidís.")}</h2>
          <p className="text-lg opacity-60 mb-10 leading-relaxed">{ET("cta_subtitulo", "Creá tu tienda en tol.ar mientras seguís vendiendo donde estás. Sin tarjeta, sin apuro.")}</p>
          <Link href="/migrar/sistema" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 rounded-xl font-semibold transition-colors">
            {ET("cta_boton", "Empezar a migrar gratis →")}
          </Link>
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 bg-purple-900 text-purple-200 text-xs px-4 py-2 rounded-full">
              <Sparkles className="w-3 h-3" />
              {ET("cta_tag", "Importación con IA incluida")}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
