import { luxuryHeading } from "@/lib/fonts/luxury"

// Testimonios con comillas doradas (#ebb868), tal cual la sección real de la
// demo ("Praise from delighted customers"). Sección nueva: ningún otro
// temple (Moderno/Elegante/Bold/Blingg/Artesano/Minimal) tiene testimonios.
const TESTIMONIALS = [
  { quote: "La calidad superó lo que esperaba, y llegó antes de lo prometido.", author: "Valentina R." },
  { quote: "Atención impecable y un diseño que se nota que está cuidado al detalle.", author: "Martín G." },
  { quote: "Volví a comprar sin dudarlo. Es mi tienda de confianza.", author: "Sofía L." },
]

export function TestimonialsLuxury() {
  return (
    <section className="bg-[#faf9f7] py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`${luxuryHeading.className} text-2xl md:text-3xl uppercase tracking-wide text-neutral-900`}>
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="text-center px-4">
              <span className="text-5xl leading-none" style={{ color: "#ebb868" }}>&ldquo;</span>
              <p className="text-sm text-neutral-600 italic mt-2 mb-4">{t.quote}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-900 font-semibold">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
