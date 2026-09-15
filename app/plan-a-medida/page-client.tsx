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
import { EditableText, usePageContent } from "@/components/editable-text"
import { Video, Calendar, MessageSquare, FileText, Rocket, CheckCircle2, Clock, Users, Palette, Code, ShoppingBag, Headphones } from "lucide-react"

const PROCESS_STEPS = [
  { icon: Calendar,      key:"paso1", title:"1. Agendá tu cita",    desc:"Elegí el día y horario que te quede cómodo para la videollamada." },
  { icon: Video,         key:"paso2", title:"2. Videoconferencia",  desc:"Nos conectamos por Meet o Zoom y charlamos sobre tu proyecto." },
  { icon: MessageSquare, key:"paso3", title:"3. Diagnóstico",       desc:"Entendemos qué necesitás y te asesoramos sobre las mejores opciones." },
  { icon: FileText,      key:"paso4", title:"4. Propuesta",         desc:"Te enviamos un presupuesto detallado según la complejidad del trabajo." },
  { icon: Rocket,        key:"paso5", title:"5. Desarrollo",        desc:"Una vez aprobado, comenzamos a construir tu solución a medida." },
]

const SERVICES = [
  { icon: Palette,     key:"serv1", title:"Tienda a tu medida",      desc:"Diseño unico que refleja tu marca y tu estilo" },
  { icon: Code,        key:"serv2", title:"SEO profesional",         desc:"Nosotros optimizamos tu tienda para que aparezca en Google" },
  { icon: ShoppingBag, key:"serv3", title:"Asesoramiento completo",  desc:"Te guiamos en todo: productos, precios, fotos, marketing" },
  { icon: Users,       key:"serv4", title:"Configuracion total",     desc:"Armamos tu tienda, cargamos productos, configuramos todo" },
  { icon: Headphones,  key:"serv5", title:"Soporte VIP",             desc:"Atencion prioritaria cuando lo necesites" },
]

const AVAILABLE_TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"]

const FAQS = [
  { pk:"faq1_p", pd:"¿La consulta tiene costo?", rk:"faq1_r", rd:"No, la videollamada inicial es totalmente gratuita y sin compromiso. Solo te pasamos presupuesto si decidís avanzar." },
  { pk:"faq2_p", pd:"¿Cuánto cuesta un desarrollo a medida?", rk:"faq2_r", rd:"Depende de la complejidad. Puede ir desde $20.000 para algo simple hasta $200.000+ para proyectos grandes." },
  { pk:"faq3_p", pd:"¿Cuánto tiempo tarda el desarrollo?", rk:"faq3_r", rd:"Depende del proyecto. Algo simple puede estar listo en 1 semana, proyectos más complejos pueden llevar 1-2 meses." },
  { pk:"faq4_p", pd:"¿Puedo combinar con Plan Cositas o Plan Socio?", rk:"faq4_r", rd:"Sí, podés tener tu tienda con cualquier plan y además contratar desarrollos a medida específicos." },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanAMedidaClient({ brand = "tol" }: Props) {
  const [formData, setFormData] = useState({ name:"", email:"", phone:"", company:"", date:"", time:"", platform:"meet", description:"" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { isAdmin, get } = usePageContent("plan-a-medida")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-a-medida" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#9333ea" />
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    let count = 0
    while (dates.length < 14) {
      const date = new Date(today)
      date.setDate(today.getDate() + count)
      const day = date.getDay()
      if (day !== 0 && day !== 6) {
        dates.push({ value: date.toISOString().split("T")[0], label: date.toLocaleDateString("es-AR", { weekday:"long", day:"numeric", month:"long" }) })
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
              <p className="text-muted-foreground mb-6">Nos vemos el <strong>{new Date(formData.date).toLocaleDateString("es-AR", { weekday:"long", day:"numeric", month:"long" })}</strong> a las <strong>{formData.time}hs</strong>.</p>
              <Link href="/"><Button>Volver al inicio</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #6b21a8, #9333ea)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Video className="w-4 h-4" />
            {ET("hero_badge", "Atención personalizada")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {ET("hero_titulo", "Plan Personalizado", "span", "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            {ET("hero_subtitulo", "Nuestro equipo te arma la tienda, optimiza tu SEO y te asesora para que vendas mas.")}
          </p>
          <p className="text-lg text-purple-600 font-medium">{ET("hero_tag", "Tienda a medida + SEO + Asesoramiento completo")}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("pasos_titulo", "¿Cómo funciona?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.key} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">{ET(`${step.key}_titulo`, step.title)}</h3>
                <p className="text-sm text-muted-foreground">{ET(`${step.key}_desc`, step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("servicios_titulo", "¿Qué podemos hacer por vos?")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{ET("servicios_subtitulo", "Estos son algunos ejemplos de lo que podemos desarrollar.")}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SERVICES.map((s) => (
              <Card key={s.key} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{ET(`${s.key}_titulo`, s.title)}</h3>
                  <p className="text-sm text-muted-foreground">{ET(`${s.key}_desc`, s.desc)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {ET("form_titulo", "Agendá tu videollamada")}
                </CardTitle>
                <CardDescription className="text-purple-100">{ET("form_subtitulo", "Elegí el día y horario que te quede mejor. La reunión dura aproximadamente 30 minutos.")}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nombre completo *</Label><Input placeholder="Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} required /></div>
                    <div className="space-y-2"><Label>Empresa / Negocio</Label><Input placeholder="Mi Tienda" value={formData.company} onChange={e => setFormData({...formData, company:e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="juan@email.com" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} required /></div>
                    <div className="space-y-2"><Label>Teléfono / WhatsApp *</Label><Input placeholder="11 1234-5678" value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} required /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha *</Label>
                      <Select value={formData.date} onValueChange={v => setFormData({...formData, date:v})}>
                        <SelectTrigger><SelectValue placeholder="Elegí un día" /></SelectTrigger>
                        <SelectContent>{getAvailableDates().map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Horario *</Label>
                      <Select value={formData.time} onValueChange={v => setFormData({...formData, time:v})}>
                        <SelectTrigger><SelectValue placeholder="Elegí un horario" /></SelectTrigger>
                        <SelectContent>{AVAILABLE_TIMES.map(t => <SelectItem key={t} value={t}>{t}hs</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Plataforma</Label>
                      <Select value={formData.platform} onValueChange={v => setFormData({...formData, platform:v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="meet">Google Meet</SelectItem><SelectItem value="zoom">Zoom</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contanos brevemente qué necesitás</Label>
                    <Textarea placeholder="Ej: Tengo una tienda de ropa y necesito integrar mi sistema de stock..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description:e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <p>{ET("form_nota", "La videollamada dura aproximadamente 30 minutos. Recibirás el link por email 1 hora antes.")}</p>
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.date || !formData.time}>
                    <Video className="w-5 h-5 mr-2" />
                    {ET("form_boton", isSubmitting ? "Agendando..." : "Agendar videollamada")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("faq_titulo", "Preguntas frecuentes")}</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {FAQS.map(({pk,pd,rk,rd}) => (
              <Card key={pk}>
                <CardHeader><CardTitle className="text-lg">{ET(pk, pd)}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{ET(rk, rd)}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
