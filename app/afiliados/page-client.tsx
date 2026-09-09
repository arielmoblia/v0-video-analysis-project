"use client"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const beneficios = [
  {
    tk: "b1_titulo",
    td: "Cobrás por cada tienda que sumes",
    dk: "b1_desc",
    dd: "Recomendás tol.ar (a un conocido, en tus redes, en tu blog) y si esa tienda nueva pasa a un plan pago dentro de los primeros 60 días, ganás una comisión.",
  },
  {
    tk: "b2_titulo",
    td: "No hay costo ni exclusividad",
    dk: "b2_desc",
    dd: "No pagás nada por sumarte al programa y podés promocionar lo que quieras, de quien quieras. No hay horario ni instrucciones sobre cómo hacerlo.",
  },
  {
    tk: "b3_titulo",
    td: "Cobrás solo si hay resultado",
    dk: "b3_desc",
    dd: "Si la tienda que referiste no llega a pagar un plan, no cobrás nada. No hay pago fijo ni relación laboral de ningún tipo.",
  },
  {
    tk: "b4_titulo",
    td: "Te vas cuando quieras",
    dk: "b4_desc",
    dd: "Podés darte de baja del programa en cualquier momento, sin dar explicaciones y sin penalidad.",
  },
]

type Estado = "idle" | "enviando" | "enviado" | "error"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function AfiliadosClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("afiliados")
  const [estado, setEstado] = useState<Estado>("idle")
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [cuit, setCuit] = useState("")
  const [tipoAfiliado, setTipoAfiliado] = useState<"recomendacion" | "agencia">("recomendacion")
  const [comoPromociona, setComoPromociona] = useState("")
  const [modeloComision, setModeloComision] = useState<"fijo" | "porcentaje">("fijo")
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [codigo, setCodigo] = useState("")
  const [copiado, setCopiado] = useState(false)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="afiliados" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#7c3aed" />
  )

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email || !aceptaTerminos) return
    setEstado("enviando")
    try {
      const res = await fetch("/api/afiliados-registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, cuit, tipoAfiliado, comoPromociona, modeloComision }),
      })
      if (!res.ok) throw new Error("fallo")
      const data = await res.json()
      if (data.codigo) setCodigo(data.codigo)
      setEstado("enviado")
    } catch {
      setEstado("error")
    }
  }

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4c1d95, #7c3aed)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <p className="text-purple-700 font-semibold text-sm mb-2 uppercase tracking-wide">
            {ET("kicker", "Programa de Afiliados — tol.ar")}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Recomendá tol.ar y ganá por cada tienda que sumes")}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {ET(
              "intro",
              "Si conocés negocios que todavía no venden por internet, sumalos a tol.ar. Por cada tienda nueva que empiece a pagar un plan gracias a tu recomendación, ganás una comisión."
            )}
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-10">
            <p className="text-purple-900 font-semibold text-lg">{ET("resumen_titulo", "En criollo")}</p>
            <p className="text-purple-800 mt-2">
              {ET(
                "resumen_texto",
                "Te sumás gratis, nos mandás gente interesada en abrir su tienda online, y si esa tienda pasa a un plan pago dentro de los primeros 60 días, te pagamos una comisión por esa referencia. No hay exclusividad ni horarios: promocionás como y donde quieras. Si no hay venta, no hay pago — y podés darte de baja cuando quieras."
              )}
            </p>
          </div>

          <div className="space-y-5 mb-10">
            {beneficios.map((b) => (
              <div key={b.tk} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">{ET(b.tk, b.td)}</p>
                  <p className="text-gray-600 text-sm">{ET(b.dk, b.dd)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            {estado === "enviado" ? (
              <div className="text-center py-2">
                <p className="text-purple-700 font-semibold mb-4">
                  {ET("gracias", "¡Gracias por sumarte! En breve te contactamos para coordinar cómo seguimos.")}
                </p>
                {codigo && (
                  <div className="bg-white border border-purple-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-gray-700 mb-2">
                      Este es tu link único. Cada tienda que se cree a través de él queda registrada como referida tuya durante 60 días:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-purple-50 px-3 py-2 rounded text-sm text-purple-900 break-all">
                        https://tol.ar/?ref={codigo}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://tol.ar/?ref=${codigo}`)
                          setCopiado(true)
                          setTimeout(() => setCopiado(false), 2000)
                        }}
                        className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded transition"
                      >
                        {copiado ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={enviar}>
                <p className="font-semibold text-gray-900 mb-4 text-center">
                  {ET("pregunta", "¿Querés sumarte al programa?")}
                </p>
                {estado === "error" && (
                  <p className="text-red-600 text-sm text-center mb-4">
                    {ET("error_texto", "No pudimos registrar tu solicitud. Probá de nuevo o escribinos a soporte@tiendaonline.com.ar.")}
                  </p>
                )}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {ET("tipo_pregunta", "¿Cómo querés participar?")}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50">
                      <input
                        type="radio"
                        name="tipoAfiliado"
                        checked={tipoAfiliado === "recomendacion"}
                        onChange={() => setTipoAfiliado("recomendacion")}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{ET("tipo_recomendacion_titulo", "Recomiendo tol.ar")}</span>
                        <br />
                        {ET("tipo_recomendacion_desc", "Compartís tu link con gente que conocés. No armás nada vos, solo referís.")}
                      </span>
                    </label>
                    <label className="flex items-start gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50">
                      <input
                        type="radio"
                        name="tipoAfiliado"
                        checked={tipoAfiliado === "agencia"}
                        onChange={() => setTipoAfiliado("agencia")}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{ET("tipo_agencia_titulo", "Armo tiendas para otros (agencia / profesional)")}</span>
                        <br />
                        {ET("tipo_agencia_desc", "Le hacés la tienda vos mismo a tu cliente, bajo tu propio nombre, y cobrás comisión por cada una que quede activa.")}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-400 focus:outline-none text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-400 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="CUIT (opcional, hace falta antes de cobrar la primera comisión)"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-400 focus:outline-none text-sm"
                  />
                  <textarea
                    placeholder="¿Cómo pensás recomendarnos? (redes, contactos, blog...) — opcional"
                    value={comoPromociona}
                    onChange={(e) => setComoPromociona(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-400 focus:outline-none text-sm resize-none"
                  />
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {ET("modelo_pregunta", "¿Cómo preferís cobrar la comisión?")}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50">
                      <input
                        type="radio"
                        name="modeloComision"
                        checked={modeloComision === "fijo"}
                        onChange={() => setModeloComision("fijo")}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{ET("modelo_fijo_titulo", "Monto fijo por tienda")}</span>
                        <br />
                        {ET("modelo_fijo_desc", "Cobrás un monto fijo por cada tienda que refieras y pase a un plan pago. Simple y predecible (monto a confirmar antes de tu primera comisión).")}
                      </span>
                    </label>
                    <label className="flex items-start gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50">
                      <input
                        type="radio"
                        name="modeloComision"
                        checked={modeloComision === "porcentaje"}
                        onChange={() => setModeloComision("porcentaje")}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{ET("modelo_porcentaje_titulo", "Porcentaje mientras la tienda crece")}</span>
                        <br />
                        {ET("modelo_porcentaje_desc", "Cobrás un porcentaje de lo que tol.ar le cobra a esa tienda durante varios meses. Puede ser más si esa tienda crece (porcentaje y plazo a confirmar antes de tu primera comisión).")}
                      </span>
                    </label>
                  </div>
                </div>
                <label className="flex items-start gap-2 mb-4 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    {ET("legal_previo", "Acepto los")}{" "}
                    <Link href="/afiliados-terminos" className="underline hover:text-gray-700" target="_blank">
                      {ET("legal_link", "términos y condiciones del Programa de Afiliados")}
                    </Link>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={estado === "enviando" || !nombre || !email || !aceptaTerminos}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  {estado === "enviando" ? "Enviando..." : "Sumarme al programa"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
