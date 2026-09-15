"use client"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { useParams, useRouter } from "next/navigation"

function EditableText({ field, value, onSave, tag = "span", className = "" }: {
  field: string; value: string; onSave: (k: string, v: string) => Promise<void>; tag?: string; className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [hover, setHover] = useState(false)
  const [text, setText] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { setText(value) }, [value])
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  const handleSave = async () => {
    setSaving(true); await onSave(field, text); setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === "Escape") { setText(value); setEditing(false) }
  }
  if (editing) return (
    <span style={{ display: "inline-block", width: "100%" }}>
      <textarea ref={ref} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} rows={3}
        style={{ width: "100%", padding: "6px 10px", fontSize: "inherit", fontFamily: "inherit", fontWeight: "inherit",
          background: "rgba(255,255,255,0.95)", border: "2px solid #d97706", borderRadius: "8px",
          resize: "vertical", outline: "none", lineHeight: "1.5", textAlign: "center" }} />
      <span style={{ display: "flex", gap: "8px", marginTop: "4px", justifyContent: "center" }}>
        <button onClick={() => { setText(value); setEditing(false) }}
          style={{ padding: "3px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "12px" }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "3px 12px", borderRadius: "6px", border: "none", background: saving ? "#fbbf24" : "#d97706", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
          {saving ? "Guardando..." : "Guardar"}</button>
      </span>
    </span>
  )
  const Tag = tag as any
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Tag className={className}
        style={{ cursor: "text", borderRadius: "4px", transition: "all 0.15s",
          outline: hover ? "2px dashed #fbbf24" : "2px dashed transparent", outlineOffset: "3px" }}>
        {text}
      </Tag>
      {hover && <button onClick={() => setEditing(true)}
        style={{ position: "absolute", top: "-12px", right: "-12px", background: "#d97706", color: "white",
          border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✏️</button>}
      {saved && <span style={{ position: "absolute", top: "-12px", right: "20px", background: "#10b981",
        color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "4px" }}>✓</span>}
    </span>
  )
}

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function GeoPageClient({ brand = "tol" }: Props) {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [publicando, setPublicando] = useState(false)
  const [publicada, setPublicada] = useState(false)
  const [ubicacion, setUbicacion] = useState<string[]>([])
  const [nombreLink, setNombreLink] = useState("")

  useEffect(() => {
    fetch(`/api/geo-pagina?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.contenido) setContent(d.contenido)
        else if (d && typeof d === 'object') setContent(d)
        if (d.ubicacion) setUbicacion(d.ubicacion)
        if (d.nombre_link) setNombreLink(d.nombre_link)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleSave = async (key: string, value: string) => {
    await fetch("/api/geo-pagina", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, key, value }) })
    setContent(prev => ({ ...prev, [key]: value }))
  }

  const handlePublicar = async () => {
    setPublicando(true)
    const res = await fetch("/api/super-admin/geo-publicar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, ubicacion, nombreLink }) })
    const data = await res.json()
    setPublicando(false)
    if (data.success) {
      setPublicada(true)
    }
  }

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText field={field} value={content[field] || fallback} onSave={handleSave} tag={tag} className={className} />
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando...</div>

  const faqs = [1,2,3,4,5,6].filter(n => content[`faq${n}_pregunta`])
  const beneficios = [1,2,3,4,5,6].filter(n => content[`beneficio${n}_titulo`])

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div style={{ background: "#d97706", color: "white", textAlign: "center", padding: "10px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <span>✏️ MODO EDICIÓN — Pasá el mouse sobre los textos para editarlos</span>
        <button onClick={handlePublicar} disabled={publicando}
          style={{ background: "white", color: "#d97706", border: "none", borderRadius: "6px", padding: "4px 14px", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>
          {publicando ? "Publicando..." : publicada ? "✅ Publicada" : "🚀 Publicar página"}
        {publicada && (
          <a href={`/${slug}`} target="_blank" rel="noreferrer"
            style={{ marginLeft: "12px", background: "white", color: "#d97706", border: "none", borderRadius: "6px", padding: "4px 14px", fontWeight: 700, cursor: "pointer", fontSize: "12px", textDecoration: "none" }}>
            Ver en tol.ar →
          </a>
        )}
        </button>
      </div>
      <Header fullMenu={true} brand={brand} />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            {ET("badge", "Sin comisiones")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-amber-600">
            {ET("titulo", slug.replace(/-/g, " "), "span", "text-amber-600")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {ET("subtitulo", "tol.ar es la plataforma de e-commerce argentina sin comisiones por venta.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://tol.ar" className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
              {ET("cta_boton", "Crear mi tienda gratis")}
            </a>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {ET("como_funciona_titulo", "¿Cómo funciona?", "span")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(n => (
              <div key={n} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold mb-4">{n}</div>
                <h3 className="font-semibold mb-2">{ET(`paso${n}_titulo`, `Paso ${n}`)}</h3>
                <p className="text-sm text-slate-600">{ET(`paso${n}_desc`, `Descripción del paso ${n}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios (solo si existen) */}
      {beneficios.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              {ET("beneficios_titulo", "Todo lo que incluye tu tienda gratis", "span")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {beneficios.map(n => (
                <div key={n} className="rounded-xl p-6 border border-amber-100 bg-amber-50">
                  <h3 className="font-semibold text-amber-800 mb-2">{ET(`beneficio${n}_titulo`, `Beneficio ${n}`)}</h3>
                  <p className="text-sm text-slate-600">{ET(`beneficio${n}_desc`, `Detalle del beneficio ${n}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {faqs.map(n => (
                <div key={n} className="border border-slate-200 rounded-xl p-5 bg-white">
                  <h3 className="font-semibold text-slate-800 mb-2">{ET(`faq${n}_pregunta`, `Pregunta ${n}`)}</h3>
                  <p className="text-sm text-slate-600">{ET(`faq${n}_respuesta`, `Respuesta ${n}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      {content["cta_titulo"] && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              {ET("cta_titulo", "¿Listo para empezar?", "span")}
            </h2>
            <a href="https://tol.ar" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-lg">
              {ET("cta_boton2", "Crear mi tienda gratis ahora")}
            </a>
          </div>
        </section>
      )}

      <Footer brand={brand} />
    </main>
  )
}
