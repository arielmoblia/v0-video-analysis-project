import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getStoreCustomersWithSpend } from "@/lib/services/customers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Lista de clientes de la tienda con cuánto gastaron, para el dueño
export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")
  if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })

  const { data: store } = await supabase.from("stores").select("subdomain").eq("id", storeId).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const cookieStore = await cookies()
  const isOwner = cookieStore.get(`admin_${store.subdomain.toLowerCase()}`)?.value === "true"
  if (!isOwner) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const customers = await getStoreCustomersWithSpend(storeId)
  return NextResponse.json({ customers })
}
