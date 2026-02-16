"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  ArrowRight,
  Upload,
  Wand2,
  Package,
  ImageIcon,
  Clock,
  DollarSign,
  HeadphonesIcon,
  AlertTriangle,
  Zap,
  Shield,
  TrendingDown,
  RefreshCw,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const COMPARACION = [
  {
    feature: "Costo mensual",
    tiendanube: "Gratis a $220.000/mes",
    empretienda: "$6.990/mes",
    webmaster: "$50.000+ por única vez",
    tolar: "GRATIS (plan básico)",
  },
  {
    feature: "Comisión por venta",
    tiendanube: "0,7% a 2% por transacción",
    empretienda: "0% comisión",
    webmaster: "0% comisión",
    tolar: "0% comisión",
  },
  {
    feature: "Diseño personalizado",
    tiendanube: "Templates limitados",
    empretienda: "Templates básicos",
    webmaster: "A medida (costoso)",
    tolar: "Diseño con IA (copiá cualquier sitio)",
  },
  {
    feature: "Soporte",
    tiendanube: "Chat y tickets",
    empretienda: "Email y tickets",
    webmaster: "Depende del profesional",
    tolar: "WhatsApp directo",
  },
  {
    feature: "Facilidad de uso",
    tiendanube: "Complejo, muchas opciones",
    empretienda: "Intermedio",
    webmaster: "Dependés del webmaster",
    tolar: "Simple, lo esencial",
  },
  {
    feature: "Migración",
    tiendanube: "—",
    empretienda: "—",
    webmaster: "Cobrá por hora",
    tolar: "Te migramos TODO gratis",
  },
]

const PASOS = [
  {
    step: 1,
    title: "Exportás tus productos",
    description: "Desde Tiendanube, exportás tu catálogo en CSV. Es un click.",
    icon: Upload,
  },
  {
    step: 2,
    title: "Nos pasás el archivo",
    description: "Nos enviás el CSV y la URL de tu tienda actual.",
    icon: Package,
  },
  {
    step: 3,
    title: "Clonamos el diseño con IA",
    description: "Nuestra IA copia los colores y estilo de tu tienda actual.",
    icon: Wand2,
  },
  {
    step: 4,
    title: "Importamos todo",
    description: "Productos, categorías, imágenes. Todo migrado.",
    icon: ImageIcon,
  },
  {
    step: 5,
    title: "Tu tienda lista",
    description: "En 24-48hs tenés tu tienda funcionando en tol.ar",
    icon: Zap,
  },
]

const TESTIMONIOS = [
  {
    name: "María L.",
    business: "Tienda de ropa",
    text: "Estaba pagando $20.000/mes en Tiendanube y era un lío configurar todo. En tol.ar migré gratis y ahorro un montón.",
  },
  {
    name: "Carlos R.",
    business: "Accesorios",
    text: "Me daba miedo migrar y perder todo. El equipo de tol.ar me pasó todo en un día. Increíble.",
  },
]

export default function PlanMigrarPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    currentStore: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: "Plan Migrar - Solicitud de migración",
        }),
      })
      setSent(true)
    } catch (error) {
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <RefreshCw className="w-3 h-3 mr-1" />
            Migración gratuita
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Escapá de tu proveedor de e-commerce
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Sabemos que es un lío. Muchas opciones, configuraciones eternas, y encima te cobran comisión por cada venta.
          </p>
          <p className="text-2xl font-semibold text-emerald-600 mb-8">
            Te migramos TODO gratis. En 24-48 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
              <a href="#formulario">
                Quiero migrar ahora
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <a href="#comparacion">Ver comparación</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Problemas de Tiendanube */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">¿Te suena familiar?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <DollarSign className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle className="text-lg">Pagás de más</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cuota mensual + comisión por venta + extras. Todo suma y no sabés cuánto vas a pagar.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <Clock className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle className="text-lg">Es muy complicado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mil opciones, menús, configuraciones. Querés vender, no ser programador.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <HeadphonesIcon className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle className="text-lg">Soporte lento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mandás un ticket y esperás días. Mientras tanto, tu tienda tiene problemas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparación */}
      <section id="comparacion" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">tol.ar vs "el resto"</h2>
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-3 font-medium italic">Característica</th>
                  <th className="text-center py-4 px-3">
                    <span className="text-emerald-600 underline">Tiendanube</span>
                  </th>
                  <th className="text-center py-4 px-3 text-muted-foreground">empretienda</th>
                  <th className="text-center py-4 px-3 text-muted-foreground">web master</th>
                  <th className="text-center py-4 px-3 text-emerald-600 font-semibold">tol.ar</th>
                </tr>
              </thead>
              <tbody>
                {COMPARACION.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-3 font-medium italic">{item.feature}</td>
                    <td className="py-4 px-3 text-center text-muted-foreground">{item.tiendanube}</td>
                    <td className="py-4 px-3 text-center text-muted-foreground">{item.empretienda}</td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{item.webmaster}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-emerald-700">{item.tolar}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pasos de migración */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Cómo es la migración?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Super simple. Nosotros hacemos todo el trabajo pesado.
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {PASOS.map((paso, index) => (
                <div key={paso.step} className="relative">
                  <Card className="h-full text-center bg-white">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <paso.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <Badge variant="outline" className="mx-auto mb-2">
                        Paso {paso.step}
                      </Badge>
                      <CardTitle className="text-base">{paso.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs">{paso.description}</CardDescription>
                    </CardContent>
                  </Card>
                  {index < PASOS.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 text-emerald-300 -translate-y-1/2 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Qué incluye la migración gratuita?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Package, title: "Todos tus productos", desc: "Nombre, descripción, precio, variantes" },
              { icon: ImageIcon, title: "Todas las imágenes", desc: "Las descargamos y subimos por vos" },
              { icon: Wand2, title: "Diseño clonado", desc: "Mismo estilo que tu tienda actual" },
              { icon: Shield, title: "Sin perder nada", desc: "Tu tienda vieja sigue online mientras migramos" },
            ].map((item, index) => (
              <Card key={index} className="text-center border-emerald-100">
                <CardHeader>
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ahorro */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <TrendingDown className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ahorrá hasta $200.000/año</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Sin cuota mensual, sin comisiones. Ese dinero queda en tu bolsillo.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-3xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-6 flex-1">
              <p className="text-sm opacity-70 mb-2">Con Tiendanube</p>
              <p className="text-4xl font-bold">~$180.000<span className="text-lg font-normal">/año</span></p>
              <p className="text-sm opacity-70 mt-1">cuota + comisiones</p>
            </div>
            <ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" />
            <div className="bg-white/20 rounded-2xl p-6 flex-1 ring-2 ring-white/50">
              <p className="text-sm opacity-70 mb-2">Con tol.ar</p>
              <p className="text-4xl font-bold">$0<span className="text-lg font-normal">/año</span></p>
              <p className="text-sm opacity-70 mt-1">plan gratis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ya migraron y están felices</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {TESTIMONIOS.map((testimonio, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonio.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">{testimonio.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonio.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonio.business}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="formulario" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Empezá tu migración gratis</h2>
              <p className="text-muted-foreground">
                Completá el formulario y te contactamos en menos de 24hs para coordinar.
              </p>
            </div>

            {sent ? (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Recibimos tu solicitud</h3>
                  <p className="text-muted-foreground">
                    Te contactamos en menos de 24hs para coordinar la migración de tu tienda.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tu nombre</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">WhatsApp</label>
                      <Input
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">URL de tu tienda actual</label>
                      <Input
                        required
                        value={formData.currentStore}
                        onChange={(e) => setFormData({ ...formData, currentStore: e.target.value })}
                        placeholder="https://mitienda.mitiendanube.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">¿Algo que quieras contarnos?</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Cantidad de productos, problemas actuales, etc."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" disabled={sending}>
                      {sending ? (
                        "Enviando..."
                      ) : (
                        <>
                          Quiero migrar gratis
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Tu tienda actual sigue funcionando mientras migramos. Sin riesgos.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
