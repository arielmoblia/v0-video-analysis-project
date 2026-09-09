import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import AfiliadosClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Programa de Afiliados de tol.ar — Ganá recomendando tiendas online | Tienda Online",
  description:
    "Sumate al Programa de Afiliados de tol.ar: recomendá nuestra plataforma de tiendas online y ganá una comisión por cada negocio nuevo que sumes y empiece a vender.",
  alternates: {
    canonical: "https://tol.ar/afiliados",
  },
  openGraph: {
    title: "Programa de Afiliados de tol.ar",
    description:
      "Recomendá tol.ar y ganá una comisión por cada tienda nueva que sumes. Sin exclusividad, sin relación laboral, pago solo si hay resultado.",
    type: "website",
    url: "https://tol.ar/afiliados",
  },
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <AfiliadosClient brand={brand} />
      <SeoExtraBlock page="afiliados" />
    </>
  )
}
