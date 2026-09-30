import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Dropshipping — Vendé sin tener stock propio",
  description: "Tu tienda importa productos, precios y stock automáticamente de una tienda madre. Vos elegís el margen de ganancia y sincronizás cuando quieras.",
  keywords: ["dropshipping argentina", "vender sin stock tienda online", "importar catalogo tienda madre", "dropshipping tolar"],
  openGraph: {
    title: "Dropshipping — Vendé sin tener stock propio",
    description: "Tu tienda importa productos, precios y stock automáticamente de una tienda madre.",
    url: "https://tol.ar/plan-cositas/dropshipping",
  }
}

export default async function DropshippingPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "dropshipping")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Dropshipping</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Tu tienda importa productos, precios y stock automáticamente de una tienda madre. Vos elegís el margen de ganancia y sincronizás cuando quieras.
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Querés vender online pero no tenés stock propio?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Cargar un catálogo entero a mano, producto por producto, con fotos, precios y stock, es semanas de trabajo antes de vender el primer producto.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Dropshipping, tu tienda arranca con el catálogo ya cargado, importado directo de una tienda madre.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "📦", title: "Sin comprar stock por adelantado", desc: "Vendés primero, la tienda madre despacha después. No arriesgás capital en mercadería." },
              { icon: "⏱", title: "Sin cargar productos a mano", desc: "El catálogo entero se importa solo: fotos, precios, stock y categorías." },
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
          <div className="space-y-8">
            {[
              { n: "1", title: "Elegís una tienda madre", desc: "El proveedor cuyo catálogo querés vender en tu tienda." },
              { n: "2", title: "Se importa todo el catálogo", desc: "Fotos, precios, stock y categorías, automáticamente. Se actualiza solo todos los días." },
              { n: "3", title: "Vos elegís el margen de ganancia", desc: "Definís cuánto le sumás a cada precio importado. El resto lo hace la tienda sola." },
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

          <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-100">
            <p className="text-slate-600 leading-relaxed">
              La tecnología que hace posible importar ese catálogo automáticamente se llama <strong>scraping</strong>. Si querés entender cómo funciona por dentro (y qué hay que tener en cuenta legalmente antes de usarla), te lo explicamos en detalle acá:
            </p>
            <Link href="/blog/scraping" className="inline-flex items-center gap-1 mt-4 text-black font-medium hover:underline">
              Cómo funciona el scraping en tol.ar →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
            {[
              { q: "¿Con qué frecuencia se actualiza el catálogo?", a: "Una vez por día, automáticamente: precios, stock e imágenes." },
              { q: "¿Puedo elegir mi propio margen de ganancia?", a: "Sí. Vos definís cuánto le sumás a cada precio importado, en cualquier momento." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Tu tienda deja de sincronizar productos nuevos de la tienda madre. Los que ya tenías cargados no se borran." },
              { q: "¿Necesito un acuerdo con la tienda madre?", a: "Sí, y es enteramente tu responsabilidad conseguir esa autorización antes de importar su catálogo. tol.ar te da la herramienta técnica, pero no gestiona ni garantiza ningún acuerdo con terceros. Te lo explicamos en detalle en el artículo de scraping." },
              { q: "¿Qué pasa si la tienda madre cambia sus precios o stock?", a: "Como la importación es diaria, tu tienda refleja esos cambios al día siguiente. Vos seguís teniendo control total del margen que le sumás a cada precio importado, ese ajuste no lo toca la actualización automática." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Empezá a vender sin stock propio</h2>
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
            <Link href="/plan-cositas/dolar-peso" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Dólar / Peso →</Link>
            <Link href="/blog/scraping" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Cómo funciona el scraping →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
