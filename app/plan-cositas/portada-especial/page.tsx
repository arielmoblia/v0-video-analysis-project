import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Portada especial — Copiá el estilo de otra tienda que te guste",
  description: "Pegá el link de una tienda que te guste y armamos la portada de tu tienda con ese estilo, usando tus productos y fotos reales.",
  keywords: ["clonar diseño tienda", "portada personalizada tienda online", "copiar estilo tienda argentina", "portada especial tol.ar"],
  openGraph: {
    title: "Portada especial — Copiá el estilo de otra tienda que te guste",
    description: "Pegá el link de una tienda que te guste y armamos la portada de tu tienda con ese estilo, usando tus productos y fotos reales.",
    url: "https://tol.ar/plan-cositas/portada-especial",
  }
}

export default async function PortadaEspecialPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "nuevo_propio")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Portada especial</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Pegá el link de una tienda que te guste y armamos la portada de tu tienda con ese estilo, usando tus productos y fotos reales.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Comprar por $10 USD
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Ya sabés cómo querés que se vea tu tienda?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            A veces no hace falta elegir entre nuestros modelos: ya viste una tienda (tuya de antes, o de otro lado) con la que querés que la tuya se parezca. Ese trabajo de diseño desde cero lleva tiempo y no siempre sale igual.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Portada especial, armamos nosotros esa portada a mano, con el estilo de la página que nos mandes, pero con tus productos y fotos reales.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>
          <div className="space-y-8">
            {[
              { n: "1", title: "Pegás el link de la página que te gusta", desc: "Puede ser tu tienda vieja en otra plataforma, o cualquier página que te guste como referencia de diseño." },
              { n: "2", title: "Pagás una sola vez ($10 USD)", desc: "Sin mensualidad. Es un trabajo de diseño puntual, no una suscripción." },
              { n: "3", title: "La armamos a mano", desc: "Tomamos el estilo (colores, banner, orden de secciones) de esa referencia y armamos tu portada con tus productos y fotos reales." },
              { n: "4", title: "Te avisamos cuando está lista", desc: "Vas a verla directo en el panel de tu tienda, en la sección \"Portada especial\"." },
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
              { q: "¿Esto clona todo el sitio de la página que mando?", a: "No, solo la portada (banner, colores, orden de secciones). Si querés clonar también el catálogo completo de otra tienda, esa es otra cosita distinta: \"Clonar con IA\"." },
              { q: "¿Puedo usar el link de mi propia tienda vieja?", a: "Sí, es el caso más común: gente que tenía su tienda en otra plataforma y quiere que la nueva en tol.ar se vea igual." },
              { q: "¿Cuánto tarda?", a: "Es un trabajo manual de nuestro equipo, así que puede tardar unos días según la cola de pedidos." },
              { q: "¿Se cobra de nuevo si pido otro cambio después?", a: "El armado inicial de la portada está incluido en el pago único. Cambios grandes posteriores se evalúan aparte." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Armemos tu portada</h2>
          <p className="text-slate-400 mb-8">$10 USD, pago único. Vos elegís el estilo, nosotros la armamos.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-violet-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-violet-600 transition-colors">
              Comprar ahora
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
            <Link href="/plan-cositas/modelos-templates" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Modelos/Templates →</Link>
            <Link href="/plan-cositas/dolar-peso" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Dólar/Peso →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
