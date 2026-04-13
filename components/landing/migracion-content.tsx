"use client"

import Link from "next/link"
import { ArrowRight, RefreshCw, Sparkles, CreditCard, Globe, LifeBuoy, Truck, CheckCircle2, XCircle } from "lucide-react"

export function MigracionContent() {
  return (
    <>
      {/* HERO */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-8">
            <RefreshCw className="w-4 h-4" />
            Miles de vendedores quedaron sin plataforma
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Traé tu tienda a tol.ar<br />en 10 minutos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Importá todos tus productos automáticamente. La IA detecta el tipo de producto y configura las variantes sola. Sin perder nada, sin empezar de cero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/migrar/sistema"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              Empezar a migrar gratis
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center gap-2 border border-border text-foreground text-lg px-8 py-4 rounded-xl font-medium transition-colors hover:bg-muted"
            >
              Ver cómo funciona →
            </Link>
          </div>
        </div>
      </section>

      {/* 3 DATOS RÁPIDOS */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-orange-500">10 min</p>
              <p className="text-sm text-muted-foreground mt-1">tiempo promedio de migración</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">0%</p>
              <p className="text-sm text-muted-foreground mt-1">comisión por venta, para siempre</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">✦ IA</p>
              <p className="text-sm text-muted-foreground mt-1">detecta y configura tus productos sola</p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Cómo funciona la migración</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">7 pasos simples, guiados, con video en cada uno.</p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              ["1", "Elegís de dónde venís", "Mercado Libre, Tiendanube, Empretienda, WordPress o tu propio CSV."],
              ["2", "Subís tu archivo", "CSV o Excel — el mismo que exportás desde tu plataforma actual."],
              ["3", "La IA detecta el tipo de producto", "Indumentaria, calzado, perfumería, tecnología — y configura las variantes automáticamente."],
              ["4", "Revisás las columnas", "Confirmás que cada campo esté mapeado correctamente."],
              ["5", "Preview antes de importar", "Ves exactamente cómo van a quedar tus productos antes de confirmar."],
              ["✓", "Productos importados y tienda lista", "En menos de 10 minutos tenés tu tienda funcionando en tol.ar."],
            ].map(([num, title, desc]) => (
              <div key={title} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${num === "✓" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                  {num}
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/migrar/sistema"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Empezar ahora →
            </Link>
          </div>
        </div>
      </section>

      {/* DE DÓNDE VENÍS */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">¿De dónde venís?</h2>
          <p className="text-center text-muted-foreground mb-10 text-lg">Tenemos guía y video específico para cada plataforma.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["ML", "Mercado Libre", "Mi página / Mercado Shops", "bg-orange-50 text-orange-700"],
              ["TN", "Tiendanube", "Planes pagos con comisión", "bg-blue-50 text-blue-700"],
              ["WP", "WordPress", "WooCommerce CSV nativo", "bg-green-50 text-green-700"],
              ["CSV", "Ya tengo mi CSV", "Cualquier plataforma", "bg-purple-50 text-purple-700"],
            ].map(([code, name, sub, colors]) => (
              <Link
                key={name}
                href="/migrar/sistema"
                className="bg-background border border-border rounded-xl p-4 text-center hover:border-orange-300 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full ${colors} flex items-center justify-center text-xs font-bold mx-auto mb-3`}>
                  {code}
                </div>
                <p className="font-semibold text-sm text-foreground mb-1">{name}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ TOL.AR */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Por qué migrar a tol.ar</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">No es solo cambiar de plataforma — es recuperar el control de tu negocio.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              [CreditCard, "bg-orange-50 text-orange-600", "0% comisión por venta", "Tus ganancias son 100% tuyas. Sin porcentajes, sin sorpresas al cobrar."],
              [Globe, "bg-purple-50 text-purple-600", "Dominio .tol.ar gratis", "tutienda.tol.ar desde el primer día, o conectá tu propio .com.ar sin costo extra."],
              [LifeBuoy, "bg-green-50 text-green-600", "Soporte humano por WhatsApp", "Nada de bots ni tickets eternos. Te respondemos nosotros directamente."],
              [Truck, "bg-blue-50 text-blue-600", "Envíos con OCA y Andreani", "Cotización automática integrada. El comprador ve el precio del envío al instante."],
            ].map(([Icon, colors, title, desc]) => (
              <div key={title} className="flex gap-4 p-5 border border-border rounded-xl">
                <div className={`w-10 h-10 rounded-lg ${colors} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Comparativa de precios real</h2>
          <p className="text-center text-muted-foreground mb-10 text-lg">Precios verificados — los actualizamos cuando cambian.</p>
          <div className="bg-background border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 bg-muted text-sm font-semibold">
              <div className="p-3 col-span-1 text-muted-foreground">Concepto</div>
              <div className="p-3 text-center text-orange-600">ML Mi Página</div>
              <div className="p-3 text-center text-blue-600">Tiendanube</div>
              <div className="p-3 text-center text-green-700">Empretienda</div>
              <div className="p-3 text-center text-orange-500 font-bold">tol.ar</div>
            </div>
            {[
              ["Costo mensual", "$15.999/mes", "$24.999/mes", "$8.490/mes", "Gratis", false],
              ["Comisión por venta", "11% – 17%", "0.5% – 2%*", "0%", "0%", false],
              ["Dominio propio", "No aplica", "Costo extra", "Incluido", "Incluido", false],
              ["Importar productos", "Manual", "Manual", "CSV básico", "IA automático", false],
              ["Soporte", "Sin soporte", "Chat/email", "WhatsApp", "WhatsApp directo", false],
              ["Tu tienda es tuya", "No — es de ML", "Sí", "Sí", "Sí — 100%", false],
            ].map(([concept, ml, tn, et, tolar], i) => (
              <div key={concept} className={`grid grid-cols-5 text-sm ${i % 2 === 0 ? "" : "bg-muted/50"}`}>
                <div className="p-3 font-medium text-foreground">{concept}</div>
                <div className="p-3 text-center text-red-500">{ml}</div>
                <div className="p-3 text-center text-muted-foreground">{tn}</div>
                <div className="p-3 text-center text-muted-foreground">{et}</div>
                <div className="p-3 text-center text-green-600 font-medium">{tolar}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">* Tiendanube no cobra comisión con su propia pasarela Pago Nube. Con MercadoPago u otras sí aplica. Precios orientativos — verificá los precios actuales en cada plataforma:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <a href="https://www.mercadolibre.com.ar/ayuda/Costos-de-vender-un-producto_870" target="_blank" rel="noopener noreferrer" className="text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">Ver costos de vender en ML →</a>
            <a href="https://www.tiendanube.com/planes-y-precios" target="_blank" rel="noopener noreferrer" className="text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">Ver precios Tiendanube →</a>
            <a href="https://www.empretienda.com/#precios" target="_blank" rel="noopener noreferrer" className="text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">Ver precios Empretienda →</a>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-40 mb-4">Sin riesgos. Sin compromisos.</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            No te vayas de tu plataforma.<br />Probanos y después decidís.
          </h2>
          <p className="text-lg opacity-60 mb-10 leading-relaxed">
            Creá tu tienda en tol.ar mientras seguís vendiendo donde estás. Sin tarjeta, sin apuro. Si no te convence, no perdiste nada.
          </p>
          <Link
            href="/migrar/sistema"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 rounded-xl font-semibold transition-colors"
          >
            Empezar a migrar gratis →
          </Link>
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 bg-purple-900 text-purple-200 text-xs px-4 py-2 rounded-full">
              <Sparkles className="w-3 h-3" />
              Importación con IA incluida
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
