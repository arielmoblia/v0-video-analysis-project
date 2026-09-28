import PageClient from "./page-client"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { getBrand } from "@/lib/get-brand"

export const metadata = {
  title: "Pasar mi tienda de Tiendanube a tol.ar gratis | tol.ar",
  description:
    "Guía paso a paso para migrar tu catálogo de Tiendanube a tol.ar sin perder nada: productos, precios y fotos. Gratis, sin cuota ni comisión.",
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <PageClient brand={brand} />
      <SeoExtraBlock page="pasar-tiendanube-a-tol" />
    </>
  )
}
