import type { Metadata } from "next"
import PageClient from "./page-client"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Quiénes somos — tol.ar",
  description:
    "Conocé a tol.ar: una plataforma argentina de tiendas online gratis y sin comisiones, y los departamentos que la operan.",
  openGraph: {
    title: "Quiénes somos — tol.ar",
    description:
      "Conocé a tol.ar y los departamentos que la operan: Dirección, Desarrollo, Legal, SEO y Marketing, Atención al Cliente y Administración.",
    url: "https://tol.ar/quienes-somos",
    type: "website",
  },
  alternates: {
    canonical: "https://tol.ar/quienes-somos",
  },
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <PageClient brand={brand} />
      <SeoExtraBlock page="quienes-somos" />
    </>
  )
}
