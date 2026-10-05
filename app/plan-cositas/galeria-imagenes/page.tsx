import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Galería de Imágenes — Mostrá tus productos desde todos los ángulos",
  description: "Subí hasta 5 fotos por producto y mostralas en una galería deslizable. Tus clientes ven el producto de verdad antes de comprar.",
  keywords: ["galeria de fotos tienda online", "multiples fotos por producto argentina", "galeria interactiva ecommerce", "galeria imagenes tolar"],
  openGraph: {
    title: "Galería de Imágenes — Mostrá tus productos desde todos los ángulos",
    description: "Subí hasta 5 fotos por producto y mostralas en una galería deslizable.",
    url: "https://tol.ar/plan-cositas/galeria-imagenes",
  }
}

export default async function GaleriaImagenesPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "multi_images")
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Galería de Imágenes</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            Subí hasta 5 fotos por producto y mostralas en una galería deslizable. Tus clientes ven el producto desde todos los ángulos antes de comprar.
          </p>
          <div className="grid sm:grid-cols-5 gap-4 items-center max-w-3xl mx-auto">
            <div className="sm:col-span-3 aspect-video rounded-xl overflow-hidden border border-slate-200">
              <iframe
                src="https://www.youtube.com/embed/DMgNkjOVLs4"
                title="Cómo sacar buenas fotos de tus productos con el celular"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3 justify-center">
              <Link href={activarHref} className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors text-center">
                Probar 8 días gratis
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Tus productos tienen una sola foto?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Con una sola imagen, el cliente no ve bien la tela, el detalle, el color real o cómo se ve el producto desde otro ángulo. Esa duda es una de las razones más comunes por las que alguien no termina de comprar.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Con Galería de Imágenes, cada producto puede mostrar hasta 5 fotos en una galería deslizable, como en las tiendas grandes.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "📷", title: "Una sola foto genera dudas", desc: "El cliente no ve el detalle, la tela o el color real del producto." },
              { icon: "🖼️", title: "Galería deslizable", desc: "Hasta 5 fotos por producto, el cliente desliza y ve todos los ángulos." },
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
              { n: "1", title: "Entrás a un producto en tu admin", desc: "El de siempre, donde ya cargás nombre, precio y descripción." },
              { n: "2", title: "Subís hasta 5 fotos", desc: "Además de la foto principal, sumás las que quieras hasta llegar a 5 por producto." },
              { n: "3", title: "Tu cliente desliza la galería", desc: "En la ficha del producto, tu cliente pasa las fotos como en cualquier app de compras grande." },
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
              { q: "¿Cuántas fotos puedo subir por producto?", a: "Hasta 5 fotos por producto." },
              { q: "¿Tengo que resubir las fotos que ya tenía?", a: "No. La foto principal que ya cargaste se mantiene, solo sumás las adicionales." },
              { q: "¿Qué pasa si desactivo la cosita?", a: "Tus productos vuelven a mostrar solo la foto principal. Las demás fotos no se borran, quedan guardadas." },
              { q: "¿Funciona en celular?", a: "Sí, la galería se desliza igual en celular, tablet o computadora." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Mostrá tus productos de verdad</h2>
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
            <Link href="/plan-cositas/modelos-templates" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Modelos/Templates →</Link>
            <Link href="/plan-cositas/portada-especial" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Diseño Customizado de Portada →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
