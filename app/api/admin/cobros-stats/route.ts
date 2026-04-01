import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hs = Math.floor(mins / 60)
  if (hs < 24) return `hace ${hs} hs`
  return `hace ${Math.floor(hs / 24)} días`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const desde = searchParams.get("desde")
    const hasta = searchParams.get("hasta")
    if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })

    let query = supabase
      .from("orders")
      .select("payment_method, total, created_at")
      .eq("store_id", storeId)
      .eq("status", "paid")
      .order("created_at", { ascending: false })

    if (desde) query = query.gte("created_at", desde)
    if (hasta) query = query.lte("created_at", hasta + "T23:59:59")

    const { data, error } = await query
    if (error) throw error

    const stats: Record<string, { transacciones: number; total: number }> = {}
    const lastOrder: Record<string, string> = {}
    let totalGeneral = 0

    for (const order of data || []) {
      const method = order.payment_method || "otro"
      if (!stats[method]) stats[method] = { transacciones: 0, total: 0 }
      stats[method].transacciones++
      stats[method].total += Number(order.total) || 0
      totalGeneral += Number(order.total) || 0
      if (!lastOrder[method]) lastOrder[method] = formatAgo(new Date(order.created_at))
    }

    return NextResponse.json({ stats, totalGeneral, lastOrderAgo: lastOrder })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
