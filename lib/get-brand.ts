import { headers } from "next/headers"

export async function getBrand(): Promise<"tol" | "tiendabasica"> {
  const host = (await headers()).get("host") || ""
  return host.includes("tiendabasica.com") ? "tiendabasica" : "tol"
}
