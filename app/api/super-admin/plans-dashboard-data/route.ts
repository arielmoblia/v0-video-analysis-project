import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Supabase corta cada select en 1000 filas por default, y hay miles de productos.
// Se pagina con .range() hasta traer todo.
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
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }

  const products = await fetchAllRows("products", "store_id")
  const productCount: Record<string, number> = {}
  products.forEach((p: any) => { productCount[p.store_id] = (productCount[p.store_id] || 0) + 1 })
  const storesWithProducts = Object.keys(productCount)

  const { data: payments } = await supabase.from("payment_methods").select("store_id, provider").eq("provider", "mercadopago")
  const storesWithMP = (payments || []).map((p: any) => p.store_id)

  const cositas = await fetchAllRows("store_purchased_features", "store_id, feature_code, is_active, is_gifted")
  const cositasPorTienda: Record<string, any[]> = {}
  cositas.forEach((c: any) => {
    if (!cositasPorTienda[c.store_id]) cositasPorTienda[c.store_id] = []
    cositasPorTienda[c.store_id].push(c)
  })

  const orders = await fetchAllRows("orders", "store_id, status")
  const orderCount: Record<string, number> = {}
  const orderPaid: Record<string, number> = {}
  orders.forEach((o: any) => {
    orderCount[o.store_id] = (orderCount[o.store_id] || 0) + 1
    if (o.status === "pagado") orderPaid[o.store_id] = (orderPaid[o.store_id] || 0) + 1
  })

  const { data: pageData } = await supabase.from("page_content").select("key, value").eq("page", "plan-cositas")
  const pageContent: Record<string, string> = {}
  ;(pageData || []).forEach((r: any) => { pageContent[r.key] = r.value })

  const { data: featuresData } = await supabase
    .from("store_features")
    .select("*")
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: true })

  return NextResponse.json(
    { storesWithProducts, productCount, storesWithMP, cositasPorTienda, orderCount, orderPaid, pageContent, featuresData: featuresData || [] },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  )
}
