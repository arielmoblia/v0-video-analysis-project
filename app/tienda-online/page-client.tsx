"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Store,
  ShoppingCart,
  CreditCard,
  Truck,
  Settings,
  ImageIcon,
  Smartphone,
  BarChart2,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SignupModal } from "@/components/landing/signup-modal"

const FEATURES = [
  { icon: Store,        title: "Tu dominio propio",         description: "Tu tienda en mitienda.tol.ar o con dominio propio (.com.ar, etc.)" },
  { icon: ImageIcon,    title: "Productos ilimitados",      description: "Cargá todos tus productos con fotos, variantes y precios sin límite" },
  { icon: ShoppingCart, title: "Carrito de compras",        description: "Tus clientes eligen, agregan al carrito y compran con un click" },
  { icon: CreditCard,   title: "Medios de pago",            description: "Mercado Pago, transferencia, efectivo y más. Integrado sin código." },
  { icon: Truck,        title: "Envíos configurables",      description: "Retiro en local, envío propio, Correo Argentino y otros" },
  { icon: Smartphone,   title: "100% mobile",               description: "Tu tienda online se ve perfecta en celular, tablet y computadora" },
  { icon: Settings,     title: "Panel fácil de usar",       description: "Gestioná productos, pedidos, pagos y envíos desde un solo lugar" },
  { icon: BarChart2,    title: "Estadísticas de visitas",   description: "Sabé cuánta gente entra a tu tienda y qué productos miran más" },
  { icon: Globe,        title: "Diseñado para Argentina",   description: "Pensado para vendedores argentinos: pesos, MercadoPago, Correo Argentino" },
]

const STEPS = [
  {
    n: 1,
    titulo: "Elegí tu template",
    desc: "Cosméticos, Ropa, Calzado o Electrónica. Cada uno pensado para tu tipo de productos.",
  },
  {
    n: 2,
    titulo: "Creá tu cuenta gratis",
    desc: "Elegí el nombre de tu tienda, tu email y contraseña. En 2 minutos tenés todo listo.",
  },
  {
    n: 3,
    titulo: "Empezá a vender",
    desc: "Cargá tus productos, configurá los pagos y envíos, y compartí tu tienda online.",
  },
]

const FAQS = [
  {
    q: "¿Qué es una tienda online?",
    a: "Una tienda online es un sitio web donde vendés tus productos por internet. Tus clientes pueden comprar desde cualquier dispositivo, en cualquier momento, sin que vos estés presente.",
  },
  {
    q: "¿Cuánto cuesta crear una tienda online?",
    a: "Con tol.ar podés crear tu tienda online gratis, sin tarjeta de crédito y sin límite de tiempo. El plan gratuito incluye todo lo esencial para empezar a vender.",
  },
  {
    q: "¿Necesito saber programación?",
    a: "No. tol.ar está hecho para que cualquier persona pueda tener su tienda online sin saber programar. Todo se configura con clicks desde un panel simple.",
  },
  {
    q: "¿Puedo aceptar pagos online?",
    a: "Sí. Tu tienda online acepta Mercado Pago, transferencia bancaria, efectivo y más, todo integrado sin ningún conocimiento técnico.",
  },
  {
    q: "¿Qué tiene de diferente tol.ar frente a otras plataformas?",
    a: "tol.ar tiene plan 100% gratis sin límite de tiempo ni comisión por venta, a diferencia de otras plataformas que cobran mensualidad o un porcentaje extra sobre cada venta. Además, está construido específicamente para el mercado argentino.",
  },
  {
    q: "¿Puedo usar mi propio dominio?",
    a: "Sí. Podés arrancar con mitienda.tol.ar gratis y después agregar tu propio dominio (.com.ar o cualquier otro) cuando quieras.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function TiendaOnlinePage({ brand = "tol" }: Props) {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header brand={brand} />

      {/* Hero */}
      <section className="py-16 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Store className="h-4 w-4" />
            La plataforma argentina de tiendas online
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Creá tu{" "}
            <span className="text-blue-600">tienda online</span>{" "}
            en Argentina
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Sin tarjeta de crédito. Sin conocimientos técnicos. En menos de 2 minutos tenés tu tienda online funcionando y podés empezar a vender.
          </p>
          <p className="text-lg text-blue-600 font-semibold mb-8">100% gratis, sin límite de tiempo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              onClick={() => setShowSignup(true)}
            >
              Crear mi tienda online gratis
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/comparar">Comparar planes</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">Sin tarjeta de crédito · Sin límite de tiempo · Gratis para siempre</p>
        </div>
      </section>

      {/* Por qué tener una tienda online */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            ¿Por qué necesitás una tienda online?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Tener una tienda online te permite vender las 24 horas, llegar a clientes de todo el país y crecer sin los límites de un local físico.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                titulo: "Vendés mientras dormís",
                desc: "Tu tienda online está abierta las 24 horas del día, los 7 días de la semana. Tus clientes compran cuando ellos quieren.",
              },
              {
                titulo: "Llegás a todo el país",
                desc: "Con una tienda online no tenés límites geográficos. Vendés en Buenos Aires, Córdoba, Mendoza y cualquier provincia de Argentina.",
              },
              {
                titulo: "Menos costos, más ganancia",
                desc: "Una tienda online elimina los costos de un local físico: alquiler, servicios, empleados. Más margen para vos.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.titulo}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo crear tu tienda online */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Cómo crear tu tienda online con tol.ar
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Crear una tienda online nunca fue tan fácil. Seguí estos 3 pasos y empezá a vender hoy.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.n}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.titulo}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              onClick={() => setShowSignup(true)}
            >
              Empezar gratis ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Todo lo que incluye tu tienda online
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Tu tienda online en tol.ar viene con todo lo que necesitás para vender en Argentina.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <Card key={i} className="border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                      <feature.icon className="h-5 w-5 text-blue-600" />
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

      {/* Testimonial + social proof */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Cientos de tiendas online ya venden con tol.ar
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Emprendedores de todo el país crearon su tienda online con tol.ar. Ropa, calzado, cosméticos, electrónica, alimentos — cualquier rubro tiene su lugar.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { numero: "2 min", label: "para crear tu tienda online" },
              { numero: "100%", label: "gratis, sin tarjeta" },
              { numero: "0%", label: "comisión en el Plan Gratis" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-1">{stat.numero}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Preguntas frecuentes sobre tiendas online
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Card key={i} className="border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Especialista */}
      <section className="py-12 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            ¿Querés que un especialista te configure la tienda online?
          </h2>
          <p className="text-blue-200 mb-6 max-w-xl mx-auto">
            Pagos, productos, envíos y diseño — todo listo para vender. Vos solo te encargás de vender.
          </p>
          <a
            href="/especialista"
            className="inline-block bg-white text-[#1e3a5f] font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver servicio de especialista →
          </a>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Creá tu tienda online gratis hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sin tarjeta de crédito. Sin límite de tiempo. Tu tienda online en Argentina en 2 minutos.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
            onClick={() => setShowSignup(true)}
          >
            Crear mi tienda online gratis
          </Button>
          <p className="text-sm text-blue-200 mt-4">
            Ya hay cientos de tiendas online creadas con tol.ar en Argentina
          </p>
        </div>
      </section>

      <Footer brand={brand} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  )
}
