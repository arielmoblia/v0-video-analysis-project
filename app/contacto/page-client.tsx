"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Send, CheckCircle2, MessageSquare, Video, Bot, Settings, CreditCard, ExternalLink, Calendar } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const FAQ_TECNICAS = [
  { qk:"faqt1_q", qd:"Porque no puedo entrar a mi administrador?", ak:"faqt1_a", ad:"Tene mucho cuidado cuando copies y pegues tu usuario y contraseña de no poner espacios adelante o atras." },
  { qk:"faqt2_q", qd:"Como subo productos a mi tienda?", ak:"faqt2_a", ad:"Anda a Productos > Agregar producto. Subi las fotos, completa nombre, descripcion y precio." },
  { qk:"faqt3_q", qd:"Como configuro MercadoPago en mi tienda?", ak:"faqt3_a", ad:"Anda a tu panel > Configuracion > Pagos. Hace click en Conectar MercadoPago y segui los pasos." },
  { qk:"faqt4_q", qd:"Como configuro los envios con Andreani?", ak:"faqt4_a", ad:"En tu panel > Configuracion > Envios, activa Andreani. El sistema calcula automaticamente el costo segun el destino." },
  { qk:"faqt5_q", qd:"Como veo mis estadisticas de ventas?", ak:"faqt5_a", ad:"En tu panel tenes la seccion Analytics donde ves ventas, visitas, productos mas vendidos y mas." },
  { qk:"faqt6_q", qd:"Puedo tener mi propio dominio?", ak:"faqt6_a", ad:"Si! Con el Plan Cositas podes agregar tu dominio propio. Tu tienda tambien funciona gratis con tutienda.tol.ar" },
]

const FAQ_COMERCIALES = [
  { qk:"faqc1_q", qd:"Cuanto cuesta crear una tienda?", ak:"faqc1_a", ad:"Crear tu tienda es GRATIS con el Plan Gratis (productos ilimitados)." },
  { qk:"faqc2_q", qd:"Que incluye el Plan Gratis?", ak:"faqc2_a", ad:"Tienda online completa, productos ilimitados, pagos con MercadoPago, envios configurables y diseño profesional." },
  { qk:"faqc3_q", qd:"Como funciona el Plan Socio?", ak:"faqc3_a", ad:"Con el Plan Socio pagas 10% solo cuando vendes. Sin mensualidad. Nosotros invertimos en publicidad." },
  { qk:"faqc4_q", qd:"Puedo cambiar de plan?", ak:"faqc4_a", ad:"Si, podes cambiar de plan en cualquier momento desde tu panel de administracion." },
  { qk:"faqc5_q", qd:"Como recibo el dinero de mis ventas?", ak:"faqc5_a", ad:"El dinero va directo a tu cuenta de MercadoPago. Nosotros nunca tocamos tu plata." },
  { qk:"faqc6_q", qd:"Tienen soporte en español?", ak:"faqc6_a", ad:"Si! Somos un equipo argentino y todo nuestro soporte es en español." },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({ name:"", email:"", phone:"", subject:"", message:"", tipo:"tecnico" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [videoFormData, setVideoFormData] = useState({ name:"", email:"", message:"" })
  const [videoSending, setVideoSending] = useState(false)
  const [videoSent, setVideoSent] = useState(false)
  const [capoFormData, setCapoFormData] = useState({ name:"", email:"", message:"" })
  const [capoSending, setCapoSending] = useState(false)
  const [capoSent, setCapoSent] = useState(false)
  const { isAdmin, get } = usePageContent("contacto")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="contacto" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#10b981" />
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true); setError("")
    try {
      const r = await fetch("/api/contact-tolar", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...formData, subject:`[${formData.tipo.toUpperCase()}] ${formData.subject}`}) })
      if (r.ok) { setSent(true); setFormData({ name:"", email:"", phone:"", subject:"", message:"", tipo:"tecnico" }) }
      else setError("Error al enviar el mensaje. Intenta de nuevo.")
    } catch { setError("Error de conexion. Intenta de nuevo.") }
    finally { setSending(false) }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setVideoSending(true)
    try {
      const r = await fetch("/api/contact-tolar", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...videoFormData, subject:"[VIDEOLLAMADA] Solicitud de reunion"}) })
      if (r.ok) { setVideoSent(true); setVideoFormData({ name:"", email:"", message:"" }) }
    } catch {} finally { setVideoSending(false) }
  }

  const handleCapoSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setCapoSending(true)
    try {
      const r = await fetch("/api/contact-tolar", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...capoFormData, subject:"[EL CAPO] Mensaje directo"}) })
      if (r.ok) { setCapoSent(true); setCapoFormData({ name:"", email:"", message:"" }) }
    } catch {} finally { setCapoSending(false) }
  }

  return (
    <div className="min-h-screen">
      <Header />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #065f46, #10b981)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="bg-emerald-500 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            {ET("hero_titulo", "Contactanos")}
          </h1>
          <p className="text-xl text-white/90">{ET("hero_subtitulo", "No te dejamos solo. Elegí como prefieras comunicarte y te ayudamos.")}</p>
        </div>
      </section>

      <section className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{ET("faq_titulo", "Preguntas Frecuentes")}</h2>
            <p className="text-gray-600">{ET("faq_subtitulo", "El 90% de las consultas se resuelven aca en 2 minutos")}</p>
          </div>
          <Tabs defaultValue="tecnicas" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="tecnicas" className="gap-2"><Settings className="w-4 h-4" />Tecnicas</TabsTrigger>
              <TabsTrigger value="comerciales" className="gap-2"><CreditCard className="w-4 h-4" />Comerciales</TabsTrigger>
            </TabsList>
            <TabsContent value="tecnicas">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible>
                    {FAQ_TECNICAS.slice(0,3).map((faq,i) => (
                      <AccordionItem key={i} value={`t${i}`}>
                        <AccordionTrigger className="text-left text-sm">{ET(faq.qk, faq.qd)}</AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">{ET(faq.ak, faq.ad)}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible>
                    {FAQ_TECNICAS.slice(3).map((faq,i) => (
                      <AccordionItem key={i} value={`t2${i}`}>
                        <AccordionTrigger className="text-left text-sm">{ET(faq.qk, faq.qd)}</AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">{ET(faq.ak, faq.ad)}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comerciales">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible>
                    {FAQ_COMERCIALES.slice(0,3).map((faq,i) => (
                      <AccordionItem key={i} value={`c${i}`}>
                        <AccordionTrigger className="text-left text-sm">{ET(faq.qk, faq.qd)}</AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">{ET(faq.ak, faq.ad)}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <Accordion type="single" collapsible>
                    {FAQ_COMERCIALES.slice(3).map((faq,i) => (
                      <AccordionItem key={i} value={`c2${i}`}>
                        <AccordionTrigger className="text-left text-sm">{ET(faq.qk, faq.qd)}</AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">{ET(faq.ak, faq.ad)}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{ET("form_titulo", "Formulario de Consulta")}</h2>
            <p className="text-gray-600">{ET("form_subtitulo", "Si no encontraste la respuesta, te respondemos por mail en menos de 24hs")}</p>
          </div>
          {sent ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Mensaje enviado!</h3>
              <p className="text-gray-600 mb-6">Te respondemos por email en menos de 24 horas.</p>
              <Button onClick={() => setSent(false)}>Enviar otra consulta</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={formData.tipo} onValueChange={v => setFormData({...formData, tipo:v})} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="tecnico" className="gap-2"><Settings className="w-4 h-4" />Consulta Tecnica</TabsTrigger>
                  <TabsTrigger value="comercial" className="gap-2"><CreditCard className="w-4 h-4" />Consulta Comercial</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Tu nombre *</label><Input value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} placeholder="Como te llamas?" required /></div>
                <div><label className="block text-sm font-medium mb-2">Email *</label><Input type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} placeholder="tu@email.com" required /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">WhatsApp (opcional)</label><Input value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} placeholder="+54 11 1234-5678" /></div>
                <div><label className="block text-sm font-medium mb-2">Asunto *</label><Input value={formData.subject} onChange={e => setFormData({...formData, subject:e.target.value})} placeholder="En que podemos ayudarte?" required /></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Tu consulta *</label><Textarea value={formData.message} onChange={e => setFormData({...formData, message:e.target.value})} placeholder="Contanos en detalle tu consulta..." rows={4} required /></div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                {sending ? "Enviando..." : "Enviar consulta"}<Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-rose-500 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <MessageSquare className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{ET("wa_titulo", "WhatsApp con Asistente")}</h2>
            <p className="text-white/90">{ET("wa_subtitulo", "Podes escribirnos y un asistente te contesta automaticamente 24/7")}</p>
          </div>
          <div className="bg-white rounded-lg p-8 max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-6">{ET("wa_nombre", "Asistente Humano")}</h3>
            <a href="https://wa.me/18504837710?text=Hola!%20Necesito%20ayuda%20con%20mi%20tienda" target="_blank" rel="noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors">
              <span className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />{ET("wa_boton", "Abrir WhatsApp")}<ExternalLink className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cyan-400 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <Video className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{ET("video_titulo", "Video Llamada con Asistente")}</h2>
            <p className="text-white/90">{ET("video_subtitulo", "Solo para consultas complejas o planes personalizados (US$35 x 30 min).")}</p>
          </div>
          {videoSent ? (
            <div className="text-center py-8 bg-white/20 backdrop-blur rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Solicitud enviada!</h3>
              <p className="text-white/90">Te contactamos para coordinar la videollamada.</p>
            </div>
          ) : (
            <form onSubmit={handleVideoSubmit} className="bg-white rounded-lg p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2">Nombre</label><Input value={videoFormData.name} onChange={e => setVideoFormData({...videoFormData, name:e.target.value})} placeholder="Tu nombre" required /></div>
              <div><label className="block text-sm font-medium mb-2">Email</label><Input type="email" value={videoFormData.email} onChange={e => setVideoFormData({...videoFormData, email:e.target.value})} placeholder="tu@email.com" required /></div>
              <div><label className="block text-sm font-medium mb-2">Mensaje</label><Textarea value={videoFormData.message} onChange={e => setVideoFormData({...videoFormData, message:e.target.value})} placeholder="Contanos brevemente que necesitas..." rows={3} required /></div>
              <Button type="submit" disabled={videoSending} className="w-full bg-cyan-600 hover:bg-cyan-700">
                {videoSending ? "Enviando..." : ET("video_boton", "Solicitar videollamada")}<Calendar className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-yellow-400 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-2">{ET("capo_titulo", "Comunicarse con el capo")}</h2>
            <p className="text-black/80">{ET("capo_subtitulo", "Generalmente este capo del proyecto esta de viaje pero cuando tiene tiempo lee este mensaje. No esperes respuesta.")}</p>
          </div>
          {capoSent ? (
            <div className="text-center py-8 bg-black/10 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">Mensaje enviado!</h3>
              <p className="text-black/80">El capo lo va a leer cuando pueda (o no).</p>
            </div>
          ) : (
            <form onSubmit={handleCapoSubmit} className="bg-black rounded-lg p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2 text-white">Nombre</label><Input value={capoFormData.name} onChange={e => setCapoFormData({...capoFormData, name:e.target.value})} placeholder="Tu nombre" required className="bg-white" /></div>
              <div><label className="block text-sm font-medium mb-2 text-white">Email</label><Input type="email" value={capoFormData.email} onChange={e => setCapoFormData({...capoFormData, email:e.target.value})} placeholder="tu@email.com" required className="bg-white" /></div>
              <div><label className="block text-sm font-medium mb-2 text-white">Mensaje</label><Textarea value={capoFormData.message} onChange={e => setCapoFormData({...capoFormData, message:e.target.value})} placeholder="Tu mensaje para el capo..." rows={3} required className="bg-white" /></div>
              <Button type="submit" disabled={capoSending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                {capoSending ? "Enviando..." : ET("capo_boton", "Enviar al capo")}<Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </section>

      <div className="flex h-3">
        <div className="flex-1 bg-fuchsia-500" /><div className="flex-1 bg-cyan-400" /><div className="flex-1 bg-yellow-400" /><div className="flex-1 bg-black" />
      </div>
      <Footer />
    </div>
  )
}
