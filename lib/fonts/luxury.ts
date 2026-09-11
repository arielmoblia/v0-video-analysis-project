import { IBM_Plex_Sans, Epilogue } from "next/font/google"

// Tipografía real de la demo scrapeada (belle-demo-2.myshopify.com): IBM
// Plex Sans para texto general, Epilogue para títulos grandes.
export const luxuryBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-luxury-body",
})

export const luxuryHeading = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-luxury-heading",
})
