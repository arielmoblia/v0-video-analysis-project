interface MarqueeStripLuxuryProps {
  text?: string
}

// Franja de texto corrido con efecto de contorno ("text-stroke"), tal cual
// la sección "scrolling_text" real de la demo (belle-demo-2.myshopify.com).
// Sección nueva que no existe en ningún otro temple.
export function MarqueeStripLuxury({ text = "NUEVA COLECCIÓN" }: MarqueeStripLuxuryProps) {
  const items = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="bg-white border-y border-neutral-200 overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
        {items.map((i) => (
          <span
            key={i}
            className="mx-6 text-lg font-semibold uppercase tracking-widest text-transparent"
            style={{ WebkitTextStroke: "1px #111111" }}
          >
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
