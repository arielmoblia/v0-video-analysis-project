"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Check,
  X,
  ArrowRight,
  Shield,
  Globe,
  Upload,
  Search,
  Rocket,
  LifeBuoy,
  AlertTriangle,
  Sparkles,
  CreditCard,
  Truck,
} from "lucide-react"

type Tab = "mercado-shops" | "tiendanube"

export function MigracionContent() {
  const [activeTab, setActiveTab] = useState<Tab>("mercado-shops")

  return (
    <>
      {/* Banner urgencia */}
      <div className="bg-red-600 text-white text-center py-3 px-4">
        <p className="text-sm md:text-base font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Miles de vendedores se quedaron sin plataforma. No pierdas mas
            ventas.
          </span>
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("mercado-shops")}
              className={`flex-1 py-4 text-center font-semibold text-sm md:text-base transition-colors relative ${
                activeTab === "mercado-shops"
                  ? "text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Alternativa a Mercado Shops
              {activeTab === "mercado-shops" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tiendanube")}
              className={`flex-1 py-4 text-center font-semibold text-sm md:text-base transition-colors relative ${
                activeTab === "tiendanube"
                  ? "text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Alternativa a Tiendanube
              {activeTab === "tiendanube" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === "mercado-shops" ? (
        <MercadoShopsContent />
      ) : (
        <TiendanubeContent />
      )}
    </>
  )
}

/* ========================================
   TAB: MERCADO SHOPS
   ======================================== */
function MercadoShopsContent() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-8">
            <AlertTriangle className="w-4 h-4" />
            Mercado Shops cerro en Argentina
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground text-balance leading-tight">
            {"Tu tienda de Mercado Shops cerro? Recupera tu negocio hoy en Tol.ar"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            El cierre de Mercado Shops en Argentina dejo a miles de vendedores
            sin plataforma, sin fotos y sin su vidriera digital. En Tol.ar,
            entendemos la urgencia de tu negocio. No pierdas mas ventas: te
            ofrecemos la plataforma mas estable y rapida para volver a vender
            online hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-red-200"
            >
              <Link href="/plan-gratis">
                <Rocket className="w-5 h-5 mr-2" />
                RESCATAR MI NEGOCIO AHORA
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl bg-transparent"
            >
              <Link href="/plan-migrar">
                Ver plan de migracion
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Por que elegir Tol.ar */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            {"Por que elegir Tol.ar como tu nueva plataforma eCommerce?"}
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
            Sabemos que empezar de cero es dificil, por eso disenamos un sistema
            donde el protagonista es tu marca, no el marketplace.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: CreditCard,
                title: "Sin Comisiones por Venta",
                desc: "A diferencia de otras plataformas, en Tol.ar tus ganancias son 100% tuyas.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Globe,
                title: "Dominio Propio y Profesional",
                desc: "Olvidate de los subdominios largos. Tene tu propia identidad (tuempresa.com.ar).",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Upload,
                title: "Carga Masiva de Productos",
                desc: "No pierdas meses cargando uno por uno. Subi tu inventario desde Excel o CSV en segundos.",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Search,
                title: "Optimizacion SEO Automatica",
                desc: "Tu tienda nace preparada para aparecer en los primeros resultados de Google.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex gap-4">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativa */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Comparativa: Por que los vendedores eligen Tol.ar
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-lg">
            Tras el cierre de Mercado Shops
          </p>

          <div className="bg-background rounded-2xl shadow-sm overflow-hidden border">
            <div className="grid grid-cols-3 bg-slate-100 font-semibold text-sm">
              <div className="p-4 text-muted-foreground">Caracteristica</div>
              <div className="p-4 text-center text-red-500">Mercado Shops</div>
              <div className="p-4 text-center text-green-600">Tol.ar</div>
            </div>
            {[
              {
                feat: "Estado del servicio",
                shops: "CERRADO / Inestable",
                tolar: "Activo y en Crecimiento",
              },
              {
                feat: "Comision por venta",
                shops: "Alta (Costos ML)",
                tolar: "0% Comision",
              },
              {
                feat: "Control de marca",
                shops: "Limitado",
                tolar: "Total y Personalizable",
              },
              {
                feat: "Soporte tecnico",
                shops: "Automatizado",
                tolar: "Humano y Directo",
              },
            ].map((row, i) => (
              <div
                key={row.feat}
                className={`grid grid-cols-3 text-sm ${
                  i % 2 === 0 ? "" : "bg-slate-50"
                }`}
              >
                <div className="p-4 font-medium text-foreground">
                  {row.feat}
                </div>
                <div className="p-4 text-center text-red-500 flex items-center justify-center gap-1">
                  <X className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{row.shops}</span>
                </div>
                <div className="p-4 text-center text-green-600 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{row.tolar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pasos */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Migracion Rapida: De la nada a tu Tienda Online en 3 pasos
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
            Si te quedaste sin fotos ni precios, nuestro sistema te ayuda a
            reconstruir tu catalogo con herramientas de Inteligencia Artificial.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Registrate en Tol.ar",
                desc: "Crea tu cuenta en menos de un minuto.",
                icon: Sparkles,
              },
              {
                step: "2",
                title: "Carga tu Stock",
                desc: "Usa nuestro importador inteligente para subir tus productos.",
                icon: Upload,
              },
              {
                step: "3",
                title: "Activa y Vende",
                desc: "Conecta tus metodos de pago (Mercado Pago, transferencia) y envios.",
                icon: Rocket,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Construi tu comunidad */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Shield className="w-12 h-12 mx-auto mb-6 text-green-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            No regales tus clientes, construi tu propia comunidad
          </h2>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed">
            El error de las plataformas cerradas es que los clientes no son
            tuyos, son de ellos. En Tol.ar, vos sos el dueno de la base de
            datos de tus clientes, de tu diseno y de tu futuro comercial.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-10 py-6 rounded-xl shadow-lg"
          >
            <Link href="/plan-gratis">
              <Rocket className="w-5 h-5 mr-2" />
              EMPEZAR MI TIENDA GRATIS
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-red-50 to-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            No esperes a perder mas clientes
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Cada dia sin tienda es un dia de ventas perdidas. Crea tu tienda en
            Tol.ar en menos de 2 minutos y empeza a recuperar tu negocio hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-red-200"
            >
              <Link href="/plan-gratis">
                RESCATAR MI NEGOCIO AHORA
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Sin tarjeta de credito. Sin compromisos. 100% gratis para empezar.
          </p>
        </div>
      </section>
    </>
  )
}

/* ========================================
   TAB: TIENDANUBE
   ======================================== */
function TiendanubeContent() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Alternativa mas economica y simple
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground text-balance leading-tight">
            {"Cansado de las comisiones de Tiendanube? Proba Tol.ar"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Tol.ar es la alternativa argentina a Tiendanube pensada para
            emprendedores que quieren vender online sin pagar comisiones por
            venta ni mensualidades caras. Tu tienda profesional, lista en 2
            minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-200"
            >
              <Link href="/plan-gratis">
                <Rocket className="w-5 h-5 mr-2" />
                CREAR MI TIENDA GRATIS
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl bg-transparent"
            >
              <Link href="/comparar/tiendanube">
                Ver comparativa completa
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            {"Por que emprendedores migran de Tiendanube a Tol.ar?"}
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
            Menos costos, mas control, la misma (o mejor) funcionalidad.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: CreditCard,
                title: "0% Comision por Venta",
                desc: "Tiendanube cobra comisiones en todos sus planes. En Tol.ar, tus ganancias son 100% tuyas.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Globe,
                title: "Dominio Gratis Incluido",
                desc: "Tu dominio .tol.ar gratis, o conecta tu .com.ar sin costo adicional.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: LifeBuoy,
                title: "Soporte Humano y Directo",
                desc: "Nada de bots ni tickets eternos. Te respondemos personalmente por WhatsApp.",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Truck,
                title: "Envios con Andreani",
                desc: "Cotizacion automatica integrada, igual que en Tiendanube pero sin costos extras.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex gap-4">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativa precios */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
            Comparativa de precios
          </h2>

          <div className="bg-background rounded-2xl shadow-sm overflow-hidden border">
            <div className="grid grid-cols-3 bg-slate-100 font-semibold text-sm">
              <div className="p-4 text-muted-foreground">Plan</div>
              <div className="p-4 text-center text-blue-500">Tiendanube</div>
              <div className="p-4 text-center text-green-600">Tol.ar</div>
            </div>
            {[
              {
                plan: "Plan basico",
                tn: "~$15.000/mes",
                tolar: "Gratis (20 productos)",
              },
              {
                plan: "Plan intermedio",
                tn: "~$30.000/mes",
                tolar: "Cositas (pagas lo que usas)",
              },
              {
                plan: "Plan avanzado",
                tn: "~$60.000/mes + comision",
                tolar: "Socio (10% por venta, sin mensualidad)",
              },
              {
                plan: "Plan premium",
                tn: "Consultar",
                tolar: "A medida",
              },
            ].map((row, i) => (
              <div
                key={row.plan}
                className={`grid grid-cols-3 text-sm ${
                  i % 2 === 0 ? "" : "bg-slate-50"
                }`}
              >
                <div className="p-4 font-medium text-foreground">
                  {row.plan}
                </div>
                <div className="p-4 text-center text-muted-foreground">
                  {row.tn}
                </div>
                <div className="p-4 text-center text-green-600 font-medium">
                  {row.tolar}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hace el cambio hoy. Sin riesgos.
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crea tu tienda gratis en Tol.ar, proba todo lo que necesitas, y
            cuando estes listo migra tu catalogo completo. Sin tarjeta, sin
            compromisos.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-10 py-6 rounded-xl shadow-lg"
          >
            <Link href="/plan-gratis">
              <Rocket className="w-5 h-5 mr-2" />
              CREAR MI TIENDA GRATIS
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
