import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { getBrand } from "@/lib/get-brand"
import { getActivarHref } from "@/lib/get-activar-href"

export const metadata: Metadata = {
  title: "Oferta Destacada — Mostrá un producto completo en tu portada, gratis",
  description: "Elegí el producto que marcás con la estrella en Productos y se muestra completo (galería, precio y botón de compra) en un lugar fijo del inicio de tu tienda. Sin costo.",
  keywords: ["producto destacado tienda online", "vidriera producto portada", "destacar producto inicio tienda argentina", "oferta destacada tolar"],
  openGraph: {
    title: "Oferta Destacada — Mostrá un producto completo en tu portada, gratis",
    description: "Elegí el producto que marcás con la estrella en Productos y se muestra completo (galería, precio y botón de compra) en un lugar fijo del inicio de tu tienda.",
    url: "https://tol.ar/plan-cositas/oferta-destacada",
  }
}

export default async function OfertaDestacadaPage({ searchParams }: { searchParams: Promise<{ tienda?: string }> }) {
  const { tienda } = await searchParams
  const activarHref = getActivarHref(tienda, "oferta_destacada")
  const brand = await getBrand()
  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />

      {/* HERO */}
      <section className="py-16 md:py-24 text-center border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm mb-6">
            Cositas tol.ar · Gratis
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Oferta Destacada</h1>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-xl text-orange-500 mb-8 leading-relaxed">
            El producto que marcás con la estrella en Productos se muestra completo —galería de fotos, precio y
            botón de compra— en un lugar fijo del inicio de tu tienda.
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
                Activar — Gratis
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Tenés un producto estrella y se pierde entre los demás?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            En una grilla de productos, todos se ven del mismo tamaño. Si tenés uno que querés mostrar de verdad
            —con todas sus fotos, su descripción completa y bien a la vista— no tenés dónde ponerlo sin armar una
            sección nueva a mano.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Oferta Destacada resuelve esto: marcás la estrella en ese producto desde Productos, y aparece solo, en
            grande, en un lugar fijo de tu portada.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cómo funciona</h2>

          <div className="space-y-8">
            {[
              { n: "1", title: "Marcás la estrella en Productos", desc: "Desde tu panel, en la pestaña Productos, tocás la estrella del producto que querés mostrar." },
              { n: "2", title: "Aparece solo en tu portada", desc: "Galería de fotos con miniaturas, precio (con el descuento si cargaste uno), descripción y botón de compra." },
              { n: "3", title: "Cambiás cuándo quieras", desc: "Marcás otra estrella y la sección se actualiza sola, sin tocar nada más." },
              { n: "4", title: "Sin producto marcado, no se muestra nada", desc: "Si no usás la estrella, tu portada queda exactamente igual que siempre." },
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
              Esta cosita es gratis y ya está activa en tu tienda: no hay que comprarla ni activarla por separado.
              Solo depende de que marques un producto con la estrella.
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
              { q: "¿Cuánto cuesta?", a: "Nada, es gratis para todas las tiendas." },
              { q: "¿Qué producto se muestra?", a: "El que tenga marcada la estrella en Productos. Es la misma estrella que usan Carruseles y Destacados." },
              { q: "¿Puedo elegir más de un producto?", a: "No, Oferta Destacada muestra siempre uno solo: el primero que encuentre marcado con la estrella." },
              { q: "¿Dónde aparece exactamente?", a: "Cerca del inicio de tu portada, debajo del banner y los carruseles (si los tenés activados)." },
              { q: "¿Funciona con cualquier diseño de mi tienda?", a: "Sí, aparece sin importar qué temple tengas activo." },
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
          <h2 className="text-3xl font-bold text-white mb-3">Dale lugar a tu producto estrella</h2>
          <p className="text-slate-400 mb-8">Gratis. Sin pasos de pago ni activación.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={activarHref} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Ir a Productos
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
            <Link href="/plan-cositas/carruseles" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Carruseles →</Link>
            <Link href="/plan-cositas/galeria-imagenes" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Galería de Imágenes →</Link>
            <Link href="/plan-cositas" className="text-sm text-slate-600 hover:text-black border border-slate-200 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors">Ver todas las cositas →</Link>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
