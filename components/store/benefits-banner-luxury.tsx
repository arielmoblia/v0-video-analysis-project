import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react"
import { luxuryHeading } from "@/lib/fonts/luxury"
import { EditableInline } from "./editable-inline"

interface BenefitsBannerLuxuryProps {
  editMode?: boolean
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// Banner de beneficios real de la demo ("store_features"): Free Shipping &
// Return, Money Guarantee, Online Support, Secure Payments. Mismo patrón que
// Artesano pero con íconos en línea (sin círculo de color) y acento dorado,
// tal cual el original. Título y descripción de cada ítem son editables
// (texts["benefits.<key>.title|desc"]).
const BENEFITS = [
  { icon: Truck, key: "envio", title: "Envío y devolución gratis", desc: "Coordinamos la entrega y el cambio sin cargo." },
  { icon: ShieldCheck, key: "garantia", title: "Garantía de satisfacción", desc: "30 días para cambios sin vueltas." },
  { icon: Headphones, key: "atencion", title: "Atención personalizada", desc: "Te acompañamos antes y después de la compra." },
  { icon: RotateCcw, key: "pagos", title: "Pagos seguros", desc: "Todos los medios de pago, protegidos." },
]

export function BenefitsBannerLuxury({ editMode = false, texts = {}, onChangeText = () => {} }: BenefitsBannerLuxuryProps) {
  return (
    <section className="bg-white border-y border-neutral-100 py-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map(({ icon: Icon, key, title, desc }) => (
            <div key={key} className="flex flex-col items-center text-center gap-3">
              <Icon className="h-7 w-7 text-[#111111]" strokeWidth={1.5} />
              <EditableInline
                as="h3"
                editMode={editMode}
                className={`${luxuryHeading.className} text-sm uppercase tracking-wide text-neutral-900 text-center`}
                value={texts[`benefits.${key}.title`] ?? title}
                onChange={(v) => onChangeText(`benefits.${key}.title`, v)}
              />
              <EditableInline
                as="p"
                editMode={editMode}
                multiline
                className="text-sm text-neutral-500 max-w-[220px] text-center"
                value={texts[`benefits.${key}.desc`] ?? desc}
                onChange={(v) => onChangeText(`benefits.${key}.desc`, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
