"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "blog-tiendabasica"

const paises = [
  { codigo: "argentina", bandera: "🇦🇷", nombre: "Argentina", tag: "Activo", tagClase: "bg-emerald-50 text-emerald-700" },
  { codigo: "chile", bandera: "🇨🇱", nombre: "Chile", tag: "Piloto", tagClase: "bg-amber-50 text-amber-700" },
  { codigo: "mexico", bandera: "🇲🇽", nombre: "México", tag: "Próximamente", disabled: true, tagClase: "bg-gray-100 text-gray-500" },
  { codigo: "colombia", bandera: "🇨🇴", nombre: "Colombia", tag: "Próximamente", disabled: true, tagClase: "bg-gray-100 text-gray-500" },
  { codigo: "peru", bandera: "🇵🇪", nombre: "Perú", tag: "Próximamente", disabled: true, tagClase: "bg-gray-100 text-gray-500" },
  { codigo: "uruguay", bandera: "🇺🇾", nombre: "Uruguay", tag: "Próximamente", disabled: true, tagClase: "bg-gray-100 text-gray-500" },
]

const opcionesChile = [
  { categoria: "Medios de pago", icono: "💳", nombre: "Webpay Plus (Transbank)", sub: "Tarjetas débito/crédito Chile" },
  { categoria: "Medios de pago", icono: "💳", nombre: "Mercado Pago Chile", sub: "Cuenta MP local, distinta a la de Argentina" },
  { categoria: "Envíos", icono: "📦", nombre: "Chilexpress", sub: "Cobertura nacional" },
  { categoria: "Envíos", icono: "📦", nombre: "Starken", sub: "Envíos y retiro en sucursal" },
  { categoria: "Facturación electrónica", icono: "🧾", nombre: "Boleta electrónica SII", sub: "Organismo fiscal chileno, no tiene nada que ver con AFIP" },
]

function DemoPaises() {
  const [pantalla, setPantalla] = useState<"portal" | "redirect" | "chile">("portal")
  const [urlTexto, setUrlTexto] = useState("tiendabasica.com")

  function elegirPais(codigo: string) {
    if (codigo === "argentina") {
      setPantalla("redirect")
      setUrlTexto("tiendabasica.com → redirigiendo…")
      setTimeout(() => setUrlTexto("tol.ar"), 900)
    } else if (codigo === "chile") {
      setPantalla("chile")
      setUrlTexto("chile.tiendabasica.com")
    }
  }

  function volverPortal() {
    setPantalla("portal")
    setUrlTexto("tiendabasica.com")
  }

  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white not-prose">
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 bg-white rounded-md px-2.5 py-1 text-xs text-gray-500 flex-1">{urlTexto}</span>
      </div>

      {pantalla === "portal" && (
        <div>
          <div className="text-center pt-10 pb-6 px-6 bg-gradient-to-b from-emerald-50/40 to-white">
            <div className="text-2xl font-extrabold tracking-tight">
              tienda<span className="text-emerald-600">básica</span>
            </div>
            <div className="text-sm text-gray-500 mt-1.5">Elegí tu país para entrar a tu tienda</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 px-6 pb-10 max-w-xl mx-auto">
            {paises.map((p) => (
              <button
                key={p.codigo}
                type="button"
                disabled={p.disabled}
                onClick={() => elegirPais(p.codigo)}
                className={`border rounded-xl p-4 text-center transition ${
                  p.disabled
                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-emerald-400 hover:-translate-y-0.5 cursor-pointer"
                }`}
              >
                <div className="text-3xl mb-1.5">{p.bandera}</div>
                <div className="text-xs font-bold text-gray-800">{p.nombre}</div>
                <div className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tagClase}`}>{p.tag}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {pantalla === "redirect" && (
        <div className="text-center py-16 px-6">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-emerald-600 animate-spin mx-auto mb-5" />
          <div className="text-sm text-gray-500 mb-1">Redirigiendo a tu tienda de Argentina…</div>
          <div className="text-lg font-extrabold mb-6">tol.ar</div>
          <div className="max-w-sm mx-auto bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-xs text-emerald-800 text-left leading-relaxed">
            <strong>Nada nuevo acá.</strong> Argentina sigue funcionando exactamente igual que hoy en tol.ar, con Mercado Pago y Andreani/Correo Argentino. Tienda Básica no le cambia nada, solo la deja accesible desde el portal.
          </div>
          <button type="button" onClick={volverPortal} className="mt-6 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200">
            ← Volver al portal
          </button>
        </div>
      )}

      {pantalla === "chile" && (
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2.5 px-6 pt-5">
            <div className="text-sm font-bold flex items-center gap-2">
              🇨🇱 Tienda Básica — Chile{" "}
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">chile.tiendabasica.com</span>
            </div>
            <button type="button" onClick={volverPortal} className="px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200">
              ← Cambiar país
            </button>
          </div>
          <div className="px-6 pb-8">
            <div className="flex items-center gap-2.5 border border-gray-200 rounded-lg p-3 bg-gray-50 mt-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm flex-shrink-0">⚙️</div>
              <div>
                <div className="text-xs font-bold">Mismo motor que tol.ar</div>
                <div className="text-[11px] text-gray-500">Mismo código, misma base de tiendas — acá solo cambia qué medios de pago, envíos y facturación están disponibles para este país.</div>
              </div>
            </div>

            {["Medios de pago", "Envíos", "Facturación electrónica"].map((cat) => (
              <div key={cat}>
                <div className="text-xs font-bold text-gray-600 mt-5 mb-2.5">{cat} — Chile</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {opcionesChile
                    .filter((o) => o.categoria === cat)
                    .map((o) => (
                      <div key={o.nombre} className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm flex-shrink-0">{o.icono}</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold">{o.nombre}</div>
                          <div className="text-[11px] text-gray-500">{o.sub}</div>
                        </div>
                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 whitespace-nowrap">Por integrar</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[11px] text-gray-600 leading-relaxed">
              <strong className="text-gray-800">Por qué "por integrar" y no un simple check:</strong> en Argentina estos proveedores (Mercado Pago, Andreani, AFIP) ya están conectados al sistema desde hace tiempo. Para Chile no existen todavía — ese es el trabajo real antes de que este país piloto pueda tener una tienda vendiendo de verdad. Una vez integrados acá, cualquier tienda nueva en Chile los prende con un clic, igual que hoy en Argentina.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TiendaBasicaClient() {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#1D9E75" />
  )

  return (
    <>
      <Header />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Tienda Básica</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Tienda Básica: llevar el sistema de tol.ar a toda Latinoamérica")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Agosto 2026 · Idea en evaluación")}</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10">
            <p className="text-emerald-900 font-semibold text-lg">{ET("criollo_titulo", "En criollo")}</p>
            <p className="text-emerald-800 mt-2">
              {ET(
                "criollo_texto",
                "Estamos evaluando armar Tienda Básica: un portal donde entrás, elegís tu país, y te lleva a una tienda con el mismo sistema de tol.ar por dentro, pero con los medios de pago, transportes y facturación de ese país. Argentina sigue siendo tol.ar tal cual la conocés; los demás países de Latinoamérica entrarían por Tienda Básica, arrancando con Chile como piloto."
              )}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{ET("demo_titulo", "Cómo se vería")}</h2>
            <p className="text-gray-700 mb-6">
              {ET(
                "demo_texto",
                "Esto es una maqueta funcional para mostrar el recorrido: probá elegir un país y mirá a dónde te lleva."
              )}
            </p>
          </div>

          <DemoPaises />

          <div className="prose prose-gray max-w-none mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{ET("real_titulo", "Qué es real hoy y qué es la idea a futuro")}</h2>
            <div className="space-y-4 mb-10">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{ET("real1_titulo", "El portal tiendabasica.com todavía no existe")}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ET("real1_desc", "Es la idea que estamos evaluando: entrás, elegís país, y cada país te lleva a donde corresponde.")}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{ET("real2_titulo", "Argentina no cambia")}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ET("real2_desc", "tol.ar sigue funcionando exactamente igual que hoy. El portal solamente la referenciaría como la opción de Argentina.")}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{ET("real3_titulo", "Chile sería el país piloto")}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ET("real3_desc", "Un subdominio nuevo (chile.tiendabasica.com) sobre el mismo motor de tol.ar, no una copia aparte del sistema.")}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{ET("real4_titulo", "Los medios de pago y envíos de Chile todavía no están integrados")}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ET("real4_desc", "Webpay, Mercado Pago Chile, Chilexpress, Starken y la boleta electrónica del SII son el trabajo grande antes de que el piloto pueda vender de verdad.")}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{ET("nombre_titulo", "Por qué el nombre Tienda Básica")}</h2>
            <p className="text-gray-700 mb-10">
              {ET(
                "nombre_texto",
                "Es una cuestión de posicionamiento: \"tol.ar\" suena atado a Argentina, y para crecer en toda Latinoamérica queremos un nombre más neutro que comunique eso desde el arranque. Por dentro sigue siendo el mismo sistema, la misma cuenta técnica; por fuera, otra marca."
              )}
            </p>
          </div>

          <div className="mt-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">{ET("cta_titulo", "Mientras tanto, tu tienda en Argentina ya está lista")}</h2>
            <p className="text-emerald-50 mb-6">
              {ET("cta_texto", "Tienda Básica es una idea en evaluación. Si estás en Argentina, ya podés crear tu tienda gratis en tol.ar hoy mismo.")}
            </p>
            <Link
              href="https://app.tol.ar/register"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              {ET("cta_boton", "Crear tienda gratis")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
