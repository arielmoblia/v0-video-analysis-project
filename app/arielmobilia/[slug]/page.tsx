import { getBrand } from "@/lib/get-brand"
import GeoPageClient from "./page-client"

export default async function Page() {
  const brand = await getBrand()
  return <GeoPageClient brand={brand} />
}
