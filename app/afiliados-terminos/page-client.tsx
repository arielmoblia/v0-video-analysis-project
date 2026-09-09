"use client"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const clausulas = [
  {
    numero: 1,
    tk: "c1_titulo",
    td: "Objeto",
    dk: "c1_desc",
    dd: "Este programa permite a cualquier persona ('afiliado') recomendar tol.ar a negocios que todavía no venden por internet. Si un negocio referido abre una tienda en tol.ar y pasa a un plan pago dentro de los 60 días posteriores a la referencia, el afiliado gana una comisión.",
  },
  {
    numero: 2,
    tk: "c2_titulo",
    td: "Sin exclusividad ni relación laboral",
    dk: "c2_desc",
    dd: "El afiliado puede promocionar tol.ar por el medio que elija (redes, contactos personales, blog, etc.), sin horario ni instrucciones sobre el método. No hay relación de dependencia, societaria ni de ningún otro tipo entre el afiliado y Tienda Online: el afiliado actúa siempre por cuenta propia.",
  },
  {
    numero: 3,
    tk: "c3_titulo",
    td: "Pago atado a resultado",
    dk: "c3_desc",
    dd: "La comisión se paga únicamente si el negocio referido llega a pagar efectivamente un plan de tol.ar. No hay pago fijo, adelanto ni comisión por referidos que solo prueban el plan gratuito.",
  },
  {
    numero: 4,
    tk: "c4_titulo",
    td: "Requisito de facturación",
    dk: "c4_desc",
    dd: "Para cobrar la primera comisión, el afiliado debe informar su CUIT y estar en condiciones de facturar (Monotributo o Responsable Inscripto). Es responsabilidad del afiliado declarar ese ingreso ante ARCA (ex AFIP).",
  },
  {
    numero: 5,
    tk: "c5_titulo",
    td: "Antifraude",
    dk: "c5_desc",
    dd: "No se paga comisión si el negocio referido es el propio afiliado o alguien que use el mismo medio de pago. Tienda Online puede esperar un período antes de liberar el pago de una comisión, para descartar bajas o contracargos del plan recién activado.",
  },
  {
    numero: 6,
    tk: "c6_titulo",
    td: "Prohibiciones",
    dk: "c6_desc",
    dd: "Está prohibido el auto-referido, el spam, y la publicidad engañosa sobre tol.ar (por ejemplo, prometer condiciones que no existen). También está prohibido usar el nombre de competidores de tol.ar en la promoción sin autorización previa y expresa de Tienda Online.",
  },
  {
    numero: 7,
    tk: "c7_titulo",
    td: "Uso de marca",
    dk: "c7_desc",
    dd: "El afiliado puede mencionar el nombre 'tol.ar' para promocionar el programa, pero no puede registrar dominios que lo contengan ni pautar publicidad usando 'tol.ar' como palabra clave. Esta licencia de uso es limitada y revocable en cualquier momento.",
  },
  {
    numero: 8,
    tk: "c8_titulo",
    td: "Baja del programa",
    dk: "c8_desc",
    dd: "Tanto el afiliado como Tienda Online pueden dar de baja la participación en cualquier momento, sin expresión de causa y sin penalidad. Las comisiones ya generadas antes de la baja se pagan igual.",
  },
  {
    numero: 9,
    tk: "c9_titulo",
    td: "Protección de datos",
    dk: "c9_desc",
    dd: "Los datos personales del afiliado (nombre, email, CUIT) se usan únicamente para gestionar su participación en el programa y el pago de comisiones, conforme a la Ley 25.326 de Protección de Datos Personales.",
  },
  {
    numero: 10,
    tk: "c10_titulo",
    td: "Cómo se acepta (firma electrónica)",
    dk: "c10_desc",
    dd: "Estos términos se aceptan al completar el formulario de inscripción en tol.ar/afiliados y tildar la casilla de aceptación. Ese registro queda guardado con fecha, hora e IP, y se considera firma electrónica válida.",
  },
  {
    numero: 11,
    tk: "c11_titulo",
    td: "Ley aplicable",
    dk: "c11_desc",
    dd: "Estos términos se rigen por las leyes de la República Argentina, en particular la Ley 25.326 de Protección de Datos Personales y la Ley 22.802 de Lealtad Comercial. Ante cualquier desacuerdo, las partes buscan primero una solución directa antes de recurrir a los tribunales de la Ciudad Autónoma de Buenos Aires.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function AfiliadosTerminosClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("afiliados-terminos")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="afiliados-terminos" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#7c3aed" />
  )

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
        <div className="max-w-3xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-purple-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/afiliados" className="hover:text-purple-600">Programa de Afiliados</Link>
            <span className="mx-2">/</span>
            <span>Términos y condiciones</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Términos y condiciones del Programa de Afiliados")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Última actualización: septiembre 2026")}</p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-10">
            <p className="text-purple-900 font-semibold text-lg">{ET("resumen_titulo", "En criollo")}</p>
            <p className="text-purple-800 mt-2">
              {ET("resumen_texto", "Recomendás tol.ar como quieras, sin exclusividad ni horarios. Si un negocio que sumaste pasa a pagar un plan dentro de los primeros 60 días, cobrás una comisión. Si no hay venta, no hay pago. No hay relación laboral de ningún tipo, y podés darte de baja cuando quieras.")}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-8">
              {ET(
                "intro",
                "Estos términos aplican a quienes se inscriben en el Programa de Afiliados de Tienda Online (tiendaonline.com.ar), operador de la plataforma tol.ar, a través del formulario en tol.ar/afiliados."
              )}
            </p>

            <div className="space-y-6 mb-10">
              {clausulas.map((c) => (
                <div key={c.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">
                      {c.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(c.tk, c.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(c.dk, c.dd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm">
              {ET("contacto", "Consultas sobre estos términos: soporte@tiendaonline.com.ar")}
            </p>
          </div>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
