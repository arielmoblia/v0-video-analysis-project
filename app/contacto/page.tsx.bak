"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, Send, CheckCircle2, MessageSquare, Video, Bot, 
  HelpCircle, Settings, CreditCard, ExternalLink, Calendar, Phone
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

// FAQ Tecnicas
const FAQ_TECNICAS = [
  {
    question: "Porque no puedo entrar a mi administrador?",
    answer: "Tene mucho cuidado cuando copies y pegues tu usuario y contraseña de no poner espacios adelante o atras. Si copias con espacios extra, no te va a dejar entrar. Borra los espacios y proba de nuevo."
  },
  {
    question: "Como subo productos a mi tienda?",
    answer: "Anda a Productos > Agregar producto. Subi las fotos, completa nombre, descripcion y precio. Si tenes variantes (talles, colores), agregalas en la seccion de variantes. Guarda y listo!"
  },
  {
    question: "Como configuro MercadoPago en mi tienda?",
    answer: "Anda a tu panel de administracion > Configuracion > Pagos. Hace click en 'Conectar MercadoPago' y segui los pasos. Solo necesitas tu cuenta de MercadoPago y listo, ya podes recibir pagos."
  },
  {
    question: "Como configuro los envios con Andreani?",
    answer: "En tu panel de administracion > Configuracion > Envios, activa Andreani. Completa tu direccion de origen y listo. El sistema calcula automaticamente el costo segun el destino del cliente."
  },
  {
    question: "Como veo mis estadisticas de ventas?",
    answer: "En tu panel de administracion tenes la seccion Analytics donde ves ventas, visitas, productos mas vendidos y mas. Con Plan Cositas podes agregar estadisticas avanzadas."
  },
  {
    question: "Puedo tener mi propio dominio?",
    answer: "Si! Con el Plan Cositas podes agregar tu dominio propio (tutienda.com). Nosotros te ayudamos con la configuracion. Tu tienda tambien funciona gratis con tutienda.tol.ar"
  },
]

// FAQ Comerciales
const FAQ_COMERCIALES = [
  {
    question: "Cuanto cuesta crear una tienda?",
    answer: "Crear tu tienda es GRATIS con el Plan Gratis (hasta 20 productos). Si necesitas mas, tenes Plan Cositas donde pagas solo lo que usas, Plan Socio (10% por venta sin mensualidad), o Plan Personalizado con asesoramiento completo."
  },
  {
    question: "Que incluye el Plan Gratis?",
    answer: "El Plan Gratis incluye: tienda online completa, hasta 20 productos, pagos con MercadoPago, envios configurables, diseño profesional, panel de administracion y tu direccion tutienda.tol.ar"
  },
  {
    question: "Como funciona el Plan Socio?",
    answer: "Con el Plan Socio pagas 10% solo cuando vendes. Sin mensualidad. Nosotros invertimos en publicidad para traerte clientes. Incluye todo: productos ilimitados, todas las funciones, soporte prioritario."
  },
  {
    question: "Puedo cambiar de plan?",
    answer: "Si, podes cambiar de plan en cualquier momento desde tu panel de administracion. Si subis de plan se aplica inmediatamente. Si bajas, se aplica en el proximo ciclo de facturacion."
  },
  {
    question: "Como recibo el dinero de mis ventas?",
    answer: "El dinero va directo a tu cuenta de MercadoPago. Nosotros nunca tocamos tu plata. Podes transferirlo a tu banco cuando quieras desde MercadoPago."
  },
  {
    question: "Tienen soporte en español?",
    answer: "Si! Somos un equipo argentino y todo nuestro soporte es en español. Tenes chat con Tomi (AI), WhatsApp, email y videollamada para Plan Personalizado."
  },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    tipo: "tecnico"
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  // Form para videollamada
  const [videoFormData, setVideoFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [videoSending, setVideoSending] = useState(false)
  const [videoSent, setVideoSent] = useState(false)

  // Form para el capo
  const [capoFormData, setCapoFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [capoSending, setCapoSending] = useState(false)
  const [capoSent, setCapoSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const response = await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: `[${formData.tipo.toUpperCase()}] ${formData.subject}`
        }),
      })

      if (response.ok) {
        setSent(true)
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", tipo: "tecnico" })
      } else {
        setError("Error al enviar el mensaje. Intenta de nuevo.")
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.")
    } finally {
      setSending(false)
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoSending(true)

    try {
      const response = await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...videoFormData,
          subject: "[VIDEOLLAMADA] Solicitud de reunion"
        }),
      })

      if (response.ok) {
        setVideoSent(true)
        setVideoFormData({ name: "", email: "", message: "" })
      }
    } catch {
      // Error silencioso
    } finally {
      setVideoSending(false)
    }
  }

  const handleCapoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCapoSending(true)

    try {
      const response = await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...capoFormData,
          subject: "[EL CAPO] Mensaje directo"
        }),
      })

      if (response.ok) {
        setCapoSent(true)
        setCapoFormData({ name: "", email: "", message: "" })
      }
    } catch {
      // Error silencioso
    } finally {
      setCapoSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO - Verde */}
      <section className="bg-emerald-500 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Contactanos
          </h1>
          <p className="text-xl text-white/90">
            No te dejamos solo. Elegí como prefieras comunicarte y te ayudamos.
          </p>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES - Gris */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Preguntas Frecuentes</h2>
            <p className="text-gray-600">El 90% de las consultas se resuelven aca en 2 minutos</p>
          </div>

          <Tabs defaultValue="tecnicas" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="tecnicas" className="gap-2">
                <Settings className="w-4 h-4" />
                Tecnicas
              </TabsTrigger>
              <TabsTrigger value="comerciales" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Comerciales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tecnicas">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ_TECNICAS.slice(0, 3).map((faq, i) => (
                      <AccordionItem key={i} value={`tecnica-${i}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ_TECNICAS.slice(3).map((faq, i) => (
                      <AccordionItem key={i} value={`tecnica-2-${i}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comerciales">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ_COMERCIALES.slice(0, 3).map((faq, i) => (
                      <AccordionItem key={i} value={`comercial-${i}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ_COMERCIALES.slice(3).map((faq, i) => (
                      <AccordionItem key={i} value={`comercial-2-${i}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CHAT CON AI - Verde */}
      <section className="bg-green-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10 text-white" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Chat con nuestra AI</h2>
          </div>
          <p className="text-white/90 mb-8">
            El 90% de las preguntas se las sabe y contesta al instante
          </p>
          
          {/* Chat preview box */}
          <div className="bg-white rounded-lg shadow-xl max-w-2xl mx-auto overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
              <Bot className="w-5 h-5 text-green-500" />
              <span className="font-medium text-sm">Asistente AI de TOL.AR</span>
              <span className="ml-auto text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                En linea
              </span>
            </div>
            <div className="p-4 space-y-3 text-left">
              <div className="flex gap-2">
                <Bot className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  Hola! Soy el asistente AI de TOL.AR. Te puedo ayudar con consultas sobre tu tienda, configuracion, pagos, envios y mas. En que te puedo ayudar?
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Hace click en el <span className="inline-flex items-center gap-1 text-green-600 font-medium"><MessageSquare className="w-4 h-4" /> boton verde</span> de abajo a la derecha para chatear
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm mt-6">
            <CheckCircle2 className="w-4 h-4" />
            Respuesta inmediata 24/7
          </div>
        </div>
      </section>

      {/* FORMULARIO DE CONSULTA - Blanco */}
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Formulario de Consulta</h2>
            <p className="text-gray-600">
              Si no encontraste la respuesta, te respondemos por mail en menos de 24hs
            </p>
          </div>

          {sent ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Mensaje enviado!</h3>
              <p className="text-gray-600 mb-6">
                Te respondemos por email en menos de 24 horas.
              </p>
              <Button onClick={() => setSent(false)}>Enviar otra consulta</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de consulta */}
              <Tabs value={formData.tipo} onValueChange={(v) => setFormData({...formData, tipo: v})} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="tecnico" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Consulta Tecnica
                  </TabsTrigger>
                  <TabsTrigger value="comercial" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Consulta Comercial
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tu nombre *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Como te llamas?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp (opcional)</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Asunto *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="En que podemos ayudarte?"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tu consulta *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Contanos en detalle tu consulta..."
                  rows={4}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                {sending ? "Enviando..." : "Enviar consulta"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* WHATSAPP CON ASISTENTE - Rosa/Rojo */}
      <section className="bg-rose-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <MessageSquare className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">WhatsApp con Asistente</h2>
            <p className="text-white/90">
              Podes escribirnos y un asistente te contesta automaticamente 24/7
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-6">Asistente Humano</h3>
            
            <a 
              href="https://wa.me/18804837710?text=Hola!%20Necesito%20ayuda%20con%20mi%20tienda" 
              target="_blank" 
              rel="noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Abrir WhatsApp
                <ExternalLink className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* VIDEO LLAMADA CON ASISTENTE - Cyan */}
      <section className="bg-cyan-400 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <Video className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Video Llamada con Asistente</h2>
            <p className="text-white/90">
              Podes tener una reunion en video llamada. Solo para consultas complejas o planes personalizados (US$35 x 30 min).
            </p>
          </div>

          {videoSent ? (
            <div className="text-center py-8 bg-white/20 backdrop-blur rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Solicitud enviada!</h3>
              <p className="text-white/90">Te contactamos para coordinar la videollamada.</p>
            </div>
          ) : (
            <form onSubmit={handleVideoSubmit} className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <Input
                  value={videoFormData.name}
                  onChange={(e) => setVideoFormData({ ...videoFormData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={videoFormData.email}
                  onChange={(e) => setVideoFormData({ ...videoFormData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensaje</label>
                <Textarea
                  value={videoFormData.message}
                  onChange={(e) => setVideoFormData({ ...videoFormData, message: e.target.value })}
                  placeholder="Contanos brevemente que necesitas..."
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" disabled={videoSending} className="w-full bg-cyan-600 hover:bg-cyan-700">
                {videoSending ? "Enviando..." : "Solicitar videollamada"}
                <Calendar className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* COMUNICARSE CON EL CAPO - Amarillo/Negro */}
      <section className="bg-yellow-400 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-2">
              Comunicarse con &quot;el capo&quot;
            </h2>
            <p className="text-black/80">
              Generalmente este &quot;capo&quot; del proyecto esta de viaje pero cuando tiene tiempo lee este mensaje. No esperes respuesta.
            </p>
          </div>

          {capoSent ? (
            <div className="text-center py-8 bg-black/10 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">Mensaje enviado!</h3>
              <p className="text-black/80">El capo lo va a leer cuando pueda (o no).</p>
            </div>
          ) : (
            <form onSubmit={handleCapoSubmit} className="bg-black rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Nombre</label>
                <Input
                  value={capoFormData.name}
                  onChange={(e) => setCapoFormData({ ...capoFormData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <Input
                  type="email"
                  value={capoFormData.email}
                  onChange={(e) => setCapoFormData({ ...capoFormData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Mensaje</label>
                <Textarea
                  value={capoFormData.message}
                  onChange={(e) => setCapoFormData({ ...capoFormData, message: e.target.value })}
                  placeholder="Tu mensaje para el capo..."
                  rows={3}
                  required
                  className="bg-white"
                />
              </div>
              <Button type="submit" disabled={capoSending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                {capoSending ? "Enviando..." : "Enviar al capo"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Franja de colores */}
      <div className="flex h-3">
        <div className="flex-1 bg-fuchsia-500" />
        <div className="flex-1 bg-cyan-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-black" />
      </div>

      <Footer />
    </div>
  )
}
