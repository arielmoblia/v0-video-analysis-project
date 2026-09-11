import { Truck, Flower2, ShieldCheck, CreditCard } from "lucide-react"
import { vintageHeading } from "@/lib/fonts/vintage"

// Franja de "Features" real de la demo (sección "Fast Delivery 24/7", "Only
// Fresh Flowers" + garantía/pago), con íconos de lucide-react en vez de
// fotos — no hay más fotos reales scrapeadas que el hero, así que esta
// sección se resuelve solo con color/tipografía/iconos, igual que Blingg y
// Artesano manejan secciones sin foto propia.
const FEATURES = [
  { icon: Truck, title: "Envío rápido 24/7", desc: "Coordinamos la entrega el mismo día." },
  { icon: Flower2, title: "Flores frescas", desc: "Seleccionadas y armadas a último momento." },
  { icon: ShieldCheck, title: "Garantía de frescura", desc: "Cambio sin cargo si algo no llega bien." },
  { icon: CreditCard, title: "Pagos seguros", desc: "Todos los medios de pago, protegidos." },
]

export function FeaturesVintage() {
  return (
    <section className="bg-white py-14 border-y border-[#f0e9e2]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#fff6f5]">
                <Icon className="h-6 w-6 text-[#cc3833]" strokeWidth={1.5} />
              </div>
              <h3 className={`${vintageHeading.className} text-sm text-[#4a4632]`}>{title}</h3>
              <p className="text-sm text-[#7c7669] max-w-[220px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
