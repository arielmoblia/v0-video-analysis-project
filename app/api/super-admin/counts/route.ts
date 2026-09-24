export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Supabase corta cada select en 1000 filas por default. Con miles de productos/pedidos
// en la plataforma, un select sin paginar se queda a mitad de camino. Se pagina con
// .range() hasta traer todo.
async function fetchAllRows(table: string, select: string, applyFilter?: (q: any) => any) {
  const pageSize = 1000
  let from = 0
  let allRows: any[] = []
  while (true) {
    let q = supabase.from(table).select(select)
    if (applyFilter) q = applyFilter(q)
    const { data, error } = await q.range(from, from + pageSize - 1)
    if (error || !data || data.length === 0) break
    allRows = allRows.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return allRows
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const prods = await fetchAllRows("products", "store_id, created_at", q => q.neq("is_template", true))
    const prodCounts: Record<string, number> = {}
    const lastProductAt: Record<string, string> = {}
    prods.forEach((p: any) => {
      prodCounts[p.store_id] = (prodCounts[p.store_id] || 0) + 1
      if (!lastProductAt[p.store_id] || new Date(p.created_at) > new Date(lastProductAt[p.store_id])) lastProductAt[p.store_id] = p.created_at
    })

    const ords = await fetchAllRows("orders", "store_id")
    const orderCounts: Record<string, number> = {}
    ords.forEach((o: any) => { orderCounts[o.store_id] = (orderCounts[o.store_id] || 0) + 1 })

    const payments = await fetchAllRows("payment_methods", "store_id, cash_enabled, card_enabled, transfer_enabled, mercadopago_enabled, mobbex_enabled, modo_enabled, uala_enabled, rapipago_enabled")
    const hasPayment: Record<string, boolean> = {}
    payments.forEach((p: any) => {
      hasPayment[p.store_id] = !!(p.cash_enabled || p.card_enabled || p.transfer_enabled || p.mercadopago_enabled || p.mobbex_enabled || p.modo_enabled || p.uala_enabled || p.rapipago_enabled)
    })

    const shippings = await fetchAllRows("shipping_methods", "store_id, pickup_enabled, delivery_enabled, enviamelo_enabled, andreani_enabled, oca_enabled, correo_enabled, own_delivery_enabled")
    const hasShipping: Record<string, boolean> = {}
    shippings.forEach((s: any) => {
      hasShipping[s.store_id] = !!(s.pickup_enabled || s.delivery_enabled || s.enviamelo_enabled || s.andreani_enabled || s.oca_enabled || s.correo_enabled || s.own_delivery_enabled)
    })

    return NextResponse.json(
      { prodCounts, lastProductAt, orderCounts, hasPayment, hasShipping },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  } catch (error) {
    console.error("Error fetching counts:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
