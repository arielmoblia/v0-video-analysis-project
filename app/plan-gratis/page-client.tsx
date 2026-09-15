"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Store, ShoppingCart, CreditCard, Truck, Settings, ImageIcon, Mail, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { SignupModal } from "@/components/landing/signup-modal"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const INCLUDED_FEATURES = [
  { icon: Store,      key: "feat1", title: "Tu tienda online",        description: "Con tu propio nombre: mitienda.tol.ar" },
  { icon: ImageIcon,  key: "feat2", title: "Productos ilimitados",     description: "Sin límite de cantidad. Con fotos, descripciones, precios y variantes." },
  { icon: ShoppingCart, key: "feat3", title: "Carrito de compras",    description: "Tus clientes pueden agregar productos y comprar" },
  { icon: CreditCard, key: "feat4", title: "Métodos de pago",         description: "Mercado Pago, efectivo, transferencia y más" },
  { icon: Truck,      key: "feat5", title: "Métodos de envío",        description: "Retiro en local, envío propio, Correo Argentino, etc." },
  { icon: Mail,       key: "feat6", title: "Emails automáticos",      description: "Confirmación de pedido y cambios de estado" },
  { icon: Settings,   key: "feat7", title: "Panel de administración", description: "Gestioná productos, pedidos, pagos y envíos" },
]

const NOT_INCLUDED_DEFAULTS = [
  "Estadísticas de visitas",
  "Video en portada",
  "Chat con IA",
  "Dominio propio",
  "Productos ilimitados",
  "Soporte prioritario",
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function PlanGratisPage({ brand = "tol" }: Props) {
  const [showSignup, setShowSignup] = useState(false)
  const { content, isAdmin, get } = usePageContent("plan-gratis")
  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="plan-gratis" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#16a34a" />
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #14532d, #16a34a)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            {ET("hero_badge", "100% Gratis, sin tarjeta de crédito")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {ET("hero_titulo", "Plan Gratis", "span", "text-green-600")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {ET("hero_subtitulo", "Todo lo que necesitás para empezar a vender online. Sin costos ocultos, sin límite de tiempo.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6" onClick={() => setShowSignup(true)}>
              {ET("hero_boton", "Crear mi tienda gratis")}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/templates">{ET("hero_boton2", "Ver templates")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{ET("incluye_titulo", "¿Qué incluye el Plan Gratis?")}</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {ET("incluye_subtitulo", "Todo lo esencial para tener tu tienda online funcionando y empezar a vender")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {INCLUDED_FEATURES.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{ET(`${feature.key}_titulo`, feature.title)}</h3>
                      <p className="text-sm text-gray-600">{ET(`${feature.key}_desc`, feature.description)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Qué NO incluye */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("no_incluye_titulo", "¿Qué NO incluye?")}</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6">
                  {ET("no_incluye_intro", "Estas funcionalidades están disponibles en el Plan Cositas donde podés elegir y pagar solo lo que necesitás:")}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {NOT_INCLUDED_DEFAULTS.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-500">
                      <X className="h-5 w-5 text-gray-400" />
                      <span>{ET(`no_feat${index+1}`, feature)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-4">{ET("no_incluye_cta_text", "¿Necesitás alguna de estas funcionalidades?")}</p>
                  <Button variant="outline" asChild>
                    <Link href="/plan-cositas">{ET("no_incluye_cta_boton", "Ver Plan Cositas")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo empezar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("pasos_titulo", "¿Cómo empezar?")}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1,2,3].map(n => (
              <div key={n} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">{n}</span>
                </div>
                <h3 className="font-semibold mb-2">{ET(`paso${n}_titulo`, ["Elegí tu template","Creá tu cuenta","Empezá a vender"][n-1])}</h3>
                <p className="text-sm text-gray-600">{ET(`paso${n}_desc`, ["Cosméticos, Ropa, Calzado o Electrónicos. Cada uno adaptado a tu tipo de productos.","Elegí el nombre de tu tienda, ponés tu email y contraseña. En 2 minutos tenés todo listo.","Cargá tus productos, configurá los pagos y envíos, y compartí tu tienda con el mundo."][n-1])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{ET("faq_titulo", "Preguntas Frecuentes")}</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "¿Es realmente gratis?", a: "Sí, 100% gratis. No pedimos tarjeta de crédito ni hay costos ocultos. Podés tener tu tienda funcionando sin pagar nada." },
              { q: "¿Hay límite de tiempo?", a: "No. Tu tienda gratis es tuya para siempre. No es una prueba de 14 días ni nada por el estilo." },
              { q: "¿Puedo agregar funcionalidades después?", a: "Sí, cuando quieras podés agregar cositas como estadísticas, chat con IA, dominio propio, etc. Pagás solo lo que necesitás." },
              { q: "¿Cuántos productos puedo cargar?", a: "Podés cargar productos ilimitados en el plan gratis, sin ninguna restricción." },
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{ET(`faq${i+1}_pregunta`, faq.q)}</h3>
                  <p className="text-gray-600">{ET(`faq${i+1}_respuesta`, faq.a)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("cta_titulo", "¿Listo para empezar?")}</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {ET("cta_subtitulo", "Creá tu tienda online gratis en menos de 2 minutos. Sin complicaciones.")}
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6" onClick={() => setShowSignup(true)}>
            {ET("cta_boton", "Crear mi tienda gratis")}
          </Button>
        </div>
      </section>


      {/* CTA Especialista */}
      <section className="py-12 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">¿Querés que un especialista te configure la tienda?</h2>
          <p className="text-blue-200 mb-6 max-w-xl mx-auto">Pagos, productos, envíos y diseño — todo listo para vender. Vos solo te encargás de vender.</p>
          <a href="/especialista" className="inline-block bg-white text-[#1e3a5f] font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Ver servicio de especialista →
          </a>
        </div>
      </section>
      <Footer brand={brand} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  )
}
