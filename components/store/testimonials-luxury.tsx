import { luxuryHeading } from "@/lib/fonts/luxury"
import { EditableInline } from "./editable-inline"

interface TestimonialsLuxuryProps {
  editMode?: boolean
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// Testimonios con comillas doradas (#ebb868), tal cual la sección real de la
// demo ("Praise from delighted customers"). Sección nueva: ningún otro
// temple (Moderno/Elegante/Bold/Blingg/Artesano/Minimal) tiene testimonios.
// Título y cada frase/autor son editables (texts["testimonials.heading" | "testimonials.<key>.quote|author"]).
const TESTIMONIALS = [
  { key: "t1", quote: "La calidad superó lo que esperaba, y llegó antes de lo prometido.", author: "Valentina R." },
  { key: "t2", quote: "Atención impecable y un diseño que se nota que está cuidado al detalle.", author: "Martín G." },
  { key: "t3", quote: "Volví a comprar sin dudarlo. Es mi tienda de confianza.", author: "Sofía L." },
]

export function TestimonialsLuxury({ editMode = false, texts = {}, onChangeText = () => {} }: TestimonialsLuxuryProps) {
  return (
    <section className="bg-[#faf9f7] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <EditableInline
            as="h2"
            editMode={editMode}
            className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900 text-center`}
            value={texts["testimonials.heading"] ?? "Lo que dicen nuestros clientes"}
            onChange={(v) => onChangeText("testimonials.heading", v)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t) => (
            <div key={t.key} className="text-center px-4">
              <span className="text-5xl leading-none" style={{ color: "#ebb868" }}>&ldquo;</span>
              <EditableInline
                as="p"
                editMode={editMode}
                multiline
                className="text-sm text-neutral-600 italic mt-2 mb-4 text-center"
                value={texts[`testimonials.${t.key}.quote`] ?? t.quote}
                onChange={(v) => onChangeText(`testimonials.${t.key}.quote`, v)}
              />
              <EditableInline
                as="p"
                editMode={editMode}
                className="text-xs uppercase tracking-widest text-neutral-900 font-semibold text-center"
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
