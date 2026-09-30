import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Carruseles — Productos destacados y frases que se deslizan solos",
  description: "Agregá una franja de productos destacados que se desliza y una franja de texto con frases rotando (promociones, envíos, redes) debajo del banner de tu tienda.",
  keywords: ["carrusel de productos tienda online", "franja de texto rotando tienda", "productos destacados slider argentina", "carruseles tolar"],
  openGraph: {
    title: "Carruseles — Productos destacados y frases que se deslizan solos",
    description: "Agregá una franja de productos destacados que se desliza y una franja de texto con frases rotando debajo del banner de tu tienda.",
    url: "https://tol.ar/plan-cositas/carruseles",
  }
}

export default async function CarruselesPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "carousels")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Carruseles</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            Una franja de productos destacados que se desliza sola y una franja de texto con frases rotando, justo debajo del banner de tu portada.
          </p>
          <div className="grid sm:grid-cols-5 gap-4 items-center max-w-3xl mx-auto">
            <div className="sm:col-span-3 aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36a.75.75 0 011.28.53v6.36a.75.75 0 01-1.28.53L15.75 13.5M4.5 6h9a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 16.5v-9A1.5 1.5 0 014.5 6z" />
              </svg>
              <span className="text-xs text-center px-4">Video explicativo — próximamente</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3 justify-center">
              <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center">
                Activar por $2 USD/mes
              </Link>
              <Link href="/plan-cositas" className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center">
                Ver todas las cositas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Tu portada se queda quieta y no muestra nada más?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Un banner fijo con una sola foto cuenta una sola cosa. Si tenés varios productos destacados o promociones para avisar (envío gratis, nuevo canal de mayoristas, descuentos), no tenés dónde ponerlos sin ensuciar la portada.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Los carruseles resuelven esto: una franja de productos que se desliza sola, y una franja de texto con tus avisos rotando.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "🛍️", title: "Solo se ve un producto a la vez", desc: "Sin carrusel, mostrar varios destacados obliga a scrollear toda la tienda." },
              { icon: "📢", title: "No hay dónde avisar promos", desc: "Envío gratis, nuevo canal, descuentos — sin una franja dedicada, esos avisos no se ven." },
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
              { n: "1", title: "Activás la cosita", desc: "Desde tu panel, con un click. Podés desactivarla cuando quieras." },
              { n: "2", title: "Elegís qué franjas mostrar", desc: "Carrusel de productos destacados, franja de texto con frases, o ambas." },
              { n: "3", title: "Cargás tus frases (si usás la de texto)", desc: "Promociones, envíos, redes — las que quieras, van rotando solas." },
              { n: "4", title: "Aparecen debajo del banner", desc: "El carrusel de productos siempre muestra productos reales de tu tienda, actualizado solo." },
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
              Podés activar solo el carrusel de productos, solo la franja de texto, o los dos juntos. Ambos son opcionales e independientes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
            {[
              { q: "¿Qué productos muestra el carrusel?", a: "Tus productos destacados si marcaste alguno, o tus productos en general si no marcaste ninguno. Siempre productos reales de tu tienda." },
              { q: "¿Puedo escribir mis propias frases para la franja de texto?", a: "Sí, cargás las que quieras desde tu panel — promociones, envíos, redes, lo que necesites avisar." },
              { q: "¿Cuántas frases puedo poner?", a: "Las que quieras, van rotando en fila continua." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Las dos franjas desaparecen de tu tienda. Sin cambios en tus productos." },
              { q: "¿Funciona con cualquier temple de mi tienda?", a: "Sí, aparece debajo del banner sin importar qué temple tengas activo." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Dale movimiento a tu portada</h2>
          <p className="text-slate-400 mb-8">$2 USD por mes. Cancelás cuando querés.</p>
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
            <Link href="/plan-cositas/galeria-imagenes" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Galería de Imágenes →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
