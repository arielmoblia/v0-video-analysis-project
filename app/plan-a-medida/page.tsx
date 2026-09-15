import { getBrand } from "@/lib/get-brand"
import PlanAMedidaClient from "./page-client"

export default async function Page() {
  const brand = await getBrand()
  return <PlanAMedidaClient brand={brand} />
}
