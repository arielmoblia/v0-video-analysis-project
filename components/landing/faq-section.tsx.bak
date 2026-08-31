"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Cuanto cuesta crear una tienda online en tol.ar?",
    answer: "Tenemos 4 planes para que elijas el que mejor te sirva:\n\n• PLAN GRATIS: Totalmente gratis hasta 20 productos. Ideal para empezar.\n\n• PLAN COSITAS: Empezas gratis y vas sumando funciones extras pagas solo cuando las necesites (dominio propio, quitar marca, estadisticas, etc).\n\n• PLAN SOCIO (10% por venta): Todo incluido, sin mensualidad. Solo pagas cuando vendes.\n\n• PLAN PERSONALIZADO: Ademas de customizar tu tienda, nuestro equipo te hace el SEO y te asesora en todo para que vendas mas.\n\nLa mayoria empieza gratis y va creciendo.",
  },
  {
    question: "Necesito saber programar para usar tol.ar?",
    answer: "No, no necesitas ningun conocimiento tecnico. tol.ar esta diseñado para que cualquier persona pueda crear su tienda online en menos de 2 minutos. Todo es visual y facil de usar.",
  },
  {
    question: "Puedo recibir pagos con MercadoPago?",
    answer: "Si, tol.ar tiene integracion completa con MercadoPago. Tus clientes pueden pagar con tarjeta de credito, tarjeta de debito, transferencia bancaria, efectivo en Rapipago/PagoFacil y mas metodos de pago.",
  },
  {
    question: "Como funcionan los envios?",
    answer: "Podes configurar envios con Andreani (calculo automatico de costos), envio propio con precio fijo, o retiro en local gratis. El sistema muestra las opciones al cliente en el checkout.",
  },
  {
    question: "Puedo usar mi propio dominio?",
    answer: "Si! Con el plan Socio podes conectar tu dominio propio (ej: mitienda.com). En el plan gratis tenes un subdominio gratuito (ej: mitienda.tol.ar).",
  },
  {
    question: "Cuantos productos puedo subir?",
    answer: "En el plan gratis podes subir hasta 20 productos. En los planes Cositas, Socio y Personalizado tenes productos ilimitados.",
  },
  {
    question: "Que pasa si necesito ayuda?",
    answer: "Tenemos soporte en español por email y WhatsApp. Respondemos en menos de 24 horas. Ademas tenemos videos tutoriales y guias paso a paso para todo.",
  },
  {
    question: "Puedo migrar mi tienda de otra plataforma?",
    answer: "Si, ofrecemos servicio de migracion desde TiendaNube, WooCommerce, Shopify y otras plataformas. Contactanos y te ayudamos a pasar todos tus productos.",
  },
]

export function FAQSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Preguntas frecuentes sobre crear tu tienda online
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber antes de empezar a vender por internet con tol.ar
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg px-6 border"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
