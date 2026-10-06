import { Instrument_Sans } from "next/font/google"

// Tipografía real de dianiswim.com (ver design-refs/diani-minimal/RESUMEN.md):
// una sola familia, Instrument Sans, para todo — títulos, body, precios,
// botones y footer. Nada de combinar dos fuentes.
export const dianiBody = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-diani-body",
})

export const dianiHeading = dianiBody
