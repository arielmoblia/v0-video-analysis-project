"use client"
import { Quote } from "lucide-react"
import { EditableText, usePageContent } from "@/components/editable-text"

// Testimonios reales, autorizados por el abogado el 07/08/2026. Tiendas reales
// creadas con tol.ar, dueños reales — no son actores ni citas inventadas.
const TESTIMONIALS = [
  {
    key: "test1",
    texto: "Hice la tienda online en 10 minutos, con pago y envío incluido. Intenté con otras plataformas, pero nada más sencillo que tol.ar.",
    autor: "Mónica Mobilia",
    tienda: "genesis.tol.ar",
  },
  {
    key: "test2",
    texto: "Un servicio al cliente sin igual. Me ayudaron a hacer la tienda y la dejamos andando, con la ayuda y paciencia de Tomy del servicio técnico.",
    autor: "Carlos",
    tienda: "donamia.tol.ar",
  },
  {
    key: "test3",
    texto: "Un sistema muy simple para hacer scraping y darle a mis revendedores una tienda online propia para que aumenten sus ventas, ¡y coordino con mi stock!",
    autor: "Ronaldo",
    tienda: "franchimayorista.tol.ar",
  },
]

export function TestimonialsSection() {
  const { isAdmin, get } = usePageContent("home")
  const ET = (field: string, fallback: string) => (
    <EditableText page="home" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#16a34a" />
  )
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ET("test_titulo", "Lo que cuentan los que ya tienen su tienda")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ET("test_subtitulo", "Tiendas reales, dueños reales. Podés visitarlas ahora mismo.")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.key} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
              <Quote className="w-6 h-6 text-green-600 mb-3" />
              <p className="text-gray-700 mb-4 flex-1">{ET(`${t.key}_texto`, t.texto)}</p>
              <div>
                <p className="font-semibold text-gray-900">{ET(`${t.key}_autor`, t.autor)}</p>
                <a href={`https://${t.tienda}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 hover:text-green-800">
                  {t.tienda}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
