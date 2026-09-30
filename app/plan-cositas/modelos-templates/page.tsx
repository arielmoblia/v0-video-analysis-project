import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Modelos/Templates — Editá tu tienda en vivo, tocando lo que ves",
  description: "Elegí el diseño de tu tienda y editalo en vivo, tocando directo sobre lo que ves. Sin editores aparte, sin paneles complicados.",
  keywords: ["diseño tienda online argentina", "editar tienda en vivo", "templates tienda online", "modelos tol.ar"],
  openGraph: {
    title: "Modelos/Templates — Editá tu tienda en vivo, tocando lo que ves",
    description: "Elegí el diseño de tu tienda y editalo en vivo, tocando directo sobre lo que ves.",
    url: "https://tol.ar/plan-cositas/modelos-templates",
  }
}

export default async function ModelosTemplatesPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "modelos_templates")
  const brand = await getBrand()
  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />

      {/* HERO */}
      <section className="py-16 md:py-24 text-center border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm mb-6">
            Cositas tol.ar
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Modelos/Templates</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Elegí el diseño de tu tienda y editalo en vivo, tocando directo sobre lo que ves. Sin editores aparte, sin paneles complicados.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Activar por $1 USD/mes
            </Link>
            <Link href="/plan-cositas" className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Ver todas las cositas
            </Link>
          </div>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Tu tienda se ve igual que todas las demás?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            La mayoría de las plataformas te dan una plantilla fija. Para cambiar un texto, una foto o el orden de una sección tenés que entrar a un editor aparte, perderte entre paneles y opciones, y probar a ciegas cómo va a quedar.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con tol.ar no. Editás directo sobre la tienda real, viendo el resultado al instante.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "🧩", title: "Editores separados", desc: "Cambiás algo en un panel y tenés que ir a la tienda a ver cómo quedó. Ida y vuelta constante." },
              { icon: "🎨", title: "Plantillas cerradas", desc: "Todas las tiendas del mismo plan se ven igual. Poco margen para que la tuya se distinga." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>

          {/* DEMO VISUAL */}
          <div className="flex items-center gap-4 mb-12 bg-slate-50 rounded-2xl p-8">
            <div className="flex-1 text-center">
              <p className="text-sm text-slate-400 mb-2">Entrás a tu tienda</p>
              <p className="text-2xl font-bold text-slate-900">Modo normal</p>
            </div>
            <div className="text-slate-300 text-3xl">→</div>
            <div className="flex-1 text-center bg-black rounded-xl p-6">
              <p className="text-sm text-slate-400 mb-2">Activás edición</p>
              <p className="text-2xl font-bold text-white">Tocás y editás</p>
              <p className="text-xs text-slate-500 mt-2">se guarda al instante</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { n: "1", title: "Elegís un modelo para tu tienda", desc: "Un diseño profesional ya armado, conectado a tus productos, categorías y fotos." },
              { n: "2", title: "Activás el modo edición", desc: "Entrás logueado como dueño y prendés \"Editar diseño\". Aparecen los botones de edición sobre la propia tienda." },
              { n: "3", title: "Tocás directo lo que querés cambiar", desc: "Fotos, banner, categorías destacadas, textos, precios y fichas de producto. Sin ir a ningún panel aparte." },
              { n: "4", title: "Guardás y ya está publicado", desc: "El cambio se ve al instante, para vos y para tus clientes." },
            ].map(step => (
              <div key={step.n} className="flex gap-5 items-start">
                <div className="w-10 h-10 min-w-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-lg">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUE PODES EDITAR HOY */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Qué podés editar hoy</h2>
          <p className="text-slate-500 mb-8">Ya está activo en el diseño "Moderno". Vamos a sumar más modelos con el mismo sistema de edición en vivo.</p>
          <div className="space-y-3">
            {[
              { key: "Portada de tu tienda", desc: "Banner principal, categorías destacadas e imágenes." },
              { key: "Ficha de producto", desc: "Foto, precio, descripción y stock de cada producto." },
              { key: "Nuevos modelos a pedido", desc: "¿Ya tenés un diseño que te gusta (HTML/CSS propio o de otra tienda de referencia)? Lo armamos como modelo nuevo para tu tienda." },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900">{d.key}</span>
                  <p className="text-sm mt-0.5 text-slate-400">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {[
              { q: "¿Necesito saber de diseño para usarlo?", a: "No. Tocás el elemento que querés cambiar (una foto, un texto, un precio) y lo editás ahí mismo, sin código ni herramientas externas." },
              { q: "¿Mis clientes ven los botones de edición?", a: "No. Los botones de edición solo aparecen para vos, logueado como dueño de la tienda. Tus clientes ven la tienda normal." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Tu tienda sigue funcionando con el último diseño guardado. Solo dejás de poder editarlo en vivo." },
              { q: "¿Puedo pedir un diseño distinto al que ya tienen?", a: "Sí. Nos pasás el HTML/CSS que te gusta, o el link de una tienda de referencia, y armamos un modelo nuevo con el mismo sistema de edición en vivo." },
              { q: "¿Funciona en el celular?", a: "Sí, tanto para editar como para que tus clientes vean la tienda." },
            ].map((faq, i) => (
              <div key={i} className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Hacé que tu tienda se vea distinta</h2>
          <p className="text-slate-400 mb-8">$1 USD por mes. Cancelás cuando querés.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Activar ahora
            </Link>
            <Link href="/plan-cositas" className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Ver todas las cositas
            </Link>
          </div>
        </div>
      </section>

      {/* LINKS INTERNOS */}
      <section className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-slate-400 text-sm mb-4">Otras cositas que te pueden interesar</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/plan-cositas/dolar-peso" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Dólar/Peso →</Link>
            <Link href="/plan-cositas/lupa" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Lupa →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
