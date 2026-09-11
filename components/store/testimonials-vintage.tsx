import { vintageHeading, vintageScript } from "@/lib/fonts/vintage"

// Testimonios en texto (sin fotos, no hay retratos reales scrapeados), con
// comillas en la fuente script como acento — tal cual la sección
// "Testimonials" real de la demo (floral.weblium.site).
const TESTIMONIALS = [
  { quote: "Llegaron frescas y hermosas, tal cual las pedí.", author: "Camila R." },
  { quote: "El arreglo superó lo que esperaba, se nota el cuidado.", author: "Lucía M." },
  { quote: "Siempre elijo esta florería para regalar.", author: "Julián P." },
]

export function TestimonialsVintage() {
  return (
    <section className="bg-[#f6f1ed] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`${vintageHeading.className} text-2xl md:text-3xl text-[#4a4632]`}>
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="text-center px-4">
              <span className={`${vintageScript.className} text-5xl leading-none text-[#cc3833]`}>&ldquo;</span>
              <p className="text-sm text-[#7c7669] italic mt-2 mb-4">{t.quote}</p>
              <p className="text-xs uppercase tracking-widest text-[#4a4632] font-semibold">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
