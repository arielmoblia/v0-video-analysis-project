"use client"
import { Store, CreditCard, Truck, Rocket } from "lucide-react"
import Link from "next/link"
import { EditableText, usePageContent } from "@/components/editable-text"

const STEPS = [
  { icon: Store,      key:"paso1", title:"1. Creá tu tienda online gratis",  desc:"Registrate en menos de 2 minutos con tu email. Elegí el nombre de tu tienda virtual y listo. Sin tarjeta de crédito, sin compromisos, 100% gratis para empezar.", link: null },
  { icon: CreditCard, key:"paso2", title:"2. Conectá MercadoPago",           desc:"Integrá tu cuenta de MercadoPago en un click. Aceptá tarjetas de crédito, débito, transferencias, Mercado Crédito y todos los medios de pago de Argentina.", link: "/pagos" },
  { icon: Truck,      key:"paso3", title:"3. Subí tus productos",            desc:"Agregá fotos, precios, variantes y descripciones de tus productos. Configurá envíos con Andreani, Correo Argentino, envío propio o retiro en local.", link: null },
  { icon: Rocket,     key:"paso4", title:"4. Vendé por internet",            desc:"Compartí el link de tu tienda en Instagram, Facebook, WhatsApp y redes sociales. Recibí pedidos y cobrá automáticamente. Así de simple.", link: null },
]

export function HowItWorks() {
  const { isAdmin, get } = usePageContent("home")
  const ET = (field: string, fallback: string) => (
    <EditableText page="home" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#f59e0b" />
  )
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("how_titulo", "Cómo Crear tu Tienda Online con MercadoPago Integrado")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ET("how_subtitulo", "No necesitás saber programar ni tener experiencia. Con tol.ar cualquier persona puede tener su propia tienda online funcionando en minutos.")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.key} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{ET(`${step.key}_titulo`, step.title)}</h3>
              <p className="text-muted-foreground">{ET(`${step.key}_desc`, step.desc)}</p>
              {step.link && (
                <Link href={step.link} className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm uppercase tracking-wide">LEER MAS</Link>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">{ET("how_footer", "Más de 500 emprendedores ya crearon su tienda online con tol.ar")}</p>
        </div>
      </div>
    </section>
  )
}
