"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const CONTENT = {
  "badge": "100% Gratis, Sin Comisiones",
  "titulo": "Crea tu Tienda Online Gratis sin Comisiones por Venta",
  "cta_boton": "Crear mi Tienda Gratis",
  "subtitulo": "Con tol.ar venderás online sin perder dinero en comisiones. Integra MercadoPago, Mobbex o MODO y quédate con el 100% de cada venta.",
  "cta_titulo": "Comienza a Vender Online sin Perder Dinero en Comisiones",
  "paso1_desc": "Crea tu cuenta en minutos sin costo alguno. No pedimos tarjeta de crédito ni datos bancarios para comenzar.",
  "paso2_desc": "Sube tus productos sin límites, personaliza el diseño y elige los medios de pago que prefieras: MercadoPago, Mobbex o MODO. Todo integrado y listo para vender.",
  "paso3_desc": "Cada venta es tuya. No cobramos comisión por transacción, sin importar qué medio de pago uses. Te quedas con todo lo que venden tus clientes.",
  "paso1_titulo": "Registrate Gratis en tol.ar",
  "paso2_titulo": "Configura tu Tienda Online",
  "paso3_titulo": "Vende y Cobra el 100%",
  "faq1_pregunta": "¿Realmente no cobran comisión por venta?",
  "faq2_pregunta": "¿Por qué no cobran comisión por venta?",
  "faq1_respuesta": "Correcto. Con tol.ar no hay comisión por venta, sea cual sea el medio de pago: MercadoPago, Mobbex o MODO. El 100% de tu venta es tuya.",
  "faq2_respuesta": "Porque tol.ar no se queda con un porcentaje de lo que vendés, uses el medio de pago que uses. Vos elegís libremente cómo cobrar (MercadoPago, Mobbex o MODO) sin perder dinero en comisiones por transacción de parte de tol.ar. La única comisión que puede aplicarse es la propia del medio de pago que elijas (por ejemplo, la de MercadoPago), que es independiente de tol.ar.",
  "como_funciona_titulo": "Cómo Funciona tu Tienda Online sin Comisiones"
}

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header fullMenu={true} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            {CONTENT.badge || "Sin comisiones"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-amber-600">
            {CONTENT.titulo || "crear tienda online gratis sin comisiones"}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {CONTENT.subtitulo}
          </p>
          <a href="https://tol.ar" className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
            {CONTENT.cta_boton || "Crear mi tienda gratis"}
          </a>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">{CONTENT.como_funciona_titulo || "¿Cómo funciona?"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(n => (
              <div key={n} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold mb-4">{n}</div>
                <h3 className="font-semibold mb-2">{CONTENT[`paso${n}_titulo`] || `Paso ${n}`}</h3>
                <p className="text-sm text-slate-600">{CONTENT[`paso${n}_desc`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[1,2,3,4].map(n => CONTENT[`faq${n}_pregunta`] ? (
              <div key={n} className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">{CONTENT[`faq${n}_pregunta`]}</h3>
                <p className="text-sm text-slate-600">{CONTENT[`faq${n}_respuesta`]}</p>
              </div>
            ) : null)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}