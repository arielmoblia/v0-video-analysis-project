import { Montserrat } from "next/font/google"

// Tipografía real de la demo scrapeada (sa-minimal.myshopify.com): una sola
// familia, Montserrat, para títulos y texto — sin combinar dos fuentes como
// en Artesano (Roboto/Roboto Slab) o Blingg.
export const minimalBody = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-minimal-body",
})

export const minimalHeading = minimalBody
