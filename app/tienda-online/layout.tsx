import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear una tienda online gratis en Argentina | tol.ar",
  description:
    "Creá tu tienda online en Argentina en 2 minutos. 100% gratis, sin tarjeta de crédito. Vendé por internet con tol.ar, la plataforma argentina de tiendas online.",
  alternates: {
    canonical: "https://tol.ar/tienda-online",
  },
  openGraph: {
    title: "Crear una tienda online gratis en Argentina | tol.ar",
    description:
      "Creá tu tienda online en Argentina en 2 minutos. 100% gratis, sin tarjeta de crédito. Vendé por internet con tol.ar.",
    url: "https://tol.ar/tienda-online",
    siteName: "tol.ar",
    locale: "es_AR",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
