"use client"

import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const PAGE = "blog-nota-de-prensa2"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function NotaDePrensa2Client({ brand = "tol" }: Props) {
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
            {ET("h1", "tol.ar suma el Plan Cositas: pagás solo por las funciones que tu tienda usa")}
          </h1>

          <p className="text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
            {ET("fecha", "Buenos Aires · Agosto de 2026")}
          </p>

          <p className="font-serif text-xl text-gray-800 leading-relaxed mb-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
            {ET(
              "bajada",
              "tol.ar presenta el Plan Cositas: en vez de venderle al emprendedor un paquete cerrado con funciones que no siempre usa, cada uno elige y paga solo las que su tienda online necesita."
            )}
          </p>

          <div className="nota-cuerpo font-serif text-gray-800">
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              <strong>Buenos Aires, agosto de 2026.-</strong>{" "}
              {ET(
                "cuerpo_p1",
                "tol.ar, la plataforma argentina para crear tiendas online gratis, suma una nueva forma de crecer: el Plan Cositas. La idea es simple: en lugar de ofrecer paquetes cerrados con funciones fijas, cada emprendedor arma su propia tienda sumando, una por una, solo las funciones que realmente necesita."
              )}
            </p>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "cuerpo_p2",
                "La plataforma lo explica así: cada otra plataforma vende un paquete cerrado, y el usuario termina pagando por diez funciones aunque solo use tres. Con el Plan Cositas de tol.ar es distinto: se empieza gratis, y cada función se suma y se paga por separado, sin planes cerrados ni letra chica."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion1_titulo", "Un plan que no es un plan cerrado", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion1_texto",
                "El Plan Cositas no tiene un precio fijo ni un combo predefinido. Cada función ('cosita') se activa y se desactiva de forma independiente, y se puede combinar con las demás como el emprendedor necesite. Si en algún momento una función deja de ser útil, se puede dar de baja sin perder el resto de la tienda."
              )}
            </p>

            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#111827", marginTop: "2.5rem", marginBottom: "1rem" }}>
              {ET("seccion2_titulo", "Ejemplos concretos, con precios reales", "span")}
            </h2>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto1",
                "Algunos ejemplos ya disponibles hoy en tol.ar: mostrar los precios en dólares y que el cliente pague en pesos, por USD 1 al mes; sumar una galería de fotos a los productos, por USD 1 de pago único; agregar un chat de WhatsApp a la tienda, por USD 1 de pago único; habilitar variantes personalizables de producto (como talle y color combinados), por USD 3 de pago único; importar todo el catálogo desde un archivo CSV o Excel, por USD 1 de pago único; o activar dropshipping, por USD 1 al mes."
              )}
            </p>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              {ET(
                "seccion2_texto2",
                "La lista de funciones sigue creciendo con el tiempo. El detalle completo y actualizado, con el precio de cada una convertido a pesos según la cotización del día, está disponible en tol.ar/plan-cositas."
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
