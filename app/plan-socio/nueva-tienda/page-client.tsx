"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"
import {
  Check, TrendingUp, Megaphone, Handshake, ArrowRight,
  BarChart3, Video, MessageSquare, Globe, Package, Headphones, EyeOff, Calculator, Send,
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

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanSocioPage({ brand = "tol" }: Props) {
  const [ventasMensuales, setVentasMensuales] = useState("")
  const [formData, setFormData] = useState({ nombre: "", tienda: "", email: "", telefono: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const { isAdmin, get } = usePageContent("plan-socio")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-socio" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#d97706" />
  )

  const calcularComision = () => (Number.parseFloat(ventasMensuales) || 0) * 0.1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const response = await fetch("/api/contact-tolar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nombre, email: formData.email, phone: formData.telefono,
          subject: `Quiero ser SOCIO - ${formData.tienda}`,
          message: `Tienda: ${formData.tienda}\nWhatsApp: ${formData.telefono}\n\nSobre el negocio:\n${formData.mensaje}`,
        }),
      })
      if (response.ok) setEnviado(true)
      else alert("Error al enviar. Intentá de nuevo.")
    } catch { alert("Error al enviar. Intentá de nuevo.") }
    finally { setEnviando(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #92400e, #d97706)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <a href="/plan-socio" className="inline-block text-sm text-amber-700 hover:underline mb-6">
            ← Volver a Plan Socio
          </a>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            {ET("badge", "Crecemos juntos")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {ET("titulo", "Plan Socio · Nueva Tienda", "span", "text-amber-600")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {ET("subtitulo", "No pagás mensualidad. Solo compartís el 10% de tus ventas. Nosotros invertimos en publicidad para que vendas más.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
              <a href="#aplicar">{ET("hero_boton1", "Quiero ser socio")}<ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">{ET("hero_boton2", "¿Cómo funciona?")}</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("como_funciona_titulo", "¿Cómo funciona?")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n:1, tKey:"paso1_titulo", tDef:"Vos vendés", dKey:"paso1_desc", dDef:"Tu tienda funciona con todas las funcionalidades premium incluidas. Vos te enfocás en tus productos y clientes." },
              { n:2, tKey:"paso2_titulo", tDef:"Nosotros invertimos", dKey:"paso2_desc", dDef:"Invertimos en publicidad (Google Ads, Meta Ads, etc.) para que tu tienda reciba más visitas y más clientes." },
              { n:3, tKey:"paso3_titulo", tDef:"Compartimos el éxito", dKey:"paso3_desc", dDef:"Solo pagás el 10% de lo que vendés. Si no vendés, no pagás nada. Crecemos juntos." },
            ].map(({ n, tKey, tDef, dKey, dDef }) => (
              <Card key={n} className="border-2 border-amber-200 bg-amber-50/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{n}</span>
                  </div>
                  <CardTitle>{ET(tKey, tDef)}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">{ET(dKey, dDef)}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("incluido_titulo", "Todo incluido")}</h2>
          <p className="text-center text-muted-foreground mb-12">{ET("incluido_subtitulo", "Como socio tenés TODAS las cositas incluidas sin costo adicional")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {TODAS_LAS_COSITAS.map((cosita) => (
              <div key={cosita.name} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
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

          <Card className="border-2 border-amber-300">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    {ET("ventajas_titulo", "Ventajas del Plan Socio")}
                  </h3>
                  <ul className="space-y-3">
                    {[
                      ["ventaja1","No pagás nada si no vendés"],
                      ["ventaja2","Publicidad profesional sin que vos tengas que saber de marketing"],
                      ["ventaja3","Todas las funcionalidades premium incluidas"],
                      ["ventaja4","Nosotros ponemos la plata de la publicidad"],
                      ["ventaja5","Soporte personalizado para hacer crecer tu negocio"],
                    ].map(([key, def]) => (
                      <li key={key} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{ET(key, def)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-600" />
                    {ET("calc_titulo", "Calculá tu comisión")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ventas">{ET("calc_label", "Tus ventas mensuales estimadas")}</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input id="ventas" type="number" placeholder="100000" className="pl-8"
                          value={ventasMensuales} onChange={(e) => setVentasMensuales(e.target.value)} />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{ET("calc_comision_label", "Comisión (10%)")}</span>
                        <span className="text-2xl font-bold text-amber-600">${calcularComision().toLocaleString("es-AR")}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{ET("calc_nota", "Solo pagás si vendés. Si vendés $0, pagás $0.")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("faq_titulo", "Preguntas frecuentes")}</h2>
          <div className="space-y-6">
            {[
              ["faq1_p","¿Cómo saben cuánto vendí?","faq1_r","Todos los pedidos pasan por la plataforma, así que sabemos exactamente cuánto vendiste. Es 100% transparente."],
              ["faq2_p","¿Cuándo tengo que pagar?","faq2_r","La comisión se cobra mensualmente. Sumamos todas tus ventas del mes y cobramos el 10% en los primeros días del mes siguiente."],
              ["faq3_p","¿Cuánto invierten en publicidad para mi tienda?","faq3_r","Depende del rubro y la competencia. Arrancamos con un presupuesto base y lo vamos ajustando según los resultados."],
              ["faq4_p","¿Puedo cancelar cuando quiera?","faq4_r","Sí, podés cancelar el Plan Socio cuando quieras. Tu tienda sigue funcionando pero volvés al plan gratis."],
              ["faq5_p","¿Cualquiera puede ser socio?","faq5_r","Evaluamos cada caso. Buscamos tiendas con productos de calidad y potencial de crecimiento."],
            ].map(([pk, pd, rk, rd]) => (
              <div key={pk} className="border-b pb-6">
                <h3 className="font-bold mb-2">{ET(pk, pd)}</h3>
                <p className="text-muted-foreground">{ET(rk, rd)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="aplicar" className="py-20 px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("form_titulo", "Quiero ser socio")}</h2>
          <p className="text-center text-muted-foreground mb-8">{ET("form_subtitulo", "Completá el formulario y nos ponemos en contacto para conocer tu negocio")}</p>
          {enviado ? (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{ET("form_ok_titulo", "¡Solicitud enviada!")}</h3>
                <p className="text-muted-foreground">{ET("form_ok_desc", "Recibimos tu solicitud. Te contactamos en las próximas 48 horas.")}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Tu nombre</Label>
                      <Input id="nombre" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="tienda">Nombre de tu tienda</Label>
                      <Input id="tienda" required value={formData.tienda} onChange={(e) => setFormData({ ...formData, tienda: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="telefono">WhatsApp</Label>
                      <Input id="telefono" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mensaje">Contanos sobre tu negocio</Label>
                    <Textarea id="mensaje" placeholder="¿Qué vendés? ¿Hace cuánto estás en el rubro? ¿Tenés tienda física?" rows={4}
                      value={formData.mensaje} onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" size="lg" disabled={enviando}>
                    <Send className="w-4 h-4 mr-2" />
                    {ET("form_boton", enviando ? "Enviando..." : "Enviar solicitud")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
