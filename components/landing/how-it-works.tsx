import { Store, CreditCard, Truck, Rocket } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Store,
    title: "1. Crea tu tienda online gratis",
    description: "Registrate en menos de 2 minutos con tu email. Elegi el nombre de tu tienda virtual y listo. Sin tarjeta de credito, sin compromisos, 100% gratis para empezar.",
    link: null,
  },
  {
    icon: CreditCard,
    title: "2. Conecta MercadoPago",
    description: "Integra tu cuenta de MercadoPago en un click. Acepta tarjetas de credito, debito, transferencias, Mercado Credito y todos los medios de pago de Argentina.",
    link: "/pagos",
  },
  {
    icon: Truck,
    title: "3. Subi tus productos",
    description: "Agrega fotos, precios, variantes y descripciones de tus productos. Configura envios con Andreani, Correo Argentino, envio propio o retiro en local.",
    link: null,
  },
  {
    icon: Rocket,
    title: "4. Vende por internet",
    description: "Comparti el link de tu tienda en Instagram, Facebook, WhatsApp y redes sociales. Recibi pedidos y cobra automaticamente. Asi de simple.",
    link: null,
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como Crear tu Tienda Online con MercadoPago Integrado
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No necesitas saber programar ni tener experiencia. Con tol.ar cualquier persona puede 
            tener su propia tienda online funcionando en minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {step.link && (
                <Link 
                  href={step.link} 
                  className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm uppercase tracking-wide"
                >
                  LEER MAS
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Mas de <strong>500 emprendedores</strong> ya crearon su tienda online con tol.ar
          </p>
        </div>
      </div>
    </section>
  )
}
