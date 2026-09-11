import { Roboto, Roboto_Slab } from "next/font/google"

// Tipografía real de la demo scrapeada (websitedemos.net/blingg-jewelry-store-04):
// títulos en "Roboto Slab", texto en "Roboto". Se cargan con next/font/google
// (la forma correcta en Next.js) en vez de copiar los .woff.
export const blinggBody = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-blingg-body",
})

export const blinggHeading = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-blingg-heading",
})
