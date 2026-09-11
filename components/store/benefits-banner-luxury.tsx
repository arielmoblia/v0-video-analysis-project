import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react"
import { luxuryHeading } from "@/lib/fonts/luxury"

// Banner de beneficios real de la demo ("store_features"): Free Shipping &
// Return, Money Guarantee, Online Support, Secure Payments. Mismo patrón que
// Artesano pero con íconos en línea (sin círculo de color) y acento dorado,
// tal cual el original.
const BENEFITS = [
  { icon: Truck, title: "Envío y devolución gratis", desc: "Coordinamos la entrega y el cambio sin cargo." },
  { icon: ShieldCheck, title: "Garantía de satisfacción", desc: "30 días para cambios sin vueltas." },
  { icon: Headphones, title: "Atención personalizada", desc: "Te acompañamos antes y después de la compra." },
  { icon: RotateCcw, title: "Pagos seguros", desc: "Todos los medios de pago, protegidos." },
]

export function BenefitsBannerLuxury() {
  return (
    <section className="bg-white border-y border-neutral-100 py-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <Icon className="h-7 w-7 text-[#111111]" strokeWidth={1.5} />
              <h3 className={`${luxuryHeading.className} text-sm uppercase tracking-wide text-neutral-900`}>{title}</h3>
              <p className="text-sm text-neutral-500 max-w-[220px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
