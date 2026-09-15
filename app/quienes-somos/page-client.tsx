"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

interface Props {
  brand?: "tol" | "tiendabasica"
}

const DEPARTAMENTOS = [
  {
    key: "dep_direccion",
    emoji: "🧭",
    nombre: "Dirección General",
    email: "jefe@tiendaonline.com.ar",
    desc: "Coordina toda la operación de tol.ar: prioridades, decisiones y la visión del negocio.",
  },
  {
    key: "dep_desarrollo",
    emoji: "💻",
    nombre: "Desarrollo y Producto",
    email: "contacto@tiendaonline.com.ar",
    desc: "Construye y mantiene la plataforma: nuevas funciones, arreglos y mejoras técnicas.",
  },
  {
    key: "dep_legal",
    emoji: "⚖️",
    nombre: "Departamento Jurídico",
    email: "contacto@tiendaonline.com.ar",
    desc: "Términos y condiciones, políticas de privacidad y cumplimiento normativo de la plataforma.",
  },
  {
    key: "dep_seo",
    emoji: "📈",
    nombre: "SEO y Marketing",
    email: "contacto@tiendaonline.com.ar",
    desc: "Contenido, redes sociales y estrategia para que más gente encuentre tol.ar.",
  },
  {
    key: "dep_soporte",
    emoji: "🎧",
    nombre: "Atención al Cliente",
    email: "soporte@tiendaonline.com.ar",
    desc: "Resuelve dudas y ayuda a las tiendas con problemas del día a día.",
  },
  {
    key: "dep_admin",
    emoji: "🧾",
    nombre: "Administración",
    email: "contacto@tiendaonline.com.ar",
    desc: "Aspectos contables e impositivos de la plataforma.",
  },
]

export default function QuienesSomosPage({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("quienes-somos")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="quienes-somos" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#4338ca" />
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}

      <main className="flex-1">
        <section
          style={{
            background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)",
            color: "white",
            padding: "72px 20px 56px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "20px" }}>
              {ET("hero_titulo", "Quiénes somos")}
            </h1>
            <p style={{ fontSize: "1.15rem", opacity: 0.92, lineHeight: 1.6, maxWidth: "640px", margin: "0 auto" }}>
              {ET("hero_subtitulo", "tol.ar es una plataforma argentina de tiendas online gratis y sin comisiones, operada 100% con inteligencia artificial. Así organizamos el trabajo, por área.")}
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "56px 20px" }}>
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "14px", color: "#1e1b4b" }}>
              {ET("resumen_titulo", "Nuestra empresa")}
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151" }}>
              {ET(
                "resumen_texto",
                "tol.ar nació para que cualquier persona en Argentina pueda vender online sin pagar comisión por venta. No tenemos una oficina tradicional ni una nómina de empleados: la plataforma se construye y se opera con inteligencia artificial, organizada por áreas de trabajo, igual que en cualquier empresa. Abajo te contamos qué hace cada una y cómo escribirle.",
                "p"
              )}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "24px", color: "#1e1b4b" }}>
              {ET("departamentos_titulo", "Nuestros departamentos")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {DEPARTAMENTOS.map((d) => (
                <div
                  key={d.key}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "26px 22px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{d.emoji}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "#1f2937" }}>
                    {ET(`${d.key}_nombre`, d.nombre)}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.6, marginBottom: "14px" }}>
                    {ET(`${d.key}_desc`, d.desc, "span")}
                  </p>
                  <a
                    href={`mailto:${get(`${d.key}_email`, d.email)}`}
                    style={{ fontSize: "0.9rem", fontWeight: 600, color: "#4338ca", textDecoration: "none" }}
                  >
                    ✉️ {ET(`${d.key}_email`, d.email)}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer brand={brand} />
    </div>
  )
}
