import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react"
import { artesanoHeading } from "@/lib/fonts/artesano"
import { EditableInline } from "./editable-inline"

interface BenefitsBannerArtesanoProps {
  accentColor?: string
  accentColor2?: string
  editMode?: boolean
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// Banner de beneficios: sección nueva que no existe en ningún otro temple.
// Reproduce la sección real "Why choose us" de la demo de mueblería (4
// columnas con ícono + título + texto corto: Fast Delivery, Free Shipping,
// Secure Checkout, Easy Returns). Título y descripción de cada ítem son
// editables (texts["benefits.<key>.title|desc"]).
const BENEFITS = [
  { icon: Truck, key: "envio", title: "Envío rápido", desc: "Coordinamos la entrega en pocos días hábiles." },
  { icon: CreditCard, key: "gratis", title: "Envío gratis", desc: "En compras seleccionadas, sin cargo extra." },
  { icon: ShieldCheck, key: "pago", title: "Pago seguro", desc: "Tus datos y tu compra siempre protegidos." },
  { icon: RotateCcw, key: "cambios", title: "Cambios fáciles", desc: "Si no te convence, lo cambiás sin vueltas." },
]

export function BenefitsBannerArtesano({ accentColor = "#C19A83", accentColor2 = "#4A3427", editMode = false, texts = {}, onChangeText = () => {} }: BenefitsBannerArtesanoProps) {
  return (
    <section className="bg-[#F1EDE7] py-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map(({ icon: Icon, key, title, desc }) => (
            <div key={key} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <EditableInline
                as="h3"
                editMode={editMode}
                className={`${artesanoHeading.className} text-base text-center`}
                style={{ color: accentColor2 }}
                value={texts[`benefits.${key}.title`] ?? title}
                onChange={(v) => onChangeText(`benefits.${key}.title`, v)}
              />
              <EditableInline
                as="p"
                editMode={editMode}
                multiline
                className="text-sm text-[#6b5c4f] max-w-[220px] text-center"
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
