"use client"
import React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import {
  CreditCard, Package, Truck, Megaphone, Search, Palette,
  ShoppingCart, Wrench, Globe, BarChart3, Sparkles, MessageCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"


const ICON_MAP: Record<string, any> = {
  mp: CreditCard, pagos_extra: CreditCard, productos: Package, categorias: Package,
  envios: Truck, logo: Palette, banner: Palette, dominio: Globe,
  seo: Search, redes: Megaphone, marketing_email: BarChart3,
  capacitacion: Wrench, todo: Sparkles
}

type Servicio = {
  code: string
  name: string
  description: string
  price: number
  icon: any
}

type Categoria = { name: string; items: Servicio[] }

const CATEGORIAS: Categoria[] = [
  { name: "Pagos", items: [
    { code: "mp", name: "Configurar Mercado Pago", description: "Creamos la aplicación, obtenemos el Access Token y lo conectamos a tu tienda. Listo para cobrar.", price: 5000, icon: CreditCard },
    { code: "pagos_extra", name: "Otros métodos de pago", description: "Configuramos transferencia, Mobbex, Ualá u otros medios según lo que necesites.", price: 3000, icon: CreditCard },
  ]},
  { name: "Productos", items: [
    { code: "productos", name: "Carga de productos", description: "Subimos tus productos con fotos, descripciones, precios y stock. Precio por paquete de hasta 30 productos.", price: 8000, icon: Package },
    { code: "categorias", name: "Organización en categorías", description: "Organizamos tu catálogo en categorías para que tus clientes encuentren lo que buscan.", price: 3000, icon: Package },
  ]},
  { name: "Envíos", items: [
    { code: "envios", name: "Configurar envíos", description: "Configuramos Andreani, Enviamelo u otros. Con zonas, precios y retiro en punto.", price: 4000, icon: Truck },
  ]},
  { name: "Diseño", items: [
    { code: "logo", name: "Logo y marca", description: "Diseñamos el logo de tu tienda y elegimos colores y tipografías que representen tu marca.", price: 10000, icon: Palette },
    { code: "banner", name: "Banner principal", description: "Diseñamos el banner de portada de tu tienda con tu producto estrella.", price: 4000, icon: Palette },
    { code: "dominio", name: "Dominio propio", description: "Compramos y conectamos tu dominio (ej: mitienda.com.ar) a tu tienda tol.ar.", price: 5000, icon: Globe },
  ]},
  { name: "Marketing", items: [
    { code: "seo", name: "SEO básico", description: "Configuramos título, descripción y palabras clave para que aparezcas en Google.", price: 5000, icon: Search },
    { code: "redes", name: "Redes sociales", description: "Conectamos tu Instagram y Facebook, configuramos el pixel de Meta para seguimiento.", price: 4000, icon: Megaphone },
    { code: "marketing_email", name: "Email marketing", description: "Configuramos tu primera campaña de email para tus clientes.", price: 5000, icon: BarChart3 },
  ]},
  { name: "Soporte", items: [
    { code: "capacitacion", name: "Capacitación", description: "Una sesión de 1 hora por videollamada donde te enseñamos a manejar tu tienda.", price: 5000, icon: Wrench },
    { code: "todo", name: "Todo incluido — Tienda lista 🚀", description: "Te entregamos la tienda 100% lista para vender. Productos, pagos, envíos, diseño y SEO. Vos solo vendés.", price: 45000, icon: Sparkles },
  ]},
]

const ALL_SERVICIOS = CATEGORIAS.flatMap(c => c.items)

export default function EspecialistaPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [dolarRate, setDolarRate] = useState(1200)

  useEffect(() => {
    fetch("/api/super-admin/exchange-rate")
      .then(r => r.json())
      .then(data => { if (data.rate) setDolarRate(data.rate) })
      .catch(() => {})
  }, [])
  const [servicios, setServicios] = useState(ALL_SERVICIOS)
  const [categorias, setCategorias] = useState(CATEGORIAS)

  useEffect(() => {
    fetch("/api/super-admin/especialista-config")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.servicios) {
          setServicios(data.servicios)
          const cats = [...new Set(data.servicios.filter((s: any) => s.activo).map((s: any) => s.categoria))] as string[]
          setCategorias(cats.map(cat => ({ name: cat, items: data.servicios.filter((s: any) => s.categoria === cat && s.activo) })))
        }
      })
      .catch(() => {})
  }, [])

  const toggle = (code: string) => {
    setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
  }
  const getCode = (s: any) => s.id || s.code

  const total = servicios.filter((s: any) => selected.includes(s.id || s.code)).reduce((sum: number, s: any) => sum + Math.round((s.precioUSD || s.precio || s.price || 0) * dolarRate), 0)

  const handleContactar = () => {
    const servicios = ALL_SERVICIOS.filter(s => selected.includes(s.code)).map(s => `• ${s.name}`).join("\n")
    const texto = selected.length > 0
      ? `Hola! Quiero contratar la configuración de mi tienda tol.ar.\n\nServicios seleccionados:\n${servicios}\n\nTotal: $${total.toLocaleString("es-AR")}`
      : `Hola! Quiero que un especialista configure mi tienda tol.ar.`
    window.open(`https://wa.me/18504837710?text=${encodeURIComponent(texto)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f]/10 via-white to-[#2563eb]/5">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#2563eb] font-semibold text-lg mb-6">Servicio de configuración</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]">
            Que un especialista configure tu tienda
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
            tol.ar es gratis y fácil de usar. Pero si preferís no perder tiempo, nosotros te dejamos todo listo para vender.
          </p>
          <p className="text-lg text-[#2563eb] font-medium">
            Elegí lo que necesitás y te contactamos para coordinarlo.
          </p>
        </div>
      </section>

      {/* Aviso honesto */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-900">
            <strong className="font-semibold">¿Por qué contratar esto?</strong> Podés hacer todo solo — tol.ar está diseñado para eso. Pero si no tenés tiempo, no te gusta la tecnología, o simplemente querés que quede perfecto desde el primer día, un especialista te ahorra horas de trabajo y errores. Vos ponés los productos, nosotros ponemos el resto.
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Elegí los servicios que necesitás</h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            Podés contratar todo junto o solo lo que te falta. El precio se calcula automáticamente.
          </p>
          <div className="max-w-4xl mx-auto space-y-8">
            {categorias.map((cat) => (
              <div key={cat.name}>
                <h3 className="text-lg font-medium text-slate-400 mb-4">{cat.name}</h3>
                <div className="space-y-2">
                  {cat.items.map((servicio: any) => {
                    const isSelected = selected.includes(servicio.id || servicio.code)
                    return (
                      <div
                        key={servicio.id || servicio.code}
                        onClick={() => toggle(servicio.id || servicio.code)}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? "border-[#2563eb] bg-blue-50" : "border-blue-200 bg-blue-50/30 hover:bg-blue-50"}`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggle(servicio.id || servicio.code)} onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-[#1e3a5f] data-[state=checked]:border-[#1e3a5f]"
                        />
                        <div className="w-10 h-10 bg-[#2563eb]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-5 h-5 text-[#1e3a5f]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{servicio.nombre || servicio.name}</p>
                          <p className="text-sm text-slate-500">{servicio.descripcion || servicio.description}</p>
                        </div>
                        <p className="text-right min-w-[100px]">
                          <span className="font-semibold">${Math.round((servicio.precioUSD || servicio.precio || servicio.price || 0) * dolarRate).toLocaleString("es-AR")}</span>
                          <span className="text-xs text-slate-400 block">pago único</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA fijo abajo */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto">
              {selected.map((code) => {
                const s = servicios.find((x: any) => (x.id || x.code) === code)
                return s ? (
                  <Badge key={code} className="text-xs bg-[#2563eb]/10 text-[#1e3a5f] hover:bg-[#2563eb]/20 cursor-pointer" onClick={() => toggle(code)}>
                    {s.nombre || s.name} ✕
                  </Badge>
                ) : null
              })}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#2563eb]" />
                <span className="font-medium">{selected.length} servicio{selected.length > 1 ? "s" : ""} seleccionado{selected.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">${total.toLocaleString("es-AR")}</p>
                </div>
                <button
                  onClick={handleContactar}
                  className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2563eb] text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contratar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Sección SEO - contenido para Google */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-[#1e3a5f]">¿Qué hace un especialista en tiendas online?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Un especialista en ecommerce es alguien que conoce todas las herramientas necesarias para que una tienda online funcione correctamente desde el primer día. En Argentina, configurar una tienda online implica mucho más que subir productos: hay que conectar Mercado Pago, configurar los envíos con Andreani o Enviamelo, optimizar el SEO para aparecer en Google, y asegurarse de que el diseño genere confianza en el cliente.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Muchos emprendedores arrancan solos y pierden horas tratando de entender cómo obtener el Access Token de Mercado Pago, por qué los envíos no calculan bien, o por qué Google no encuentra su tienda. Un especialista resuelve todo eso en una sola sesión.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            En tol.ar ofrecemos un servicio de configuración completo para emprendedores argentinos que quieren vender online sin perder tiempo en cuestiones técnicas. Vos ponés los productos y las ganas — nosotros ponemos el resto.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-[#1e3a5f]">¿Qué incluye la configuración de una tienda online en Argentina?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Para que una tienda online esté lista para vender en Argentina necesita, como mínimo, estas configuraciones:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              ["Mercado Pago conectado", "Sin esto no podés cobrar. Implica crear una aplicación en el panel de desarrolladores, obtener el Access Token de producción y pegarlo en la configuración de tu tienda."],
              ["Productos cargados correctamente", "Fotos de calidad, descripciones claras, precios actualizados y stock configurado. Un catálogo mal cargado espanta clientes."],
              ["Envíos configurados", "Andreani, Enviamelo, retiro en punto o envío propio. El cliente tiene que poder calcular el costo de envío antes de comprar."],
              ["SEO básico", "Título, descripción y palabras clave de cada página. Sin esto Google no sabe de qué trata tu tienda."],
              ["Diseño y marca", "Logo, colores y banner principal. La primera impresión importa — una tienda sin identidad visual genera desconfianza."],
            ].map(([titulo, desc]) => (
              <li key={titulo} className="flex gap-3 items-start">
                <span className="text-[#2563eb] font-bold mt-1">→</span>
                <div>
                  <strong className="text-slate-800">{titulo}:</strong>
                  <span className="text-slate-600"> {desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="text-3xl font-bold mb-6 text-[#1e3a5f]">¿Por qué contratar un especialista en vez de hacerlo solo?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            tol.ar está diseñado para que cualquier persona pueda configurar su tienda sola, sin saber programar. Y muchos lo hacen. Pero hay casos donde contratar un especialista tiene mucho sentido:
          </p>
          <ul className="space-y-2 mb-8 text-slate-600">
            <li>• No tenés tiempo para aprender y configurar todo desde cero.</li>
            <li>• Querés que quede perfecto desde el primer día para no perder ventas.</li>
            <li>• Ya intentaste configurarlo y te trabaste en algún paso técnico.</li>
            <li>• Tenés muchos productos y cargarlos uno por uno te llevaría días.</li>
            <li>• Querés estar seguro de que Mercado Pago, los envíos y el SEO están bien configurados.</li>
          </ul>

          <p className="text-slate-600 leading-relaxed">
            El servicio de especialista de tol.ar está pensado para emprendedores argentinos que venden productos físicos, digitales o servicios online. Trabajamos con negocios de todos los rubros: ropa, accesorios, alimentos, tecnología, manualidades, y más.
          </p>
        </div>
      </section>

      {/* FAQ para Google */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#1e3a5f]">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              ["¿Cuánto tarda en estar lista mi tienda?", "Depende de los servicios que elijas. Solo la configuración de Mercado Pago tarda menos de 30 minutos. Una tienda completa con productos, envíos, diseño y SEO puede estar lista en 24 a 48 horas hábiles."],
              ["¿Necesito saber de tecnología para contratar este servicio?", "No. De eso nos encargamos nosotros. Vos solo tenés que tener una cuenta en tol.ar y en Mercado Pago. El resto lo hacemos nosotros."],
              ["¿Qué pasa si ya tengo la tienda creada pero está incompleta?", "Perfecto. Podés contratar solo los servicios que te faltan. No es necesario empezar de cero."],
              ["¿Cómo me contactan después de contratar?", "Por WhatsApp. Coordinamos un horario para hacer todo juntos o te pedimos los accesos necesarios y lo resolvemos nosotros."],
              ["¿Puedo contratar solo la configuración de Mercado Pago?", "Sí. Cada servicio se puede contratar por separado. Seleccionás solo lo que necesitás y te contactamos para coordinarlo."],
              ["¿El servicio incluye soporte después de la configuración?", "La configuración incluye una revisión final para asegurarnos de que todo funciona. Si después surge algún problema relacionado con lo que configuramos, lo resolvemos sin costo adicional."],
            ].map(([pregunta, respuesta]) => (
              <div key={pregunta} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-2">{pregunta}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA si no seleccionó nada */}
      {selected.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto bg-[#1e3a5f] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">¿No sabés por dónde empezar?</h3>
              <p className="text-blue-200 text-sm mb-6">Escribinos y te recomendamos qué configurar primero según tu tipo de negocio.</p>
              <button
                onClick={handleContactar}
                className="flex items-center gap-2 bg-white text-[#1e3a5f] font-semibold px-6 py-3 rounded-lg mx-auto hover:bg-blue-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Consultá gratis por WhatsApp
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mb-24" />
      <Footer />
    </div>
  )
}
