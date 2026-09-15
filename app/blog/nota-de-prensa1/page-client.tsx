"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "blog-nota-de-prensa1"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function NotaDePrensa1Client({ brand = "tol" }: Props) {
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
            {ET("h1", "Nueva plataforma para tiendas online realmente gratis para emprendedores")}
          </h1>

          <p className="text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
            {ET("fecha", "Buenos Aires · Agosto de 2026")}
          </p>

          <p className="font-serif text-xl text-gray-800 leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
            {ET(
              "bajada",
              "Hace 12 meses se lanzó tol.ar, una plataforma pensada para que cualquier emprendedor pueda armar su tienda online sin necesidad de presupuesto. No solo es gratis: es simple, para vender por internet sin complicaciones, y promete además posicionamiento en buscadores y redes sociales."
            )}
          </p>

          <div className="nota-cuerpo font-serif text-gray-800">
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              <strong>Buenos Aires, agosto de 2026.-</strong>{" "}
              {ET(
                "cuerpo_p1",
                "Ya pasaron 12 meses desde el lanzamiento de tol.ar, una plataforma argentina para crear tiendas online que se presenta como realmente gratuita: sin costos ocultos, sin planes pagos escondidos detrás de la letra chica, pensada para que un emprendedor pueda empezar a vender por internet con cero presupuesto."
              )}
            </p>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "cuerpo_p2",
                "La propuesta no se queda solo en la gratuidad. tol.ar apuesta a la simplicidad: que cualquier persona, tenga o no conocimientos técnicos, pueda tener su tienda online funcionando sin complicarse. Y va un paso más allá: promete ayudar a que esa tienda se posicione en los buscadores y en las redes sociales, algo que habitualmente exige presupuesto de marketing o conocimientos que muchos emprendedores no tienen."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion1_titulo", "Un proyecto armado con experiencia, no con capital", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion1_texto",
                "Detrás de tol.ar hay un grupo de jubilados del sector que decidió volcar años de experiencia y trayectoria en el rubro a un proyecto nuevo, con la asistencia de inteligencia artificial para construir y mejorar la plataforma día a día. La combinación de experiencia real y herramientas de IA les permitió avanzar en beneficios y mejoras constantes sin necesidad de una gran inversión inicial."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion2_titulo", "Sin fines de lucro, con un objetivo claro", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto1",
                "tol.ar se define como un proyecto sin fines de lucro. La idea central es que las oportunidades sean para todos: que nadie tenga la excusa de la falta de oportunidades para no animarse a vender por internet. Según sus creadores, lo único que hace falta no es plata, sino perseverancia y esfuerzo para aprender cosas nuevas."
              )}
            </p>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto2",
                "Con esa filosofía, tol.ar sigue sumando funciones y mejoras, apostando a que cada vez más emprendedores argentinos puedan tener su tienda online sin barreras de entrada."
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
