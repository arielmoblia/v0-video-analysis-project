"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"
import { Check, Store, ArrowRight, ShieldCheck, DollarSign, Package } from "lucide-react"

const BENEFICIOS = [
  ["b1_titulo", "No pagás nada por sumarte", "b1_desc", "No hay costo de alta ni mensualidad. Cobrás el 100% del precio que vos pusiste en cada venta; nuestra ganancia la sumamos aparte, a cargo del comprador."],
  ["b2_titulo", "Vos seguís vendiendo igual que siempre", "b2_desc", "Esto no reemplaza nada de lo que ya hacés, es un canal de venta extra."],
  ["b3_titulo", "Solo cobramos si vendemos", "b3_desc", "No te descontamos nada de tu precio: si vendemos algo tuyo, te lo pagamos completo. Si no vendemos, no pagás nada."],
  ["b4_titulo", "Te vas cuando quieras", "b4_desc", "Avisando con 30 días de anticipación (alcanza un mail), sin penalidad."],
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanSocioViejaTiendaPage({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("plan-socio-vieja-tienda")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-socio-vieja-tienda" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#16a34a" />
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #14532d, #16a34a)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <a href="/plan-socio" className="inline-block text-sm text-green-700 hover:underline mb-6">
            ← Volver a Plan Socio
          </a>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Store className="w-4 h-4" />
            {ET("badge", "Ya tenés tu tienda")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {ET("titulo", "Plan Socio · Vieja Tienda", "span", "text-green-600")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {ET("subtitulo", "Vendemos tus productos en tol.ar sin que hagas nada. Cobrás el 100% de tu precio. Si no vendemos, no pagás nada.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/programa-reventa">{ET("hero_boton1", "Quiero sumar mi tienda")}<ArrowRight className="w-4 h-4 ml-2" /></a>
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
              { n: 1, tKey: "paso1_titulo", tDef: "Nos das el OK", dKey: "paso1_desc", dDef: "Aceptás los términos y condiciones del programa. Queda registrado con fecha, hora y tu decisión." },
              { n: 2, tKey: "paso2_titulo", tDef: "Publicamos tu catálogo", dKey: "paso2_desc", dDef: "Sumamos tus productos a tol.ar con las mismas fotos, precios y descripciones que ya tenés." },
              { n: 3, tKey: "paso3_titulo", tDef: "Cobrás el 100%", dKey: "paso3_desc", dDef: "Si vendemos algo tuyo, te pagamos el precio completo que pusiste. Nuestra ganancia la sumamos aparte, a cargo del comprador." },
            ].map(({ n, tKey, tDef, dKey, dDef }) => (
              <Card key={n} className="border-2 border-green-200 bg-green-50/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-3xl font-bold text-center mb-4">{ET("ventajas_titulo", "Ventajas de sumar tu tienda")}</h2>
          <p className="text-center text-muted-foreground mb-12">{ET("ventajas_subtitulo", "Sin costo de alta, sin mensualidad, sin arriesgar nada")}</p>
          <Card className="border-2 border-green-300">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {BENEFICIOS.map(([tk, td, dk, dd]) => (
                  <div key={tk} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{ET(tk, td)}</p>
                      <p className="text-gray-600 text-sm">{ET(dk, dd)}</p>
                    </div>
                  </div>
                ))}
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
              ["faq1_p", "¿Cómo saben cuánto vendieron de lo mío?", "faq1_r", "Todas las ventas pasan por tol.ar, así que sabemos exactamente cuánto vendimos de tu catálogo. Es 100% transparente."],
              ["faq2_p", "¿Qué pasa si cambio un precio o me quedo sin stock?", "faq2_r", "Actualizás tu tienda como siempre y nosotros reflejamos esos cambios. Vos seguís teniendo el control de tus precios y tu stock."],
              ["faq3_p", "¿Qué pasa con mis fotos y descripciones?", "faq3_r", "Las publicamos tal cual las tenés en tu tienda. Son tuyas, nosotros solo las mostramos para vender."],
              ["faq4_p", "¿Puedo salir del programa cuando quiera?", "faq4_r", "Sí, avisando con 30 días de anticipación (alcanza un mail), sin penalidad."],
              ["faq5_p", "¿Hay algún contrato o letra chica?", "faq5_r", "Sí, pero es simple: los términos y condiciones completos están publicados y los aceptás con un clic antes de sumarte."],
            ].map(([pk, pd, rk, rd]) => (
              <div key={pk} className="border-b pb-6">
                <h3 className="font-bold mb-2">{ET(pk, pd)}</h3>
                <p className="text-muted-foreground">{ET(rk, rd)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto max-w-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{ET("cta_titulo", "Sumá tu tienda ahora")}</h2>
          <p className="text-muted-foreground mb-8">{ET("cta_subtitulo", "Es un formulario corto: nos das el OK y arrancamos a publicar tu catálogo.")}</p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <a href="/programa-reventa">{ET("cta_boton", "Quiero sumar mi tienda")}<ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {ET("cta_legal", "Vas a ver los")}{" "}
            <a href="/scraping-terminos-condiciones" className="underline hover:text-green-700" target="_blank" rel="noreferrer">
              {ET("cta_legal_link", "Términos y condiciones")}
            </a>{" "}
            {ET("cta_legal2", "antes de confirmar")}
          </p>
          <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <Package className="w-3 h-3" />
            {ET("nota_final", "Tu catálogo se publica tal cual lo tenés, sin cambiar precios ni descripciones.")}
          </p>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
