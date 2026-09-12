import { EditableInline } from "./editable-inline"

interface PromoBarLuxuryProps {
  text?: string
  editMode?: boolean
  onChangeText?: (value: string) => void
}

// Franja negra de oferta ("SPRING SUMMER SALE — Shop Now"), tal cual la
// sección "promotion_bar" real de la demo. Sección nueva, no existe en
// ningún otro temple. Texto editable en vivo.
export function PromoBarLuxury({ text = "Envíos a todo el país — Pagá en cuotas", editMode = false, onChangeText = () => {} }: PromoBarLuxuryProps) {
  return (
    <div className="bg-[#111111] text-white text-center py-3 text-xs uppercase tracking-[0.2em]">
      <EditableInline as="span" editMode={editMode} value={text} onChange={onChangeText} />
    </div>
  )
}
