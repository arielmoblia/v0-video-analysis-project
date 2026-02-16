"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Store, ShoppingCart, CreditCard, Truck, Settings, ImageIcon, Mail, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { SignupModal } from "@/components/landing/signup-modal"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const INCLUDED_FEATURES = [
  { icon: Store, title: "Tu tienda online", description: "Con tu propio nombre: mitienda.tol.ar" },
  { icon: ImageIcon, title: "Hasta 20 productos", description: "Con fotos, descripciones, precios y variantes. Ideal para empezar." },
  { icon: ShoppingCart, title: "Carrito de compras", description: "Tus clientes pueden agregar productos y comprar" },
  { icon: CreditCard, title: "Métodos de pago", description: "Mercado Pago, efectivo, transferencia y más" },
  { icon: Truck, title: "Métodos de envío", description: "Retiro en local, envío propio, Correo Argentino, etc." },
  { icon: Mail, title: "Emails automáticos", description: "Confirmación de pedido y cambios de estado" },
  { icon: Settings, title: "Panel de administración", description: "Gestioná productos, pedidos, pagos y envíos" },
]

const NOT_INCLUDED = [
  "Estadísticas de visitas",
  "Video en portada",
  "Chat con IA",
  "Dominio propio",
  "Productos ilimitados",
  "Soporte prioritario",
]

export default function PlanGratisPage() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            100% Gratis, sin tarjeta de crédito
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Plan <span className="text-green-600">Gratis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Todo lo que necesitás para empezar a vender online. Sin costos ocultos, sin límite de tiempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
              onClick={() => setShowSignup(true)}
            >
              Crear mi tienda gratis
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/templates">Ver templates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Qué incluye el Plan Gratis?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Todo lo esencial para tener tu tienda online funcionando y empezar a vender
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
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparación */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Qué NO incluye?</h2>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6">
                  Estas funcionalidades están disponibles en el{" "}
                  <Link href="/plan-cositas" className="text-blue-600 hover:underline font-medium">
                    Plan Cositas
                  </Link>{" "}
                  donde podés elegir y pagar solo lo que necesitás:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {NOT_INCLUDED.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-500">
                      <X className="h-5 w-5 text-gray-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-4">¿Necesitás alguna de estas funcionalidades?</p>
                  <Button variant="outline" asChild>
                    <Link href="/plan-cositas">Ver Plan Cositas</Link>
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
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo empezar?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Elegí tu template</h3>
              <p className="text-sm text-gray-600">
                Cosméticos, Ropa, Calzado o Electrónicos. Cada uno adaptado a tu tipo de productos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Creá tu cuenta</h3>
              <p className="text-sm text-gray-600">
                Elegí el nombre de tu tienda, ponés tu email y contraseña. En 2 minutos tenés todo listo.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Empezá a vender</h3>
              <p className="text-sm text-gray-600">
                Cargá tus productos, configurá los pagos y envíos, y compartí tu tienda con el mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Es realmente gratis?</h3>
                <p className="text-gray-600">
                  Sí, 100% gratis. No pedimos tarjeta de crédito ni hay costos ocultos. Podés tener tu tienda
                  funcionando sin pagar nada.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Hay límite de tiempo?</h3>
                <p className="text-gray-600">
                  No. Tu tienda gratis es tuya para siempre. No es una prueba de 14 días ni nada por el estilo.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿Puedo agregar funcionalidades después?</h3>
                <p className="text-gray-600">
                  Sí, cuando quieras podés agregar "cositas" como estadísticas, chat con IA, dominio propio, etc. Pagás
                  solo lo que necesitás.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">¿20 productos alcanzan?</h3>
                <p className="text-gray-600">
                  Para empezar, sí. Si necesitás más, podés agregar "Productos ilimitados" desde el Plan Cositas por un
                  pago mensual.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Creá tu tienda online gratis en menos de 2 minutos. Sin complicaciones.
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6"
            onClick={() => setShowSignup(true)}
          >
            Crear mi tienda gratis
          </Button>
        </div>
      </section>

      <Footer />

      {/* Modal de Signup */}
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  )
}
