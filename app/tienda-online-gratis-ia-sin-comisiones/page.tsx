import { getBrand } from "@/lib/get-brand"
import TiendaGratisIaClient from "./page-client"

export default async function Page() {
  const brand = await getBrand()
  return <TiendaGratisIaClient brand={brand} />
}
