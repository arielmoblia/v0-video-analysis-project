import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import ProgramaReventaClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Sumá tu negocio a tol.ar — Vendemos tus productos sin costo | Tienda Online",
  description:
    "Programa de reventa online de Tienda Online (tiendaonline.com.ar): publicamos y vendemos tus productos en tol.ar sin costo para tu negocio. Solo cobramos 10% si vendemos.",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ negocio?: string; email?: string }>
}) {
  const { negocio, email } = await searchParams
  const brand = await getBrand()
  return (
    <>
      <ProgramaReventaClient brand={brand} negocio={negocio || ""} email={email || ""} />
      <SeoExtraBlock page="programa-reventa" />
    </>
  )
}
