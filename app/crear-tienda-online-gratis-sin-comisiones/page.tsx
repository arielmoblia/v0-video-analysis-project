import { getBrand } from "@/lib/get-brand"
import CrearTiendaGratisClient from "./page-client"

export default async function Page() {
  const brand = await getBrand()
  return <CrearTiendaGratisClient brand={brand} />
}
