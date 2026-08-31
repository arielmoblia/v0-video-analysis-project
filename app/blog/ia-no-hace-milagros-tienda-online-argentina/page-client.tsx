"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Volume2, Square } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "blog-ia-no-hace-milagros"

const quehacerItems = [
  { k: "quehacer_li1", d: "Volvé y completá el catálogo: productos con fotos reales, no genéricas. Diez productos bien cargados venden más que cincuenta a medias." },
  { k: "quehacer_li2", d: "Avisale a gente real: tus contactos de WhatsApp, tu Instagram, tu círculo cercano. La primera venta casi nunca viene de un desconocido en Google." },
  { k: "quehacer_li3", d: "Contestá rápido: alguien que pregunta y no recibe respuesta en horas se va a otro lado." },
  { k: "quehacer_li4", d: "Volvé cada semana: ajustá precios, sacá lo que no se mueve, sumá lo que sí. Una tienda que nadie toca hace meses se nota, y se nota mal." },
]

const faqItems = [
  { qk: "faq1_q", q: "¿Por qué mi tienda online no vende si ya la armé con IA?", ak: "faq1_a", a: "Porque armar la tienda es apenas el primer paso. Vender requiere cargar productos reales, avisarle a gente y sostenerlo en el tiempo — nada de eso lo hace la IA sola." },
  { qk: "faq2_q", q: "¿Es normal que la mayoría de las tiendas creadas queden abandonadas?", ak: "faq2_a", a: "Sí, y le pasa a todas las plataformas, no solo a tol.ar. Más de 6 de cada 10 proyectos armados con IA se abandonan antes de los tres meses porque la novedad inicial no alcanza sin trabajo detrás." },
  { qk: "faq3_q", q: "¿Qué hace falta además de la IA para que una tienda funcione?", ak: "faq3_a", a: "Constancia: cargar bien el catálogo, difundir, responder rápido y ajustar cada semana. Es trabajo humano que ninguna herramienta reemplaza." },
]

// Orden en que se lee el artículo en voz alta: solo párrafos y listas del cuerpo, nunca títulos ni subtítulos.
const READ_FIELDS = [
  "intro_p1", "intro_p2",
  "herramienta_p1", "herramienta_p2",
  "numeros_p1", "numeros_p2",
  "vago_p1",
  "quehacer_li1", "quehacer_li2", "quehacer_li3", "quehacer_li4",
  "cierre_p",
  "faq1_a", "faq2_a", "faq3_a",
]

export default function IaNoHaceMilagrosClient() {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "p", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#ea580c" />
  )

  const [hablando, setHablando] = require("react").useState(false)

  const leerArticulo = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    if (hablando) {
      window.speechSynthesis.cancel()
      setHablando(false)
      return
    }
    const defaults: Record<string, string> = {
      intro_p1: "Con IA, crear una tienda online hoy tarda minutos. Elegís un nombre, la IA te arma el catálogo, los textos, hasta las fotos si hace falta. Es real, funciona, y es gratis. Pero mirando las tiendas creadas en tol.ar hay un patrón que se repite mucho más de lo que gustaría: cientos quedan a medio armar. Un logo, tres productos cargados, y nada más. Nunca se completan, nunca se difunden, nunca venden un peso.",
      intro_p2: "Algunas son de programadores o diseñadores probando cómo responde el sistema — eso está bien, para eso también existe. Pero otras son de gente que se anotó pensando que la tienda sola le iba a traer clientes. Y ahí está el problema.",
      herramienta_p1: "Armar la tienda es la parte fácil. Es el 10% del trabajo. El otro 90% es: cargar productos de verdad con fotos que se vean bien, poner precios que tengan sentido, avisarle a tus contactos que existís, mandar el link por WhatsApp, contestar rápido cuando alguien pregunta, ajustar cuando algo no se vende. Ese 90% no lo hace ninguna inteligencia artificial. Lo tenés que hacer vos.",
      herramienta_p2: "La IA es un martillo. Un martillo espectacular, mejor que cualquiera que hayas usado antes. Pero un martillo solo, sobre la mesa, no clava nada. Necesita una mano humana que lo agarre, apunte y golpee. Si esa mano no aparece, el clavo sigue afuera de la pared para siempre.",
      numeros_p1: "Esto no pasa solo en tol.ar. Estudios recientes sobre proyectos armados con herramientas de IA muestran que más del 60% se abandona antes de los tres meses — la gente prueba, ve que la magia inicial no alcanza, y suelta. En ecommerce en general, más del 80% de las tiendas chicas fracasa en sus primeros tres años, y la causa principal no es la plataforma que usaron: es la falta de seguimiento, de constancia y de estrategia después del día uno.",
      numeros_p2: "Incluso a nivel empresas grandes que invierten en proyectos de IA, se estima que más del 40% de esos proyectos se van a cancelar antes de 2027 por falta de resultados claros. Si eso pasa con presupuestos millonarios, no hay motivo para pensar que a una tienda gratis armada en dos minutos le va a ir distinto sin que nadie la empuje.",
      vago_p1: "Esto va directo, sin vueltas: si tu plan es crear la tienda y esperar sentado a que le caiga la plata del cielo, no va a pasar. Ni con tol.ar, ni con ninguna otra plataforma, ni con la IA que salga el año que viene. La tecnología bajó muchísimo la barrera de entrada — antes armar una tienda online costaba plata y tiempo, hoy es gratis e inmediato — pero bajó la barrera de entrada, no la de resultado. Vender sigue siendo un trabajo.",
      quehacer_li1: quehacerItems[0].d,
      quehacer_li2: quehacerItems[1].d,
      quehacer_li3: quehacerItems[2].d,
      quehacer_li4: quehacerItems[3].d,
      cierre_p: "La IA te ahorra semanas de trabajo técnico. Eso es enorme y es real. Pero el trabajo de vender —hablarle a la gente, sostenerlo en el tiempo, corregir sobre la marcha— sigue siendo tuyo. Nadie te lo puede tercerizar, ni siquiera la IA más avanzada que exista.",
      faq1_a: faqItems[0].a,
      faq2_a: faqItems[1].a,
      faq3_a: faqItems[2].a,
    }
    const texto = READ_FIELDS.map(k => get(k, defaults[k] || "")).join(". ")
    const utter = new SpeechSynthesisUtterance(texto)
    utter.lang = "es-AR"
    utter.rate = 1
    utter.onend = () => setHablando(false)
    utter.onerror = () => setHablando(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
    setHablando(true)
  }

  return (
    <>
      <Header />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #7c2d12, #ea580c)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen">

        <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-orange-700 mb-4">
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span>Opinión</span>
            </div>
            <div className="inline-block bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Sin filtros
            </div>
            {ET("h1", "La IA No Hace Milagros: Por Qué tu Tienda Sigue Vacía", "h1", "text-4xl md:text-5xl font-bold text-gray-900 mb-4")}
            {ET("subtitulo", "La IA es un martillo. Es una herramienta espectacular, pero necesita una mano humana que la agarre y clave el clavo. Si sos vago, no te va a servir de nada.", "p", "text-xl text-gray-600 mb-6")}
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>tol.ar Blog</span>
              <span>·</span>
              <span>5 agosto 2026</span>
              <span>·</span>
              <span>5 min de lectura</span>
              <button
                onClick={leerArticulo}
                title={hablando ? "Detener lectura" : "Escuchar el artículo"}
                aria-label={hablando ? "Detener lectura" : "Escuchar el artículo"}
                className={`flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${hablando ? "bg-orange-600 border-orange-600 text-white" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}
              >
                {hablando ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>

        <article className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            {ET("intro_h2", "Lo que vemos todos los días en tol.ar", "h2")}
            {ET("intro_p1", "Con IA, crear una tienda online hoy tarda minutos. Elegís un nombre, la IA te arma el catálogo, los textos, hasta las fotos si hace falta. Es real, funciona, y es gratis. Pero mirando las tiendas creadas en tol.ar hay un patrón que se repite mucho más de lo que gustaría: cientos quedan a medio armar. Un logo, tres productos cargados, y nada más. Nunca se completan, nunca se difunden, nunca venden un peso.")}
            {ET("intro_p2", "Algunas son de programadores o diseñadores probando cómo responde el sistema — eso está bien, para eso también existe. Pero otras son de gente que se anotó pensando que la tienda sola le iba a traer clientes. Y ahí está el problema.")}

            {ET("herramienta_h2", "La herramienta no es el negocio", "h2")}
            {ET("herramienta_p1", "Armar la tienda es la parte fácil. Es el 10% del trabajo. El otro 90% es: cargar productos de verdad con fotos que se vean bien, poner precios que tengan sentido, avisarle a tus contactos que existís, mandar el link por WhatsApp, contestar rápido cuando alguien pregunta, ajustar cuando algo no se vende. Ese 90% no lo hace ninguna inteligencia artificial. Lo tenés que hacer vos.")}
            {ET("herramienta_p2", "La IA es un martillo. Un martillo espectacular, mejor que cualquiera que hayas usado antes. Pero un martillo solo, sobre la mesa, no clava nada. Necesita una mano humana que lo agarre, apunte y golpee. Si esa mano no aparece, el clavo sigue afuera de la pared para siempre.")}

            {ET("numeros_h2", "No es solo una sensación: los números lo confirman", "h2")}
            {ET("numeros_p1", "Esto no pasa solo en tol.ar. Estudios recientes sobre proyectos armados con herramientas de IA muestran que más del 60% se abandona antes de los tres meses — la gente prueba, ve que la magia inicial no alcanza, y suelta. En ecommerce en general, más del 80% de las tiendas chicas fracasa en sus primeros tres años, y la causa principal no es la plataforma que usaron: es la falta de seguimiento, de constancia y de estrategia después del día uno.")}
            {ET("numeros_p2", "Incluso a nivel empresas grandes que invierten en proyectos de IA, se estima que más del 40% de esos proyectos se van a cancelar antes de 2027 por falta de resultados claros. Si eso pasa con presupuestos millonarios, no hay motivo para pensar que a una tienda gratis armada en dos minutos le va a ir distinto sin que nadie la empuje.")}

            {ET("vago_h2", "Si sos vago, ninguna herramienta te va a salvar", "h2")}
            {ET("vago_p1", "Esto va directo, sin vueltas: si tu plan es crear la tienda y esperar sentado a que le caiga la plata del cielo, no va a pasar. Ni con tol.ar, ni con ninguna otra plataforma, ni con la IA que salga el año que viene. La tecnología bajó muchísimo la barrera de entrada — antes armar una tienda online costaba plata y tiempo, hoy es gratis e inmediato — pero bajó la barrera de entrada, no la de resultado. Vender sigue siendo un trabajo.")}

            {ET("quehacer_h2", "Qué hacer si tu tienda quedó a medio armar", "h2")}
            <ul>
              {quehacerItems.map((item) => (
                <li key={item.k}>{ET(item.k, item.d, "span")}</li>
              ))}
            </ul>
            {ET("cierre_p", "La IA te ahorra semanas de trabajo técnico. Eso es enorme y es real. Pero el trabajo de vender —hablarle a la gente, sostenerlo en el tiempo, corregir sobre la marcha— sigue siendo tuyo. Nadie te lo puede tercerizar, ni siquiera la IA más avanzada que exista.")}

            {ET("faq_h2", "Preguntas frecuentes", "h2")}
            {faqItems.map((faq) => (
              <div key={faq.qk}>
                {ET(faq.qk, faq.q, "h3")}
                {ET(faq.ak, faq.a, "p")}
              </div>
            ))}
          </div>
        </article>

        <section className="py-16 px-4 bg-orange-600 text-white text-center">
          <div className="max-w-2xl mx-auto">
            {ET("cta_h2", "Tenés la herramienta. Ahora usala.", "h2", "text-3xl font-bold mb-3")}
            {ET("cta_p", "tol.ar te arma la tienda gratis en minutos. El resto — completarla, difundirla, sostenerla — depende de vos.", "p", "text-orange-100 mb-8")}
            <Link
              href="/plan-gratis"
              className="inline-flex items-center gap-2 bg-white text-orange-700 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors"
            >
              Crear mi tienda gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
