import PageClient from "./page-client"
import { SeoExtraBlock } from "@/components/seo-extra-block"
import { getBrand } from "@/lib/get-brand"

export default async function Page() {
  const brand = await getBrand()
  return (
    <>
      <PageClient brand={brand} />
      <SeoExtraBlock page="plan-cositas" />
    </>
  )
}
