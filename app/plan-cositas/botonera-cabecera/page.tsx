import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Botonera Cabecera — Páginas propias (Quiénes somos, Cómo comprar) en tu tienda",
  description: "Creá páginas propias sin límite (Quiénes somos, Cómo comprar, Guía de talles, Política de devolución) y aparecen solas como botones en el menú de tu tienda.",
  keywords: ["páginas propias tienda online", "quienes somos tienda online", "menu tienda online", "botonera cabecera tolar"],
  openGraph: {
    title: "Botonera Cabecera — Páginas propias en tu tienda",
    description: "Creá páginas propias sin límite y aparecen solas como botones en el menú de tu tienda.",
    url: "https://tol.ar/plan-cositas/botonera-cabecera",
  }
}

export default async function BotoneraCabeceraPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "botonera_cabecera")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Botonera Cabecera</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            Creá las páginas que necesites — Quiénes somos, Cómo comprar, Guía de talles, Política de devolución, lo que sea — y aparecen solas como botones en el menú de tu tienda. Sin límite de páginas.
          </p>
          <div className="grid sm:grid-cols-5 gap-4 items-center max-w-3xl mx-auto">
            <div className="sm:col-span-3 aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              <span className="text-xs text-center px-4">Video explicativo — próximamente</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3 justify-center">
              <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center">
                Activar por $1 USD/mes
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Te preguntan siempre lo mismo por WhatsApp?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Sin páginas propias, cada vez que alguien pregunta cómo comprar, cuál es tu talle, o si hacés cambios, tenés que explicarlo de nuevo a mano. Y tu tienda no transmite la misma confianza que una con historia y políticas claras a la vista.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Botonera Cabecera activada, escribís el contenido una sola vez y queda disponible siempre, como un botón más en el menú de arriba de tu tienda — igual que cualquier tienda grande.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>

          <div className="space-y-8">
            {[
              { n: "1", title: "Activás la cosita", desc: "Desde tu panel, con un click. Podés desactivarla cuando quieras." },
              { n: "2", title: "Creás tus páginas", desc: "En la pestaña \"Páginas\", ponés un título (ej. \"Cómo comprar\") y escribís el contenido. Sin límite de cuántas crees." },
              { n: "3", title: "Aparecen solas en el menú", desc: "Cada página publicada suma un botón más en la cabecera de tu tienda, con el título que le pusiste." },
              { n: "4", title: "Las editás cuando quieras", desc: "Volvés a la pestaña \"Páginas\" y cambiás el texto, lo despublicás, o lo borrás." },
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
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Preguntas frecuentes</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
            {[
              { q: "¿Cuántas páginas puedo crear?", a: "Las que quieras, no hay límite mientras la cosita esté activa." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Los botones desaparecen del menú de tu tienda. El contenido que ya escribiste queda guardado por si la reactivás." },
              { q: "¿Funciona con cualquier temple de mi tienda?", a: "Hoy está disponible en los temples Moderno y Pink. Se va sumando al resto." },
              { q: "¿Puedo poner cualquier título?", a: "Sí, el título que le pongas a la página es el texto que se muestra en el botón del menú." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Una tienda con historia y reglas claras</h2>
          <p className="text-slate-400 mb-8">$1 USD por mes, páginas ilimitadas. Cancelás cuando querés.</p>
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
            <Link href="/plan-cositas/cuentas-clientes" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Cuentas de Clientes →</Link>
            <Link href="/plan-cositas/carruseles" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Carruseles →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
