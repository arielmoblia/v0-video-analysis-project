"use client"
import { EditableText, usePageContent } from "@/components/editable-text"

const FAQS = [
  { qk:"faq1_q",  qd:"Cuanto cuesta crear una tienda online en tol.ar?",         ak:"faq1_a",  ad:"Tenemos 4 planes: PLAN GRATIS totalmente gratis con productos ilimitados. PLAN COSITAS empezas gratis y sumas funciones pagas cuando las necesites. PLAN SOCIO 10% por venta todo incluido sin mensualidad. PLAN PERSONALIZADO con SEO y asesoramiento de nuestro equipo." },
  { qk:"faq9_q",  qd:"Donde puedo hacer mi tienda online gratis?",                ak:"faq9_a",  ad:"En tol.ar podes crear tu tienda online gratis, sin comisiones por venta y sin mensualidad. No hay costo para empezar: subi productos ilimitados y cobras por MercadoPago desde el primer dia. En menos de 2 minutos tenes tu tienda lista para vender." },
  { qk:"faq10_q", qd:"Quiero vender por internet, por donde empiezo?",            ak:"faq10_a", ad:"Entras a tol.ar, creas tu cuenta gratis, subis tus productos con fotos y precio, y ya podes compartir el link de tu tienda. Tus clientes pagan con MercadoPago, tarjeta de credito, debito o efectivo. Los envios los configuras con Andreani o con retiro en tu local. Todo en menos de 2 minutos, sin saber programar." },
  { qk:"faq11_q", qd:"Cual es la alternativa mas barata para crear una tienda online?",           ak:"faq11_a", ad:"tol.ar es una alternativa gratuita para crear tu tienda online en Argentina. El plan gratis de tol.ar no tiene mensualidad ni comision por venta. Solo pagas si elegis el plan Socio (10% por venta) o el plan Personalizado." },
  { qk:"faq2_q",  qd:"Necesito saber programar para usar tol.ar?",                ak:"faq2_a",  ad:"No, no necesitas ningun conocimiento tecnico. tol.ar esta diseñado para que cualquier persona pueda crear su tienda online en menos de 2 minutos." },
  { qk:"faq3_q",  qd:"Puedo recibir pagos con MercadoPago?",                      ak:"faq3_a",  ad:"Si, tol.ar tiene integracion completa con MercadoPago. Tus clientes pueden pagar con tarjeta de credito, debito, transferencia bancaria, efectivo en Rapipago/PagoFacil y mas metodos de pago." },
  { qk:"faq4_q",  qd:"Como funcionan los envios?",                                ak:"faq4_a",  ad:"Podes configurar envios con Andreani, envio propio con precio fijo, o retiro en local gratis. El sistema muestra las opciones al cliente en el checkout." },
  { qk:"faq5_q",  qd:"Puedo usar mi propio dominio?",                             ak:"faq5_a",  ad:"Si! Con el plan Socio podes conectar tu dominio propio. En el plan gratis tenes un subdominio gratuito (ej: mitienda.tol.ar)." },
  { qk:"faq6_q",  qd:"Cuantos productos puedo subir?",                            ak:"faq6_a",  ad:"En todos los planes podes subir productos ilimitados, incluyendo el plan gratis." },
  { qk:"faq7_q",  qd:"Que pasa si necesito ayuda?",                               ak:"faq7_a",  ad:"Tenemos soporte en español por email y WhatsApp. Respondemos en menos de 24 horas. Ademas tenemos videos tutoriales y guias paso a paso para todo." },
  { qk:"faq8_q",  qd:"Puedo migrar mi tienda de otra plataforma?",                ak:"faq8_a",  ad:"Si, ofrecemos servicio de migracion desde otras plataformas de tienda online. Contactanos y te ayudamos a pasar todos tus productos." },
]

export function FAQSection() {
  const { isAdmin, get } = usePageContent("home")
  const ET = (field: string, fallback: string) => (
    <EditableText page="home" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#f59e0b" />
  )
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("faq_titulo", "Preguntas frecuentes sobre crear tu tienda online")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ET("faq_subtitulo", "Todo lo que necesitas saber antes de empezar a vender por internet con tol.ar")}</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg border group">
              <summary className="px-6 py-4 text-left font-semibold cursor-pointer list-none flex justify-between items-center">
                <span>{ET(faq.qk, faq.qd)}</span>
                <svg className="w-4 h-4 ml-2 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4 text-muted-foreground">
                {ET(faq.ak, faq.ad)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
