interface PromoBarLuxuryProps {
  text?: string
}

// Franja negra de oferta ("SPRING SUMMER SALE — Shop Now"), tal cual la
// sección "promotion_bar" real de la demo. Sección nueva, no existe en
// ningún otro temple.
export function PromoBarLuxury({ text = "Envíos a todo el país — Pagá en cuotas" }: PromoBarLuxuryProps) {
  return (
    <div className="bg-[#111111] text-white text-center py-3 text-xs uppercase tracking-[0.2em]">
      {text}
    </div>
  )
}
