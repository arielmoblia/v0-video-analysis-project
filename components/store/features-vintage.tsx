import { Truck, Flower2, ShieldCheck, CreditCard } from "lucide-react"
import { vintageHeading } from "@/lib/fonts/vintage"
import { EditableInline } from "./editable-inline"

interface FeaturesVintageProps {
  editMode?: boolean
  texts?: Record<string, string>
  onChangeText?: (key: string, value: string) => void
}

// Franja de "Features" real de la demo (sección "Fast Delivery 24/7", "Only
// Fresh Flowers" + garantía/pago), con íconos de lucide-react en vez de
// fotos — no hay más fotos reales scrapeadas que el hero, así que esta
// sección se resuelve solo con color/tipografía/iconos, igual que Blingg y
// Artesano manejan secciones sin foto propia. Título y descripción de cada
// ítem son editables (texts["features.<key>.title|desc"]).
const FEATURES = [
  { icon: Truck, key: "envio", title: "Envío rápido 24/7", desc: "Coordinamos la entrega el mismo día." },
  { icon: Flower2, key: "frescura", title: "Flores frescas", desc: "Seleccionadas y armadas a último momento." },
  { icon: ShieldCheck, key: "garantia", title: "Garantía de frescura", desc: "Cambio sin cargo si algo no llega bien." },
  { icon: CreditCard, key: "pagos", title: "Pagos seguros", desc: "Todos los medios de pago, protegidos." },
]

export function FeaturesVintage({ editMode = false, texts = {}, onChangeText = () => {} }: FeaturesVintageProps) {
  return (
    <section className="bg-white py-14 border-y border-[#f0e9e2]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURES.map(({ icon: Icon, key, title, desc }) => (
            <div key={key} className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#fff6f5]">
                <Icon className="h-6 w-6 text-[#cc3833]" strokeWidth={1.5} />
              </div>
              <EditableInline
                as="h3"
                editMode={editMode}
                className={`${vintageHeading.className} text-sm text-[#4a4632] text-center`}
                value={texts[`features.${key}.title`] ?? title}
                onChange={(v) => onChangeText(`features.${key}.title`, v)}
              />
              <EditableInline
                as="p"
                editMode={editMode}
                multiline
                className="text-sm text-[#7c7669] max-w-[220px] text-center"
                value={texts[`features.${key}.desc`] ?? desc}
                onChange={(v) => onChangeText(`features.${key}.desc`, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
