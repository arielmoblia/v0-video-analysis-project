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
            {ET("h1", "tol.ar suma nuevas funciones para que cualquier tienda online cumpla con la ley y venda con más opciones de pago")}
          </h1>

          <p className="text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
            {ET("fecha", "Buenos Aires · Septiembre de 2026")}
          </p>

          <p className="font-serif text-xl text-gray-800 leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
            {ET(
              "bajada",
              "tol.ar sigue agregando herramientas a las tiendas que ya están funcionando en la plataforma, sin costo extra y sin que el dueño tenga que tocar una línea de código."
            )}
          </p>

          <div className="nota-cuerpo font-serif text-gray-800">
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              <strong>Buenos Aires, septiembre de 2026.-</strong>{" "}
              {ET(
                "cuerpo_p1",
                "tol.ar, la plataforma argentina para crear tiendas online 100% gratis, incorporó en las últimas semanas dos mejoras pensadas para que cualquier emprendedor, tenga o no conocimientos técnicos, pueda vender con las mismas herramientas que un negocio grande."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion1_titulo", "Un botón de arrepentimiento en cada tienda, sin configurar nada", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion1_texto",
                "La Disposición 954/2025 de la Subsecretaría de Defensa del Consumidor exige que las tiendas online muestren de forma clara cómo un comprador puede arrepentirse de una compra, según establece la Ley de Defensa del Consumidor. tol.ar incorporó ese botón en el pie de página de todas sus tiendas: el comprador completa un formulario simple (pedido, motivo) y tanto el dueño de la tienda como el comprador reciben la confirmación por mail. El dueño no tiene que programar ni activar nada: ya está en todas las tiendas de la plataforma."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion2_titulo", "Cobro con tarjeta en el momento de la entrega", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto1",
                "Se sumó una nueva forma de cobro para los envíos: el comprador paga con su tarjeta cuando recibe el producto, usando el posnet propio del vendedor, sin necesidad de contratar una pasarela de pago online. Se suma a las opciones ya existentes (Mercado Pago, efectivo), para que cada tienda elija cómo prefiere cobrar según su forma de trabajar."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion3_titulo", "Seguimos sumando", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion3_texto",
                "Ambas mejoras se suman sin costo a todas las tiendas ya creadas en tol.ar. La idea de fondo es la misma desde el arranque de la plataforma: que un emprendedor sin presupuesto ni conocimientos técnicos tenga acceso a las mismas herramientas legales y de cobro que un negocio con equipo propio de desarrollo."
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
