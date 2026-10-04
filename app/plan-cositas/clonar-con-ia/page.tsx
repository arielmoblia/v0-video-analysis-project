import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Clonar con IA — Copiá una tienda que te gusta, a tu medida",
  description: "Elegí cuánto querés clonar de una página que te gusta: solo la portada, el catálogo, el diseño completo, o todo sincronizado como dropshipping.",
  keywords: ["clonar tienda online argentina", "copiar diseño tienda con ia", "clonar catalogo tienda", "clonar con ia tolar"],
  openGraph: {
    title: "Clonar con IA — Copiá una tienda que te gusta, a tu medida",
    description: "Elegí cuánto querés clonar de una página que te gusta, de solo la portada hasta todo sincronizado.",
    url: "https://tol.ar/plan-cositas/clonar-con-ia",
  }
}

const MODALIDADES = [
  { titulo: "Solo portada", precio: "$15.000", desc: "Clonamos solo la pantalla de inicio, tal como se ve hoy. Sin productos, sin páginas internas, sin actualizarse después." },
  { titulo: "Catálogo sin clonar el diseño", precio: "$25.000", desc: "Traemos los productos de la página de origen, pero con el diseño propio de tol.ar." },
  { titulo: "Sistema completo vacío", precio: "$35.000", desc: "Clonamos el diseño completo (categorías, producto, carrito, cuenta) sin productos. Cargás el catálogo a mano después." },
  { titulo: "Todo clonado, foto fija", precio: "$50.000", desc: "Clonamos diseño y catálogo completo tal como están hoy. Queda fijo, no se actualiza solo." },
  { titulo: "Solo una parte puntual", precio: "A cotizar", desc: "Clonamos una sección específica, por ejemplo el checkout o una categoría, no la página entera." },
  { titulo: "Con marca propia", precio: "A cotizar", desc: "Misma base que elijas arriba, pero cambiando logo, colores y nombre para que no se vea como copia 1 a 1." },
  { titulo: "Sistema + catálogo sincronizado", precio: "$70.000 + mantenimiento mensual", desc: "Clonamos todo y lo mantenemos sincronizado solo, todos los días (precio y stock), como un dropshipping completo." },
]

export default async function ClonarConIAPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "clonar_ia_catalogo")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Clonar con IA</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Pegás el link de una tienda que te gusta y elegís cuánto querés clonar: desde solo la portada hasta todo el sistema sincronizado solo, todos los días.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Ver las 7 modalidades
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Te gusta cómo quedó otra tienda y no sabés por dónde empezar la tuya?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Armar una tienda desde cero (diseño, catálogo, textos) lleva tiempo. Si ya existe una página que te gusta, no hace falta empezar de la nada.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Clonar con IA elegís exactamente cuánto clonar, según lo que necesites.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "⏱", title: "Armar todo de cero tarda semanas", desc: "Diseño, catálogo, textos, fotos — todo a mano es mucho trabajo antes de vender." },
              { icon: "🎯", title: "No siempre necesitás todo igual", desc: "Según el caso, puede alcanzar con la portada, o hacer falta el catálogo completo sincronizado." },
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

      {/* MODALIDADES */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Elegís la modalidad</h2>
          <p className="text-slate-500 mb-8">Una sola opción, según cuánto necesites clonar. Los precios son orientativos, se ajustan según el caso.</p>
          <div className="space-y-3">
            {MODALIDADES.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-slate-100 gap-4">
                <div>
                  <span className="font-semibold text-slate-900">{m.titulo}</span>
                  <p className="text-sm mt-0.5 text-slate-400">{m.desc}</p>
                </div>
                <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{m.precio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>
          <div className="space-y-8">
            {[
              { n: "1", title: "Pegás el link de la tienda que te gusta", desc: "La que quieras usar de referencia para clonar." },
              { n: "2", title: "Elegís la modalidad", desc: "Cuánto clonar: solo portada, catálogo, diseño completo, o todo sincronizado." },
              { n: "3", title: "Armamos el pedido", desc: "Lo revisamos y te confirmamos antes de arrancar." },
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

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {[
              { q: "¿Puedo elegir más de una modalidad?", a: "No, es una sola opción por pedido. Si más adelante querés pasar a otra (por ejemplo, de portada a catálogo completo), armamos un pedido nuevo." },
              { q: "¿Necesito permiso de la tienda que quiero clonar?", a: "Es tu responsabilidad contar con esa autorización. tol.ar te da la herramienta técnica, no gestiona acuerdos con terceros." },
              { q: "¿La modalidad sincronizada se actualiza para siempre?", a: "Sí, precio y stock se actualizan solos todos los días, como un dropshipping completo. El resto de las modalidades quedan fijas el día que se clonan." },
              { q: "¿Qué pasa si solo quiero una parte puntual (ej. el checkout)?", a: "Elegís la modalidad 'Solo una parte puntual' y nos contás qué sección." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Empezá tu tienda clonando la que ya te gusta</h2>
          <p className="text-slate-400 mb-8">Desde $15.000, según la modalidad que elijas.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Ver las 7 modalidades
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
            <Link href="/plan-cositas/dropshipping" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Dropshipping →</Link>
            <Link href="/plan-cositas/modelos-templates" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Modelos/Templates →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
