import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { getCustomerBySession, getCustomerOrders } from "@/lib/services/customers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const subdomain = request.nextUrl.searchParams.get("subdomain")
    if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

    const subdomainLower = subdomain.toLowerCase()
    const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomainLower).single()
    if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

    const cookieStore = await cookies()
    const token = cookieStore.get(`customer_${subdomainLower}`)?.value

    const customer = token ? await getCustomerBySession(token, store.id) : null
    if (!customer) return NextResponse.json({ customer: null })

    const orders = await getCustomerOrders(store.id, customer.email)

    return NextResponse.json({ customer, orders })
  } catch (error) {
    console.error("Customer me error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
