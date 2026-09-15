import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import StockPageClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Stock — Le vendiste algo que no tenías",
  description: "Una idea en evaluación: centralizá el stock de todas tus sucursales y puntos de venta en un solo lugar, y que cada venta descuente del mismo stock.",
  robots: { index: false, follow: false },
}

export default async function StockPage() {
  const brand = await getBrand()
  return (
    <>
      <Header brand={brand} />
      <StockPageClient />
      <SeoExtraBlock page="cosita-stock" />
      <Footer brand={brand} />
    </>
  )
}
