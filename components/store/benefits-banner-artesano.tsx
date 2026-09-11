import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react"
import { artesanoHeading } from "@/lib/fonts/artesano"

interface BenefitsBannerArtesanoProps {
  accentColor?: string
  accentColor2?: string
}

// Banner de beneficios: sección nueva que no existe en ningún otro temple.
// Reproduce la sección real "Why choose us" de la demo de mueblería (4
// columnas con ícono + título + texto corto: Fast Delivery, Free Shipping,
// Secure Checkout, Easy Returns).
const BENEFITS = [
  { icon: Truck, title: "Envío rápido", desc: "Coordinamos la entrega en pocos días hábiles." },
  { icon: CreditCard, title: "Envío gratis", desc: "En compras seleccionadas, sin cargo extra." },
  { icon: ShieldCheck, title: "Pago seguro", desc: "Tus datos y tu compra siempre protegidos." },
  { icon: RotateCcw, title: "Cambios fáciles", desc: "Si no te convence, lo cambiás sin vueltas." },
]

export function BenefitsBannerArtesano({ accentColor = "#C19A83", accentColor2 = "#4A3427" }: BenefitsBannerArtesanoProps) {
  return (
    <section className="bg-[#F1EDE7] py-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`${artesanoHeading.className} text-base`} style={{ color: accentColor2 }}>{title}</h3>
              <p className="text-sm text-[#6b5c4f] max-w-[220px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
