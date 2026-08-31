import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Mayorista / Minorista — Dos tiendas conectadas, un solo negocio",
  description: "Tené una tienda para vender por mayor y otra para vender por menor, cada una con sus propios precios, conectadas por un botón en el encabezado.",
  keywords: ["tienda mayorista y minorista argentina", "vender por mayor y por menor online", "tienda online mayorista tolar", "dos tiendas conectadas"],
  openGraph: {
    title: "Mayorista / Minorista — Dos tiendas conectadas, un solo negocio",
    description: "Tené una tienda para vender por mayor y otra para vender por menor, conectadas por un botón en el encabezado.",
    url: "https://tol.ar/plan-cositas/mayorista-minorista",
  }
}

export default function MayoristaMinoristaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="py-16 md:py-24 text-center border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm mb-6">
            Cositas tol.ar · Próximamente
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Mayorista / Minorista</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Dos tiendas separadas, una para vender por mayor y otra por menor, cada una con sus propios precios y productos. Un botón en el encabezado de cada una lleva directo a la otra.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/plan-cositas" className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Me interesa esta cosita
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Vendés por mayor y por menor, pero todo mezclado en un solo lugar?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Si le vendés tanto a otros comercios (por mayor, con precios más bajos) como directo al público (por menor), mostrar todo en una sola tienda genera confusión: el comprador final ve precios que no son para él, o el revendedor no encuentra las condiciones que necesita.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            La solución más simple no es mezclar todo en una tienda: es tener dos tiendas separadas y conectadas.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "🏬", title: "Precios mezclados confunden", desc: "Si mostrás precio mayorista y minorista juntos, nadie entiende bien cuál le corresponde a quién." },
              { icon: "🔀", title: "Cada público busca algo distinto", desc: "El comprador final quiere ver el precio final. El revendedor quiere condiciones de por mayor." },
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
              <p className="text-sm text-slate-400 mb-2">Tienda minorista</p>
              <p className="text-2xl font-bold text-slate-900">tutienda.tol.ar</p>
              <p className="text-xs text-slate-400 mt-2">precios al público</p>
            </div>
            <div className="text-slate-300 text-3xl">⇄</div>
            <div className="flex-1 text-center bg-black rounded-xl p-6">
              <p className="text-sm text-slate-400 mb-2">Tienda mayorista</p>
              <p className="text-2xl font-bold text-white">tutiendamayorista.tol.ar</p>
              <p className="text-xs text-slate-500 mt-2">precios por mayor</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { n: "1", title: "Armás tu tienda minorista", desc: "La tienda de siempre, con tus productos y precios al público." },
              { n: "2", title: "Armás tu tienda mayorista", desc: "Una segunda tienda, con su propia URL y administración, con precios y condiciones de por mayor." },
              { n: "3", title: "Las conectás con un botón", desc: "En el encabezado de cada una aparece un botón, por ejemplo 'Venta mayorista' o 'Venta minorista', que lleva directo a la otra tienda." },
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
              Son dos tiendas completamente independientes: cada una con su propio catálogo, precios y administración. Lo único que las une es el botón visual en el encabezado.
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
              { q: "¿Es una sola tienda con dos vistas o dos tiendas separadas?", a: "Son dos tiendas separadas, cada una con su propio catálogo, precios y panel de administración. Solo están conectadas por un botón." },
              { q: "¿Tengo que cargar los productos en las dos tiendas?", a: "Sí, hoy cada tienda se carga y administra por separado." },
              { q: "¿Puedo elegir el texto del botón?", a: "Sí, por ejemplo 'Venta mayorista' o 'Venta minorista', y a qué tienda apunta." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "El botón desaparece del encabezado. Las dos tiendas siguen funcionando de forma independiente, cada una con su URL." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Separá tu venta por mayor de tu venta por menor</h2>
          <p className="text-slate-400 mb-8">Esta cosita está en preparación. Contanos si te interesa para tu tienda.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/plan-cositas" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Me interesa esta cosita
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
            <Link href="/plan-cositas/dropshipping" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Dropshipping →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
