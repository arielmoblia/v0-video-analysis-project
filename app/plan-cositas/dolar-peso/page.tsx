import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Dólar / Peso — Precios en dólares, tus clientes ven pesos",
  description: "Cargá tus productos en dólares y tus clientes los ven en pesos automáticamente. Nunca más actualizás precios por inflación. Se actualiza solo con la cotización del día.",
  keywords: ["precios en dolares pesos argentina", "actualizar precios dolar automatico tienda online", "cotizacion dolar blue tienda", "dolar peso tolar"],
  openGraph: {
    title: "Dólar / Peso — Precios en dólares, tus clientes ven pesos",
    description: "Cargá tus productos en dólares y tus clientes los ven en pesos automáticamente.",
    url: "https://tol.ar/plan-cositas/dolar-peso",
  }
}

type DolarCotizacion = { key: string; precio: number; rec: boolean; desc: string }

const DOLAR_FALLBACK: DolarCotizacion[] = [
  { key: "Blue", precio: 1405, rec: true, desc: "El más usado para fijar precios en negocios reales. Refleja la realidad económica del argentino común." },
  { key: "Bolsa (MEP)", precio: 1426, rec: false, desc: "Legal y muy usado por empresas. Se opera a través de la bolsa." },
  { key: "CCL", precio: 1485, rec: false, desc: "Similar al MEP pero involucra bonos en el exterior. Suele ser un poco más caro." },
  { key: "Oficial", precio: 1395, rec: false, desc: "El del Banco Nación. El más bajo de todos." },
]

async function getDolarCotizaciones(): Promise<DolarCotizacion[]> {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", { next: { revalidate: 3600 } })
    const data = await res.json()
    const porCasa = (casa: string) => data.find((d: any) => d.casa === casa)?.venta
    const blue = porCasa("blue")
    const bolsa = porCasa("bolsa")
    const ccl = porCasa("contadoconliqui")
    const oficial = porCasa("oficial")
    if (![blue, bolsa, ccl, oficial].every((v) => typeof v === "number")) return DOLAR_FALLBACK
    return [
      { key: "Blue", precio: Math.round(blue), rec: true, desc: "El más usado para fijar precios en negocios reales. Refleja la realidad económica del argentino común." },
      { key: "Bolsa (MEP)", precio: Math.round(bolsa), rec: false, desc: "Legal y muy usado por empresas. Se opera a través de la bolsa." },
      { key: "CCL", precio: Math.round(ccl), rec: false, desc: "Similar al MEP pero involucra bonos en el exterior. Suele ser un poco más caro." },
      { key: "Oficial", precio: Math.round(oficial), rec: false, desc: "El del Banco Nación. El más bajo de todos." },
    ]
  } catch {
    return DOLAR_FALLBACK
  }
}

export default async function DolarPesoPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "dolar_peso")
  const brand = await getBrand()
  const cotizaciones = await getDolarCotizaciones()
  const dolarVenta = cotizaciones.find((c) => c.key === "Blue")?.precio ?? 1405
  const pesosDemo = (dolarVenta * 10).toLocaleString("es-AR")
  const precioMensualArs = dolarVenta.toLocaleString("es-AR")
  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />

      {/* HERO */}
      <section className="py-16 md:py-24 text-center border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm mb-6">
            Cositas tol.ar
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Dólar / Peso</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            Cargá tus precios en dólares y tus clientes los ven en pesos argentinos automáticamente. Nunca más actualizás por inflación.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 items-stretch max-w-xl mx-auto">
            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36a.75.75 0 011.28.53v6.36a.75.75 0 01-1.28.53L15.75 13.5M4.5 6h9a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 16.5v-9A1.5 1.5 0 014.5 6z" />
              </svg>
              <span className="text-xs text-center px-4">Video explicativo — próximamente</span>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center">
                Activar por ${precioMensualArs}/mes
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Actualizás precios cada vez que sube el dólar?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            En Argentina los precios cambian todo el tiempo. Si vendés ropa, electrónica, perfumes o cualquier producto que sigue al dólar, sabés lo que es entrar al admin cada semana a cambiar precios uno por uno.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Y si no lo hacés, vendés a pérdida sin darte cuenta.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "⏱", title: "Perdés horas actualizando", desc: "Entrás al admin, cambiás producto por producto. Horas que podrías usar para vender." },
              { icon: "📉", title: "O dejás precios viejos", desc: "El dólar sube y tus precios se quedan atrás. Vendés de menos sin darte cuenta." },
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
              <p className="text-sm text-slate-400 mb-2">Vos cargás</p>
              <p className="text-4xl font-bold text-slate-900">$10 USD</p>
            </div>
            <div className="text-slate-300 text-3xl">→</div>
            <div className="flex-1 text-center bg-black rounded-xl p-6">
              <p className="text-sm text-slate-400 mb-2">Tu cliente ve</p>
              <p className="text-4xl font-bold text-white">${pesosDemo} ARS</p>
              <p className="text-xs text-slate-500 mt-2">actualizado hoy</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { n: "1", title: "Cargás tus productos en dólares", desc: "Una sola vez. Ponés el precio real en USD y no lo tocás más." },
              { n: "2", title: "Elegís con qué dólar trabajar", desc: "Blue, MEP, CCL, Oficial — vos decidís cuál refleja mejor tu negocio." },
              { n: "3", title: "Tus clientes ven el precio en pesos", desc: "Automático, actualizado con la cotización del día. Sin que hagas nada." },
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

      {/* ELEGÍS EL DÓLAR */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Elegís con qué dólar trabajar</h2>
          <p className="text-slate-500 mb-8">No todos los negocios son iguales. Vos sabés mejor que nadie cuál dólar refleja tu realidad.</p>
          <div className="space-y-3">
            {cotizaciones.map((d, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-5 py-4 ${d.rec ? "bg-black text-white" : "bg-white border border-slate-100"}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${d.rec ? "text-white" : "text-slate-900"}`}>{d.key}</span>
                    {d.rec && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">recomendado</span>}
                  </div>
                  <p className={`text-sm mt-0.5 ${d.rec ? "text-slate-400" : "text-slate-400"}`}>{d.desc}</p>
                </div>
                <span className={`text-xl font-bold ml-4 whitespace-nowrap ${d.rec ? "text-white" : "text-slate-700"}`}>${d.precio.toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-right">Fuente: dolarapi.com · cotización del día</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {[
              { q: "¿Con qué frecuencia se actualiza la cotización?", a: "Una vez por día, automáticamente. Siempre refleja la cotización del día actual." },
              { q: "¿Mis productos siguen en dólares en el admin?", a: "Sí. Vos seguís viendo y editando los precios en dólares en tu panel. Solo tus clientes ven el equivalente en pesos." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Tus clientes vuelven a ver los precios en dólares. Sin cambios en los productos." },
              { q: "¿Puedo cambiar el tipo de dólar cuando quiero?", a: "Sí, desde tu panel podés cambiar entre Blue, MEP, CCL u Oficial en cualquier momento." },
              { q: "¿Funciona con todos los productos?", a: "Sí. Aplica a todos los productos de tu tienda automáticamente." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Olvidate de actualizar precios</h2>
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
            <Link href="/plan-cositas/lupa" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Lupa →</Link>
            <Link href="/plan-cositas/estadisticas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Estadísticas →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
