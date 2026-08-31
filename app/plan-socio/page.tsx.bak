"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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


function EditableText({ field, value, isAdmin, onSave, tag = "span", className = "" }: {
  field: string; value: string; isAdmin: boolean; onSave: (k: string, v: string) => Promise<void>; tag?: string; className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { setText(value) }, [value])
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  const handleSave = async () => {
    setSaving(true); await onSave(field, text); setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === "Escape") { setText(value); setEditing(false) }
  }
  if (!isAdmin) { const Tag = tag as any; return <Tag className={className}>{value}</Tag> }
  if (editing) return (
    <span style={{ display: "inline-block", width: "100%" }}>
      <textarea ref={ref} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} rows={2}
        style={{ width: "100%", padding: "6px 10px", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit",
          color: "#92400e", background: "rgba(255,255,255,0.95)", border: "2px solid #d97706", borderRadius: "8px",
          resize: "vertical", outline: "none", lineHeight: "1.5", textAlign: "center" }} />
      <span style={{ display: "flex", gap: "8px", marginTop: "4px", justifyContent: "center" }}>
        <button onClick={() => { setText(value); setEditing(false) }}
          style={{ padding: "3px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "12px" }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "3px 12px", borderRadius: "6px", border: "none", background: saving ? "#fbbf24" : "#d97706", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          {saving ? "Guardando..." : "Guardar"}</button>
      </span>
    </span>
  )
  const Tag = tag as any
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Tag className={className}
        style={{ cursor: "text", borderRadius: "4px", transition: "all 0.15s",
          outline: hover ? "2px dashed #fbbf24" : "2px dashed transparent", outlineOffset: "3px" }}>
        {text}
      </Tag>
      {hover && <button onClick={() => setEditing(true)}
        style={{ position: "absolute", top: "-12px", right: "-12px", background: "#d97706", color: "white",
          border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(217,119,6,0.4)", zIndex: 10 }}>✏️</button>}
      {saved && <span style={{ position: "absolute", top: "-12px", right: "20px", background: "#10b981",
        color: "white", borderRadius: "4px", padding: "2px 7px", fontSize: "11px", fontWeight: 600 }}>✓</span>}
    </span>
  )
}

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
  const [content, setContent] = useState<Record<string,string>>({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch("/api/plan-socio").then(r=>r.json()).then(setContent).catch(()=>{})
    fetch("/api/super-admin/check-auth").then(r=>r.json()).then(d=>setIsAdmin(d?.authenticated===true)).catch(()=>{})
  }, [])

  const handleSave = async (key: string, value: string) => {
    const res = await fetch("/api/plan-socio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) })
    if (res.ok) setContent(prev => ({ ...prev, [key]: value }))
  }
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
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #92400e, #d97706)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            {isAdmin ? <EditableText field="badge" value={content.badge || "Crecemos juntos"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.badge || "Crecemos juntos")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <EditableText field="titulo" value={content.titulo || "Plan Socio"} isAdmin={isAdmin} onSave={handleSave} tag="span" className={isAdmin ? "text-amber-600" : "text-amber-600"} />
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isAdmin ? <EditableText field="subtitulo" value={content.subtitulo || "No pagás mensualidad. Solo compartís el 10% de tus ventas. Nosotros invertimos en publicidad para que vendas más."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.subtitulo || <>No pagás mensualidad. Solo compartís el <span className="font-bold text-amber-600">10% de tus ventas</span>. Nosotros invertimos en publicidad para que vendas más.</>)}
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
          <h2 className="text-3xl font-bold text-center mb-12"><EditableText field="como_funciona_titulo" value={content.como_funciona_titulo || "¿Cómo funciona?"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <CardTitle><EditableText field="paso1_titulo" value={content.paso1_titulo || "Vos vendés"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {isAdmin ? <EditableText field="paso1_desc" value={content.paso1_desc || "Tu tienda funciona con todas las funcionalidades premium incluidas. Vos te enfocás en tus productos y clientes."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.paso1_desc || "Tu tienda funciona con todas las funcionalidades premium incluidas. Vos te enfocás en tus productos y clientes.")}
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <CardTitle><EditableText field="paso2_titulo" value={content.paso2_titulo || "Nosotros invertimos"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {isAdmin ? <EditableText field="paso2_desc" value={content.paso2_desc || "Invertimos en publicidad (Google Ads, Meta Ads, etc.) para que tu tienda reciba más visitas y más clientes."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.paso2_desc || "Invertimos en publicidad (Google Ads, Meta Ads, etc.) para que tu tienda reciba más visitas y más clientes.")}
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <CardTitle><EditableText field="paso3_titulo" value={content.paso3_titulo || "Compartimos el éxito"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                {isAdmin ? <EditableText field="paso3_desc" value={content.paso3_desc || "Solo pagás el 10% de lo que vendés. Si no vendés, no pagás nada. Crecemos juntos."} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.paso3_desc || "Solo pagás el 10% de lo que vendés. Si no vendés, no pagás nada. Crecemos juntos.")}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4"><EditableText field="incluido_titulo" value={content.incluido_titulo || "Todo incluido"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></h2>
          <p className="text-center text-muted-foreground mb-12">
            {isAdmin ? <EditableText field="incluido_subtitulo" value={content.incluido_subtitulo || "Como socio tenés TODAS las cositas incluidas sin costo adicional"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.incluido_subtitulo || "Como socio tenés TODAS las cositas incluidas sin costo adicional")}
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
                    {isAdmin ? <EditableText field="ventajas_titulo" value={content.ventajas_titulo || "Ventajas del Plan Socio"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventajas_titulo || "Ventajas del Plan Socio")}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{isAdmin ? <EditableText field="ventaja1" value={content.ventaja1 || "No pagás nada si no vendés"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventaja1 || "No pagás nada si no vendés")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{isAdmin ? <EditableText field="ventaja2" value={content.ventaja2 || "Publicidad profesional sin que vos tengas que saber de marketing"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventaja2 || "Publicidad profesional sin que vos tengas que saber de marketing")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{isAdmin ? <EditableText field="ventaja3" value={content.ventaja3 || "Todas las funcionalidades premium incluidas"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventaja3 || "Todas las funcionalidades premium incluidas")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{isAdmin ? <EditableText field="ventaja4" value={content.ventaja4 || "Nosotros ponemos la plata de la publicidad"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventaja4 || "Nosotros ponemos la plata de la publicidad")}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{isAdmin ? <EditableText field="ventaja5" value={content.ventaja5 || "Soporte personalizado para hacer crecer tu negocio"} isAdmin={isAdmin} onSave={handleSave} tag="span" /> : (content.ventaja5 || "Soporte personalizado para hacer crecer tu negocio")}</span>
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
          <h2 className="text-3xl font-bold text-center mb-4"><EditableText field="form_titulo" value={content.form_titulo || "Quiero ser socio"} isAdmin={isAdmin} onSave={handleSave} tag="span" /></h2>
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
