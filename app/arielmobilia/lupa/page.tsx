import { getBrand } from "@/lib/get-brand"
import LupaPageClient from "./page-client"

export default async function Page() {
  const brand = await getBrand()
  return <LupaPageClient brand={brand} />
}
