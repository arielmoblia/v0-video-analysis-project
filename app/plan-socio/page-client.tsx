"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"
import { Handshake, Store, Sparkles, ArrowRight, Megaphone, Percent } from "lucide-react"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanSocioHubPage({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("plan-socio-hub")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-socio-hub" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#7c3aed" />
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4c1d95, #7c3aed)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            {ET("badge", "Vendé sin arriesgar nada")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            {ET("titulo", "Plan Socio")}
          </h1>
          <Card className="border-2 border-violet-200 bg-white text-left">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ET(
                  "explicacion",
                  "Nunca pagás mensualidad: solo compartís un porcentaje cuando vendemos. Invertimos en promocionarte en redes sociales y buscadores, y ponemos a un vendedor de nuestro equipo a ofrecer tus productos por vos. Elegí la opción que te queda mejor según tu situación:"
                )}
              </p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center text-sm text-violet-800">
                <span className="inline-flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full">
                  <Percent className="w-3.5 h-3.5" /> {ET("chip1", "Solo % si vendemos")}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full">
                  <Megaphone className="w-3.5 h-3.5" /> {ET("chip2", "Promoción en redes y buscadores")}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-violet-50 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> {ET("chip3", "Un vendedor que te vende")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-amber-300 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1 text-center items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-amber-700 mb-2">
                  {ET("nueva_titulo", "Plan Socio Nueva Tienda")}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {ET("nueva_subtitulo", "Todavía no tenés tienda online")}
                </p>
                <p className="text-muted-foreground mb-8 flex-1">
                  {ET(
                    "nueva_desc",
                    "Te armamos la tienda con todo incluido, sin costo. Invertimos en publicidad (Google Ads, Meta Ads) para que te lleguen clientes. Solo pagás el 10% de lo que vendas. Si no vendés, no pagás nada."
                  )}
                </p>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 w-full" asChild>
                  <a href="/plan-socio/nueva-tienda">
                    {ET("nueva_boton", "Ver cómo funciona")}<ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1 text-center items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  {ET("vieja_titulo", "Plan Socio Vieja Tienda")}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {ET("vieja_subtitulo", "Ya tenés tu tienda con productos")}
                </p>
                <p className="text-muted-foreground mb-8 flex-1">
                  {ET(
                    "vieja_desc",
                    "Publicamos tu catálogo (fotos, precios y descripciones tal cual los tenés) también en tol.ar. Cobrás el 100% de tu precio; nuestra ganancia la sumamos aparte, a cargo del comprador. Si no vendemos, no pagás nada."
                  )}
                </p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full" asChild>
                  <a href="/plan-socio/vieja-tienda">
                    {ET("vieja_boton", "Ver cómo funciona")}<ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
