"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const CONTENT = {
  "badge": "100% Gratis · Sin Comisión · Con IA",
  "titulo": "Crea tu Tienda Online Gratis en Minutos, Sin Comisión, con IA",
  "cta_boton": "Crear Mi Tienda Gratis Ahora",
  "subtitulo": "Tienda online gratis en Argentina: 0% de comisión por venta, dominio propio incluido, y la hace una IA especial para que no te frustres.",
  "cta_titulo": "¿Listo para crear tu tienda online gratis con IA?",
  "paso1_desc": "Creá tu cuenta en segundos sin costo. La IA te ayuda a armar tu tienda: genera el diseño, escribe las primeras descripciones de productos y organiza tus categorías. Sin experiencia técnica necesaria.",
  "paso2_desc": "Agregá todos tus productos sin restricciones. La IA genera descripciones optimizadas para Google y para los buscadores de IA como ChatGPT, Gemini y Claude. Más visibilidad, menos trabajo manual.",
  "paso3_desc": "Conectá MercadoPago, Mobbex o MODO en minutos. Cobrás el 100% de cada venta. Sin comisiones ocultas, sin retenciones, sin letra chica. Lo que vendés es tuyo.",
  "paso1_titulo": "Registrate y Configurá con IA",
  "paso2_titulo": "Cargá tus Productos ",
  "paso3_titulo": "Activá Entrega/Pagos y Vendé",
  "faq1_pregunta": "¿Realmente es 100% gratis, sin trampa?",
  "faq2_pregunta": "¿Cómo me ayuda la IA a crear mi tienda?",
  "faq3_pregunta": "¿Puedo crear mi tienda sin experiencia técnica?",
  "faq4_pregunta": "¿Cuántos productos puedo vender?",
  "faq5_pregunta": "¿Por qué no cobran comisión por venta?",
  "faq6_pregunta": "¿La IA también me ayuda con el SEO?",
  "faq1_respuesta": "Sí. Sin cuota mensual, sin comisión por venta, sin límite de productos. Solo pagás lo que cobra el procesador de pago (MercadoPago, Mobbex o MODO) por cada transacción, igual que en cualquier plataforma del mundo. Nosotros no nos quedamos nada.",
  "faq2_respuesta": "La IA de tol.ar escribe descripciones de productos optimizadas para Google, mejora el copy de tu tienda, sugiere categorías y organiza tu catálogo automáticamente. Te ahorra horas de trabajo y mejora tu posicionamiento desde el primer día.",
  "faq3_respuesta": "Sí. tol.ar está diseñado para emprendedores, no para programadores. Con la IA integrada, la interfaz intuitiva y el soporte en español, cualquier persona puede tener una tienda funcionando en horas, no días.",
  "faq4_respuesta": "Sin límite. Podés cargar miles de productos sin pagar más, sin restricciones por plan.",
  "faq5_respuesta": "Porque tol.ar no se queda con un porcentaje de tus ventas, uses el medio de pago que uses. La única comisión que puede aplicarse es la propia del medio de pago que elijas (por ejemplo, la de MercadoPago), independiente de tol.ar. Además, la IA está integrada nativamente y sin costo extra.",
  "faq6_respuesta": "Sí. La IA genera textos para que tu tienda aparezca en Google y también cuando alguien le pregunta a ChatGPT, Gemini o Claude por productos como los tuyos. Es SEO de nueva generación, incluido sin cargo.",
  "beneficio1_desc": "Con MercadoPago, Mobbex o MODO te quedás con el 100% de cada venta. Cero por ciento para tol.ar.",
  "beneficio2_desc": "No es un add-on ni un extra de pago. La IA está dentro de tol.ar desde el primer día, para todos.",
  "beneficio3_desc": "Sin restricciones, sin planes premium. Cargá todo tu catálogo desde el inicio y crecé sin límites.",
  "beneficio4_desc": "MercadoPago, Mobbex y MODO ya están integrados. Cobrás como cobran las grandes marcas del país.",
  "beneficio5_desc": "Tu tienda en tutienda.tol.ar desde el día uno. URL profesional sin pagar nada extra.",
  "beneficio6_desc": "Equipo argentino que te ayuda cuando lo necesitás. Sin chatbots en inglés, sin esperas.",
  "beneficio1_titulo": "Sin comisión por venta",
  "beneficio2_titulo": "IA integrada nativa",
  "beneficio3_titulo": "Productos ilimitados",
  "beneficio4_titulo": "Pagos argentinos integrados",
  "beneficio5_titulo": "Subdominio propio gratis",
  "beneficio6_titulo": "Soporte en español",
  "beneficios_titulo": "Todo lo que Incluye tu Tienda Gratis",
  "como_funciona_titulo": "Cómo Crear tu Tienda Online con IA en 3 Pasos"
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
            {CONTENT.titulo || "tienda online gratis ia sin comisiones"}
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