"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "blog-nota-de-prensa3"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function NotaDePrensa3Client({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent(PAGE)

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={PAGE} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#b91c1c" />
  )

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <article className="max-w-2xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span>Nota de prensa</span>
          </nav>

          <p className="uppercase tracking-widest text-xs font-bold text-red-700 mb-3">
            Nota de prensa
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {ET("h1", "tol.ar: 73 tiendas online nuevas se crearon en la plataforma gratuita en solo una semana")}
          </h1>

          <p className="text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
            {ET("fecha", "Buenos Aires · Septiembre de 2026")}
          </p>

          <p className="font-serif text-xl text-gray-800 leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
            {ET(
              "bajada",
              "La plataforma argentina para crear tiendas online sin costo ya suma 739 locales activos, la mayoría armados por personas sin experiencia en programación ni diseño."
            )}
          </p>

          <div className="nota-cuerpo font-serif text-gray-800">
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              <strong>Buenos Aires, septiembre de 2026.-</strong>{" "}
              {ET(
                "cuerpo_p1",
                "tol.ar, la plataforma argentina para crear tiendas online 100% gratis, sigue sumando emprendedores: hoy tiene 739 tiendas activas, y 73 de ellas se crearon solo en los últimos 7 días. La plataforma está pensada para que cualquier persona pueda vender por internet sin necesidad de experiencia en programación ni diseño, y sin presupuesto: sin costos ocultos ni planes pagos escondidos detrás de la letra chica."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion1_titulo", "Todavía no todas venden, y eso también es parte de la historia", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion1_texto",
                "No todas las tiendas nuevas están vendiendo activamente todavía: muchas recién están cargando productos o probando el modelo antes de lanzarse de lleno. Según sus creadores, ese es justamente el fenómeno interesante: gente que nunca había vendido online se anima a dar el primer paso, con cero barrera de entrada."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion2_titulo", "Casos reales, no inventados", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto1",
                "tol.ar ofrece coordinar contacto directo con emprendedores reales de la plataforma, con nombre y tienda propia, dispuestos a contar su experiencia armando el primer local online. También pone a disposición datos actualizados del crecimiento mes a mes para quien quiera profundizar la cobertura."
              )}
            </p>
          </div>

          <div className="mt-14 border-t border-gray-200 pt-6 text-sm text-gray-500">
            <p>Contacto de prensa: prensa@tol.ar</p>
          </div>
        </article>
      </main>
      <Footer brand={brand} />
    </>
  )
}
