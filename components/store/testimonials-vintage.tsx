import { vintageHeading, vintageScript } from "@/lib/fonts/vintage"
import { EditableInline } from "./editable-inline"

interface TestimonialsVintageProps {
  editMode?: boolean
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// Testimonios en texto (sin fotos, no hay retratos reales scrapeados), con
// comillas en la fuente script como acento — tal cual la sección
// "Testimonials" real de la demo (floral.weblium.site). Título y cada
// frase/autor son editables (texts["testimonials.heading" | "testimonials.<key>.quote|author"]).
const TESTIMONIALS = [
  { key: "t1", quote: "Llegaron frescas y hermosas, tal cual las pedí.", author: "Camila R." },
  { key: "t2", quote: "El arreglo superó lo que esperaba, se nota el cuidado.", author: "Lucía M." },
  { key: "t3", quote: "Siempre elijo esta florería para regalar.", author: "Julián P." },
]

export function TestimonialsVintage({ editMode = false, texts = {}, onChangeText = () => {} }: TestimonialsVintageProps) {
  return (
    <section className="bg-[#f6f1ed] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <EditableInline
            as="h2"
            editMode={editMode}
            className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632] text-center`}
            value={texts["testimonials.heading"] ?? "Lo que dicen nuestros clientes"}
            onChange={(v) => onChangeText("testimonials.heading", v)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t) => (
            <div key={t.key} className="text-center px-4">
              <span className={`${vintageScript.className} text-5xl leading-none text-[#cc3833]`}>&ldquo;</span>
              <EditableInline
                as="p"
                editMode={editMode}
                multiline
                className="text-sm text-[#7c7669] italic mt-2 mb-4 text-center"
                value={texts[`testimonials.${t.key}.quote`] ?? t.quote}
                onChange={(v) => onChangeText(`testimonials.${t.key}.quote`, v)}
              />
              <EditableInline
                as="p"
                editMode={editMode}
                className="text-xs uppercase tracking-widest text-[#4a4632] font-semibold text-center"
                value={texts[`testimonials.${t.key}.author`] ?? t.author}
                onChange={(v) => onChangeText(`testimonials.${t.key}.author`, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
