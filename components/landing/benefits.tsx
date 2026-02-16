import { Check, Zap, Shield, Smartphone, Globe, HeadphonesIcon, ArrowRight } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Zap,
    title: "Rapido y facil de usar",
    description: "Crea tu tienda online profesional en menos de 2 minutos. No necesitas conocimientos tecnicos, programacion ni diseño. Nuestra plataforma esta pensada para emprendedores argentinos que quieren empezar a vender por internet de forma simple y rapida.",
  },
  {
    icon: Shield,
    title: "Pagos seguros con MercadoPago",
    description: "Integracion completa con MercadoPago, la plataforma de pagos mas usada en Argentina. Tus clientes pueden pagar con tarjetas de credito, tarjetas de debito, transferencias bancarias, efectivo en Rapipago y PagoFacil. Vos recibis el dinero directo en tu cuenta.",
    link: "/pagos",
  },
  {
    icon: Smartphone,
    title: "100% responsive y optimizada",
    description: "Tu tienda online se ve perfecta en celulares, tablets y computadoras. El 80% de las compras online en Argentina se hacen desde el celular, por eso optimizamos cada detalle para que tus clientes compren facil desde cualquier dispositivo.",
  },
  {
    icon: Globe,
    title: "Dominio propio o subdominio gratis",
    description: "Empeza con un subdominio gratuito (tutienda.tol.ar) y cuando crezcas podes conectar tu dominio propio (tutienda.com). Tambien ofrecemos servicio de registro de dominios .com.ar y .com si todavia no tenes uno.",
  },
  {
    icon: Check,
    title: "Sin comisiones ocultas ni sorpresas",
    description: "Plan gratis disponible para siempre. Sin costos sorpresa, sin cargos escondidos, sin letras chicas. Pagas solo lo que elegis y cuando lo necesitas. Transparencia total en todos nuestros planes y precios.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte humano en español",
    description: "Ayuda real de personas reales que entienden tu negocio. Respondemos por email y WhatsApp en menos de 24 horas. Ademas tenemos videos tutoriales, guias paso a paso y una comunidad de emprendedores que se ayudan entre si.",
  },
]

export function Benefits() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vende por Internet con MercadoPago y Envios Andreani
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La mejor alternativa a Tiendanube en Argentina. 
            Diseñada para emprendedores que quieren vender por internet sin complicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
                {(benefit as any).link && (
                  <Link 
                    href={(benefit as any).link} 
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mt-2"
                  >
                    Leer más <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Texto adicional para SEO - contenido valioso */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Por que crear tu tienda online con tol.ar en 2025
          </h3>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>
              El comercio electronico en Argentina crece cada año y cada vez mas consumidores prefieren comprar por internet. 
              Tener una tienda online ya no es opcional para los emprendedores y pequeños negocios que quieren crecer y llegar 
              a mas clientes en todo el pais. Con tol.ar podes crear tu tienda online gratis en minutos, sin necesidad de 
              conocimientos tecnicos ni grandes inversiones iniciales.
            </p>
            <p>
              A diferencia de otras plataformas de ecommerce como Tiendanube, Shopify o WooCommerce, tol.ar fue creada 
              especificamente para el mercado argentino. Esto significa que entendemos las necesidades de los emprendedores 
              locales: integracion nativa con MercadoPago para cobrar en pesos argentinos, envios con Andreani y otras 
              empresas de logistica del pais, soporte en español con atencion personalizada, y precios accesibles pensados 
              para la economia argentina.
            </p>
            <p>
              Nuestra plataforma es ideal para quienes venden ropa, accesorios, productos artesanales, alimentos, cosmeticos, 
              productos de libreria, juguetes, electronica, y cualquier tipo de producto fisico o digital. Miles de 
              emprendedores argentinos ya eligieron tol.ar para digitalizar sus negocios y aumentar sus ventas. 
              Vos tambien podes empezar hoy mismo, es gratis y te lleva solo 2 minutos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
