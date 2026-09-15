import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Lupa — Grabá sesiones de tu tienda online",
  description: "Descubrí por qué tus clientes no compran. Grabá y reproducí cada visita a tu tienda online. Ves exactamente dónde hacen click y dónde se van. Probá 7 días gratis.",
  keywords: ["grabacion sesiones tienda online argentina", "heatmap ecommerce argentina", "por que no vendo en mi tienda online", "session recording tienda", "lupa tolar"],
  openGraph: {
    title: "Lupa — Grabá sesiones de tu tienda online",
    description: "Descubrí por qué tus clientes no compran. Grabá y reproducí cada visita a tu tienda.",
    url: "https://tol.ar/plan-cositas/lupa",
  }
}

export default async function LupaPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Lupa</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            Grabá y reproducí exactamente cómo navegan tus clientes. Descubrí por qué entran y no compran.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/plan-cositas" className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Probar 7 días gratis
            </Link>
            <Link href="/plan-cositas" className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Ver todos los planes
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <video
              src="/videos/lupa-demo.webm"
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Por qué tus clientes no compran?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Tenés visitas pero pocas ventas. El problema puede ser una foto que no se ve bien en celular, un botón que nadie encuentra, o un precio que asusta. Pero sin datos, es solo una suposición.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Lupa lo ves de verdad — como si te sentaras al lado de cada cliente mientras navega tu tienda online. Ves dónde hacen click, hasta dónde scrollean y en qué momento se van.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>
          <div className="space-y-8">
            {[
              { n: "1", title: "Se graba automáticamente", desc: "Cada vez que alguien entra a tu tienda online, Lupa graba todo lo que hace — sin que el cliente lo note. Sin configuración extra." },
              { n: "2", title: "Reproducís las sesiones", desc: "Desde tu panel de administración, elegís una sesión y la reproducís como un video. Ves el mouse moviéndose, los clicks, el scroll." },
              { n: "3", title: "Encontrás el problema y lo solucionás", desc: "Ves exactamente dónde se traban tus clientes. Una foto que no carga, un precio confuso, un botón que no se ve — lo encontrás y lo arreglás." },
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

      {/* PARA QUIEN ES */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Para quién es Lupa?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Tenés visitas pero pocas ventas",
              "Querés entender qué hace la gente en tu tienda",
              "Acabás de cambiar algo y querés ver si funcionó",
              "Vendés ropa, accesorios, alimentos o cualquier producto físico",
              "Tu tienda recibe tráfico desde Instagram o TikTok",
              "Querés mejorar sin adivinar",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-slate-100">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span className="text-slate-600">{item}</span>
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
              { q: "¿El cliente sabe que lo están grabando?", a: "No. La grabación es invisible y no afecta la experiencia ni la velocidad de tu tienda." },
              { q: "¿Cuántas sesiones puedo ver?", a: "Todas las que quieras. No hay límite de grabaciones ni de reproducciones." },
              { q: "¿Funciona en celular?", a: "Sí. Graba sesiones tanto de celular como de computadora o tablet." },
              { q: "¿Cuándo empiezo a ver datos?", a: "Apenas activás Lupa, las sesiones empiezan a grabarse. En minutos ya tenés las primeras grabaciones." },
              { q: "¿Es legal grabar las sesiones?", a: "Sí. Lupa graba el comportamiento de navegación de forma anónima, sin capturar datos personales como contraseñas o tarjetas." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Empezá a entender tu tienda hoy</h2>
          <p className="text-slate-400 mb-2">7 días de prueba gratis. Sin tarjeta de crédito.</p>
          <p className="text-2xl font-bold text-white mb-2">$1.441 ARS <span className="text-base font-normal text-slate-400">/ mes</span></p>
          <p className="text-slate-500 text-sm mb-8">= USD 1 al dólar blue de hoy</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/plan-cositas" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Probar 7 días gratis
            </Link>
            <Link href="/plan-cositas" className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Comprar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* LINKS INTERNOS */}
      <section className="py-12 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-slate-400 text-sm mb-4">Otras cositas que te pueden interesar</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/plan-cositas/estadisticas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Estadísticas →</Link>
            <Link href="/plan-cositas/seo-profesional" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">SEO Profesional →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <SeoExtraBlock page="plan-cositas-lupa" />
      <Footer brand={brand} />
    </div>
  )
}
