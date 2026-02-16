"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import {
  Video,
  Calendar,
  MessageSquare,
  FileText,
  Rocket,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Users,
  Palette,
  Code,
  ShoppingBag,
  Headphones,
} from "lucide-react"

const PROCESS_STEPS = [
  {
    icon: Calendar,
    title: "1. Agendá tu cita",
    description: "Elegí el día y horario que te quede cómodo para la videollamada.",
  },
  {
    icon: Video,
    title: "2. Videoconferencia",
    description: "Nos conectamos por Meet o Zoom y charlamos sobre tu proyecto.",
  },
  {
    icon: MessageSquare,
    title: "3. Diagnóstico",
    description: "Entendemos qué necesitás y te asesoramos sobre las mejores opciones.",
  },
  {
    icon: FileText,
    title: "4. Propuesta",
    description: "Te enviamos un presupuesto detallado según la complejidad del trabajo.",
  },
  {
    icon: Rocket,
    title: "5. Desarrollo",
    description: "Una vez aprobado, comenzamos a construir tu solución a medida.",
  },
]

const SERVICES = [
  {
    icon: Palette,
    title: "Tienda a tu medida",
    description: "Diseño unico que refleja tu marca y tu estilo",
  },
  {
    icon: Code,
    title: "SEO profesional",
    description: "Nosotros optimizamos tu tienda para que aparezca en Google",
  },
  {
    icon: ShoppingBag,
    title: "Asesoramiento completo",
    description: "Te guiamos en todo: productos, precios, fotos, marketing",
  },
  {
    icon: Users,
    title: "Configuracion total",
    description: "Armamos tu tienda, cargamos productos, configuramos todo",
  },
  {
    icon: Headphones,
    title: "Soporte VIP",
    description: "Atencion prioritaria cuando lo necesites",
  },
]

const AVAILABLE_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

export default function PlanAMedidaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    date: "",
    time: "",
    platform: "meet",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  // Generar fechas disponibles (próximos 14 días hábiles)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    let count = 0

    while (dates.length < 14) {
      const date = new Date(today)
      date.setDate(today.getDate() + count)
      const day = date.getDay()

      // Solo días hábiles (lunes a viernes)
      if (day !== 0 && day !== 6) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
        })
      }
      count++
    }

    return dates
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-10 pb-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Cita agendada!</h2>
              <p className="text-muted-foreground mb-2">
                Te enviamos un email de confirmación a <strong>{formData.email}</strong>
              </p>
              <p className="text-muted-foreground mb-6">
                Nos vemos el{" "}
                <strong>
                  {new Date(formData.date).toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </strong>{" "}
                a las <strong>{formData.time}hs</strong> por {formData.platform === "meet" ? "Google Meet" : "Zoom"}.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Recibirás el link de la videollamada por email 1 hora antes de la reunión.
              </p>
              <Link href="/">
                <Button>Volver al inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Video className="w-4 h-4" />
            Atención personalizada
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Plan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Personalizado
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Nuestro equipo te arma la tienda, optimiza tu SEO y te asesora para que vendas mas.
          </p>
          <p className="text-lg text-purple-600 font-medium">Tienda a medida + SEO + Asesoramiento completo</p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 w-8 h-0.5 bg-purple-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué podemos hacer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Qué podemos hacer por vos?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Estos son algunos ejemplos de lo que podemos desarrollar. Si tenés otra idea, contanos en la reunión.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SERVICES.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de cita */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Agendá tu videollamada
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Elegí el día y horario que te quede mejor. La reunión dura aproximadamente 30 minutos.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos personales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        placeholder="Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa / Negocio</Label>
                      <Input
                        id="company"
                        placeholder="Mi Tienda"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                      <Input
                        id="phone"
                        placeholder="11 1234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Fecha y hora */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Select
                        value={formData.date}
                        onValueChange={(value) => setFormData({ ...formData, date: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Elegí un día" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableDates().map((date) => (
                            <SelectItem key={date.value} value={date.value}>
                              {date.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horario *</Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Elegí un horario" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_TIMES.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}hs
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Plataforma</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meet">Google Meet</SelectItem>
                          <SelectItem value="zoom">Zoom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Contanos brevemente qué necesitás</Label>
                    <Textarea
                      id="description"
                      placeholder="Ej: Tengo una tienda de ropa y necesito integrar mi sistema de stock..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <p>La videollamada dura aproximadamente 30 minutos. Recibirás el link por email 1 hora antes.</p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.date ||
                      !formData.time
                    }
                  >
                    {isSubmitting ? (
                      "Agendando..."
                    ) : (
                      <>
                        <Video className="w-5 h-5 mr-2" />
                        Agendar videollamada
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas frecuentes</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿La consulta tiene costo?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No, la videollamada inicial es totalmente gratuita y sin compromiso. Solo te pasamos presupuesto si
                  decidís avanzar.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cuánto cuesta un desarrollo a medida?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Depende de la complejidad. Puede ir desde $20.000 para algo simple hasta $200.000+ para proyectos
                  grandes. En la reunión te damos un presupuesto exacto.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cuánto tiempo tarda el desarrollo?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Depende del proyecto. Algo simple puede estar listo en 1 semana, mientras que proyectos más complejos
                  pueden llevar 1-2 meses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Puedo combinar con Plan Cositas o Plan Socio?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, podés tener tu tienda con cualquier plan y además contratar desarrollos a medida específicos.
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
