"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import {
  Check,
  TrendingUp,
  Megaphone,
  Handshake,
  ArrowRight,
  BarChart3,
  Video,
  MessageSquare,
  Globe,
  Package,
  Headphones,
  EyeOff,
  Calculator,
  Send,
} from "lucide-react"

const TODAS_LAS_COSITAS = [
  { icon: BarChart3, name: "Estadísticas de visitas" },
  { icon: Video, name: "Video en portada" },
  { icon: MessageSquare, name: "Chat con IA" },
  { icon: EyeOff, name: "Sin marca tol.ar" },
  { icon: Globe, name: "Dominio propio" },
  { icon: Package, name: "Productos ilimitados" },
  { icon: Headphones, name: "Soporte prioritario" },
]

export default function PlanSocioPage() {
  const [ventasMensuales, setVentasMensuales] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    tienda: "",
    email: "",
    telefono: "",
    mensaje: "",
  })
  const [enviado, setEnviado] = useState(false)

  const calcularComision = () => {
    const ventas = Number.parseFloat(ventasMensuales) || 0
    return ventas * 0.1
  }

  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    
    try {
      const response = await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          phone: formData.telefono,
          subject: `Quiero ser SOCIO - ${formData.tienda}`,
          message: `Tienda: ${formData.tienda}\nWhatsApp: ${formData.telefono}\n\nSobre el negocio:\n${formData.mensaje}`,
        }),
      })

      if (response.ok) {
        setEnviado(true)
      } else {
        alert("Error al enviar. Intentá de nuevo.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al enviar. Intentá de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            Crecemos juntos
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Plan <span className="text-amber-600">Socio</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            No pagás mensualidad. Solo compartís el <span className="font-bold text-amber-600">10% de tus ventas</span>.
            Nosotros invertimos en publicidad para que vendas más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
              <a href="#aplicar">
                Quiero ser socio
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">¿Cómo funciona?</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <CardTitle>Vos vendés</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Tu tienda funciona con todas las funcionalidades premium incluidas. Vos te enfocás en tus productos y
                clientes.
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <CardTitle>Nosotros invertimos</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Invertimos en publicidad (Google Ads, Meta Ads, etc.) para que tu tienda reciba más visitas y más
                clientes.
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <CardTitle>Compartimos el éxito</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Solo pagás el 10% de lo que vendés. Si no vendés, no pagás nada. Crecemos juntos.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Todo incluido</h2>
          <p className="text-center text-muted-foreground mb-12">
            Como socio tenés TODAS las cositas incluidas sin costo adicional
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {TODAS_LAS_COSITAS.map((cosita) => (
              <div
                key={cosita.name}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <cosita.icon className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium">{cosita.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 p-4 bg-amber-600 text-white rounded-lg">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">+ Publicidad paga</span>
            </div>
          </div>

          {/* Comparación */}
          <Card className="border-2 border-amber-300">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    Ventajas del Plan Socio
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>No pagás nada si no vendés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Publicidad profesional sin que vos tengas que saber de marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Todas las funcionalidades premium incluidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Nosotros ponemos la plata de la publicidad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Soporte personalizado para hacer crecer tu negocio</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-600" />
                    Calculá tu comisión
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ventas">Tus ventas mensuales estimadas</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="ventas"
                          type="number"
                          placeholder="100000"
                          className="pl-8"
                          value={ventasMensuales}
                          onChange={(e) => setVentasMensuales(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Comisión (10%)</span>
                        <span className="text-2xl font-bold text-amber-600">
                          ${calcularComision().toLocaleString("es-AR")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Solo pagás si vendés. Si vendés $0, pagás $0.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas frecuentes</h2>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="font-bold mb-2">¿Cómo saben cuánto vendí?</h3>
              <p className="text-muted-foreground">
                Todos los pedidos pasan por la plataforma, así que sabemos exactamente cuánto vendiste. Es 100%
                transparente.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-bold mb-2">¿Cuándo tengo que pagar?</h3>
              <p className="text-muted-foreground">
                La comisión se cobra mensualmente. Sumamos todas tus ventas del mes y cobramos el 10% en los primeros
                días del mes siguiente.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-bold mb-2">¿Cuánto invierten en publicidad para mi tienda?</h3>
              <p className="text-muted-foreground">
                Depende del rubro y la competencia. Arrancamos con un presupuesto base y lo vamos ajustando según los
                resultados. Nuestro objetivo es que vendas más.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-bold mb-2">¿Puedo cancelar cuando quiera?</h3>
              <p className="text-muted-foreground">
                Sí, podés cancelar el Plan Socio cuando quieras. Tu tienda sigue funcionando pero volvés al plan gratis
                (sin las cositas premium ni la publicidad).
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-bold mb-2">¿Cualquiera puede ser socio?</h3>
              <p className="text-muted-foreground">
                Evaluamos cada caso. Buscamos tiendas con productos de calidad y potencial de crecimiento. Completá el
                formulario y te contactamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="aplicar" className="py-20 px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Quiero ser socio</h2>
          <p className="text-center text-muted-foreground mb-8">
            Completá el formulario y nos ponemos en contacto para conocer tu negocio
          </p>

          {enviado ? (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Solicitud enviada!</h3>
                <p className="text-muted-foreground">
                  Recibimos tu solicitud. Te contactamos en las próximas 48 horas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Tu nombre</Label>
                      <Input
                        id="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tienda">Nombre de tu tienda</Label>
                      <Input
                        id="tienda"
                        required
                        value={formData.tienda}
                        onChange={(e) => setFormData({ ...formData, tienda: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">WhatsApp</Label>
                      <Input
                        id="telefono"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mensaje">Contanos sobre tu negocio</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="¿Qué vendés? ¿Hace cuánto estás en el rubro? ¿Tenés tienda física?"
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" size="lg" disabled={enviando}>
                    <Send className="w-4 h-4 mr-2" />
                    {enviando ? "Enviando..." : "Enviar solicitud"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
