"use client"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const beneficios = [
  {
    tk: "b1_titulo",
    td: "No pagás nada por sumarte",
    dk: "b1_desc",
    dd: "No hay costo de alta ni mensualidad. Solo cobramos comisión sobre lo que efectivamente vendamos por vos.",
  },
  {
    tk: "b2_titulo",
    td: "Vos seguís vendiendo igual que siempre",
    dk: "b2_desc",
    dd: "Esto no reemplaza nada de lo que ya hacés, es un canal de venta extra.",
  },
  {
    tk: "b3_titulo",
    td: "Solo cobramos si vendemos",
    dk: "b3_desc",
    dd: "10% de comisión, únicamente sobre lo que se vende a través de tol.ar. Si no vendemos, no pagás nada.",
  },
  {
    tk: "b4_titulo",
    td: "Te vas cuando quieras",
    dk: "b4_desc",
    dd: "Avisando con 30 días de anticipación (alcanza un mail), sin penalidad.",
  },
]

type Estado = "idle" | "enviando" | "enviado_si" | "enviado_no" | "error"

interface Props {
  brand?: "tol" | "tiendabasica"
  negocio: string
  email: string
}

export default function ProgramaReventaClient({ brand = "tol", negocio, email }: Props) {
  const { isAdmin, get } = usePageContent("programa-reventa")
  const [estado, setEstado] = useState<Estado>("idle")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="programa-reventa" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#16a34a" />
  )

  const responder = async (decision: "si" | "no") => {
    setEstado("enviando")
    try {
      const res = await fetch("/api/programa-reventa-consentimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negocio, email, decision }),
      })
      if (!res.ok) throw new Error("fallo")
      setEstado(decision === "si" ? "enviado_si" : "enviado_no")
    } catch {
      setEstado("error")
    }
  }

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #14532d, #16a34a)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <p className="text-green-700 font-semibold text-sm mb-2 uppercase tracking-wide">
            {ET("kicker", "Programa de reventa online — tol.ar")}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {negocio ? (
              <>
                {ET("h1_saludo", "Hola")}, {negocio} 👋
              </>
            ) : (
              ET("h1_saludo", "Hola 👋")
            )}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {ET(
              "intro",
              "Te escribimos desde Tienda Online (tiendaonline.com.ar). Vendemos por internet los productos de negocios como el tuyo, sin que tengas que hacer nada ni pagar nada por adelantado."
            )}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10">
            <p className="text-green-900 font-semibold text-lg">{ET("resumen_titulo", "En criollo")}</p>
            <p className="text-green-800 mt-2">
              {ET(
                "resumen_texto",
                "Publicamos tus productos (fotos, precios y descripciones tal cual los tenés) en tol.ar. Si vendemos algo, cobramos 10% de comisión solo sobre esa venta. Si no vendemos nada, no pagás nada. Vos seguís vendiendo como siempre, esto es un canal extra. Podés dar de baja el acuerdo cuando quieras."
              )}
            </p>
          </div>

          <div className="space-y-5 mb-10">
            {beneficios.map((b) => (
              <div key={b.tk} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">{ET(b.tk, b.td)}</p>
                  <p className="text-gray-600 text-sm">{ET(b.dk, b.dd)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            {estado === "enviado_si" && (
              <p className="text-green-700 font-semibold text-center py-4">
                {ET("gracias_si", "¡Gracias! Registramos que querés sumarte. En breve te contactamos para arrancar.")}
              </p>
            )}
            {estado === "enviado_no" && (
              <p className="text-gray-600 font-semibold text-center py-4">
                {ET("gracias_no", "Gracias por responder. No vamos a publicar tus productos. Si cambiás de opinión, escribinos cuando quieras.")}
              </p>
            )}
            {estado === "error" && (
              <p className="text-red-600 text-sm text-center mb-4">
                {ET("error_texto", "No pudimos registrar tu respuesta. Probá de nuevo o escribinos a soporte@tiendaonline.com.ar.")}
              </p>
            )}
            {(estado === "idle" || estado === "enviando" || estado === "error") && (
              <>
                <p className="font-semibold text-gray-900 mb-4 text-center">
                  {ET("pregunta", "¿Querés que sumemos tu negocio al programa?")}
                </p>
                <p className="text-gray-500 text-xs mb-4 text-center">
                  {ET("legal_previo", "Al hacer clic en \"Sí, quiero sumar mi negocio\" aceptás los")}{" "}
                  <Link href="/scraping-terminos-condiciones" className="underline hover:text-gray-700" target="_blank">
                    {ET("legal_link", "Términos y condiciones del programa de reventa online")}
                  </Link>
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => responder("si")}
                    disabled={estado === "enviando"}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition"
                  >
                    {estado === "enviando" ? "Enviando..." : "Sí, quiero sumar mi negocio"}
                  </button>
                  <button
                    onClick={() => responder("no")}
                    disabled={estado === "enviando"}
                    className="bg-white hover:bg-gray-100 disabled:opacity-60 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300 transition"
                  >
                    No, gracias
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
