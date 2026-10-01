import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Cuentas de Clientes — Login, pedidos y promos para tus compradores",
  description: "Tus clientes se registran, ven su historial de pedidos y cambian su contraseña. Vos ves el listado completo con cuánto gastó cada uno, para mandarles promos.",
  keywords: ["cuentas de clientes tienda online", "login de clientes ecommerce", "historial de pedidos tienda online", "cuentas de clientes tolar"],
  openGraph: {
    title: "Cuentas de Clientes — Login, pedidos y promos para tus compradores",
    description: "Tus clientes se registran, ven su historial de pedidos y cambian su contraseña. Vos ves el listado completo con cuánto gastó cada uno.",
    url: "https://tol.ar/plan-cositas/cuentas-clientes",
  }
}

export default async function CuentasClientesPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "customer_accounts")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Cuentas de Clientes</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            Tus clientes se registran con su email y contraseña, ven todos sus pedidos pasados, y pueden cambiar su contraseña. Vos ves el listado completo con cuánto gastó cada uno.
          </p>
          <div className="grid sm:grid-cols-5 gap-4 items-center max-w-3xl mx-auto">
            <div className="sm:col-span-3 aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Tus clientes compran siempre como invitados?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Sin cuenta, cada cliente tiene que volver a escribir sus datos en cada compra, no tiene forma de ver sus pedidos anteriores, y vos no sabés quién te compra más para poder premiarlo o mandarle una promo puntual.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Cuentas de Clientes activado, tu tienda tiene su propio sistema de login para compradores: se registran una vez, entran cuando quieran, y vos tenés un listado ordenado por cuánto gastó cada uno.
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
              { n: "2", title: "Tu cliente se registra", desc: "Con nombre, email, teléfono y una contraseña, desde el botón \"Mi cuenta\" de tu tienda." },
              { n: "3", title: "Ve sus pedidos y cambia su contraseña", desc: "Entrando con su cuenta, en cualquier momento, sin tener que escribirte a vos." },
              { n: "4", title: "Vos ves el listado completo", desc: "En tu panel, pestaña \"Clientes\": nombre, contacto, cuántos pedidos hizo y cuánto gastó en total, ordenado de mayor a menor." },
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
              { q: "¿Las contraseñas de mis clientes quedan seguras?", a: "Sí, se guardan encriptadas (bcrypt), ni vos ni nadie del equipo de tol.ar puede verlas en texto plano." },
              { q: "¿Mis clientes pueden comprar sin registrarse?", a: "Sí, seguir comprando como invitado sigue funcionando igual que siempre. La cuenta es opcional para ellos." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "El botón de \"Mi cuenta\" desaparece de tu tienda. Los clientes que ya se registraron quedan guardados por si la reactivás." },
              { q: "¿Funciona con cualquier temple de mi tienda?", a: "Sí, es un botón flotante que aparece en cualquier plantilla, sin importar qué temple tengas activo." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Conocé a tus clientes</h2>
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
            <Link href="/plan-cositas/mayorista-minorista" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Mayorista / Minorista →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
