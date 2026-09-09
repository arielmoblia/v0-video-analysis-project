import type { Metadata } from "next"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import AfiliadosTerminosClient from "./page-client"
import { getBrand } from "@/lib/get-brand"

export const metadata: Metadata = {
  title: "Términos y Condiciones — Programa de Afiliados | Tienda Online",
  description:
    "Términos y condiciones del Programa de Afiliados de Tienda Online (tiendaonline.com.ar): cómo se calcula la comisión, plazo, y condiciones de participación.",
  alternates: {
    canonical: "https://tol.ar/afiliados-terminos",
  },
  robots: { index: false, follow: true },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "tol.ar", item: "https://tol.ar" },
    { "@type": "ListItem", position: 2, name: "Programa de Afiliados", item: "https://tol.ar/afiliados" },
    { "@type": "ListItem", position: 3, name: "Términos y condiciones", item: "https://tol.ar/afiliados-terminos" },
  ],
}

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AfiliadosTerminosClient brand={brand} />
      <SeoExtraBlock page="afiliados-terminos" />
    </>
  )
}
