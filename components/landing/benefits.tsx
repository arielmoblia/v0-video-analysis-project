"use client"
import { Check, Zap, Shield, Smartphone, Globe, HeadphonesIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { EditableText, usePageContent } from "@/components/editable-text"

const BENEFITS = [
  { icon: Zap,            key:"ben1", title:"Rápido y fácil de usar",                    desc:"Creá tu tienda online profesional en menos de 2 minutos. No necesitás conocimientos técnicos, programación ni diseño. Nuestra plataforma está pensada para emprendedores argentinos.", link: null },
  { icon: Shield,         key:"ben2", title:"Pagos seguros con MercadoPago",             desc:"Integración completa con MercadoPago. Tus clientes pueden pagar con tarjetas de crédito, débito, transferencias bancarias, efectivo en Rapipago y PagoFacil.", link: "/pagos" },
  { icon: Smartphone,     key:"ben3", title:"100% responsive y optimizada",              desc:"Tu tienda online se ve perfecta en celulares, tablets y computadoras. El 80% de las compras online en Argentina se hacen desde el celular.", link: null },
  { icon: Globe,          key:"ben4", title:"Dominio propio o subdominio gratis",        desc:"Empezá con un subdominio gratuito (tutienda.tol.ar) y cuando crezcás podés conectar tu dominio propio. También ofrecemos registro de dominios .com.ar y .com.", link: null },
  { icon: Check,          key:"ben5", title:"Sin comisiones ocultas ni sorpresas",       desc:"Plan gratis disponible para siempre. Sin costos sorpresa, sin cargos escondidos, sin letras chicas. Pagás solo lo que elegís y cuando lo necesitás.", link: null },
  { icon: HeadphonesIcon, key:"ben6", title:"Soporte humano en español",                 desc:"Ayuda real de personas reales que entienden tu negocio. Respondemos por email y WhatsApp en menos de 24 horas.", link: null },
]

export function Benefits() {
  const { isAdmin, get } = usePageContent("home")
  const ET = (field: string, fallback: string) => (
    <EditableText page="home" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#f59e0b" />
  )
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("ben_titulo", "Vendé por Internet con MercadoPago y Envíos Andreani")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ET("ben_subtitulo", "La alternativa argentina para vender por internet. Diseñada para emprendedores que quieren vender por internet sin complicaciones.")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map(b => (
            <div key={b.key} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <b.icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{ET(`${b.key}_titulo`, b.title)}</h3>
                <p className="text-muted-foreground text-sm">{ET(`${b.key}_desc`, b.desc)}</p>
                {b.link && (
                  <Link href={b.link} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mt-2">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">{ET("ben_seo_titulo", "Por qué crear tu tienda online con tol.ar en 2026")}</h3>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>{ET("ben_seo_p1", "El comercio electrónico en Argentina crece cada año y cada vez más consumidores prefieren comprar por internet. Con tol.ar podés crear tu tienda online gratis en minutos, sin necesidad de conocimientos técnicos ni grandes inversiones iniciales.")}</p>
            <p>{ET("ben_seo_p2", "A diferencia de otras plataformas de e-commerce, tol.ar fue creada específicamente para el mercado argentino. Integración nativa con MercadoPago, envíos con Andreani, soporte en español y precios pensados para la economía argentina.")}</p>
            <p>{ET("ben_seo_p3", "Nuestra plataforma es ideal para quienes venden ropa, accesorios, productos artesanales, alimentos, cosméticos, electrónica, y cualquier tipo de producto. Miles de emprendedores argentinos ya eligieron tol.ar. Vos también podés empezar hoy mismo, es gratis y te lleva solo 2 minutos.")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
