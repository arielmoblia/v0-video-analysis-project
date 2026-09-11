import { Frank_Ruhl_Libre, Poppins, Mrs_Saint_Delafield } from "next/font/google"

// Tipografía real de la demo scrapeada (floral.weblium.site): títulos serif
// elegantes en Frank Ruhl Libre, texto en Poppins, y un acento CURSIVO
// (Mrs Saint Delafield) para el "eyebrow" tipo firma — único caso entre
// todos los temples, ninguno de los demás usa una fuente script.
export const vintageBody = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-vintage-body",
})

export const vintageHeading = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-vintage-heading",
})

export const vintageScript = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-vintage-script",
})
