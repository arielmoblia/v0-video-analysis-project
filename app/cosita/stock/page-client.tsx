"use client"

import Link from "next/link"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "cosita-stock"
const ACCENT = "#d97706"

const PASOS = [
  { n: "1", key: "paso1", title: "Un stock único para todo el negocio", desc: "Sabés cuánto tenés de cada producto y en qué sucursal está. Ej: Avellaneda: 3 pantalones pinzados, Centro: 5 pantalones pinzados." },
  { n: "2", key: "paso2", title: "Cada venta descuenta del mismo pozo", desc: "Se venda en Avellaneda, en Centro o online, el número se actualiza para todos." },
  { n: "3", key: "paso3", title: "Vista por sucursal y vista total", desc: "Podés ver el stock general de todo el negocio, o filtrar por sucursal o punto de venta." },
]

const PARA_QUIEN = [
  { key: "pq1", text: "Tenés dos o más sucursales o puntos de venta físicos" },
  { key: "pq2", text: "Te pasó vender algo que no tenías y tener que hacer esperar al cliente, correr a conseguirlo, o devolverle la plata" },
  { key: "pq3", text: "Cada sucursal controla su stock por separado, sin visibilidad del resto" },
  { key: "pq4", text: "Vendés también online y no sabés de qué sucursal saldría el envío" },
  { key: "pq5", text: "Hoy cruzás los números a mano o por planilla" },
]

const FAQS = [
  { pk: "faq1_p", pd: "¿Esta función ya existe?", rk: "faq1_r", rd: "No todavía. Es una idea que estamos evaluando construir. Esta página junta opiniones antes de empezar a programarla." },
  { pk: "faq2_p", pd: "¿Se conecta con el sistema de cada sucursal?", rk: "faq2_r", rd: "En esta primera idea no — cada sucursal registra sus ventas ahí mismo y todas descuentan del mismo stock. Una conexión automática con otros sistemas de punto de venta sería una etapa posterior." },
  { pk: "faq3_p", pd: "¿Cuánto va a costar?", rk: "faq3_r", rd: "Todavía no está definido. Depende de cuánto interés real haya." },
  { pk: "faq4_p", pd: "¿Cuándo estaría lista?", rk: "faq4_r", rd: "No hay fecha. Primero queremos confirmar que resuelve un problema real antes de construirla." },
]

export default function StockPageClient() {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor={ACCENT} />
  )

  return (
    <div className="min-h-screen bg-white">
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #b45309, #d97706)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      {/* HERO */}
      <section className="py-16 md:py-24 text-center border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm mb-6 border border-amber-200">
            {ET("hero_badge", "Idea en evaluación — todavía no existe")}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">{ET("hero_titulo", "Stock")}</h1>
          <p className="text-xl text-slate-500 mb-8 leading-relaxed">
            {ET("hero_subtitulo", "Centralizá el stock de todas tus sucursales y puntos de venta en un solo lugar. Sabés cuánto tenés y dónde está, y cada venta —en cualquier sucursal o en tu tienda online— descuenta del mismo stock.")}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contacto" className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Me interesa, contame más
            </Link>
            <Link href="/cositas" className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Ver todas las cositas
            </Link>
          </div>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{ET("problema_titulo", "¿Le vendiste algo que no tenías?")}</h2>
          {ET("problema_texto", "Le vendiste un producto que en realidad no tenías en esa sucursal. Ahora tenés tres opciones, todas malas: hacerlo esperar días hasta conseguirlo, correr a producirlo de urgencia, o devolverle la plata y perder la venta. Pasa porque cada sucursal maneja su stock por separado — nadie tiene el número real de todo el negocio junto.", "p", "text-lg text-slate-600 leading-relaxed")}
        </div>
      </section>

      {/* COMO FUNCIONARIA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{ET("pasos_titulo", "Cómo funcionaría")}</h2>
          <p className="text-slate-500 mb-10">{ET("pasos_subtitulo", "Esta es la idea que estamos evaluando construir — todavía no está programada.")}</p>
          <div className="space-y-8">
            {PASOS.map(step => (
              <div key={step.n} className="flex gap-5 items-start">
                <div className="w-10 h-10 min-w-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-lg">{ET(`${step.key}_titulo`, step.title)}</h3>
                  <p className="text-slate-500 leading-relaxed">{ET(`${step.key}_desc`, step.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIEN ES */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{ET("paraquien_titulo", "¿Es para vos?")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PARA_QUIEN.map((item) => (
              <div key={item.key} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-slate-100">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span className="text-slate-600">{ET(item.key, item.text)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">{ET("faq_titulo", "Preguntas frecuentes")}</h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {FAQS.map(({ pk, pd, rk, rd }) => (
              <div key={pk} className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{ET(pk, pd)}</h3>
                <p className="text-slate-500">{ET(rk, rd)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{ET("cta_titulo", "¿Te pasa esto con tus sucursales?")}</h2>
          <p className="text-slate-400 mb-8">{ET("cta_subtitulo", "Contanos tu caso — nos ayuda a decidir si vale la pena construirla.")}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contacto" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Contarles mi caso
            </Link>
            <Link href="/cositas" className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Ver todas las cositas
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
